from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database import get_db
from models import Cookie, Order, Review, Admin
from auth import verify_password, create_access_token, verify_token
import os
import shutil
from pathlib import Path

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class CookieUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    ingredients: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    weight: Optional[str] = None
    image: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    delivery_address: Optional[str] = None
    payment_method: Optional[str] = None
    delivery_date: Optional[str] = None
    quantity: Optional[int] = None
    cookie_name: Optional[str] = None
    contact: Optional[str] = None

# ... (rest of file)

@router.patch("/orders/{order_id}")
def update_order(
    order_id: int, 
    order_update: OrderUpdate, 
    db: Session = Depends(get_db), 
    admin: str = Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Update fields
    update_data = order_update.dict(exclude_unset=True)
    print(f"DEBUG: Updating Order {order_id} with data: {update_data}")
    
    # If cookie or quantity changed, recalculate price
    if 'cookie_name' in update_data or 'quantity' in update_data:
        new_cookie_name = update_data.get('cookie_name', order.cookie_name)
        new_quantity = update_data.get('quantity', order.quantity)
        print(f"DEBUG: Recalculating Price. Cookie: {new_cookie_name}, Qty: {new_quantity}")
        
        # Get cookie price
        cookie = db.query(Cookie).filter(Cookie.name == new_cookie_name).first()
        if cookie:
            # Update price based on new quantity * cookie price
            new_total = cookie.price * new_quantity
            order.total_price = new_total
            print(f"DEBUG: Found Cookie Price: {cookie.price}. New Total: {new_total}")
        else:
            print(f"DEBUG: Cookie '{new_cookie_name}' NOT FOUND. Cannot recalculate price.")
    
    for key, value in update_data.items():
        setattr(order, key, value)
    
    db.commit()
    db.refresh(order)
    print(f"DEBUG: Update Committed. Final Order: {order.quantity}x {order.cookie_name} = {order.total_price}")
    
    return order

@router.delete("/orders/{order_id}")
def delete_order(
    order_id: int, 
    db: Session = Depends(get_db), 
    admin: str = Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    return {"message": "Order deleted"}

# Image Upload
@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), admin: str = Depends(get_current_admin)):
    # Create uploads directory if it doesn't exist
    upload_dir = Path("../public/uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{os.path.splitext(file.filename)[0]}_{os.urandom(8).hex()}{file_extension}"
    file_path = upload_dir / filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return URL path
    return {"image_url": f"/uploads/{filename}"}

# Stats
@router.get("/stats")
def get_stats(db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    total_cookies = db.query(Cookie).count()
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    completed_orders = db.query(Order).filter(Order.status == "completed").count()
    total_reviews = db.query(Review).count()
    pending_reviews = db.query(Review).filter(Review.approved == False).count()
    
    return {
        "total_cookies": total_cookies,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders,
        "total_reviews": total_reviews,
        "pending_reviews": pending_reviews
    }

# Revenue Analytics
@router.get("/analytics/revenue")
def get_revenue_analytics(db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    # Calculate total revenue from completed orders
    total_revenue = db.query(func.sum(Order.total_price)).filter(
        Order.status.in_(["completed", "out_for_delivery"])
    ).scalar() or 0
    
    # Calculate average order value
    avg_order_value = db.query(func.avg(Order.total_price)).filter(
        Order.status != "cancelled"
    ).scalar() or 0
    
    # Get best-selling cookies
    best_sellers = db.query(
        Order.cookie_name,
        func.sum(Order.quantity).label('total_sold'),
        func.sum(Order.total_price).label('revenue')
    ).filter(
        Order.status.in_(["completed", "out_for_delivery", "confirmed", "preparing"])
    ).group_by(Order.cookie_name).order_by(func.sum(Order.quantity).desc()).limit(5).all()
    
    # Get daily revenue for last 7 days
    seven_days_ago = datetime.now() - timedelta(days=7)
    daily_sales = db.query(
        func.date(Order.created_at).label('date'),
        func.sum(Order.total_price).label('revenue'),
        func.count(Order.id).label('order_count')
    ).filter(
        Order.created_at >= seven_days_ago,
        Order.status.in_(["completed", "out_for_delivery", "confirmed", "preparing"])
    ).group_by(func.date(Order.created_at)).order_by(func.date(Order.created_at)).all()
    
    # Total orders this month
    this_month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_orders = db.query(Order).filter(
        Order.created_at >= this_month_start,
        Order.status != "cancelled"
    ).count()
    
    monthly_revenue = db.query(func.sum(Order.total_price)).filter(
        Order.created_at >= this_month_start,
        Order.status.in_(["completed", "out_for_delivery"])
    ).scalar() or 0
    
    return {
        "total_revenue": float(total_revenue),
        "average_order_value": float(avg_order_value),
        "monthly_revenue": float(monthly_revenue),
        "monthly_orders": monthly_orders,
        "best_sellers": [
            {
                "cookie_name": item[0],
                "total_sold": item[1],
                "revenue": float(item[2] or 0)
            } for item in best_sellers
        ],
        "daily_sales": [
            {
                "date": item[0].isoformat(),
                "revenue": float(item[1] or 0),
                "order_count": item[2]
            } for item in daily_sales
        ]
    }
