"""
CampusMind X - Model Training, Evaluation, and Comparison Pipeline
Compares:
  - Model 1 (Risk Classification): Logistic Regression vs. Random Forest vs. Gradient Boosting
  - Model 2 (Performance Regression): Ridge Regression vs. Random Forest vs. Gradient Boosting
Selects the best performing models based on actual empirical metrics, records the results,
and serializes artifacts to disk via Joblib.
"""

import os
import sys
import json
import joblib
import numpy as np

# Ensure UTF-8 output encoding on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    mean_absolute_error, root_mean_squared_error, r2_score
)

# Add parent directory to path so relative imports work seamlessly
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from preprocessing.pipeline import prepare_academic_data

def train_and_evaluate_all():
    print("=" * 65, flush=True)
    print("  CampusMind X: Model Training & Evaluation Benchmark", flush=True)
    print("=" * 65, flush=True)

    csv_file = os.path.join(parent_dir, "datasets", "student_academic_records.csv")
    print(f"[1/4] Loading academic records from: {csv_file}", flush=True)
    data = prepare_academic_data(csv_path=csv_file)

    X_train = data["X_train"]
    X_test = data["X_test"]
    y_risk_train = data["y_risk_train"]
    y_risk_test = data["y_risk_test"]
    y_gpa_train = data["y_gpa_train"]
    y_gpa_test = data["y_gpa_test"]
    preprocessor = data["preprocessor"]

    # -------------------------------------------------------------
    # 1. MODEL 1: Academic Risk Detection (Classification)
    # -------------------------------------------------------------
    print("\n[2/4] Benchmarking Model 1 Candidates (Risk Classification)...", flush=True)
    classifier_candidates = {
        "Logistic Regression": LogisticRegression(max_iter=500, random_state=42),
        "Random Forest Classifier": RandomForestClassifier(n_estimators=80, max_depth=7, random_state=42, n_jobs=-1),
        "Gradient Boosting Classifier": GradientBoostingClassifier(n_estimators=50, learning_rate=0.1, max_depth=3, random_state=42)
    }

    cls_results = {}
    best_cls_name = None
    best_cls_f1 = -1
    best_cls_model = None

    for name, clf in classifier_candidates.items():
        print(f"  -> Fitting {name}...", flush=True)
        clf.fit(X_train, y_risk_train)
        preds = clf.predict(X_test)
        
        acc = float(accuracy_score(y_risk_test, preds))
        f1_macro = float(f1_score(y_risk_test, preds, average="macro"))
        prec_macro = float(precision_score(y_risk_test, preds, average="macro"))
        rec_macro = float(recall_score(y_risk_test, preds, average="macro"))

        cls_results[name] = {
            "accuracy": round(acc, 4),
            "macro_f1": round(f1_macro, 4),
            "macro_precision": round(prec_macro, 4),
            "macro_recall": round(rec_macro, 4)
        }

        print(f"     Accuracy: {acc*100:.2f}% | Macro F1: {f1_macro:.4f} | Precision: {prec_macro:.4f} | Recall: {rec_macro:.4f}", flush=True)

        if f1_macro > best_cls_f1:
            best_cls_f1 = f1_macro
            best_cls_name = name
            best_cls_model = clf

    print(f"  [BEST CLASSIFIER] Selected: {best_cls_name} (Macro F1: {best_cls_f1:.4f})", flush=True)

    # -------------------------------------------------------------
    # 2. MODEL 2: Performance Prediction (Regression)
    # -------------------------------------------------------------
    print("\n[3/4] Benchmarking Model 2 Candidates (Performance Regression)...", flush=True)
    regressor_candidates = {
        "Ridge Regression": Ridge(alpha=1.0, random_state=42),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=80, max_depth=7, random_state=42, n_jobs=-1),
        "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=50, learning_rate=0.1, max_depth=3, random_state=42)
    }

    reg_results = {}
    best_reg_name = None
    best_reg_r2 = -float("inf")
    best_reg_model = None

    for name, reg in regressor_candidates.items():
        print(f"  -> Fitting {name}...", flush=True)
        reg.fit(X_train, y_gpa_train)
        preds = reg.predict(X_test)

        mae = float(mean_absolute_error(y_gpa_test, preds))
        rmse = float(root_mean_squared_error(y_gpa_test, preds))
        r2 = float(r2_score(y_gpa_test, preds))

        reg_results[name] = {
            "mae": round(mae, 4),
            "rmse": round(rmse, 4),
            "r2_score": round(r2, 4)
        }

        print(f"     MAE: {mae:.4f} GPA points | RMSE: {rmse:.4f} | R2: {r2:.4f}", flush=True)

        if r2 > best_reg_r2:
            best_reg_r2 = r2
            best_reg_name = name
            best_reg_model = reg

    print(f"  [BEST REGRESSOR] Selected: {best_reg_name} (R2 Score: {best_reg_r2:.4f})", flush=True)

    # -------------------------------------------------------------
    # 3. Save Serialized Model Artifacts
    # -------------------------------------------------------------
    print("\n[4/4] Serializing model artifacts to disk...", flush=True)
    models_dir = os.path.join(parent_dir, "models")
    eval_dir = os.path.join(parent_dir, "evaluation")
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(eval_dir, exist_ok=True)

    risk_model_path = os.path.join(models_dir, "risk_model.pkl")
    perf_model_path = os.path.join(models_dir, "performance_model.pkl")
    preprocessor_path = os.path.join(models_dir, "preprocessor.pkl")

    joblib.dump(best_cls_model, risk_model_path)
    joblib.dump(best_reg_model, perf_model_path)
    preprocessor.save(preprocessor_path)

    print(f"  [OK] Saved: {risk_model_path}", flush=True)
    print(f"  [OK] Saved: {perf_model_path}", flush=True)
    print(f"  [OK] Saved: {preprocessor_path}", flush=True)

    # -------------------------------------------------------------
    # 4. Save Metric Evaluation Report JSON
    # -------------------------------------------------------------
    report = {
        "dataset": {
            "total_samples": 1200,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "features": data["feature_names"]
        },
        "model_1_risk_detection": {
            "task": "Multiclass Classification (Low, Medium, High)",
            "selected_model": best_cls_name,
            "comparison": cls_results,
            "test_metrics": cls_results[best_cls_name]
        },
        "model_2_performance_prediction": {
            "task": "Continuous Regression (Future Semester GPA)",
            "selected_model": best_reg_name,
            "comparison": reg_results,
            "test_metrics": reg_results[best_reg_name]
        },
        "model_version": "v1.3.0-phase3"
    }

    report_path = os.path.join(eval_dir, "metrics_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print(f"  [OK] Saved evaluation report to: {report_path}", flush=True)
    print("=" * 65, flush=True)

    return report

if __name__ == "__main__":
    train_and_evaluate_all()
