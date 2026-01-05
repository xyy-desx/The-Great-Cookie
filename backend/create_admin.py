from database import SessionLocal
from models import Admin
from auth import get_password_hash

db = SessionLocal()

try:
    # Check if admin already exists
    existing_admin = db.query(Admin).filter(Admin.username == "alex").first()
    
    if not existing_admin:
        # Create default admin
        admin = Admin(
            username="alex",
            password_hash=get_password_hash("Cookie2024!")
        )
        db.add(admin)
        db.commit()
        print("✅ Default admin created!")
        print("Username: alex")
        print("Password: Cookie2024!")
    else:
        print("ℹ️  Admin already exists")
        
except Exception as e:
    print(f"❌ Error creating admin: {e}")
    db.rollback()
finally:
    db.close()
