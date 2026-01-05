from database import engine, SessionLocal
from models import Base, Cookie

# Create all tables
Base.metadata.create_all(bind=engine)

# Seed cookies
cookies_data = [
    {
        "name": "Alcapone Cookie",
        "description": "A nutty cookie, infused with smooth and silky textured cream cheese filling that burst like haven",
        "ingredients": "Chewy Dough, White Chocolate Chips, Cream cheese Filling, Sliced Almonds",
        "category": "Nutty",
        "price": 150.0,
        "image": "/src/assets/cookies/alcapone.png"
    },
    {
        "name": "Biscoff Campfire",
        "description": "A premium burnt cookie, filled with sweet and delectable hints of buttery and caramel notes",
        "ingredients": "Chewy Dough, Biscoff Cookie, Milk & Dark Chocolate Chips, Biscoff Filling, Burnt Marshmallow",
        "category": "Caramel",
        "price": 160.0,
        "image": "/src/assets/cookies/biscoff.png"
    },
    {
        "name": "Chocobomb Walnut",
        "description": "A dark chocolatey and nutty flavored cookie, infused with a bomb like chocolate goodness",
        "ingredients": "Chewy Black Dough, Dark Chocolate Chips, Choco Lava Filling, Walnuts",
        "category": "Chocolate",
        "price": 155.0,
        "image": "/src/assets/cookies/chocobomb.png"
    },
    {
        "name": "Classic Belgian",
        "description": "A wholesome goodness of ooey gooey cookie that burst like explosive lava",
        "ingredients": "Chewy Dough, Milk Chocolate Chips, Choco Lava Filling",
        "category": "Chocolate",
        "price": 140.0,
        "image": "/src/assets/cookies/belgian.png"
    },
    {
        "name": "Funfetti Cookie",
        "description": "A bright like rainbow candied cookie, filled with smooth and balanced sweetness of caramel indulgence",
        "ingredients": "Chewy Dough, White Chocolate Chips, Rainbow Sprinkle, Caramel Filling",
        "category": "Fruity",
        "price": 145.0,
        "image": "/src/assets/cookies/funfetti.png"
    },
    {
        "name": "Red Velvet",
        "description": "A smooth, rich, and velvety cookie, stuffed with a right amount of creamcheese indulgence",
        "ingredients": "Chewy Velvety Dough, White Chocolate Chips, Creamcheese Filling",
        "category": "Classic",
        "price": 155.0,
        "image": "/src/assets/cookies/redvelvet.png"
    }
]

db = SessionLocal()

try:
    # Check if cookies already exist
    existing_cookies = db.query(Cookie).count()
    if existing_cookies == 0:
        for cookie_data in cookies_data:
            cookie = Cookie(**cookie_data)
            db.add(cookie)
        db.commit()
        print(f"✅ Successfully seeded {len(cookies_data)} cookies!")
    else:
        print(f"ℹ️  Database already has {existing_cookies} cookies")
except Exception as e:
    print(f"❌ Error seeding database: {e}")
    db.rollback()
finally:
    db.close()
