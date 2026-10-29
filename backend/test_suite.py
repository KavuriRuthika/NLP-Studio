"""
backend/test_suite.py
=====================
Automated Verification Suite for NLP Intelligence Studio.
Covers:
- All 10 Multi-Task NLP Playground endpoints
- Model Benchmark Arena & Leaderboard
- Advanced Explainability & Saliency Inspection
- Dataset Intelligence & Partition Split
- Robustness & Adversarial Testing
- Multilingual Cross-lingual Analysis
- Document Search & Grounded Question Answering
- Persistent Experiment Registry
- AI Reliability Monitoring
- Dynamic Research Report Export
- Input Validation & Edge Case Handling
"""

import sys
import unittest
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

class TestNLPIntelligenceStudio(unittest.TestCase):

    def test_01_health_and_metadata(self):
        """Verify server health and architecture metadata."""
        resp = client.get("/api/health")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("distilbert", data["primary_model"].lower())

        # Models metadata
        resp_models = client.get("/api/models")
        self.assertEqual(resp_models.status_code, 200)
        models = resp_models.json()
        self.assertGreaterEqual(len(models), 2)
        distil = next(m for m in models if m["id"] == "distilbert")
        self.assertEqual(distil["layers"], 6)

    def test_02_multitask_playground(self):
        """Verify all 10 tasks in the Multi-Task NLP Playground."""
        # 1. Sentiment Analysis
        res = client.post("/api/analyze", json={"text": "This film was magnificent and thrilling.", "model": "distilbert"}).json()
        self.assertEqual(res["predicted_label"], "POSITIVE")
        self.assertGreater(res["confidence"], 0.90)

        # 2. Emotion Classification
        res_em = client.post("/api/multitask/emotion", json={"text": "I was crying because the ending was so devastating and heartbreaking."}).json()
        self.assertEqual(res_em["task"], "Emotion Classification")
        self.assertIn("Sadness", res_em["emotion_distribution"])

        # 3. Summarization
        long_text = "The film begins in a quiet coastal town where the protagonist uncovers a hidden secret. As winter approaches, tensions rise between the local families. The resolution delivers an unexpected twist that redefines the story."
        res_sum = client.post("/api/multitask/summarize", json={"text": long_text, "ratio": 0.5}).json()
        self.assertIn("summary", res_sum)
        self.assertLess(len(res_sum["summary"]), len(long_text))

        # 4. NER
        res_ner = client.post("/api/multitask/ner", json={"text": "David Lynch directed Mulholland Drive for Google in Chicago in 2001."}).json()
        self.assertGreater(res_ner["entity_count"], 0)

        # 5. QA
        res_qa = client.post("/api/multitask/qa", json={
            "context": "DistilBERT was introduced by Sanh et al. in 2019. It retains 97% of BERT's performance with 40% fewer parameters.",
            "question": "When was DistilBERT introduced?"
        }).json()
        self.assertIn("2019", res_qa["answer"])

        # 6. Zero-Shot
        res_zs = client.post("/api/multitask/zeroshot", json={
            "text": "The latest rocket launch into low Earth orbit succeeded without a hitch.",
            "candidate_labels": ["space exploration", "culinary arts", "classical literature"]
        }).json()
        self.assertEqual(res_zs["top_label"], "space exploration")

        # 7. Text Similarity
        res_sim = client.post("/api/multitask/similarity", json={
            "text1": "A delightful cinematic masterpiece with extraordinary acting.",
            "text2": "An exceptional movie with stellar performances."
        }).json()
        self.assertGreater(res_sim["similarity_score"], 0.20)

        # 8. Language Detection
        res_lang = client.post("/api/multitask/langdetect", json={"text": "Esta película es una obra de arte con actores excelentes."}).json()
        self.assertEqual(res_lang["detected_language"], "Spanish")

        # 9. Keywords
        res_kw = client.post("/api/multitask/keywords", json={"text": "Deep learning models require self-attention mechanisms and large transformer parameters."}).json()
        self.assertGreater(len(res_kw["keywords"]), 0)

    def test_03_model_arena_and_leaderboard(self):
        """Verify side-by-side model arena comparison."""
        resp = client.post("/api/arena/compare", json={"text": "A brilliant and thoughtful screenplay."})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("distilbert", data)
        self.assertIn("bert_base", data)
        self.assertTrue(data["comparison"]["agreement"])

        # Leaderboard
        resp_lb = client.get("/api/arena/leaderboard")
        self.assertEqual(resp_lb.status_code, 200)
        leaderboard = resp_lb.json()
        self.assertEqual(leaderboard[0]["model_name"], "DistilBERT SST-2")

    def test_04_advanced_explainability(self):
        """Verify token inspection, perturbation analysis, and attribution disclaimer."""
        resp = client.post("/api/explain/inspect", json={"text": "The acting was undeniably brilliant and touching."})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertGreater(len(data["tokens"]), 0)
        self.assertGreater(len(data["perturbations"]), 0)
        self.assertIn("ATTRIBUTION NOTICE", data["scientific_disclaimer"])

    def test_05_dataset_intelligence(self):
        """Verify dataset upload analysis and partition splitting."""
        resp = client.post("/api/dataset/analyze", json={})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["total_samples"], 100)
        self.assertIn("imbalance_ratio", data)

        resp_split = client.post("/api/dataset/split", json={"train_pct": 70, "val_pct": 15, "test_pct": 15, "random_seed": 42})
        self.assertEqual(resp_split.status_code, 200)
        split_data = resp_split.json()
        self.assertEqual(split_data["partitions"]["train"]["count"], 70)

    def test_06_robustness_and_adversarial_testing(self):
        """Verify 8 controlled transformations and flip rate calculation."""
        resp = client.post("/api/robustness/test", json={"text": "This movie was absolutely fantastic."})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["total_transformations"], 8)
        self.assertIn("flip_rate_pct", data)

    def test_07_multilingual_evaluation(self):
        """Verify multilingual evaluation across 6 languages."""
        resp = client.get("/api/multilingual/evaluate")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["evaluated_languages"], 6)

    def test_08_semantic_search_and_document_qa(self):
        """Verify document indexing, semantic search, and grounded Q&A with refusal."""
        # Index document
        upload_resp = client.post("/api/documents/upload", json={
            "filename": "Research_Notes.txt",
            "content": "Attention mechanisms allow models to focus on dynamic context positions.\n\nTransformers dispense with recurrence entirely and rely on self-attention."
        })
        self.assertEqual(upload_resp.status_code, 200)

        # Semantic Search
        search_resp = client.post("/api/documents/search", json={"query": "self-attention and recurrence", "top_k": 2})
        self.assertEqual(search_resp.status_code, 200)
        self.assertGreater(len(search_resp.json()["results"]), 0)

        # Grounded QA
        qa_resp = client.post("/api/documents/ask", json={"question": "What do transformers dispense with?"})
        self.assertEqual(qa_resp.status_code, 200)
        self.assertTrue(qa_resp.json()["grounded"])

        # Refusal on ungrounded query
        qa_refusal = client.post("/api/documents/ask", json={"question": "What is the recipe for baking chocolate cookies?"})
        self.assertFalse(qa_refusal.json()["grounded"])

    def test_09_experiment_persistence_and_reliability(self):
        """Verify SQLite experiment registry and operational reliability logs."""
        resp = client.get("/api/experiments")
        self.assertEqual(resp.status_code, 200)
        self.assertGreaterEqual(len(resp.json()), 1)

        resp_rel = client.get("/api/reliability/stats")
        self.assertEqual(resp_rel.status_code, 200)
        self.assertIn("total_requests", resp_rel.json())

    def test_10_reports_export(self):
        """Verify report generation in Markdown and JSON."""
        resp_md = client.get("/api/reports/export?format=md")
        self.assertEqual(resp_md.status_code, 200)
        self.assertIn("ACADEMIC RESEARCH REPORT", resp_md.text)

        resp_json = client.get("/api/reports/export?format=json")
        self.assertEqual(resp_json.status_code, 200)
        self.assertIn("content_markdown", resp_json.json())

    def test_11_edge_cases_and_error_handling(self):
        """Verify rejection of empty text inputs and safe error responses."""
        resp = client.post("/api/analyze", json={"text": "   "})
        self.assertEqual(resp.status_code, 400)

if __name__ == "__main__":
    unittest.main()
