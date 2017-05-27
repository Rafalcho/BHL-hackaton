import requests
import json

url = 'http://localhost:8080/patrols/'
payloads = [{"x": 52.219690, "y": 21.011764, 'description': 'abc'},
           {"x": 52.217025, "y": 21.010337, 'description': 'abc'},
           {"x": 52.217694,"y": 21.008236, 'description': 'abc'},
           {"x": 52.217234, "y": 21.008073, 'description': 'abc'}]

for payload in payloads:
    r = requests.post(url,data=json.dumps(payload))
    print(r.status_code, r.reason)