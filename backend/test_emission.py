import requests

url = "http://127.0.0.1:5000/api/emissions/add"
payload = {
    "user_id": 3,
    "category": "Ulaşım",
    "source": "Benzinli Araç",
    "amount": 100
}

response = requests.post(url, json=payload)
print("Status Code:", response.status_code)
print("Response:", response.json())