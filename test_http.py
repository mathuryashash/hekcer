import urllib.request
import json
import os

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/hack', 
    data=json.dumps({"user_input": "hi", "level": 1}).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as f:
        resp = f.read().decode('utf-8')
        with open("test_out.txt", "w") as out:
            out.write("STATUS: " + str(f.status) + "\n")
            out.write("RESP: " + resp)
except Exception as e:
    with open("test_out.txt", "w") as out:
        out.write("ERROR: " + str(e))
