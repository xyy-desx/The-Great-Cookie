from database import SessionLocal
from models import Cookie, Admin
from auth import get_password_hash

db = SessionLocal()

try:
    print("🔄 Fixing Cookie Image Paths...")
    cookies = db.query(Cookie).all()
    for cookie in cookies:
        if "/src/assets/cookies/" in cookie.image:
            old_path = cookie.image
            new_path = cookie.image.replace("/src/assets/cookies/", "/cookies/")
            cookie.image = new_path
            print(f"   Fixed: {cookie.name} -> {new_path}")
    
    print("\n🔄 Resetting Admin Password...")
    admin = db.query(Admin).filter(Admin.username == "alex").first()
    if admin:
        admin.password_hash = get_password_hash("Cookie2024!")
        print("   ✅ Password for 'alex' reset to 'Cookie2024!'")
    else:
        # Create if missing
        admin = Admin(
            username="alex",
            password_hash=get_password_hash("Cookie2024!")
        )
        db.add(admin)
        print("   ✅ Created missing admin 'alex'")

    db.commit()
    print("\n✨ All fixes applied! You can now log in and see images.")

except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
