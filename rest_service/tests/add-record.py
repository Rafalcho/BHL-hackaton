import requests
import json

url = 'http://localhost:8080/parties/'
payloads = [{"id": 1, "x": 52.219690, "y": 21.011764, 'description': 'abc'},
           {"id": 2,"x": 52.217025, "y": 21.010337, 'description': 'abc'},
           {"id": 3,"x": 52.217694, "y": 21.008236, 'description': 'abc'},
           {"id": 4,"x": 52.217234, "y": 21.008073, 'description': 'abc'}]

for payload in payloads:
    r = requests.post(url, data=json.dumps(payload))
    print(r.status_code, r.reason)


