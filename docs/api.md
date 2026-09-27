# CampusMind X: API Gateway & Microservices Reference

## 1. Overview
The CampusMind X API Gateway exposes RESTful endpoints on port `5000` (Node.js/Express) and microservice endpoints on port `8000` (Python/FastAPI). All endpoints exchange standard JSON formatted payloads.

---

## 2. Express API Gateway Endpoints (`http://localhost:5000/api`)

### 2.1 System & Authentication
| Method | Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | None | Service heartbeat, database connection status, and host info. |
| `POST` | `/api/auth/register` | None | Create a new user account (`name`, `email`, `password`, `role`). |
| `POST` | `/api/auth/login` | None | User authentication returning JWT Bearer token and profile. |
| `POST` | `/api/auth/demo-login` | None | Instant one-click persona login (`role`: `student` \| `faculty` \| `admin`). |
| `GET` | `/api/auth/me` | Bearer Token | Retrieve currently authenticated user profile (excludes password). |
| `POST` | `/api/seed` | None | Trigger demo database seeding with cohort records. |

### 2.2 Student & Academic Data
| Method | Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | None | Retrieve cohort student profiles (supports filtering by department & risk). |
| `GET` | `/api/students/:id` | None | Retrieve single student by ObjectId or Enrollment Number (`22BCA1042`). |
| `GET` | `/api/students/:id/bundle` | None | High-performance aggregated bundle (student, marks, attendance, recs). |
| `GET` | `/api/attendance/:studentId`| None | Attendance telemetry and subject-wise lecture statistics. |
| `GET` | `/api/marks/:studentId` | None | Continuous internal evaluations (CIE) and examination marks. |
| `GET` | `/api/assignments/:studentId` | None | Coursework assignments, submission statuses, and deadlines. |

### 2.3 Skill Gap & Recommendations
| Method | Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/skill-gap/analyze` | None | Compute Role Readiness Index, deficits, and priorities for a target career. |
| `GET` | `/api/recommendations/:studentId` | None | Targeted interventions covering Academic, Attendance, Assignment, Skill, Career. |
| `PATCH` | `/api/recommendations/:id` | None | Update recommendation status (`Active`, `In Progress`, `Completed`). |
| `GET` | `/api/notifications` | None | List active academic alerts and attendance warnings. |

### 2.4 Explainable AI & Machine Learning Gateway
| Method | Path | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/ai/health` | None | Proxies FastAPI AI engine health status and loaded model details. |
| `POST` | `/api/ai/predict-risk` | None | Executes academic risk classification and persists results to student doc. |
| `POST` | `/api/ai/predict-performance` | None | Predicts continuous future semester GPA and confidence interval. |
| `POST` | `/api/ai/explain` | None | Generates plain-language explanation, contribution tiers, and benchmarks. |
| `POST` | `/api/ai/chat` | None | Conversational AI Assistant intent routing with safety guardrails. |
| `GET` | `/api/ai/chat/history` | None | Retrieve session conversation history for active student. |
| `DELETE`| `/api/ai/chat/history` | None | Clear session conversation history. |

---

## 3. Python FastAPI AI Microservice (`http://localhost:8000`)

### 3.1 `GET /health`
Returns runtime status and loaded Scikit-Learn artifact names.
```json
{
  "status": "healthy",
  "service": "CampusMind X AI/ML Engine",
  "models_loaded": {
    "risk_model": "Random Forest Classifier (Empirically Selected)",
    "performance_model": "Ridge Regression (Empirically Selected)",
    "preprocessor": "AcademicPreprocessor (StandardScaler + Imputer)"
  },
  "model_version": "v1.3.0-phase3"
}
```

### 3.2 `POST /predict/risk`
**Request Payload**:
```json
{
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

**Response Payload**:
```json
{
  "risk_level": "Medium",
  "prediction": "Medium",
  "confidence": 0.77,
  "probabilities": { "Low": 0.18, "Medium": 0.77, "High": 0.05 },
  "feature_contributions": [
    { "feature": "internal_marks", "label": "Mid-Term Internal Evaluation", "contribution_score": -23.0, "impact": "-23.0%", "type": "negative" },
    { "feature": "attendance", "label": "Lecture & Lab Attendance", "contribution_score": -15.5, "impact": "-15.5%", "type": "negative" }
  ],
  "decision_support_disclaimer": "CampusMind X is an explainable decision-support tool. Automated algorithms must not be used as sole determinants for adverse disciplinary or graduation actions."
}
```

### 3.3 `POST /predict/explain?target=risk`
Returns plain-language non-causal explanation, contribution tiers (`High contribution`, `Medium contribution`, `Low contribution`), and student values alongside cohort benchmarks.
