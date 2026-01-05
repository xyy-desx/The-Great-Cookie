# Backend Setup Instructions

## Prerequisites

You need PostgreSQL installed. If you don't have it:

### Option 1: Install PostgreSQL
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for 'postgres' user

### Option 2: Use SQLite (Simpler, No Installation)
I can switch the backend to use SQLite instead - no database installation needed!

## Current Setup (PostgreSQL)

If you have PostgreSQL installed:

1. **Create database:**
```bash
# Open PostgreSQL command line (psql)
CREATE DATABASE greatcookie;
CREATE USER cokiee WITH PASSWORD 'Newpassword';
GRANT ALL PRIVILEGES ON DATABASE greatcookie TO cokiee;
```

2. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

3. **Seed the database:**
```bash
python seed.py
```

4. **Run the server:**
```bash
python main.py
```

## Quick Start (SQLite - Recommended for Development)

If you want to skip PostgreSQL setup, let me know and I'll convert to SQLite!
- No installation needed
- Works immediately
- Same features
- Easier for development

Backend will run at: **http://localhost:8000**
API docs: **http://localhost:8000/docs**
