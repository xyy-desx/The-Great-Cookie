import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List
from dotenv import load_dotenv

load_dotenv()

# Email configuration
# Email configuration
mail_port = int(os.getenv("SMTP_PORT", 465))
print(f"📧 Configuring Email: Port {mail_port} (SSL: {mail_port==465})")

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("SMTP_USER", ""),
    MAIL_PASSWORD=os.getenv("SMTP_PASSWORD", ""),
    MAIL_FROM=os.getenv("SMTP_USER", ""),
    MAIL_PORT=mail_port,
    MAIL_SERVER=os.getenv("SMTP_HOST", "smtp.gmail.com"),
    MAIL_STARTTLS=(mail_port == 587 or mail_port == 2525),
    MAIL_SSL_TLS=(mail_port == 465),
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fastmail = FastMail(conf)

async def send_order_notification(order_data: dict):
    """Send email notification when a new order is placed"""
    
    # Get notification email from env or use default
    notification_email = os.getenv("NOTIFICATION_EMAIL", "thegreatcookiebyalex@gmail.com")
    
    # Create email body
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                <h2 style="color: #000; border-bottom: 3px solid #000; padding-bottom: 10px;">
                    🍪 New Order Received!
                </h2>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #000; margin-top: 0;">Customer Information</h3>
                    <p><strong>Name:</strong> {order_data['customer_name']}</p>
                    <p><strong>Contact:</strong> {order_data['contact']}</p>
                    <p><strong>Delivery Address:</strong> {order_data.get('delivery_address', 'Not provided')}</p>
                </div>
                
                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #000; margin-top: 0;">Order Details</h3>
                    <p><strong>Cookie:</strong> {order_data['cookie_name']}</p>
                    <p><strong>Quantity:</strong> {order_data['quantity']}</p>
                    <p><strong>Payment Method:</strong> {order_data.get('payment_method', 'Not specified')}</p>
                    <p><strong>Preferred Delivery Date:</strong> {order_data.get('delivery_date', 'Not specified')}</p>
                </div>
                
                {f'''<div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #000; margin-top: 0;">Special Requests</h3>
                    <p>{order_data['notes']}</p>
                </div>''' if order_data.get('notes') else ''}
                
                <div style="background-color: #e8e8e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Order Source:</strong> {order_data.get('order_source', 'website').upper()}</p>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                        This order was placed via the website order form.
                    </p>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                    <p style="color: #666; font-size: 12px;">
                        Log in to your admin panel to manage this order.
                    </p>
                </div>
            </div>
        </body>
    </html>
    """
    
    # Create message
    message = MessageSchema(
        subject=f"🍪 New Order from {order_data['customer_name']}",
        recipients=[notification_email],
        body=html_body,
        subtype="html"
    )
    
    try:
        # Send email
        await fastmail.send_message(message)
        return "SUCCESS"
    except Exception as e:
        error_msg = f"Failed to send email: {str(e)}"
        print(f"❌ {error_msg}")
        return error_msg

async def send_discord_notification(order_data: dict):
    """Send order notification to Discord via Webhook"""
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        print("⚠️ Discord Webhook URL not found. Skipping.")
        return

    import aiohttp
    
    # Format currency
    total_price = order_data.get('total_price', 0)
    formatted_price = f"₱{total_price:,.2f}" if total_price else "Pending Calc"

    # Format status with emoji
    status = order_data.get('status', 'pending').lower()
    status_emojis = {
        'pending': '🟡',
        'confirmed': '✅',
        'preparing': '👨‍🍳',
        'out_for_delivery': '🚚',
        'completed': '✅',
        'cancelled': '❌'
    }
    status_emoji = status_emojis.get(status, '⚪')
    formatted_status = f"{status_emoji} {status.replace('_', ' ').title()}"

    embed = {
        "title": "🍪 New Cookie Order!",
        "color": 16753920, # Orange
        "fields": [
            {"name": "Customer", "value": order_data['customer_name'], "inline": True},
            {"name": "Contact", "value": order_data['contact'], "inline": True},
            {"name": "Cookie", "value": order_data['cookie_name'], "inline": True},
            {"name": "Quantity", "value": str(order_data['quantity']), "inline": True},
            {"name": "Total Price", "value": formatted_price, "inline": True},
            {"name": "Payment", "value": order_data.get('payment_method', 'N/A'), "inline": True},
            {"name": "Status", "value": formatted_status, "inline": True},
            {"name": "Source", "value": order_data.get('order_source', 'website').upper(), "inline": True},
        ],
        "footer": {"text": "The Great Cookie Admin System"}
    }
    
    # Add notes if verified
    if order_data.get('notes'):
        embed['fields'].append({"name": "Notes", "value": order_data['notes'], "inline": False})
    
    # Add Delivery if verified
    if order_data.get('delivery_address'):
        embed['fields'].append({"name": "Address", "value": order_data['delivery_address'], "inline": False})
    
    # Add Delivery Date if specified
    if order_data.get('delivery_date'):
        embed['fields'].append({"name": "📅 Delivery Date", "value": order_data['delivery_date'], "inline": False})

    payload = {
        "content": "🚨 **New Order Received!** 🚨",
        "embeds": [embed]
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(webhook_url, json=payload) as response:
                if response.status == 204:
                    print("✅ Discord Notification Sent!")
                    return "SUCCESS"
                else:
                    print(f"⚠️ Discord Failed: {response.status}")
                    return f"Failed: {response.status}"
    except Exception as e:
        print(f"❌ Discord Error: {str(e)}")
        return str(e)

async def send_discord_status_update(order_data: dict, old_status: str = None):
    """Send Discord notification when order status is updated in admin panel"""
    webhook_url = os.getenv("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        print("⚠️ Discord Webhook URL not found. Skipping.")
        return

    import aiohttp
    
    # Format currency
    total_price = order_data.get('total_price', 0)
    formatted_price = f"₱{total_price:,.2f}" if total_price else "Pending Calc"

    # Format status with emoji
    status = order_data.get('status', 'pending').lower()
    status_emojis = {
        'pending': '🟡',
        'confirmed': '✅',
        'preparing': '👨‍🍳',
        'out_for_delivery': '🚚',
        'completed': '✅',
        'cancelled': '❌'
    }
    status_emoji = status_emojis.get(status, '⚪')
    formatted_status = f"{status_emoji} {status.replace('_', ' ').title()}"
    
    # Different color for status updates
    status_colors = {
        'pending': 16776960,      # Yellow
        'confirmed': 5763719,     # Green
        'preparing': 3447003,     # Blue
        'out_for_delivery': 15105570,  # Light orange
        'completed': 2067276,     # Dark green
        'cancelled': 15158332     # Red
    }
    embed_color = status_colors.get(status, 3447003)

    embed = {
        "title": "📝 Order Status Updated!",
        "color": embed_color,
        "fields": [
            {"name": "Order ID", "value": f"#{order_data.get('id', 'N/A')}", "inline": True},
            {"name": "Customer", "value": order_data['customer_name'], "inline": True},
            {"name": "Cookie", "value": order_data['cookie_name'], "inline": True},
            {"name": "Quantity", "value": str(order_data['quantity']), "inline": True},
            {"name": "Total Price", "value": formatted_price, "inline": True},
            {"name": "Status", "value": formatted_status, "inline": True},
        ],
        "footer": {"text": "Updated by Admin"}
    }
    
    # Add delivery date if present
    if order_data.get('delivery_date'):
        embed['fields'].append({"name": "📅 Delivery Date", "value": order_data['delivery_date'], "inline": False})
    
    # Show status change if old status provided
    status_message = "📢 **Order Status Changed!**"
    if old_status and old_status != status:
        old_emoji = status_emojis.get(old_status.lower(), '⚪')
        status_message = f"📢 Status: {old_emoji} {old_status.title()} → {status_emoji} {status.title()}"

    payload = {
        "content": status_message,
        "embeds": [embed]
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(webhook_url, json=payload) as response:
                if response.status == 204:
                    print("✅ Discord Status Update Sent!")
                    return "SUCCESS"
                else:
                    print(f"⚠️ Discord Failed: {response.status}")
                    return f"Failed: {response.status}"
    except Exception as e:
        print(f"❌ Discord Error: {str(e)}")
        return str(e)

