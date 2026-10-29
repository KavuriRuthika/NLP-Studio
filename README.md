# NLP Intelligence Studio: Interactive Laboratory for Language Model Evaluation, Sentiment Analysis, and NLP Research

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![React 19](https://img.shields.io/badge/React-19%20TypeScript-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![Transformers](https://img.shields.io/badge/HuggingFace-Transformers-orange.svg)](https://huggingface.co/transformers/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x%20CPU-red.svg)](https://pytorch.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An enterprise-grade, interactive AI research studio and academic project investigating transformer language models, subword tokenization, inference performance, linguistic challenge categories, and decoupled application orchestration with LangChain.

---

## 🌟 Product Showcase & Architecture

The **NLP Intelligence Studio** is built as a complete full-stack AI research platform:

```text
[React TypeScript Frontend (Port 8000 / 5173)]
                 │
                 ├──► 1. Overview Dashboard (Pipeline Architecture & Real Metrics)
                 ├──► 2. Live NLP Analyzer (Real-time WordPiece Tokens, Latency & Confidences)
                 ├──► 3. Model Laboratory (DistilBERT vs. BERT-Base vs. GPT-2 Architecture)
                 ├──► 4. Experiment Center (Interactive Benchmark & Stress Suite Runner)
                 ├──► 5. Performance Analytics (Interactive Confusion Matrix & Latency Curves)
                 ├──► 6. Error Analysis (Taxonomy of Sarcasm, Slang & Neutral Failures)
                 ├──► 7. Research Questions (RQ1 through RQ5 Empirical Hypotheses)
                 ├──► 8. Model Insights (Educational Dissection of Attention & Distillation)
                 ├──► 9. Responsible AI & Ethics (Bias, Privacy, Green NLP & Governance)
                 └──► 10. Documentation & Viva Hub (35 Exam Questions & Spoken Script)
                                     │
                                     ▼  REST API (FastAPI)
[Python FastAPI Backend (Port 8000)]
                 │
                 ├──► Hugging Face Transformers Engine (PyTorch 2.x CPU)
                 │      ├── DistilBERT SST-2 (66M Parameters) [Primary Baseline]
                 │      └── BERT-Base SST-2 (110M Parameters) [Comparative Teacher]
                 │
                 ├──► LangChain Orchestration Layer (LCEL Runnable Architecture)
                 │
                 └──► Empirical Benchmark Results & High-Res Figures (results/)
```

---

## 🚀 One-Command Launch (Faculty Demonstration)

From PowerShell or Terminal:

```powershell
python app.py
```

*(Note: `app.py` features automatic environment detection — it will automatically launch inside `.venv` and pop open `http://127.0.0.1:8000` in your default browser).*

---

## 🛠️ Step-by-Step Manual Setup

### 1. Python Environment Setup
```powershell
# Navigate to workspace
cd D:\Advsnced

# Create virtual environment (Python 3.12 recommended)
py -3.12 -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install PyTorch CPU & dependencies
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
```

### 2. Run the Full Experiment Benchmark Suite Headless
```powershell
python run_experiments.py
```
*Executes all 100 benchmark reviews, profiles sequence lengths 10 to 500, evaluates the 10 stress categories, and saves all CSV logs and PNG charts into `results/`.*

### 3. Launch the Interactive Jupyter Notebook
```powershell
jupyter notebook
```
*Open `notebooks/nlp_language_model_analysis.ipynb` and execute all 38 cells sequentially.*

### 4. Optional: Run Frontend in Vite Development Mode
```powershell
cd frontend
npm install
npm run dev
```

---

## 🔬 Empirical Benchmark Findings (N=100)

| Metric / Dimension | DistilBERT (66M Parameters) | BERT-Base (110M Parameters) | Finding / Significance |
| :--- | :--- | :--- | :--- |
| **Accuracy** | **99.00%** | **99.00%** | DistilBERT matches BERT-Base fidelity |
| **Precision** | **0.9804** | **0.9804** | 1 False Positive out of 51 predicted |
| **Recall** | **1.0000** | **1.0000** | Identified 50/50 true positives |
| **Macro F1-Score** | **0.9901** | **0.9901** | Exceptional harmonic balance |
| **Mean CPU Latency** | **25.22 ms** | **42.10 ms** | **39.8% faster execution** |
| **Parameter Scale** | **66.9 Million** | **109.5 Million** | **38.8% smaller model footprint** |
| **Confusion Matrix** | 49 TN, 1 FP, 0 FN, 50 TP | 49 TN, 1 FP, 0 FN, 50 TP | Balanced across polar classes |

---

## 📁 Repository Deliverables

- `app.py` — Unified server launcher (FastAPI + React bundle with auto-browser launch)
- `backend/main.py` — FastAPI REST API with endpoints (`/api/analyze`, `/api/models`, `/api/metrics`, `/api/errors`, `/api/research`)
- `frontend/` — Production React 19 + TypeScript + Vite + Recharts + Lucide application
- `notebooks/nlp_language_model_analysis.ipynb` — 38-cell academic Jupyter Notebook
- `reports/final_project_report.md` — 21-section academic research report
- `reports/viva_preparation_and_presentation.md` — 35 viva voce questions and answers + 2-minute elevator pitch
- `references.md` — 12 verified bibliographic citations with URLs
- `results/` — Real empirical CSV logs and high-resolution publication charts
