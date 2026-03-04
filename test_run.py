import asyncio
from api.index import app
from fastapi.testclient import TestClient

client = TestClient(app)
try:
    response = client.post("/api/hack", json={"user_input": "hi", "level": 1})
    with open('api_response.json', 'w') as f:
        f.write(str(response.json()))
except Exception as e:
    with open('api_response.json', 'w') as f:
        f.write(str(e))
