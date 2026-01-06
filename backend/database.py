from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Fix for Render PostgreSQL URL format (postgres:// -> postgresql://)
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Optimized connection pool settings for better performance
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,          # Maintain 5 connections
    max_overflow=10,      # Allow up to 15 total connections
    pool_pre_ping=True,   # Verify connections before use (prevents stale connections)
    pool_recycle=3600,    # Recycle connections after 1 hour
    connect_args={
        "connect_timeout": 10,  # 10 second connection timeout
        "options": "-c statement_timeout=30000"  # 30 second query timeout
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
