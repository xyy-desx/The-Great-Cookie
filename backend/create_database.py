import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to PostgreSQL server (not a specific database)
try:
    # Connect to default postgres database to create our database
    conn = psycopg2.connect(
        host="localhost",
        user="postgres",
        password="Newpassword",
        database="postgres"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute("SELECT 1 FROM pg_database WHERE datname='greatcookie'")
    exists = cursor.fetchone()
    
    if not exists:
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(
            sql.Identifier('greatcookie')
        ))
        print("✅ Database 'greatcookie' created successfully!")
    else:
        print("ℹ️  Database 'greatcookie' already exists")
    
    cursor.close()
    conn.close()
    
    print("\n🎉 Database setup complete!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nPlease check:")
    print("1. PostgreSQL service is running")
    print("2. Password is correct")
