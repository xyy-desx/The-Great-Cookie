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

# Auth dependency
def get_current_admin(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "")
    username = verify_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    return username

# Login
@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == credentials.username).first()
    if not admin or not verify_password(credentials.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": admin.username})
    return {"access_token": access_token}

# Cookie Management
@router.get("/cookies")
def get_admin_cookies(db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    return db.query(Cookie).all()

@router.put("/cookies/{cookie_id}")
def update_cookie(
    cookie_id: int, 
    cookie_update: CookieUpdate, 
    db: Session = Depends(get_db), 
    admin: str = Depends(get_current_admin)
):
    cookie = db.query(Cookie).filter(Cookie.id == cookie_id).first()
    if not cookie:
        raise HTTPException(status_code=404, detail="Cookie not found")
    
    update_data = cookie_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cookie, key, value)
    
    db.commit()
    db.refresh(cookie)
    
    # Invalidate cookie cache
    from main import invalidate_cache
    invalidate_cache("cookies")
    
    return cookie

@router.delete("/cookies/{cookie_id}")
def delete_cookie(
    cookie_id: int, 
    db: Session = Depends(get_db), 
    admin: str = Depends(get_current_admin)
):
    cookie = db.query(Cookie).filter(Cookie.id == cookie_id).first()
    if not cookie:
        raise HTTPException(status_code=404, detail="Cookie not found")
    
    db.delete(cookie)
    db.commit()
    
    # Invalidate cookie cache
    from main import invalidate_cache
    invalidate_cache("cookies")
    
    return {"message": "Cookie deleted"}

    db.delete(cookie)
    db.commit()
    return {"message": "Cookie deleted"}

@router.get("/orders")
def get_admin_orders(status: Optional[str] = None, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    query = db.query(Order)
    if status and status != 'all':
        query = query.filter(Order.status == status)
    return query.order_by(Order.created_at.desc()).all()

@router.patch("/orders/{order_id}")
async def update_order(
    order_id: int, 
    order_update: OrderUpdate, 
    db: Session = Depends(get_db), 
    admin: str = Depends(get_current_admin)
):
    from email_service import send_discord_status_update
    import asyncio
    
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Store old status for Discord notification
    old_status = order.status
    
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
    
    # Send Discord notification if status changed or significant update
    try:
        order_dict = {
            'id': order.id,
            'customer_name': order.customer_name,
            'contact': order.contact,
            'cookie_name': order.cookie_name,
            'quantity': order.quantity,
            'total_price': order.total_price,
            'payment_method': order.payment_method,
            'status': order.status,
            'delivery_date': order.delivery_date,
            'delivery_address': order.delivery_address
        }
        asyncio.create_task(send_discord_status_update(order_dict, old_status))
    except Exception as e:
        print(f"⚠️ Failed to send Discord update: {str(e)}")
    
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

# Review Management
@router.get("/reviews")
def get_all_reviews(db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    return db.query(Review).order_by(Review.created_at.desc()).all()

@router.put("/reviews/{review_id}/approve")
def approve_review(
    review_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review.approved = True
    db.commit()
    
    # Invalidate reviews cache
    from main import invalidate_cache
    invalidate_cache("reviews")
    
    return {"message": "Review approved"}

@router.delete("/reviews/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(review)
    db.commit()
    
    # Invalidate reviews cache
    from main import invalidate_cache
    invalidate_cache("reviews")
    
    return {"message": "Review deleted"}

