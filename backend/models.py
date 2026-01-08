from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from database import Base
from datetime import datetime

class Cookie(Base):
    __tablename__ = "cookies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    ingredients = Column(Text)
    category = Column(String, index=True)  # Index for category filtering
    price = Column(Float)
    image = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    contact = Column(String)
    cookie_name = Column(String)
    quantity = Column(Integer)
    notes = Column(Text, nullable=True)
    delivery_address = Column(Text, nullable=True)
    total_price = Column(Float, nullable=True)
    payment_method = Column(String, nullable=True)  # COD, GCash, Bank Transfer
    delivery_date = Column(String, nullable=True)  # Requested delivery date
    order_source = Column(String, default="website")  # website, facebook, phone
    status = Column(String, default="pending")  # pending, confirmed, preparing, out_for_delivery, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    rating = Column(Integer)
    comment = Column(Text)
    approved = Column(Boolean, default=False, index=True)  # Index for filtering approved reviews
    created_at = Column(DateTime, default=datetime.utcnow, index=True)  # Index for ordering

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
