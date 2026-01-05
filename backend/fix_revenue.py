from database import SessionLocal
from models import Order, Cookie

def fix_revenue():
    db = SessionLocal()
    print("💰 Checking for 0-Revenue Orders...")
    
    # diverse query to catch null or 0
    orders = db.query(Order).all()
    count = 0
    
    for o in orders:
        # If price is missing or 0
        if not o.total_price or o.total_price == 0:
            cookie = db.query(Cookie).filter(Cookie.name == o.cookie_name).first()
            if cookie:
                old_price = o.total_price
                new_price = cookie.price * o.quantity
                o.total_price = new_price
                print(f"   Item {o.id}: {o.cookie_name} (Qty {o.quantity}) -> Fixed: {new_price} (was {old_price})")
                count += 1
    
    if count > 0:
        db.commit()
        print(f"✅ Fixed {count} orders!")
    else:
        print("✨ All orders already have valid revenue.")
        
    db.close()

if __name__ == "__main__":
    fix_revenue()
