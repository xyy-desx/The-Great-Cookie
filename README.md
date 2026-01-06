# 🍪 The Great Cookie by Alex

A modern, full-stack e-commerce website for artisan cookies with a comprehensive admin panel.

![The Great Cookie](src/assets/logo.png)

## 🌟 Features

### Customer Features
- 🛍️ Browse premium cookie catalog
- 📱 Responsive design (mobile-friendly)
- 🛒 Place orders (direct or via Messenger)
- ⭐ Submit and view reviews
- 🔍 Search and filter cookies by category

### Admin Panel Features
- 📊 **Revenue Analytics** - Track sales, revenue, and trends
- 🔔 **Discord Bot Notifications** - Real-time alerts & order management via Discord
- 📥 **Export Orders** - Download orders as CSV for accounting
- 🍪 **Cookie Management** - Add, edit, delete cookies with image upload
- 📝 **Order Management** - View, filter, and update order status
- ⭐ **Review Management** - Approve or delete customer reviews
- 🔐 **Secure Authentication** - JWT-based admin login

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 + **TypeScript**
- **Vite** - Fast build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling

### Backend
- **FastAPI** (Python) - REST API
- **PostgreSQL** - Database
- **JWT** - Authentication
- **SQLAlchemy** - ORM
- **Discord.py** - Bot integrations (Notifications & Slash Commands)

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 13+

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create PostgreSQL database
createdb greatcookie

# Initialize database
python seed.py        # Add cookie data
python create_admin.py  # Create admin account

# Start backend server
python main.py
```

### Environment Variables

**Frontend (`.env`):**
```
VITE_API_URL=http://localhost:8000/api
```

**Backend (`backend/.env`):**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/greatcookie
CORS_ORIGINS=http://localhost:5173

# Discord Bot Configuration (Optional - for /sales commands)
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CHANNEL_ID=your_channel_id_here

# Discord Webhook (Required for Order Notifications)
DISCORD_WEBHOOK_URL=your_webhook_url_here
```

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions (Render/Railway).

**Quick Deploy:**
- **Frontend:** Vercel / Railway
- **Backend:** Railway / Render

## 📁 Project Structure

```
The-Great-Cookie/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   └── config/            # Configuration files
├── backend/               # FastAPI backend
│   ├── main.py           # API entry point
│   ├── models.py         # Database models
│   ├── admin_routes.py   # Admin endpoints
│   ├── email_service.py  # Email & Webhook Logic
│   ├── discord_bot.py    # Discord bot logic
│   ├── seed.py           # Database seeding
│   └── create_admin.py   # Admin user creation
└── public/               # Static assets
```

## 🔑 Admin Panel Routes

- `/admin` - Login page
- `/admin/dashboard` - Overview & stats
- `/admin/cookies` - Manage cookies
- `/admin/orders` - Manage orders
- `/admin/reviews` - Manage reviews
- `/admin/analytics` - Revenue analytics

## 🤖 Discord Integration

The system uses **Discord Webhooks** for instant order alerts.

- **Order Notifications**: Sent instantly to your formatted Discord channel via Webhook.
- **Bot Commands** (Optional): If you configure the Bot Token, you can also use:
  - `/sales` - View today's revenue.
  - `/pending` - List pending orders.

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check database exists
psql -l | grep greatcookie
```

### Port Already in Use
```bash
# Frontend (default: 5173)
# Backend (default: 8000)
```

## 📝 License

This project is private and proprietary.

## 👨‍💻 Developer

**Desxzor Navarro**
