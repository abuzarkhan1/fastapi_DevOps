import requests
import sys

BASE_URL = "http://localhost:8003/api/v1"
EMAIL = "test_user_2@example.com"
PASSWORD = "securepassword" # From previous step

def run_test():
    # 1. Login
    print(f"Logging in as {EMAIL}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json={"email": EMAIL, "password": PASSWORD})
        if resp.status_code != 200:
            print(f"Login Failed: {resp.text}")
            return
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("Login Successful!")
    except Exception as e:
        print(f"Login Exception: {e}")
        return

    # 2. List Users
    print("\nListing users...")
    resp = requests.get(f"{BASE_URL}/users/", headers=headers)
    if resp.status_code == 200:
        users = resp.json()
        print(f"Success! Found {len(users)} users.")
    else:
        print(f"List Users Failed: {resp.text}")
        return

    # 3. Create User
    print("\nCreating new user...")
    new_user = {
        "email": "crud_test_final@example.com",
        "password": "newpassword123",
        "full_name": "CRUD Test User",
        "role": "user"
    }
    resp = requests.post(f"{BASE_URL}/users/", json=new_user, headers=headers)
    if resp.status_code == 200:
        created_user = resp.json()
        print(f"Success! Created user ID: {created_user['id']}")
    else:
        print(f"Create User Failed: {resp.text}")
        return

    # 4. Delete User
    print(f"\nDeleting user ID: {created_user['id']}...")
    resp = requests.delete(f"{BASE_URL}/users/{created_user['id']}", headers=headers)
    if resp.status_code == 200:
        print("Success! User deleted.")
    else:
        print(f"Delete User Failed: {resp.text}")

if __name__ == "__main__":
    run_test()
