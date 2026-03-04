import os
import requests
from dotenv import load_dotenv

load_dotenv(".env.local")
key = os.environ.get("GROQ_API_KEY")

try:
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    response = requests.get("https://api.groq.com/openai/v1/models", headers=headers)
    
    with open("groq_result.txt", "w") as f:
        f.write(f"Status Code: {response.status_code}\n")
        f.write(f"Response: {response.text[:200]}\n")
except Exception as e:
    with open("groq_result.txt", "w") as f:
        f.write(f"Error: {e}\n")
