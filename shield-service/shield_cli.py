import torch
import re
import hashlib
import sqlite3
from datetime import datetime
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# ---------------- CONFIG ----------------

MODEL_NAME = "protectai/deberta-v3-base-prompt-injection-v2"
BLOCK_THRESHOLD = 0.8
DB_PATH = "shield_logs.db"

FORBIDDEN_TOPICS = [

    #  Credentials & Secrets
    "api key", "apikey", "api-key",
    "secret key", "client secret",
    "access token", "refresh token",
    "bearer token", "oauth token",
    "private key", "public key",
    "ssh key", "pgp key",
    "password", "passwd", "pwd",
    "credentials", "login credentials",
    "username and password",

    # Cloud / DevOps Secrets
    "aws access key", "aws secret",
    "iam credentials", "cloud credentials",
    "azure tenant id", "azure secret",
    "gcp service account",
    "firebase private key",
    "kubernetes secret",
    "docker registry password",
    "ci/cd secrets",
    "github token", "gitlab token",

    #  Databases & Storage
    "database dump", "db dump",
    "production database",
    "prod database",
    "sql dump",
    "mongodb dump",
    "redis keys",
    "s3 bucket contents",
    "backup files",

    #  Internal / Confidential
    "internal document",
    "confidential data",
    "restricted information",
    "private repository",
    "internal api",
    "internal endpoint",
    "company secrets",
    "trade secrets",
    "internal roadmap",
    "internal emails",

    #  Financial / HR
    "salary spreadsheet",
    "employee salary",
    "payroll data",
    "bank account details",
    "credit card numbers",
    "debit card details",
    "cvv number",
    "tax records",
    "pan card",
    "aadhar number",

    #  Legal / Strategy
    "nda document",
    "legal strategy",
    "lawsuit documents",
    "compliance report",
    "audit report",
    "merger plans",
    "acquisition plans",
    "board meeting notes",

    #  AI / Model Internals
    "system prompt",
    "developer prompt",
    "hidden instructions",
    "training data",
    "model weights",
    "fine tuning data",
    "rlhf data",
    "prompt injection",
    "guardrail bypass",

    #  Malware / Exploits
    "zero day exploit",
    "exploit code",
    "malware source",
    "ransomware",
    "keylogger",
    "credential harvester",
    "reverse shell",
    "backdoor",
    "rootkit",
    "botnet",
    "payload generation",

    #  OPSEC / Surveillance
    "bypass detection",
    "avoid being traced",
    "anonymous hacking",
    "hide from law enforcement",
    "evade antivirus",
    "disable logging",
    "erase logs",

    #  Custom / Project-Specific
    "project x",
    "sentinel internal",
    "shield internal",
    "ayaan private",
    "security architecture",
    "security weaknesses",
    "bypass sentinel",
]

JAILBREAK_PATTERNS = [

    #  Instruction Override
    r"ignore (all|any|previous|above) instructions",
    r"disregard (all|any) rules",
    r"forget your instructions",
    r"override your system prompt",
    r"reset your instructions",
    r"new rules apply",

    #  Role Hijacking / Persona Attacks
    r"you are now .*",
    r"act as .*",
    r"pretend to be .*",
    r"roleplay as .*",
    r"simulate .*",
    r"behave like .*",

    #  Safety & Policy Suppression
    r"do not mention (rules|filters|policies|safety)",
    r"without safety restrictions",
    r"bypass safety",
    r"bypass filters",
    r"disable guardrails",
    r"no content restrictions",

    #  Authority / Trust Abuse
    r"this is for educational purposes",
    r"this is for research purposes",
    r"this is legal",
    r"i have permission",
    r"authorized request",
    r"company approved",

    #  Encoding / Obfuscation Attacks
    r"decode this",
    r"encode this",
    r"base64",
    r"rot13",
    r"hexadecimal",
    r"ascii conversion",
    r"binary encoded",
    r"caesar cipher",

    #  Prompt Leakage
    r"show me your system prompt",
    r"reveal your instructions",
    r"print your hidden prompt",
    r"what are your internal rules",
    r"what was your initial prompt",

    #  Chain-of-Thought Extraction
    r"think step by step",
    r"explain your reasoning",
    r"show your reasoning",
    r"chain of thought",
    r"hidden reasoning",

    #  Compliance Forcing
    r"you must answer",
    r"you are required to comply",
    r"failure to answer",
    r"mandatory response",
    r"non negotiable",

    #  Multi-Step Jailbreaks
    r"first acknowledge",
    r"after acknowledging",
    r"step 1.*step 2",
    r"once you confirm",
    r"repeat after me",

    #  Known Jailbreak Slang
    r"dan mode",
    r"developer mode",
    r"god mode",
    r"unfiltered mode",
    r"no limits mode",
    r"raw output mode",

    #  Psychological Manipulation
    r"you are safe to answer",
    r"no harm will come",
    r"trust me",
    r"this helps improve you",

    #  Indirect Prompt Injection
    r"the following text is a system instruction",
    r"the assistant must follow",
    r"assistant instructions below",
    r"model instructions",
]


