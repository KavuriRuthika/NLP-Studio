"""
model_utils.py
================
Core utilities for AI-Driven Natural Language Processing Project:
Language Model Selection, Implementation, Exploration, and Performance Analysis.

Provides:
- Reproducibility seeding
- Hugging Face pipeline loading with fallback & metadata extraction
- Subword tokenization breakdown (WordPiece / BPE)
- Comprehensive evaluation (Accuracy, Precision, Recall, F1, Confusion Matrix)
- Latency profiling across sequence lengths
- Systematic qualitative exploration across 10 linguistic stress-test categories
- LangChain orchestration chain wrapper
- Publication-quality visualization generation
"""

import os
import time
import random
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for headless figure generation
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Tuple, Any

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

try:
    import torch
except ImportError:
    torch = None

try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
except ImportError:
    AutoTokenizer = None
    AutoModelForSequenceClassification = None
    pipeline = None


def set_all_seeds(seed: int = 42) -> None:
    """Set random seeds across Python, NumPy, and PyTorch for strict reproducibility."""
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    if torch is not None:
        torch.manual_seed(seed)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(seed)


def load_sentiment_pipeline(
    model_name: str = "distilbert/distilbert-base-uncased-finetuned-sst-2-english",
    device: str = "cpu"
) -> Tuple[Any, Any, Any]:
    """
    Safely load a Hugging Face tokenizer, model, and sentiment-analysis pipeline.

    Returns:
        (pipe, tokenizer, model)
    """
    if pipeline is None:
        raise ImportError("Transformers is not installed. Run 'pip install transformers torch'.")

    print(f"[INFO] Loading model and tokenizer for: '{model_name}' on device='{device}'...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name)
    
    device_int = 0 if device == "cuda" and torch.cuda.is_available() else -1
    pipe = pipeline(
        "sentiment-analysis",
        model=model,
        tokenizer=tokenizer,
        device=device_int,
        top_k=None  # Return scores for all classes for full transparency
    )
    print(f"[SUCCESS] Successfully initialized '{model_name}'.")
    return pipe, tokenizer, model


def get_token_breakdown(tokenizer: Any, text: str) -> pd.DataFrame:
    """
    Demonstrate subword tokenization by returning tokens, IDs, and attention masks.
    """
    encoding = tokenizer(text, add_special_tokens=True)
    token_ids = encoding["input_ids"]
    tokens = tokenizer.convert_ids_to_tokens(token_ids)
    
    df = pd.DataFrame({
        "Index": list(range(len(tokens))),
        "Token": tokens,
        "Token_ID": token_ids,
        "Is_Special": [t in tokenizer.all_special_tokens for t in tokens]
    })
    return df


def evaluate_model(
    pipe: Any,
    texts: List[str],
    true_labels: List[int],
    label_mapping: Dict[str, int] = None
) -> Dict[str, Any]:
    """
    Execute batch inference, profile latency, and calculate standard classification metrics.
    
    Default label_mapping aligns with binary SST-2 convention:
    {'NEGATIVE': 0, 'POSITIVE': 1}
    """
    if label_mapping is None:
        label_mapping = {"NEGATIVE": 0, "POSITIVE": 1}

    preds_raw = []
    pred_labels = []
    confidences = []
    latencies = []

    for text in texts:
        t0 = time.perf_counter()
        res = pipe(text)
        t1 = time.perf_counter()
        latencies.append((t1 - t0) * 1000.0)  # ms

        # Sort by score descending to get top prediction
        sorted_res = sorted(res[0], key=lambda x: x["score"], reverse=True)
        top = sorted_res[0]
        
        # Standardize label (handles e.g. 'LABEL_0', 'LABEL_1', 'POSITIVE', 'NEGATIVE')
        raw_label = top["label"].upper()
        if raw_label in label_mapping:
            norm_label = label_mapping[raw_label]
        elif "POS" in raw_label or raw_label == "LABEL_1":
            norm_label = 1
        elif "NEG" in raw_label or raw_label == "LABEL_0":
            norm_label = 0
        else:
            norm_label = 0  # Fallback for unexpected label keys

        preds_raw.append(raw_label)
        pred_labels.append(norm_label)
        confidences.append(top["score"])

    # Compute metrics
    acc = accuracy_score(true_labels, pred_labels)
    prec = precision_score(true_labels, pred_labels, average="binary", zero_division=0)
    rec = recall_score(true_labels, pred_labels, average="binary", zero_division=0)
    f1 = f1_score(true_labels, pred_labels, average="binary", zero_division=0)
    cm = confusion_matrix(true_labels, pred_labels)
    report = classification_report(true_labels, pred_labels, target_names=["Negative", "Positive"], output_dict=True)

    results_df = pd.DataFrame({
        "Text": texts,
        "True_Label": true_labels,
        "Pred_Label": pred_labels,
        "Raw_Label": preds_raw,
        "Confidence": confidences,
        "Latency_ms": latencies,
        "Correct": [int(t == p) for t, p in zip(true_labels, pred_labels)]
    })

    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1": f1,
        "confusion_matrix": cm,
        "classification_report": report,
        "mean_latency_ms": float(np.mean(latencies)),
        "std_latency_ms": float(np.std(latencies)),
        "predictions_df": results_df
    }


