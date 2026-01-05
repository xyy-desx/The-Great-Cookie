from database import engine, Base
from models import Cookie, Order, Review, Admin
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Drop all tables and recreate them
print("🔄 Dropping all tables...")
Base.metadata.drop_all(bind=engine)

print("✅ Creating tables with new schema...")
Base.metadata.create_all(bind=engine)

print("🎉 Database schema updated successfully!")
print("\n📋 Tables created:")
print("  - cookies")
print("  - orders (with new fields: delivery_address, total_price, payment_method, delivery_date, order_source, updated_at)")
print("  - reviews")
print("  - admins")
