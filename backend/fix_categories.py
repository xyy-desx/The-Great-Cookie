from database import SessionLocal
from models import Cookie

db = SessionLocal()
print("🍪 FIXING COOKIE CATEGORIES...")

# 1. Fix Red Velvet (Move to Chocolate)
rv = db.query(Cookie).filter(Cookie.name.ilike("%Red Velvet%")).first()
if rv:
    print(f"Update: {rv.name} | Old: {rv.category} -> New: Chocolate")
    rv.category = "Chocolate"

# 2. Fix Classic Belgian (Move to Classic)
cb = db.query(Cookie).filter(Cookie.name.ilike("%Classic Belgian%")).first()
if cb:
    print(f"Update: {cb.name} | Old: {cb.category} -> New: Classic")
    cb.category = "Classic"

db.commit()
print("✅ Categories Updated Successfully!")
db.close()