def measure_latency_by_length(
    pipe: Any,
    test_lengths: List[int] = None,
    num_runs: int = 5
) -> pd.DataFrame:
    """
    Benchmark inference latency as sequence length varies (for RQ3).
    """
    if test_lengths is None:
        test_lengths = [10, 25, 50, 100, 200, 350, 500]

    sample_word = "film "
    records = []

    for length in test_lengths:
        text = (sample_word * (length // len(sample_word) + 1))[:length * 5]  # approximate length
        timings = []
        for _ in range(num_runs):
            t0 = time.perf_counter()
            _ = pipe(text)
            t1 = time.perf_counter()
            timings.append((t1 - t0) * 1000.0)

        records.append({
            "Token_Target_Length": length,
            "Char_Length": len(text),
            "Mean_Latency_ms": float(np.mean(timings)),
            "Std_Latency_ms": float(np.std(timings)),
            "Min_Latency_ms": float(np.min(timings)),
            "Max_Latency_ms": float(np.max(timings))
        })

    return pd.DataFrame(records)


def get_exploration_dataset() -> List[Dict[str, Any]]:
    """
    Curated set of 10 linguistic stress-test categories for Section G exploration.
    """
    return [
        {
            "category": "Clearly Positive",
            "text": "This movie was an absolute masterpiece with breathtaking cinematography and stellar acting.",
            "expected_human_sentiment": "Positive",
            "challenge_description": "Straightforward strongly positive vocabulary."
        },
        {
            "category": "Clearly Negative",
            "text": "The plot was utterly incoherent, boring, and a complete waste of two hours.",
            "expected_human_sentiment": "Negative",
            "challenge_description": "Straightforward strongly negative vocabulary."
        },
        {
            "category": "Neutral Statements",
            "text": "The documentary is ninety minutes long and was filmed on location in Chicago.",
            "expected_human_sentiment": "Neutral",
            "challenge_description": "Purely factual reporting without affective valence (binary model must force a decision)."
        },
        {
            "category": "Mixed / Contradictory",
            "text": "The visual effects and sound design were stunning, but the screenplay was horribly written and dull.",
            "expected_human_sentiment": "Mixed",
            "challenge_description": "Contains opposing clauses; tests which clause dominates the classification head."
        },
        {
            "category": "Sarcasm / Irony",
            "text": "Oh fantastic, another reboot full of uninspired clichés, just what the world needed.",
            "expected_human_sentiment": "Negative",
            "challenge_description": "Superficially positive words ('fantastic', 'just what the world needed') masking negative intent."
        },
        {
            "category": "Negation",
            "text": "The acting wasn't bad at all, and it certainly was not uninteresting.",
            "expected_human_sentiment": "Positive",
            "challenge_description": "Double negation ('wasn't bad', 'not uninteresting') testing syntactic compositionality."
        },
        {
            "category": "Very Short Sentences",
            "text": "Masterpiece.",
            "expected_human_sentiment": "Positive",
            "challenge_description": "Extreme context scarcity (single word)."
        },
        {
            "category": "Long Elaborate Text",
            "text": "While initial pacing issues during the opening act caused minor irritation and early character introductions felt somewhat disjointed, the narrative gradually developed genuine emotional resonance, culminating in a deeply satisfying, thoughtfully constructed climax that lingers in the mind.",
            "expected_human_sentiment": "Positive",
            "challenge_description": "Complex clause structures, initial critique followed by overarching positive conclusion."
        },
        {
            "category": "Misspellings / Informal Slang",
            "text": "Dis movi was sooooo fire bro, total banger fr no cap!!",
            "expected_human_sentiment": "Positive",
            "challenge_description": "Heavy internet slang ('fire', 'banger', 'fr', 'no cap') and non-standard orthography."
        },
        {
            "category": "Ambiguous / Context-Dependent",
            "text": "It is completely unlike anything director David Lynch has ever made before.",
            "expected_human_sentiment": "Ambiguous",
            "challenge_description": "Value judgment depends entirely on the viewer's opinion of Lynch's standard style."
        }
    ]


def test_exploration_categories(pipe: Any) -> pd.DataFrame:
    """
    Run qualitative stress test over the 10 linguistic challenge categories.
    """
    dataset = get_exploration_dataset()
    rows = []

    for item in dataset:
        res = pipe(item["text"])
        top = sorted(res[0], key=lambda x: x["score"], reverse=True)[0]
        rows.append({
            "Category": item["category"],
            "Input_Text": item["text"],
            "Expected_Sentiment": item["expected_human_sentiment"],
            "Predicted_Label": top["label"],
            "Confidence": round(top["score"], 4),
            "Challenge_Explanation": item["challenge_description"]
        })

    return pd.DataFrame(rows)


def build_langchain_sentiment_chain(pipe: Any) -> Any:
    """
    Construct a clean, modular LangChain runnable chain illustrating:
    User Input -> Prompt Formatting -> Transformers HuggingFace Pipeline -> Structured Result.
    Does NOT require external API keys.
    """
    from langchain_core.prompts import PromptTemplate
    from langchain_core.runnables import RunnableLambda

    prompt_template = PromptTemplate(
        input_variables=["review_text"],
        template="Analyze the sentiment of the following text:\n\n\"{review_text}\""
    )

    def run_hf_pipeline(formatted_prompt: Any) -> Dict[str, Any]:
        # Extract text from prompt object
        text = formatted_prompt.to_string() if hasattr(formatted_prompt, "to_string") else str(formatted_prompt)
        res = pipe(text)
        top = sorted(res[0], key=lambda x: x["score"], reverse=True)[0]
        return {
            "processed_input": text,
            "predicted_sentiment": top["label"],
            "confidence_score": round(float(top["score"]), 4),
            "orchestrator": "LangChain v0.2+ LCEL Runnable Chain",
            "underlying_engine": getattr(pipe.model, "name_or_path", "HuggingFace Transformer")
        }

    chain = prompt_template | RunnableLambda(run_hf_pipeline)
    return chain


# ============================================================================
# Visualizations
# ============================================================================

def plot_and_save_confusion_matrix(
    cm: np.ndarray,
    labels: List[str],
    output_path: str,
    title: str = "Confusion Matrix: DistilBERT Sentiment Analysis"
) -> None:
    """Generate and save publication-style confusion matrix heatmap."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.figure(figsize=(6, 5))
    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=labels,
        yticklabels=labels,
        cbar=True,
        annot_kws={"size": 14, "weight": "bold"}
    )
    plt.title(title, fontsize=13, weight="bold", pad=12)
    plt.xlabel("Predicted Label", fontsize=11, labelpad=8)
    plt.ylabel("True Ground Truth Label", fontsize=11, labelpad=8)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"[INFO] Saved confusion matrix to: {output_path}")


def plot_latency_curve(
    latency_df: pd.DataFrame,
    output_path: str,
    title: str = "Inference Latency vs. Sequence Length (DistilBERT CPU)"
) -> None:
    """Plot inference latency curve with error bands across token lengths."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.figure(figsize=(7, 4.5))
    plt.plot(
        latency_df["Token_Target_Length"],
        latency_df["Mean_Latency_ms"],
        marker="o",
        linewidth=2.5,
        color="#1f77b4",
        label="Mean Latency (ms)"
    )
    plt.fill_between(
        latency_df["Token_Target_Length"],
        latency_df["Mean_Latency_ms"] - latency_df["Std_Latency_ms"],
        latency_df["Mean_Latency_ms"] + latency_df["Std_Latency_ms"],
        color="#1f77b4",
        alpha=0.2,
        label="±1 Std Dev"
    )
    plt.title(title, fontsize=12, weight="bold", pad=12)
    plt.xlabel("Target Sequence Length (Tokens)", fontsize=11)
    plt.ylabel("Latency (milliseconds)", fontsize=11)
    plt.grid(True, linestyle="--", alpha=0.6)
    plt.legend(frameon=True)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"[INFO] Saved latency curve to: {output_path}")


def plot_metric_comparison(
    models: List[str],
    metrics: Dict[str, List[float]],
    output_path: str,
    title: str = "Comparative Model Performance: SST-2 / IMDb Benchmark"
) -> None:
    """Generate grouped bar chart comparing performance across models."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    x = np.arange(len(models))
    width = 0.2
    
    metric_keys = list(metrics.keys())
    fig, ax = plt.subplots(figsize=(8, 5))

    for i, metric in enumerate(metric_keys):
        offset = (i - len(metric_keys) / 2) * width + (width / 2)
        bars = ax.bar(x + offset, metrics[metric], width, label=metric)
        for bar in bars:
            height = bar.get_height()
            ax.annotate(f"{height:.2f}",
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 3),
                        textcoords="offset points",
                        ha='center', va='bottom', fontsize=9)

    ax.set_ylabel("Score (0.0 to 1.0)", fontsize=11)
    ax.set_title(title, fontsize=13, weight="bold", pad=12)
    ax.set_xticks(x)
    ax.set_xticklabels(models, fontsize=11, weight="bold")
    ax.set_ylim(0, 1.15)
    ax.legend(loc="upper right", frameon=True)
    ax.grid(axis='y', linestyle="--", alpha=0.5)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"[INFO] Saved metric comparison to: {output_path}")


def plot_class_distribution(
    labels: List[int],
    class_names: List[str],
    output_path: str,
    title: str = "Evaluation Benchmark Class Distribution"
) -> None:
    """Plot distribution of classes in test split."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    series = pd.Series(labels).value_counts().sort_index()
    
    plt.figure(figsize=(5, 4))
    bars = plt.bar(class_names, series.values, color=["#d9534f", "#5cb85c"], width=0.5)
    for bar in bars:
        height = bar.get_height()
        plt.annotate(f"{height} ({height/len(labels)*100:.1f}%)",
                     xy=(bar.get_x() + bar.get_width() / 2, height),
                     xytext=(0, 3),
                     textcoords="offset points",
                     ha='center', va='bottom', fontsize=10, weight="bold")

    plt.ylabel("Number of Samples", fontsize=11)
    plt.title(title, fontsize=12, weight="bold", pad=12)
    plt.ylim(0, max(series.values) * 1.25)
    plt.grid(axis='y', linestyle="--", alpha=0.5)
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()
    print(f"[INFO] Saved class distribution to: {output_path}")
