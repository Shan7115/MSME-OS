import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

candidate_models = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-pro-latest"]

for m in candidate_models:
    try:
        resp = client.models.generate_content(
            model=m,
            contents="Say 'OK from ' and the model name."
        )
        print(f"Model {m}: SUCCESS -> {resp.text.strip()}")
    except Exception as e:
        print(f"Model {m}: FAILED -> {e}")
