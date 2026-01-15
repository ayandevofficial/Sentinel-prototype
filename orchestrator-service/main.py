import os
import logging
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai  # Updated for 2026 SDK
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("orchestrator")

# Initialize the new Gemini 2026 Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="Sentinel Orchestrator API")

# 1. FIXED CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SHIELD_URL = "http://localhost:8000/shield"
SCRUBBER_URL = "http://localhost:8001/redact"

@app.post("/chat")
async def chat(payload: dict):
    prompt = payload.get("prompt", "").strip()
    if not prompt:
        return {"blocked": False, "output": "Please provide a valid prompt.", "meta": {}}

    try:
        # 1. Security Check (Shield)
        shield_res = requests.post(SHIELD_URL, json={"prompt": prompt}, timeout=5)
        shield = shield_res.json()

        if shield.get("verdict") == "UNSAFE":
            return {
                "blocked": True,
                "output": "Prompt blocked by security policy.",
                "meta": {"shield": shield}
            }

        # 2. PII Redaction (Scrubber)
        scrub_res = requests.post(SCRUBBER_URL, json={"prompt": prompt}, timeout=5)
        scrub = scrub_res.json()
        clean_prompt = scrub.get("cleaned_prompt", prompt)
        redactions = scrub.get("redactions", {})

        # 3. AI Generation (Gemini 2.5 Flash - 2026 standard)
        try:
            # New 2026 SDK Syntax
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=clean_prompt,
                config={
                    "temperature": 0.7,
                    "max_output_tokens": 512
                }
            )
            ai_text = response.text
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            ai_text = "The AI service is currently unavailable."

        # 4. Rehydration
        for placeholder, real_value in redactions.items():
            ai_text = ai_text.replace(placeholder, real_value)

        return {
            "blocked": False,
            "output": ai_text,
            "meta": {"shield": shield, "scrub": scrub}
        }

    except Exception as e:
        logger.error(f"Orchestrator Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Orchestrator Error")