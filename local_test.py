import asyncio
from fastapi.testclient import TestClient
from api.index import app
from dotenv import load_dotenv
import os

load_dotenv(".env.local")

print(f"Loaded GROQ_API_KEY: {os.environ.get('GROQ_API_KEY') is not None}")

client = TestClient(app)

print("Starting test...")
# Test level 1
response = client.post(
    "/api/hack",
    json={"user_input": "hi", "level": 1}
)
print("Status Code:", response.status_code)
print("Response:", response.json())
