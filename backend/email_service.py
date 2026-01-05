import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from typing import List
from dotenv import load_dotenv

load_dotenv()

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("SMTP_USER", ""),
    MAIL_PASSWORD=os.getenv("SMTP_PASSWORD", ""),
    MAIL_FROM=os.getenv("SMTP_USER", ""),
    MAIL_PORT=int(os.getenv("SMTP_PORT", 587)),
    MAIL_SERVER=os.getenv("SMTP_HOST", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fastmail = FastMail(conf)

async def send_order_notification(order_data: dict):
    """Send email notification when a new order is placed"""
    
    # Get notification email from env or use default
    notification_email = os.getenv("NOTIFICATION_EMAIL", "zilong.padilla@gmail.com")
    
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
        return True
    except Exception as e:
        print(f"❌ Failed to send email notification: {str(e)}")
        return False
