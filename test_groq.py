import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(".env.local")

key = os.environ.get("GROQ_API_KEY")
print(f"Testing key: {key[:5]}...{key[-5:]}" if key else "No key found")

try:
    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=key,
    )
    
    response = client.models.list()
    print("SUCCESS: API Key is valid!")
    print(f"Found {len(response.data)} models available.")
except Exception as e:
    print(f"ERROR: {str(e)}")
