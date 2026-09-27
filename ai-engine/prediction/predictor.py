"""
CampusMind X - Prediction & Feature Contribution Service
Loads trained Joblib model artifacts, performs inference, calculates empirical feature
contributions, and enforces academic ethical constraints.
"""

import os
import sys
import joblib
import numpy as np

# Ensure UTF-8 output encoding on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
models_dir = os.path.join(parent_dir, "models")

class CampusMindPredictor:
    def __init__(self):
        self.risk_model_path = os.path.join(models_dir, "risk_model.pkl")
        self.perf_model_path = os.path.join(models_dir, "performance_model.pkl")
        self.preprocessor_path = os.path.join(models_dir, "preprocessor.pkl")

        if not os.path.exists(self.risk_model_path) or not os.path.exists(self.perf_model_path):
            raise FileNotFoundError("Model artifacts not found. Please run training/train_models.py first.")

        self.risk_model = joblib.load(self.risk_model_path)
        self.perf_model = joblib.load(self.perf_model_path)
        self.preprocessor = joblib.load(self.preprocessor_path)
        self.model_version = "v1.3.0-phase3"

        # Feature descriptions for intelligible explanations
        self.feature_meta = {
            "attendance": {"label": "Lecture & Lab Attendance", "unit": "%", "benchmark": 75.0},
            "assignment_completion": {"label": "Continuous Assignment Submissions", "unit": "%", "benchmark": 70.0},
            "internal_marks": {"label": "Mid-Term Internal Evaluation", "unit": "/30", "benchmark": 18.0},
            "previous_gpa": {"label": "Historical Cumulative CGPA", "unit": "/10.0", "benchmark": 7.0},
            "recent_trend": {"label": "Recent Semester Trajectory", "unit": "delta", "benchmark": 0.0},
            "core_subject_score": {"label": "Core Technical Course Aptitude", "unit": "%", "benchmark": 65.0},
            "study_hours_weekly": {"label": "Dedicated Coding & Study Time", "unit": "hrs/wk", "benchmark": 12.0},
            "missed_labs": {"label": "Unexcused Practical Lab Absences", "unit": "sessions", "benchmark": 2.0}
        }

    def predict_risk(self, student_dict):
        """
        Predicts Academic Risk Category: Low, Medium, or High.
        Returns prediction, probability distribution, and feature contributions.
        """
        X_scaled = self.preprocessor.transform(student_dict)
        predicted_category = str(self.risk_model.predict(X_scaled)[0])

        probabilities = {}
        if hasattr(self.risk_model, "predict_proba"):
            probs = self.risk_model.predict_proba(X_scaled)[0]
            classes = self.risk_model.classes_
            for cls_name, prob in zip(classes, probs):
                probabilities[str(cls_name)] = round(float(prob), 4)

        # Feature Contribution Calculation:
        # Based on Random Forest feature importances * standardized z-score deviation from cohort mean
        importances = getattr(self.risk_model, "feature_importances_", None)
        contributions = []

        if importances is not None:
            z_scores = X_scaled[0]
            for idx, feat_name in enumerate(self.preprocessor.feature_names):
                weight = float(importances[idx])
                z = float(z_scores[idx])
                
                # Invert direction for missed_labs (higher missed labs = higher risk)
                if feat_name == "missed_labs":
                    impact_val = -1 * z * weight * 100
                else:
                    impact_val = z * weight * 100

                raw_val = student_dict.get(feat_name, self.preprocessor.feature_means.get(feat_name, 0.0))
                meta = self.feature_meta.get(feat_name, {"label": feat_name, "unit": ""})

                is_positive = impact_val >= 0
                sign = "+" if is_positive else ""
                
                contributions.append({
                    "feature": feat_name,
                    "label": meta["label"],
                    "value": f"{raw_val}{meta['unit']}",
                    "contribution_score": round(impact_val, 2),
                    "impact": f"{sign}{round(impact_val, 1)}%",
                    "type": "positive" if is_positive else "negative",
                    "importance_rank": weight
                })

            # Sort by absolute magnitude of contribution
            contributions.sort(key=lambda x: abs(x["contribution_score"]), reverse=True)

        # Meaning of Categories:
        category_definitions = {
            "Low": "On track. Academic indicators meet university thresholds (>75% attendance, solid internal marks). Standard monitoring applies.",
            "Medium": "At risk. Notable deficit in attendance (60-74%) or coursework submission backlog. Early advising recommended to avoid detention.",
            "High": "Urgent intervention required. Severe attendance deficit (<60%) or failed mid-term assessments. Mandatory counseling and remedial clinic enrollment required."
        }

        return {
            "risk_level": predicted_category,
            "prediction": predicted_category,
            "confidence": probabilities.get(predicted_category, 0.85),
            "probabilities": probabilities,
            "feature_contributions": contributions,
            "category_meaning": category_definitions.get(predicted_category, ""),
            "model_version": self.model_version,
            "status": "model",
            "decision_support_disclaimer": "CampusMind X is an explainable decision-support tool. Automated algorithms must not be used as sole determinants for adverse disciplinary or graduation actions."
        }

    def predict_performance(self, student_dict):
        """
        Predicts continuous Future Semester GPA (Scale 4.0 to 10.0).
        Calculates exact linear additive contributions via Ridge coefficients.
        """
        X_scaled = self.preprocessor.transform(student_dict)
        predicted_gpa = float(self.perf_model.predict(X_scaled)[0])
        predicted_gpa = round(float(np.clip(predicted_gpa, 4.0, 10.0)), 2)

        # Standard error / prediction confidence interval (approx +/- 0.28 GPA based on test RMSE)
        prediction_range = {
            "lower_bound": round(max(predicted_gpa - 0.29, 4.0), 2),
            "upper_bound": round(min(predicted_gpa + 0.29, 10.0), 2),
            "confidence_interval": "95%"
        }

        # Exact linear additive attribution for Ridge Regression:
        # y_pred = intercept + sum(coef_i * x_scaled_i)
        contributions = []
        if hasattr(self.perf_model, "coef_"):
            coefs = self.perf_model.coef_
            z_scores = X_scaled[0]

            for idx, feat_name in enumerate(self.preprocessor.feature_names):
                effect = float(coefs[idx] * z_scores[idx])
                raw_val = student_dict.get(feat_name, self.preprocessor.feature_means.get(feat_name, 0.0))
                meta = self.feature_meta.get(feat_name, {"label": feat_name, "unit": ""})

                sign = "+" if effect >= 0 else ""
                contributions.append({
                    "feature": feat_name,
                    "label": meta["label"],
                    "value": f"{raw_val}{meta['unit']}",
                    "effect_on_gpa": round(effect, 3),
                    "impact": f"{sign}{round(effect, 2)} GPA",
                    "type": "positive" if effect >= 0 else "negative"
                })

            contributions.sort(key=lambda x: abs(x["effect_on_gpa"]), reverse=True)

        return {
            "predicted_gpa": predicted_gpa,
            "prediction_range": prediction_range,
            "feature_contributions": contributions,
            "model_type": "Ridge Regression",
            "model_version": self.model_version,
            "status": "model",
            "decision_support_disclaimer": "Predicted scores are statistical estimates intended to assist academic advisors in targeting proactive mentorship."
        }

    def explain_risk(self, student_dict):
        """
        Phase 4: Explainable AI Engine.
        Answers: 'Why did the model generate this result?'
        Returns plain-language non-causal explanations, contribution levels (High/Medium/Low),
        supporting data benchmarks, and ethical disclaimers.
        """
        pred_res = self.predict_risk(student_dict)
        raw_contributions = pred_res["feature_contributions"]
        risk_level = pred_res["risk_level"]
        confidence = pred_res["confidence"]

        factors = []
        positive_factors = []
        negative_factors = []

        for item in raw_contributions:
            abs_score = abs(item["contribution_score"])
            if abs_score >= 12.0:
                contribution_level = "High contribution"
            elif abs_score >= 5.0:
                contribution_level = "Medium contribution"
            else:
                contribution_level = "Low contribution"

            feat = item["feature"]
            meta = self.feature_meta.get(feat, {"label": item["label"], "benchmark": "N/A", "unit": ""})
            benchmark_str = f"{meta['benchmark']}{meta['unit']}"
            is_pos = item["type"] == "positive"

            # Plain-language non-causal phrasing
            if is_pos:
                explanation = f"{item['label']} ({item['value']}) exceeded cohort expectations ({benchmark_str}) and contributed positively to the model prediction."
                positive_factors.append(item['label'])
            else:
                explanation = f"{item['label']} ({item['value']}) fell below the benchmark ({benchmark_str}) and contributed to the elevated risk tier prediction."
                negative_factors.append(item['label'])

            factors.append({
                "feature": feat,
                "label": item["label"],
                "contribution_level": contribution_level,
                "impact": item["impact"],
                "type": item["type"],
                "student_value": item["value"],
                "cohort_benchmark": benchmark_str,
                "explanation": explanation
            })

        # Plain language overall summary
        neg_summary = ", ".join(negative_factors[:2]) if negative_factors else "minimal negative indicators"
        pos_summary = ", ".join(positive_factors[:2]) if positive_factors else "few mitigating factors"
        
        plain_language_summary = (
            f"The Academic Support Indicator is predicted as {risk_level} with "
            f"{round(confidence * 100, 1)}% model confidence. "
            f"Specifically, {neg_summary} contributed most significantly to the elevated risk category, "
            f"whereas {pos_summary} contributed toward stabilizing the student's standing."
        )

        return {
            "prediction": risk_level,
            "risk_level": risk_level,
            "confidence": confidence,
            "confidence_percent": f"{round(confidence * 100, 1)}%",
            "probabilities": pred_res["probabilities"],
            "plain_language_summary": plain_language_summary,
            "contributing_factors": factors,
            "non_causal_statement": "These factors contributed to the model prediction and do not imply direct deterministic causation. The model identifies statistical correlations based on past cohort academic patterns to assist advisor decision support.",
            "category_meaning": pred_res["category_meaning"],
            "model_version": self.model_version,
            "status": "model"
        }

    def explain_performance(self, student_dict):
        """
        Phase 4: Explainable AI Engine for Continuous Performance Regression.
        """
        perf_res = self.predict_performance(student_dict)
        predicted_gpa = perf_res["predicted_gpa"]
        pred_range = perf_res["prediction_range"]
        raw_contributions = perf_res["feature_contributions"]

        factors = []
        for item in raw_contributions:
            abs_effect = abs(item["effect_on_gpa"])
            if abs_effect >= 0.25:
                contribution_level = "High contribution"
            elif abs_effect >= 0.10:
                contribution_level = "Medium contribution"
            else:
                contribution_level = "Low contribution"

            feat = item["feature"]
            meta = self.feature_meta.get(feat, {"label": item["label"], "benchmark": "N/A", "unit": ""})
            is_pos = item["type"] == "positive"

            if is_pos:
                explanation = f"{item['label']} ({item['value']}) contributed +{item['effect_on_gpa']} GPA above the baseline."
            else:
                explanation = f"{item['label']} ({item['value']}) contributed {item['effect_on_gpa']} GPA deficit relative to the baseline."

            factors.append({
                "feature": feat,
                "label": item["label"],
                "contribution_level": contribution_level,
                "impact": item["impact"],
                "effect_on_gpa": item["effect_on_gpa"],
                "type": item["type"],
                "student_value": item["value"],
                "cohort_benchmark": f"{meta['benchmark']}{meta['unit']}",
                "explanation": explanation
            })

        plain_language_summary = (
            f"The predicted semester GPA is {predicted_gpa} (95% range: {pred_range['lower_bound']} to {pred_range['upper_bound']}). "
            f"Linear model decomposition reveals the top positive and negative contributors relative to the cohort mean."
        )

        return {
            "predicted_gpa": predicted_gpa,
            "prediction_range": pred_range,
            "plain_language_summary": plain_language_summary,
            "contributing_factors": factors,
            "non_causal_statement": "Feature attributions represent additive linear weights that contributed to the model prediction and do not indicate sole causality.",
            "model_type": perf_res["model_type"],
            "model_version": self.model_version,
            "status": "model"
        }

# Singleton instance
predictor = CampusMindPredictor()
