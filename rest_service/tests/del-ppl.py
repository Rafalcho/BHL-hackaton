import requests
import json


url = 'http://localhost:8080/parties/party/people/1'


r = requests.delete(url)

print(r.status_code, r.reason)