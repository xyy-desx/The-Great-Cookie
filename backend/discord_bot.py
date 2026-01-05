import discord
from discord import app_commands
import os
import asyncio
from database import SessionLocal
from models import Order
from sqlalchemy import func
from datetime import datetime

# Bot Setup
intents = discord.Intents.default()
# intents.message_content = True # Required if we want to read messages, but we only use slash commands + embeds

class CookieBot(discord.Client):
    def __init__(self):
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)
        self.notification_channel = None

    async def setup_hook(self):
        await self.tree.sync()
    
    async def on_ready(self):
        print(f'🤖 Bot Logged in as {self.user} (ID: {self.user.id})')
        # Attempt to find a channel to post to
        # 1. Look for env var
        cid = os.getenv("DISCORD_CHANNEL_ID")
        if cid:
            try:
                self.notification_channel = await self.fetch_channel(int(cid))
                print(f"✅ Configured to post in channel: {self.notification_channel.name}")
            except Exception as e:
                print(f"⚠️ Could not load configured channel: {e}")
        
        # 2. If no env var, try to find the first text channel in the first guild (Fallback)
        if not self.notification_channel and self.guilds:
            for guild in self.guilds:
                for channel in guild.text_channels:
                    if channel.permissions_for(guild.me).send_messages:
                        self.notification_channel = channel
                        print(f"⚠️ No DISCORD_CHANNEL_ID set. Defaulting to: {channel.name} in {guild.name}")
                        break
                if self.notification_channel: break

client = CookieBot()

# --- Slash Commands ---

@client.tree.command(name="sales", description="View today's revenue and order count")
async def sales(interaction: discord.Interaction):
    db = SessionLocal()
    today = datetime.now().date()
    
    # Revenue (Completed + Out for Delivery)
    revenue = db.query(func.sum(Order.total_price)).filter(
        func.date(Order.created_at) == today,
        Order.status.in_(["completed", "out_for_delivery"])
    ).scalar() or 0.0

    # Orders (All non-cancelled)
    count = db.query(Order).filter(
        func.date(Order.created_at) == today,
        Order.status != "cancelled"
    ).count()
    
    db.close()
    
    embed = discord.Embed(title="🍪 Daily Sales Report", color=discord.Color.gold())
    embed.add_field(name="📅 Date", value=str(today), inline=False)
    embed.add_field(name="💰 Revenue", value=f"₱{revenue:,.2f}", inline=True)
    embed.add_field(name="📦 Orders", value=str(count), inline=True)
    
    await interaction.response.send_message(embed=embed)

@client.tree.command(name="pending", description="List all pending orders")
async def pending(interaction: discord.Interaction):
    db = SessionLocal()
    orders = db.query(Order).filter(Order.status == "pending").all()
    db.close()

    if not orders:
        await interaction.response.send_message("✅ No pending orders currently.")
        return

    embed = discord.Embed(title=f"🕒 Pending Orders ({len(orders)})", color=discord.Color.orange())
    for order in orders:
        embed.add_field(
            name=f"Order #{order.id} - {order.customer_name}",
            value=f"{order.cookie_name} x{order.quantity} (₱{order.total_price})",
            inline=False
        )
    
    await interaction.response.send_message(embed=embed)

# --- Interactive Views ---

class OrderView(discord.ui.View):
    def __init__(self, order_id: int):
        super().__init__(timeout=None) # Persistent view (requires persistence setup usually, but fine for in-memory session)
        self.order_id = order_id

    @discord.ui.button(label="Confirm Order", style=discord.ButtonStyle.primary, custom_id="confirm")
    async def confirm(self, interaction: discord.Interaction, button: discord.ui.Button):
        db = SessionLocal()
        order = db.query(Order).filter(Order.id == self.order_id).first()
        if not order:
            await interaction.response.send_message("❌ Order not found!", ephemeral=True)
            db.close()
            return

        order.status = "confirmed"
        db.commit()
        db.close()
        
        button.disabled = True
        button.label = "Confirmed"
        await interaction.response.edit_message(view=self)
        await interaction.followup.send(f"✅ Order #{self.order_id} **CONFIRMED** by {interaction.user.display_name}!")

    @discord.ui.button(label="Mark Completed", style=discord.ButtonStyle.success, custom_id="complete")
    async def complete(self, interaction: discord.Interaction, button: discord.ui.Button):
        db = SessionLocal()
        order = db.query(Order).filter(Order.id == self.order_id).first()
        if not order:
            await interaction.response.send_message("❌ Order not found!", ephemeral=True)
            db.close()
            return

        order.status = "completed"
        db.commit()
        db.close()
        
        button.disabled = True
        button.label = "Completed"
        await interaction.response.edit_message(view=self)
        await interaction.followup.send(f"💰 Order #{self.order_id} **COMPLETED** by {interaction.user.display_name}! Revenue updated.")

# --- Helper to Send Notifications ---

async def send_bot_notification(order_data: dict, order_id: int):
    """Sends a rich embed with buttons to the configured channel"""
    if not client.is_ready() or not client.notification_channel:
        print("⚠️ Bot not ready or no channel found. Skipping notification.")
        return

    total_price = order_data.get('total_price', 0)
    formatted_price = f"₱{total_price:,.2f}" if total_price else "Pending Calc"

    embed = discord.Embed(
        title="🚨 New Order Received!",
        description=f"**Order #{order_id}**",
        color=discord.Color.red()
    )
    embed.add_field(name="Customer", value=order_data['customer_name'], inline=True)
    embed.add_field(name="Cookie", value=f"{order_data['cookie_name']} (x{order_data['quantity']})", inline=True)
    embed.add_field(name="Price", value=formatted_price, inline=True)
    embed.add_field(name="Contact", value=order_data['contact'], inline=True)
    
    if order_data.get('notes'):
        embed.add_field(name="Notes", value=order_data['notes'], inline=False)
    
    view = OrderView(order_id)
    try:
        await client.notification_channel.send(embed=embed, view=view)
        print("✅ Bot notification sent!")
    except Exception as e:
        print(f"❌ Failed to send bot notification: {e}")
