"""
app.py
======
Production Launcher for NLP Intelligence Studio:
Language Model Selection, Implementation, Exploration, and Performance Analysis.

Features:
- Self-bootstraps into .venv automatically if run from system Python
- Launches FastAPI backend + React Production Frontend on http://127.0.0.1:8000
- Opens default web browser automatically for live faculty demonstration
"""

import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent
VENV_PYTHON = CURRENT_DIR / ".venv" / "Scripts" / "python.exe"
if not VENV_PYTHON.exists():
    VENV_PYTHON = CURRENT_DIR / ".venv" / "bin" / "python"

# Ensure running in .venv
try:
    import fastapi
    import uvicorn
    import transformers
    import torch
except ImportError:
    if VENV_PYTHON.exists() and sys.executable != str(VENV_PYTHON):
        print(f"[BOOTSTRAP] Launching via virtual environment: {VENV_PYTHON}")
        ret = subprocess.call([str(VENV_PYTHON), *sys.argv])
        sys.exit(ret)
    else:
        print("[ERROR] Required packages not found. Run: pip install -r requirements.txt")
        sys.exit(1)

def main():
    print("=" * 72)
    print("       NLP INTELLIGENCE STUDIO — PREMIUM AI RESEARCH PLATFORM        ")
    print("  Language Model Evaluation, Sentiment Analysis, and NLP Research    ")
    print("=" * 72)
    print("Starting FastAPI + React Studio Server at: http://127.0.0.1:8000")
    print("Serving 10 integrated research pages: Overview, Analyzer, Models,")
    print("Experiments, Analytics, Errors, Research, Insights, Ethics & Docs.")
    print("-" * 72)

    def open_browser():
        time.sleep(1.5)
        webbrowser.open_new_tab("http://127.0.0.1:8000")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=False)

if __name__ == "__main__":
    main()
