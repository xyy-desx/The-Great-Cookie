from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

from database import engine, get_db, Base
from models import Cookie, Order, Review
from admin_routes import router as admin_router

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="The Great Cookie API")

# CORS
origins = ["http://localhost:5173"]
cors_env = os.getenv("CORS_ORIGINS")
if cors_env:
    origins.extend([origin.strip() for origin in cors_env.split(",")])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include admin routes
app.include_router(admin_router)

# Pydantic schemas
class CookieCreate(BaseModel):
    name: str
    description: str
    ingredients: str
    category: str
    price: float
    image: str

class CookieResponse(BaseModel):
    id: int
    name: str
    description: str
    ingredients: str
    category: str
    price: float
    image: str

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_name: str
    contact: str
    cookie_name: str
    quantity: int
    notes: Optional[str] = None
    delivery_address: Optional[str] = None
    total_price: Optional[float] = None
    payment_method: Optional[str] = None
    delivery_date: Optional[str] = None
    order_source: Optional[str] = "website"

class OrderResponse(BaseModel):
    id: int
    customer_name: str
    contact: str
    cookie_name: str
    quantity: int
    notes: Optional[str]
    delivery_address: Optional[str]
    total_price: Optional[float]
    payment_method: Optional[str]
    delivery_date: Optional[str]
    order_source: str
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    customer_name: str
    rating: int
    comment: str

class ReviewResponse(BaseModel):
    id: int
    customer_name: str
    rating: int
    comment: str
    approved: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Routes
@app.get("/")
def read_root():
    return {"message": "The Great Cookie API"}

@app.get("/health")
def health_check():
    """Health check endpoint for uptime monitoring (prevents Render cold starts)"""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.get("/api/cookies", response_model=List[CookieResponse])
def get_cookies(search: Optional[str] = None, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(Cookie)
    if search:
        query = query.filter(
            (Cookie.name.ilike(f"%{search}%")) |
            (Cookie.description.ilike(f"%{search}%"))
        )
    return query.limit(limit).all()

@app.post("/api/cookies", response_model=CookieResponse)
def create_cookie(cookie: CookieCreate, db: Session = Depends(get_db)):
    db_cookie = Cookie(**cookie.dict())
    db.add(db_cookie)
    db.commit()
    db.refresh(db_cookie)
    return db_cookie

# Startup Event to Launch Bot
@app.on_event("startup")
async def startup_event():
    import asyncio
    from discord_bot import client
    token = os.getenv("DISCORD_BOT_TOKEN")
    if token and token != "your_discord_bot_token_here":
        try:
            # We wrap this in a task, but if it fails immediately 'await' might raise.
            # However, start() is async.
            asyncio.create_task(client.start(token))
        except Exception as e:
             print(f"⚠️ Discord Bot failed to start: {e}")
    else:
        print("⚠️ No valid DISCORD_BOT_TOKEN found. Bot will not start.")

@app.post("/api/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    from email_service import send_order_notification
    from discord_bot import send_bot_notification
    import asyncio
    
    # Calculate total price if missing (Fix for 0 Revenue)
    if not order.total_price:
        # Find the cookie to get its price
        cookie = db.query(Cookie).filter(Cookie.name == order.cookie_name).first()
        if cookie:
            order.total_price = cookie.price * order.quantity
        else:
            # Fallback if cookie name doesn't match
            order.total_price = 0.0

    # Create order in database
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Send notifications asynchronously
    try:
        from email_service import send_discord_notification
        # 1. Email (Disabled - using Discord Webhook)
        # asyncio.create_task(send_order_notification(order.dict()))
        # 2. Discord Webhook (Simpler, Reliable)
        asyncio.create_task(send_discord_notification(order.dict()))
    except Exception as e:
        print(f"⚠️ Notification system error: {str(e)}")
    
    return db_order

@app.get("/api/orders", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@app.post("/api/reviews", response_model=ReviewResponse)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    db_review = Review(**review.dict(), approved=False)  # Pending approval by default
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/api/reviews", response_model=List[ReviewResponse])
def get_reviews(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.approved == True).order_by(Review.created_at.desc()).limit(limit).all()

@app.get("/test-email")
async def test_email():
    from email_service import send_order_notification
    test_data = {
        "customer_name": "TEST USER",
        "contact": "0000000000",
        "cookie_name": "TEST COOKIE",
        "quantity": 1,
        "notes": "Direct API Test",
        "order_source": "SERVER_TEST"
    }
    try:
        result = await send_order_notification(test_data)
        if result == "SUCCESS":
            return {"status": "success", "message": "Email sent successfully!"}
        else:
            return {"status": "error", "message": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
