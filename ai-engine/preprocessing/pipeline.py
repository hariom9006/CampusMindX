"""
CampusMind X - Reusable Academic Preprocessing Pipeline
Handles missing values, numerical scaling, feature alignment, and train/test splitting
strictly avoiding data leakage.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
import joblib
import os

FEATURE_COLUMNS = [
    "attendance",
    "assignment_completion",
    "internal_marks",
    "previous_gpa",
    "recent_trend",
    "core_subject_score",
    "study_hours_weekly",
    "missed_labs"
]

class AcademicPreprocessor:
    def __init__(self, feature_names=None):
        self.feature_names = feature_names or FEATURE_COLUMNS
        self.imputer = SimpleImputer(strategy="median")
        self.scaler = StandardScaler()
        self.is_fitted = False
        self.feature_means = {}
        self.feature_stds = {}

    def fit(self, X):
        """Fit imputer and scaler on training data only to avoid data leakage."""
        if isinstance(X, pd.DataFrame):
            X_mat = X[self.feature_names].values
        else:
            X_mat = X

        imputed = self.imputer.fit_transform(X_mat)
        self.scaler.fit(imputed)

        # Store mean & std for explainability baseline deviations
        for idx, col in enumerate(self.feature_names):
            self.feature_means[col] = float(self.scaler.mean_[idx])
            self.feature_stds[col] = float(self.scaler.scale_[idx])

        self.is_fitted = True
        return self

    def transform(self, X):
        """Transform features using fitted imputer and scaler."""
        if not self.is_fitted:
            raise ValueError("Preprocessor has not been fitted yet. Call fit() first.")

        if isinstance(X, pd.DataFrame):
            # Align columns and fill missing if necessary
            for col in self.feature_names:
                if col not in X.columns:
                    X[col] = self.feature_means.get(col, 0.0)
            X_mat = X[self.feature_names].values
        elif isinstance(X, dict):
            # Single instance dictionary
            row = [X.get(col, self.feature_means.get(col, 0.0)) for col in self.feature_names]
            X_mat = np.array([row], dtype=float)
        else:
            X_mat = X

        imputed = self.imputer.transform(X_mat)
        scaled = self.scaler.transform(imputed)
        return scaled

    def fit_transform(self, X):
        return self.fit(X).transform(X)

    def save(self, filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump(self, filepath)

    @classmethod
    def load(cls, filepath):
        return joblib.load(filepath)

def prepare_academic_data(csv_path="datasets/student_academic_records.csv", test_size=0.2, random_state=42):
    """Loads CSV, applies preprocessor, and returns train/test splits for both risk and performance models."""
    df = pd.read_csv(csv_path)
    X = df[FEATURE_COLUMNS]
    y_risk = df["risk_level"]
    y_gpa = df["future_gpa"]

    # Stratified split for classification target to maintain balance across splits
    X_train_raw, X_test_raw, y_risk_train, y_risk_test, y_gpa_train, y_gpa_test = train_test_split(
        X, y_risk, y_gpa, test_size=test_size, random_state=random_state, stratify=y_risk
    )

    preprocessor = AcademicPreprocessor(FEATURE_COLUMNS)
    X_train_scaled = preprocessor.fit_transform(X_train_raw)
    X_test_scaled = preprocessor.transform(X_test_raw)

    return {
        "preprocessor": preprocessor,
        "X_train": X_train_scaled,
        "X_test": X_test_scaled,
        "X_train_raw": X_train_raw,
        "X_test_raw": X_test_raw,
        "y_risk_train": y_risk_train,
        "y_risk_test": y_risk_test,
        "y_gpa_train": y_gpa_train,
        "y_gpa_test": y_gpa_test,
        "feature_names": FEATURE_COLUMNS
    }
