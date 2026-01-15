from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List

from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

# ----------------------------------
# App Init
# ----------------------------------
app = FastAPI(title="Sentinel Scrubber API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # orchestrator only
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

# ----------------------------------
# Request / Response Models
# ----------------------------------
class ScrubRequest(BaseModel):
    prompt: str

class ScrubResponse(BaseModel):
    cleaned_prompt: str
    redactions: Dict[str, str]

# ----------------------------------
# Scrubber Pipeline
# ----------------------------------
def scrub_pipeline(prompt: str) -> ScrubResponse:
    results = analyzer.analyze(
        text=prompt,
        entities=["PERSON", "EMAIL_ADDRESS", "PHONE_NUMBER", "LOCATION"],
        language="en"
    )

    redactions = {}
    for res in results:
        original = prompt[res.start:res.end]
        placeholder = f"<{res.entity_type}>"
        redactions[placeholder] = original

    anonymized = anonymizer.anonymize(
        text=prompt,
        analyzer_results=results
    )

    return ScrubResponse(
        cleaned_prompt=anonymized.text,
        redactions=redactions
    )

# ----------------------------------
# API Endpoint
# ----------------------------------
@app.post("/redact", response_model=ScrubResponse)
async def redact(request: ScrubRequest):
    try:
        return scrub_pipeline(request.prompt)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Scrubber failure: {str(e)}"
        )

# ----------------------------------
# Health Check
# ----------------------------------
@app.get("/health")
def health():
    return {
        "status": "online",
        "service": "scrubber"
    }
