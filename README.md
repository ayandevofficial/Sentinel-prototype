<<<<<<< HEAD
# 🛡️ Sentinel AI Guardian

**Sentinel AI Guardian** is an enterprise-grade AI security orchestrator designed to protect sensitive data while leveraging the power of LLMs. It acts as a secure gateway between users and AI models (like Gemini 3), providing real-time defense against prompt injections and automatic PII redaction.



---

## ✨ Key Features

* **Multi-Layered Shield**: Uses a DeBERTa-v3 model to detect prompt injections, jailbreaks, and malicious intent.
* **PII Scrubber**: Automatically detects and redacts sensitive information (Emails, SSNs, Phone Numbers) before the prompt leaves your network.
* **Security Orchestrator**: A FastAPI-based central hub that manages the flow between security services and the AI provider.
* **Audit Logging**: Every prompt is analyzed, scored, and logged into a secure SQLite database for compliance monitoring.
* **Modern Workspace**: A professional React-based dashboard for secure AI interaction and real-time log viewing.

---

## 🏗️ Architecture

1.  **React Frontend**: Secure user interface for chatting and log monitoring.
2.  **Orchestrator (FastAPI)**: Coordinates the security pipeline.
3.  **Shield Service**: Runs the `protectai/deberta-v3` model for threat detection.
4.  **Scrubber Service**: Handles regex-based and NER-based PII redaction.
5.  **Gemini 3 Integration**: Processes the "cleaned" prompt via Google's latest model.



---

## 🚀 Getting Started

### 1. Prerequisites
* Python 3.10+
* Node.js & npm
* Gemini API Key

### 2. Installation

**Backend Setup:**
```bash
# Create and activate environment
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows

# Install dependencies
pip install fastapi uvicorn google-genai transformers torch
=======
# Sentinel-prototype
This is a prototype of a product
>>>>>>> 6c54f025dc64de5c23d65f12c6a8edd0519fce3b
