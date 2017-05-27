import requests
import json

url = 'http://localhost:8080/patrols/'
payload = {'x': '10', 'y': '10', 'time': '1234', 'description': 'abc'}

r = requests.post(url,data=json.dumps(payload))

print(r.status_code, r.reason)