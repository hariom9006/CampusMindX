# CampusMind X — AI/ML Engine & Model Architecture (Phase 3)

## 1. Executive Summary & Purpose

**CampusMind X** integrates an empirical Machine Learning engine designed to assist academic advisors, faculty mentors, and students with early academic risk detection and proactive performance forecasting.

> [!IMPORTANT]
> **Ethical Notice & High-Stakes Decision Boundary:**  
> CampusMind X is strictly a **decision-support tool**. It is built to surface early indicators for proactive academic mentorship, remedial clinic recommendations, and attendance advisories. The system **must NOT** be used to automatically make high-stakes academic decisions (such as course deregistration, academic probation, examination debarment, or dismissal). All critical academic actions require human faculty and advisor review.

---

## 2. Dataset Architecture

### 2.1 Dataset Overview
- **Source File**: `ai-engine/datasets/student_academic_records.csv`
- **Total Records**: 1,200 student academic profiles
- **Train/Test Split**: 80% Training (960 samples), 20% Holdout Testing (240 samples)
- **Stratification**: Class distributions were stratified during splitting to prevent sampling bias across risk tiers.

### 2.2 Class Distribution (Ground Truth)
- **Low Risk**: 623 records (51.9%)
- **Medium Risk**: 324 records (27.0%)
- **High Risk**: 253 records (21.1%)

### 2.3 Definitions of Risk Categories
- **Low Risk**: Student exhibits strong academic engagement (attendance $\ge 75\%$, assignment completion $\ge 75\%$, internal marks $\ge 17.5/25$, stable or positive GPA trajectory). Low risk of course failure or detention.
- **Medium Risk**: Student is at borderline academic standing (attendance between $60\%$ and $74\%$, or coursework backlog with completion between $50\%$ and $74\%$, or negative trend $> -0.4$ GPA). Early advising and remedial clinics are recommended to prevent progression to High Risk.
- **High Risk**: Student is in critical academic danger (attendance $< 60\%$, chronic assignment non-submission $< 50\%$, multiple lab absences $> 4$, or internal marks $< 11/25$). Immediate advisor intervention required to prevent mandatory university examination debarment.

---

## 3. Academic Feature Specification

The models utilize eight quantifiable academic features covering attendance, coursework rigor, examination trends, and lab commitment:

| Feature Name | Type | Range / Unit | Description |
| :--- | :--- | :--- | :--- |
| `attendance` | Continuous | $0.0 - 100.0$ (%) | Overall lecture and practical class attendance percentage |
| `assignment_completion`| Continuous | $0.0 - 100.0$ (%) | Proportion of scheduled continuous assessments submitted |
| `internal_marks` | Continuous | $0.0 - 25.0$ (Marks) | Mid-semester assessment and continuous internal evaluation |
| `previous_gpa` | Continuous | $0.0 - 10.0$ (CGPA) | Cumulative Grade Point Average up to the preceding semester |
| `recent_trend` | Continuous | $-2.0 - +2.0$ ($\Delta$ GPA) | Momentum differential between the last two academic semesters |
| `core_subject_score` | Continuous | $0.0 - 100.0$ (%) | Performance in foundational discipline course (e.g., DSA II) |
| `study_hours_weekly` | Continuous | $0.0 - 40.0$ (Hours) | Self-reported and LMS-tracked weekly study hours |
| `missed_labs` | Integer | $0 - 15$ (Sessions) | Count of missed practical computer laboratory sessions |

---

## 4. Reusable Preprocessing Pipeline

