import requests
try:
    print("Checking internet connectivity...")
    res = requests.get("https://www.google.com", timeout=5)
    print(f"Status: {res.status_code}")
except Exception as e:
    print(f"Internet check failed: {e}")
