"""
CampusMind X - AI Engine Test Suite (Phase 7 Production Polish)
Tests:
- Model artifact loading
- Academic Risk Classifier prediction & probabilities
- Continuous GPA Performance Prediction & confidence interval bounds
- Explainability Engine: Plain-language summary, non-causal phrasing, contribution tiers
- Input validation & boundaries
"""

import sys
import os
import unittest

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from prediction.predictor import CampusMindPredictor
from fastapi.testclient import TestClient
from main import app

class TestCampusMindAIEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.predictor = CampusMindPredictor()
        cls.client = TestClient(app)
        cls.sample_student = {
            "attendance": 68.0,
            "assignment_completion": 62.0,
            "internal_marks": 16.0,
            "previous_gpa": 7.42,
            "recent_trend": -0.3,
            "core_subject_score": 58.0,
            "study_hours_weekly": 14.5,
            "missed_labs": 4
        }

    def test_01_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertIn("CampusMind X", data["service"])

    def test_02_predict_risk(self):
        res = self.predictor.predict_risk(self.sample_student)
        self.assertIn(res["risk_level"], ["Low", "Medium", "High"])
        self.assertGreaterEqual(res["confidence"], 0.0)
        self.assertLessEqual(res["confidence"], 1.0)
        self.assertIn("Low", res["probabilities"])
        self.assertIn("Medium", res["probabilities"])
        self.assertIn("High", res["probabilities"])
        self.assertGreaterEqual(len(res["feature_contributions"]), 4)

    def test_03_predict_performance(self):
        res = self.predictor.predict_performance(self.sample_student)
        self.assertGreaterEqual(res["predicted_gpa"], 4.0)
        self.assertLessEqual(res["predicted_gpa"], 10.0)
        self.assertIn("prediction_range", res)
        self.assertIn("confidence_interval", res["prediction_range"])
        self.assertGreaterEqual(len(res["feature_contributions"]), 4)

    def test_04_explain_risk_non_causal(self):
        res = self.predictor.explain_risk(self.sample_student)
        self.assertIn(res["prediction"], ["Low", "Medium", "High"])
        self.assertIn("plain_language_summary", res)
        
        # Verify non-causal constraints
        summary = res["plain_language_summary"].lower()
        self.assertNotIn("caused the student", summary)
        self.assertNotIn("forced the student", summary)
        self.assertNotIn("sole reason for failure", summary)
        self.assertTrue("contributed" in summary or "indicator" in summary)

        # Verify factors
        valid_tiers = ["High contribution", "Medium contribution", "Low contribution"]
        for factor in res["contributing_factors"]:
            self.assertIn(factor["contribution_level"], valid_tiers)
            self.assertIn("contributed", factor["explanation"])
            self.assertIn("cohort_benchmark", factor)

    def test_05_api_input_validation(self):
        # Invalid attendance (> 100)
        invalid_payload = dict(self.sample_student)
        invalid_payload["attendance"] = 150.0
        response = self.client.post("/predict/risk", json=invalid_payload)
        self.assertEqual(response.status_code, 422)

        # Invalid internal marks (> 30)
        invalid_payload2 = dict(self.sample_student)
        invalid_payload2["internal_marks"] = 45.0
        response2 = self.client.post("/predict/risk", json=invalid_payload2)
        self.assertEqual(response2.status_code, 422)

    def test_06_explain_endpoint_api(self):
        response = self.client.post("/predict/explain?target=risk", json=self.sample_student)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("plain_language_summary", data)
        self.assertIn("contributing_factors", data)

if __name__ == "__main__":
    unittest.main()
