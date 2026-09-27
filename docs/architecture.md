# CampusMind X: System Architecture & Technical Blueprint

## 1. Project Overview
**CampusMind X: An Explainable AI-Powered University Intelligence and Student Success Platform**

CampusMind X is an institutional intelligence platform designed to eliminate "black-box" decision making in universities. Traditional higher-education student information systems either lack predictive capability or deliver opaque risk scores without justification. CampusMind X addresses this by coupling predictive classification and regression models with transparent, non-causal Explainable AI (XAI) feature attributions.

Students, faculty advisors, and institutional administrators inspect the exact positive and negative drivers influencing every prediction, accompanied by tailored action plans across 5 key academic categories.

---

## 2. Multi-Tier Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION TIER                               │
│  React 19 + Vite • Tailwind CSS v4 • Framer Motion • Recharts          │
│                                                                        │
│  ┌───────────────────────┬──────────────────────┬───────────────────┐  │
│  │   Student Portal      │    Faculty Portal    │   Admin Portal    │  │
│  │  • KPI Telemetry      │  • Cohort Monitoring │  • Macro Metrics  │  │
│  │  • Skill-Gap Radar    │  • Intervention Hub  │  • Accreditation  │  │
│  │  • Learning Roadmap   │  • Bottleneck Chart  │  • Department KPI │  │
│  │  • AI Assistant Chat  │  • XAI Inspection    │  • Executive AI   │  │
│  └───────────────────────┴──────────────────────┴───────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / JSON REST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY TIER (Node.js)                        │
│  Express.js • Port 5000 • Security Middleware • JWT Authentication     │
│                                                                        │
│  • Routes: /api/auth, /api/students, /api/faculty, /api/departments,   │
│            /api/attendance, /api/marks, /api/assignments, /api/skills, │
│            /api/skill-gap, /api/recommendations, /api/notifications,   │
│            /api/ai, /api/chat                                          │
│  • Resilient Heuristic Fallbacks if AI Engine is unreachable           │
│  • Role-Based Access Control (RBAC) Middleware                         │
│  • Sanitized Mongoose ORM Data Layer                                   │
└───────────────────┬──────────────────────────────────┬─────────────────┘
                    │                                  │
                    ▼                                  ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────┐
│       DATABASE PERSISTENCE           │   │      AI ENGINE SERVICE      │
│  MongoDB / Mongoose ODM              │   │  Python 3.14+ / FastAPI     │
│  • 13 Normalized Collections         │   │  Port 8000                  │
│  • Full Indexing on Roll/Enrollment  │   │  • Random Forest Classifier │
│  • Automated Demo Seeding            │   │  • Ridge Regression Predict │
│                                      │   │  • Non-Causal XAI Engine    │
└──────────────────────────────────────┘   └─────────────────────────────┘
```

---

## 3. Tier Responsibilities & Service Boundaries

### 3.1 Client Tier (Single Page Application)
- **Framework**: React 19.x running on Vite 8.x with Tailwind CSS v4 styling.
- **Routing**: `react-router-dom` v7 with `React.lazy` route-level code splitting and `Suspense` loading boundaries.
- **Error Handling**: Branded React `ErrorBoundary` component catching runtime render exceptions without full page crashes.
- **Visualizations**: Interactive SVG telemetry powered by `Recharts` (Area charts, Bar charts, Radar charts, Pie charts).
- **Service Layer**: [`client/src/services/api.js`](file:///c:/Users/Dell/Desktop/CampusMind%20X/client/src/services/api.js) centralizes all REST calls, handles JWT auth headers, and provides in-memory mock fallbacks if backend services are offline.

### 3.2 API Gateway Tier (Express & Node.js)
- **Runtime**: Node.js v24.x ESM (`"type": "module"`).
- **Responsibilities**:
  - Validates client payloads and sanitizes request parameters.
  - Enforces JWT authentication (`protect`) and role-based permissions (`authorize('student', 'faculty', 'admin')`).
  - Implements the CampusMind AI Rule Engine and 19-intent Conversational Assistant with safety guardrails.
  - Computes deterministic skill-gap indices and generates targeted multi-category recommendations.
  - Proxies ML inference requests to the Python FastAPI microservice, falling back to heuristic models if FastAPI is temporarily unreachable.

### 3.3 AI Microservice Tier (FastAPI & Scikit-Learn)
- **Runtime**: Python 3.14+ with FastAPI, Uvicorn, Pydantic v2, and Joblib.
- **Endpoints**:
  - `GET /health` — Health check and loaded artifact metadata.
  - `POST /predict/risk` — Multi-class academic risk classification (Low, Medium, High) with class probabilities and feature importance vectors.
  - `POST /predict/performance` — Continuous future semester GPA prediction with 95% confidence bounds.
  - `POST /predict/explain` — Intelligible plain-language attribution, High/Medium/Low contribution tiers, cohort benchmarks, and non-causal safety phrasing.

### 3.4 Data Persistence Tier (MongoDB)
- **Database Engine**: MongoDB with Mongoose ODM schemas.
- **Collections**: 13 primary collections covering Users, Students, Faculty, Departments, Subjects, Attendance, Marks, Assignments, Skills, Recommendations, Notifications, Projects, and Chat Conversations.

---

## 4. End-to-End Request Lifecycle

```
[User Action on UI]
       │
       ▼
[apiService.js] ────> Checks JWT in localStorage ────> Attaches 'Authorization: Bearer <token>'
       │
       ▼
[Express Gateway /api/*]
       │
       ├──> [protect / authorize middleware] -> Validates token & role permissions
       │
       ├──> [Controller Execution]
       │       │
       │       ├──> [MongoDB Query via Mongoose] -> Fetches student records
       │       │
       │       └──> [aiService.js] ────> HTTP POST to FastAPI (http://localhost:8000)
       │                                     │
       │                                     ▼
       │                             [FastAPI Predictor]
       │                             Transforms via AcademicPreprocessor
       │                             Runs Scikit-Learn Model inference
       │                             Computes feature attributions & benchmarks
       │                                     │
       │                                     ▼
       │                             Returns JSON Prediction & Explanation
       │
       ▼
[JSON Response returned to Frontend]
       │
       ▼
[React Component updates state & renders Recharts / UI Cards]
```

---

## 5. Security & Isolation Controls
1. **Disabled `x-powered-by`**: Prevents server software fingerprinting.
2. **Standard Security Headers**: Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, and `Referrer-Policy: strict-origin-when-cross-origin`.
3. **Password Protection**: Passwords are encrypted using `bcryptjs` with salt factor 10, excluded from JSON output via `.select('-password')`.
4. **Environment Isolation**: Separate `.env` configurations for development and production deployments.
