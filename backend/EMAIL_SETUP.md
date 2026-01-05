# 📧 Email Notification Setup Guide

## What Was Added

Email notifications are now configured to alert you (zilong.padilla@gmail.com) whenever a customer places an order through the website.

## ⚙️ Setup Steps (DO THIS BEFORE DEPLOYING)

### Step 1: Create Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com
2. **Enable 2-Step Verification** (if not already enabled):
   - Go to Security → 2-Step Verification
   - Follow the prompts to set it up
3. **Create App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Click "Generate"
   - **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 2: Update Your `.env` File

Open `backend/.env` and replace `your-gmail-app-password-here` with the app password you just generated:

```env
DATABASE_URL=postgresql://postgres:Newpassword@localhost:5432/greatcookie
CORS_ORIGINS=http://localhost:5173

# Email Configuration for Order Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=zilong.padilla@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop  ← PUT YOUR 16-CHAR APP PASSWORD HERE
NOTIFICATION_EMAIL=zilong.padilla@gmail.com
```

### Step 3: Restart Backend Server

After updating `.env`, restart your backend:
```bash
cd backend
python -m uvicorn main:app --reload
```

## 📨 What You'll Receive

When a customer places an order via the "Place Order Now" button, you'll receive an email with:

- **Customer Information**: Name, contact, delivery address
- **Order Details**: Cookie type, quantity, payment method, delivery date
- **Special Requests**: Any notes from the customer
- **Order Source**: Website, Facebook, or Phone

The email will be beautifully formatted in HTML with:
- 🍪 Cookie emoji in subject line
- Color-coded sections
- Professional layout
- All order information clearly organized

## 🔒 Security Notes

- ✅ App passwords are safer than your regular Gmail password
- ✅ You can revoke app passwords anytime from your Google Account
- ✅ Never commit your `.env` file to Git/GitHub
- ✅ Each deployment environment should have its own `.env` file

## 🧪 Testing Email Notifications

1. Place a test order through your website
2. Check zilong.padilla@gmail.com inbox
3. You should receive an email within seconds

**Note**: If you don't receive emails:
- Check your spam/junk folder
- Verify the app password is correct in `.env`
- Make sure 2-Step Verification is enabled on your Gmail
- Check backend console for any error messages

## 🚀 For Production Deployment

When deploying to a server:

1. **Copy `.env` file** to your production server
2. **Update CORS_ORIGINS** to your production domain:
   ```env
   CORS_ORIGINS=https://yourdomain.com
   ```
3. **Keep email settings** the same if using Gmail
4. **Alternatively**, use a transactional email service like:
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

These services are more reliable for production and won't hit Gmail's sending limits.

## 📊 Email Notification Status

- **Enabled**: ✅ Yes
- **Notification Email**: zilong.padilla@gmail.com
- **Triggers**: Customer places order via "Place Order Now" button
- **Not triggered by**: Facebook Messenger orders (you get FB notification instead)
