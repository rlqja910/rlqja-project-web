import requests
import json

url = "http://13.124.135.106:8080/api/push/send"
headers = {"Content-Type": "application/json"}
payload = {
    "title": "Test",
    "body": "Test",
    "url": "https://korekore.vercel.app",
    "targetVisitorIds": []
}

try:
    response = requests.post(url, headers=headers, json=payload)
    print(response.status_code)
    print(response.text)
except Exception as e:
    print("Error:", e)
