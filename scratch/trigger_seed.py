import requests

try:
    response = requests.post("http://localhost:8000/api/books/force-seed/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