Implemented in [`ai-engine/preprocessing/pipeline.py`](file:///c:/Users/Dell/Desktop/CampusMind%20X/ai-engine/preprocessing/pipeline.py) via `AcademicPreprocessor`:

1. **Handling Missing Values**:
   - Numerical median imputation (`SimpleImputer(strategy='median')`) fit strictly on the training partition.
2. **Feature Normalization**:
   - Standard Z-score scaling (`StandardScaler`) ensuring zero mean and unit variance.
3. **Data Leakage Safeguards**:
   - The preprocessor is fit solely on `X_train`. The test set `X_test` and all live runtime production inference queries are transformed using the fitted statistics without re-estimating parameters.
4. **Model Serialization**:
   - The fitted preprocessor is saved alongside model weights as `ai-engine/models/preprocessor.pkl`.

---

## 5. Model 1: Academic Risk Detection (Classification)

### 5.1 Candidates Evaluated
Three classification algorithms were trained and empirically benchmarked on the 240-sample stratified holdout test set:
1. **Logistic Regression** (L2 regularized, multinomial)
2. **Random Forest Classifier** (100 estimators, balanced class weights)
3. **Gradient Boosting Classifier** (100 estimators, learning rate 0.1)

### 5.2 Empirical Evaluation Metrics

| Algorithm | Test Accuracy | Macro Precision | Macro Recall | Macro F1-Score |
| :--- | :---: | :---: | :---: | :---: |
| Logistic Regression | 94.17% | 0.9301 | 0.9285 | 0.9289 |
| **Random Forest Classifier** | **97.08%** | **0.9722** | **0.9650** | **0.9684** |
| Gradient Boosting Classifier | 97.08% | 0.9722 | 0.9650 | 0.9684 |

### 5.3 Model Selection Decision
- **Selected Model**: **Random Forest Classifier** (`ai-engine/models/risk_model.pkl`).
- **Rationale**: Random Forest achieved **97.08% test accuracy** and **0.9684 Macro F1**, outperforming Logistic Regression. It exhibits robust ensemble resistance to outlier noise and enables fast tree-based feature importance calculations for interpretability.

---

## 6. Model 2: Performance Prediction (Regression)

### 6.1 Objective
Predict a continuous future semester academic score (GPA on a $0.0 - 10.0$ scale) and compute a 95% confidence prediction range.

### 6.2 Candidates Evaluated
1. **Ridge Regression** (L2-regularized linear model, $\alpha=1.0$)
2. **Random Forest Regressor** (100 estimators)
3. **Gradient Boosting Regressor** (100 estimators)

### 6.3 Empirical Evaluation Metrics

| Algorithm | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | $R^2$ Score |
| :--- | :---: | :---: | :---: |
| **Ridge Regression** | **0.2315** | **0.2876** | **0.9254** |
| Random Forest Regressor | 0.2397 | 0.2932 | 0.9225 |
| Gradient Boosting Regressor | 0.2431 | 0.2959 | 0.9210 |

### 6.4 Model Selection Decision
- **Selected Model**: **Ridge Regression** (`ai-engine/models/performance_model.pkl`).
- **Rationale**: Ridge Regression achieved the lowest error (**MAE = 0.2315 GPA**, **RMSE = 0.2876**) and the highest variance explained (**$R^2 = 0.9254$**). Its linear formulation prevents overfitting, guarantees smooth monotonic behavior across features, and produces closed-form, transparent linear attribution weights.

---

## 7. Model Explainability Foundation

> [!NOTE]
> **Methodological Transparency:**  
> In compliance with academic integrity guidelines, feature contributions in Phase 3 are derived from **empirical model feature importances** (Random Forest Gini importance adjusted by student deviation from cohort medians) and **direct linear regression coefficients** (Ridge beta weights). They are **not** claimed as Game-Theoretic SHAP values because external heavy SHAP C-extensions were not required for this lightweight runtime tier.

Each inference response includes:
- **`impact`**: Relative percentage impact (e.g. `"-14.2%"` or `"+11.8%"`).
- **`type`**: `"positive"` (mitigating factor) or `"negative"` (risk driver).
- **`value`**: Student's actual feature value (e.g. `"68.0%"` attendance).
- **`description`**: Human-readable rationale explaining why the feature pushed the prediction in that direction.

---

## 8. Multi-Tier System Integration

The production architecture maintains strict layer isolation:

```
[React Frontend (Vite)]
        ↓ HTTP POST /api/ai/predict-risk
[Express API Gateway (Node.js :5000)]
        ↓ HTTP POST /predict/risk (Internal Microservice)
[Python FastAPI Engine (:8000)]
        ↓ Preprocessing & Scikit-learn Pipeline
[Serialized Models (.pkl)]
```

- **Frontend Security**: The React client has zero access to serialized Python model files or file system paths.
- **Node Gateway**: Validates requests, authenticates callers, decorates payload with MongoDB student records, and logs telemetry.
- **FastAPI Microservice**: Executes headless ML inference within sub-20ms latency.

---

## 9. API Reference

### 9.1 AI Engine Health
- **Endpoint**: `GET /api/ai/health` (Express) $\rightarrow$ `GET /health` (FastAPI)
- **Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "CampusMind X AI/ML Engine",
    "version": "1.3.0-phase3"
  }
}
```

### 9.2 Risk Prediction
- **Endpoint**: `POST /api/ai/predict-risk`
- **Request Body**:
```json
{
  "studentId": "22BCA1042",
  "attendance": 68.0,
  "assignment_completion": 62.0,
  "internal_marks": 16.0,
  "previous_gpa": 7.42,
  "recent_trend": -0.3,
  "core_subject_score": 58.0,
  "study_hours_weekly": 14.5,
  "missed_labs": 4
}
```
- **Response Body**:
```json
{
  "success": true,
  "data": {
    "risk_level": "Medium",
    "prediction": "Medium",
    "confidence": 0.7699,
    "probabilities": {
      "High": 0.2245,
      "Low": 0.0056,
      "Medium": 0.7699
    },
    "feature_contributions": [
      {
        "feature": "attendance",
        "label": "Lecture & Lab Attendance",
        "impact": "-14.2%",
        "type": "negative",
        "value": "68.0%",
        "category": "Attendance",
        "description": "Attendance is 68.0%, below the mandatory 75% university eligibility requirement."
      },
      {
        "feature": "assignment_completion",
        "label": "Continuous Assignment Submissions",
        "impact": "-9.1%",
        "type": "negative",
        "value": "62.0%",
        "category": "Coursework",
        "description": "Assignment completion rate is 62.0%, reflecting an active coursework backlog."
      }
    ],
    "category_meaning": "At risk. Notable deficit in attendance (60-74%) or coursework submission backlog. Early advising recommended to avoid detention.",
    "model_version": "v1.3.0-phase3",
    "status": "model",
    "decision_support_disclaimer": "CampusMind X is an explainable decision-support tool. Automated algorithms must not be used as sole determinants for adverse disciplinary or graduation actions."
  }
}
```

### 9.3 Performance Prediction
- **Endpoint**: `POST /api/ai/predict-performance`
- **Request Body**: (Same academic features as above)
- **Response Body**:
```json
{
  "success": true,
  "data": {
    "predicted_gpa": 5.55,
    "prediction_range": {
      "lower_bound": 5.26,
      "upper_bound": 5.84,
      "confidence_interval": "95%"
    },
    "model_type": "Ridge Regression",
    "model_version": "v1.3.0-phase3",
    "status": "model"
  }
}
```

---

## 10. Limitations & Future Work

1. **Synthetic Cohort Sampling**:
   - The current dataset models realistic university grade distributions but lacks cross-institutional variance.
2. **Static Semester Sampling**:
   - Real-world student engagement varies continuously over a 16-week semester. Future iterations may explore time-series models (e.g. LSTM or Temporal Convolutional Networks).
3. **Cold-Start for First-Semester Students**:
   - Students entering Semester 1 lack `previous_gpa` and historical trend data. A fallback heuristic is provided for cold-start profiles.