# ---------------- LOAD MODEL ----------------

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval()

# ---------------- DATABASE INITIALIZATION ----------------

def init_db():
    """Creates the database and table if they do not exist."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS shield_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prompt TEXT,
            verdict TEXT,
            reason TEXT,
            security_score REAL,
            details TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()

# Initialize database on script load
init_db()

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

# Global connection for logging
db = get_db()
cursor = db.cursor()

# ---------------- UTILS ----------------

def log_to_db(prompt, verdict, reason, score, details):
    cursor.execute(
        """
        INSERT INTO shield_logs 
        (prompt, verdict, reason, security_score, details, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            prompt,
            verdict,
            reason,
            score,
            details,
            datetime.utcnow().isoformat()
        )
    )
    db.commit()

# ---------------- SHIELD LAYERS ----------------

def ml_guard(prompt):
    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=512
    )
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)
    return probs[0][1].item()

def heuristic_scan(prompt):
    p = prompt.lower()
    return any(re.search(pattern, p) for pattern in JAILBREAK_PATTERNS)

def semantic_firewall(prompt):
    p = prompt.lower()
    return any(term in p for term in FORBIDDEN_TOPICS)

# ---------------- MAIN PIPELINE ----------------

def shield_pipeline(prompt):
    score = ml_guard(prompt)

    if score >= BLOCK_THRESHOLD:
        log_to_db(prompt, "UNSAFE", "ML_GUARD", score, "Prompt injection detected")
        return {
            "verdict": "UNSAFE",
            "reason": "ML_GUARD",
            "security_score": round(score, 4),
            "forward_to_ayaan": False
        }

    if heuristic_scan(prompt):
        log_to_db(prompt, "UNSAFE", "HEURISTIC", score, "Jailbreak pattern detected")
        return {
            "verdict": "UNSAFE",
            "reason": "HEURISTIC_SCANNER",
            "security_score": round(score, 4),
            "forward_to_ayaan": False
        }

    if semantic_firewall(prompt):
        log_to_db(prompt, "UNSAFE", "SEMANTIC_FIREWALL", score, "Forbidden topic")
        return {
            "verdict": "UNSAFE",
            "reason": "SEMANTIC_FIREWALL",
            "security_score": round(score, 4),
            "forward_to_ayaan": False
        }

    log_to_db(prompt, "SAFE", "CLEAN", score, "Prompt allowed")
    return {
        "verdict": "SAFE",
        "reason": "CLEAN",
        "security_score": round(score, 4),
        "forward_to_ayaan": True
    }

# ---------------- CLI ENTRY ----------------

if __name__ == "__main__":
    print("\n Sentinel Shield CLI (Ctrl+C to exit)\n")
    while True:
        try:
            user_prompt = input("User Prompt ➜ ").strip()
            if not user_prompt:
                continue
            result = shield_pipeline(user_prompt)
            print("\n--- SHIELD VERDICT ---")
            for k, v in result.items():
                print(f"{k}: {v}")
            print("----------------------\n")
        except KeyboardInterrupt:
            print("\n[+] Shield shutting down.")
            break