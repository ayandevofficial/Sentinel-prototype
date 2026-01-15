from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import your existing pipeline
from shield_cli import shield_pipeline

# ----------------------------------
# App Init
# ----------------------------------
app = FastAPI(title="Sentinel Shield API")

# Allow orchestrator only
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------
# Request Schema (MATCH ORCHESTRATOR)
# ----------------------------------
class ShieldRequest(BaseModel):
    prompt: str

# ----------------------------------
# Shield Endpoint
# ----------------------------------
@app.post("/shield")
async def run_shield(request: ShieldRequest):
    try:
        # Added a debug log
        print(f"DEBUG: Processing prompt: {request.prompt}")
        
        result = shield_pipeline(request.prompt)
        return result

    except Exception as e:
        # This will print the FULL error in your terminal
        import traceback
        traceback.print_exc() 
        
        raise HTTPException(
            status_code=500,
            detail=f"Shield failure: {str(e)}"
        )
# ----------------------------------
# Health Check
# ----------------------------------
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "shield",
        "model": "protectai/deberta-v3-base-prompt-injection-v2"
    }

import sqlite3
from fastapi import APIRouter

@app.get("/logs")
async def get_logs():
    try:
        conn = sqlite3.connect("shield_logs.db")
        conn.row_factory = sqlite3.Row # This allows us to access columns by name
        cursor = conn.cursor()
        
        # Fetch the last 50 logs
        cursor.execute("SELECT * FROM shield_logs ORDER BY created_at DESC LIMIT 50")
        rows = cursor.fetchall()
        
        # Convert sqlite rows to a list of dicts
        logs = []
        for row in rows:
            logs.append(dict(row))
            
        conn.close()
        return logs
    except Exception as e:
        return {"error": str(e)}