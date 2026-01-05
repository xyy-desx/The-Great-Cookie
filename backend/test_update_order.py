
import requests
import json

# Setup
URL = "http://localhost:8000"
COOKIE_NAME = "Classic Belgian" 

# 1. Create a Test Order
print("--- Creating Test Order ---")
new_order = {
    "customer_name": "Test Updater",
    "contact": "1234567890",
    "cookie_name": COOKIE_NAME,
    "quantity": 1,
    "order_source": "manual",
    "payment_method": "Cash",
    "delivery_date": "2024-01-01"
}
response = requests.post(f"{URL}/api/orders", json=new_order)
if response.status_code != 200:
    print(f"Failed to create order: {response.text}")
    exit()

order_id = response.json()["id"]
initial_price = response.json().get("total_price")
print(f"Order Created: ID={order_id}, Qty=1, Price={initial_price}")

# 2. Login as Admin to get Token (Mocking logic or skipping auth if feasible, but routes require auth)
# For this test, I'll need to bypass auth or login. 
# Let's assume I can login. If not, I'll check the route protection.
# The route `/api/admin/orders/{id}` requires `get_current_admin`.
# I'll create a token manually or just temporarily commenting out auth in the script if I had access, 
# but here I must login.

# Create admin if not exists (assume 'admin' 'admin123')
# Actually, I'll just try to login.
login_payload = {"username": "admin", "password": "securepassword123"} # Default from creation
login_res = requests.post(f"{URL}/api/admin/login", json=login_payload)
if login_res.status_code != 200:
    print("Login failed. Cannot test admin routes.")
    # Alternate: Login with hardcoded hash if known, or skip.
    # I will try to use the known default if possible, or just fail and ask user.
else:
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Update Quantity to 3
    print(f"\n--- Updating Order {order_id} Qty to 3 ---")
    update_payload = {
        "quantity": 3,
        "cookie_name": COOKIE_NAME # Keep same cookie
    }
    update_res = requests.patch(f"{URL}/api/admin/orders/{order_id}", json=update_payload, headers=headers)
    
    if update_res.status_code == 200:
        updated_data = update_res.json()
        print(f"Update Success!")
        print(f"New Qty: {updated_data['quantity']}")
        print(f"New Price: {updated_data['total_price']}")
        
        if updated_data['quantity'] == 3 and updated_data['total_price'] == (initial_price * 3):
            print("✅ TEST PASSED: Quantity updated and Price recalculated.")
        else:
            print("❌ TEST FAILED: Logic incorrect.")
    else:
        print(f"Update Failed: {update_res.text}")
