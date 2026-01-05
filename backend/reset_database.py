"""
Simple Database Reset Script
Clears all test data and resets auto-increment IDs for deployment.
"""

from database import get_db
from models import Order, Review
from sqlalchemy import text

def reset_database():
    print("🗑️  Resetting database for deployment...")
    
    db = next(get_db())
    
    try:
        # Delete all orders
        orders_deleted = db.query(Order).delete()
        print(f"✓ Deleted {orders_deleted} orders")
        
        # Delete all reviews
        reviews_deleted = db.query(Review).delete()
        print(f"✓ Deleted {reviews_deleted} reviews")
        
        db.commit()
        
        # Reset auto-increment sequences
        print("\n🔄 Resetting ID sequences...")
        db.execute(text("ALTER SEQUENCE orders_id_seq RESTART WITH 1"))
        db.execute(text("ALTER SEQUENCE reviews_id_seq RESTART WITH 1"))
        db.commit()
        
        print("✓ IDs reset to start from 1")
        print("\n✅ Database is ready for deployment!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
