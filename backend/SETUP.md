# Quick Start Guide

## Step 1: Create Database

Open **pgAdmin** or **SQL Shell (psql)** and run:

```sql
CREATE DATABASE greatcookie;
```

Or if you prefer command line, find psql:
- Usually in: `C:\Program Files\PostgreSQL\18\bin\psql.exe`
- Run: `"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U cokiee -d postgres`
- Then: `CREATE DATABASE greatcookie;`

## Step 2: Install Python Packages

```bash
cd backend
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv
```

## Step 3: Initialize & Seed Database

```bash
python seed.py
```

This creates tables and adds all 6 cookies to the database.

## Step 4: Start Backend Server

```bash
python main.py
```

Server runs at: http://localhost:8000
API Docs: http://localhost:8000/docs

## Test It

Visit http://localhost:8000/docs to see all API endpoints!

## Troubleshooting

If you get connection errors:
1. Make sure PostgreSQL service is running
2. Check that user 'cokiee' exists with password 'Newpassword'
3. Verify database 'greatcookie' was created
