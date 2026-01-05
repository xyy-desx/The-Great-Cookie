# 🍪 The Great Cookie by Alex

A modern, full-stack e-commerce website for artisan cookies with a comprehensive admin panel.

![The Great Cookie](src/assets/logo.png)

## 🌟 Features

### Customer Features
- 🛍️ Browse premium cookie catalog
- 📱 Responsive design (mobile-friendly)
- 🛒 Place orders (direct or via Messenger)
- ⭐ Submit and view reviews
- 📧 Email notifications for orders
- 🔍 Search and filter cookies by category

### Admin Panel Features
- 📊 **Revenue Analytics** - Track sales, revenue, and trends
- 📥 **Export Orders** - Download orders as CSV for accounting
- 🔔 **Order Notifications** - Real-time alerts for new orders
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
- **FastAPI Mail** - Email notifications

## 🚀 Live Demo

- **Website:** [Coming Soon]
- **Admin Panel:** [Coming Soon]/admin

### Admin Credentials (Demo)
- Username: `alex`
- Password: `Cookie2024!`

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
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
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
NOTIFICATION_EMAIL=your-email@gmail.com
```

## 🌐 Deployment

See [COMPLETE_DEPLOYMENT_GUIDE.md](docs/COMPLETE_DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

**Quick Deploy:**
- **Frontend:** Vercel (auto-deploy from GitHub)
- **Backend:** Render (Free PostgreSQL + Python)

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

## 📧 Email Notifications

The system automatically sends email notifications when:
- New orders are placed
- Orders are confirmed
- Orders are out for delivery

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Make sure PostgreSQL is running
pg_ctl status

# Check database exists
psql -l | grep greatcookie
```

### Port Already in Use
```bash
# Frontend (default: 5173)
# Backend (default: 8000)
# Kill processes using these ports if needed
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

## 📝 License

This project is private and proprietary.

## 👨‍💻 Developer

**Alex** - The Great Cookie by Alex

---

Built with ❤️ and 🍪
