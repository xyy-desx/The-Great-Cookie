from database import SessionLocal
from models import Cookie

db = SessionLocal()

print("\n🔍 CHECKING DATABASE IMAGE PATHS:")
print("-" * 50)
cookies = db.query(Cookie).all()
for c in cookies:
    print(f"Cookie: {c.name}")
    print(f"Path:   '{c.image}'")
    print("-" * 20)

db.close()
