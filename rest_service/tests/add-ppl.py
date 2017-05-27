import requests
import json


url = 'http://localhost:8080/parties/czitt/people'
payload = {'name': 'Jakub', 'surname': 'Motyka'}

r = requests.post(url, data=json.dumps(payload))

print(r.status_code, r.reason)