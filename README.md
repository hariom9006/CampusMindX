# CampusMind X

### An Explainable AI-Powered University Intelligence and Student Success Platform
*BCA Final-Year Capstone Project — Production Release (v1.0.0)*

[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-06b6d4)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/AI%20Microservice-Python%203.14%20%2B%20FastAPI-3776ab)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47a248)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Executive Overview

**CampusMind X** is a modern institutional intelligence platform built to eliminate "black-box" predictions in higher education. Conventional student monitoring systems compute opaque risk ratings without justification, leading to student distress and advisor hesitation. 

CampusMind X couples predictive machine learning models with **transparent, non-causal Explainable AI (XAI)**. Students, faculty mentors, and university executives can inspect the exact positive and negative feature attributions driving every academic evaluation, accompanied by targeted recovery interventions across 5 key institutional pillars.

---

## 🎯 Key Innovations & Platform Capabilities

1. **Explainable AI (XAI) Attribution**:
   - Additive feature attribution derived from empirical model weights and z-score deviations from cohort benchmarks.
   - Categorized into intuitive contribution tiers: **High contribution**, **Medium contribution**, and **Low contribution**.
   - Enforces strict ethical **non-causal phrasing** (e.g., *"Attendance contributed to the prediction"* rather than deterministic claims like *"Attendance caused failure"*).

2. **Dual-Model Machine Learning Engine**:
   - **Academic Risk Classifier**: Empirically selected Random Forest model classifying students into **Low**, **Medium**, or **High** risk with calibrated class probabilities.
   - **Performance Forecaster**: Ridge Regression model predicting continuous future semester GPA (scale 4.0 – 10.0) with 95% confidence bounds.

3. **Deterministic Skill-Gap Analyzer**:
   - Benchmarks student competencies against 5 industry career tracks: *Full Stack Developer*, *Data Analyst / Data Scientist*, *Cloud & DevOps Engineer*, *Cybersecurity Analyst*, and *AI / Machine Learning Engineer*.
   - Computes weighted Role Readiness Index and prioritizes skill deficits.

4. **Context-Aware AI Assistant**:
   - 19-intent natural language query engine supporting student, faculty, and administrative personas.
   - Integrated **privacy guardrails** (preventing cross-student data leakage) and **safety guardrails** (disclaiming automated certainty for high-stakes decisions).

5. **Multi-Role Portal Hierarchy**:
   - **Student Portal**: Academic telemetry, biometric attendance tracking, 75% exam clearance recovery, and personalized 12-week roadmap.
   - **Faculty Portal**: Cohort monitoring table, sorting and filtering, course bottleneck analytics, and instant intervention dispatch.
   - **Admin Portal**: Institutional macro metrics, department-by-department pass rates, and NAAC/NIRF accreditation readiness.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS v4 | Interactive SPA, code-split route lazy loading, dark glassmorphism UI |
| **Visualizations** | Recharts, Framer Motion, Lucide React | Area, Bar, Radar telemetry and micro-animations |
| **API Gateway** | Node.js v24, Express 4.21, Mongoose 8 | REST routing, JWT auth, RBAC authorization, security middleware |
| **AI Microservice** | Python 3.14, FastAPI, Scikit-Learn, Joblib | Scaled feature preprocessing, model inference, XAI attribution |
| **Database** | MongoDB 7+ (Local / MongoDB Atlas) | 13 normalized collections with automated demo cohort seeding |

---

## 📁 Repository Structure

```text
CampusMind-X/
├── client/                     # Frontend Single Page Application (React 19 + Vite)
│   ├── src/
│   │   ├── components/         # UI Library (StatCard, ChartCard, ExplainabilityModal, etc.)
│   │   ├── layouts/            # Dashboard shell (Sidebar + TopNavbar)
│   │   ├── pages/              # 14 role-based application views
│   │   │   ├── student/        # Student dashboard, attendance, performance, skills, roadmap, chat
│   │   │   ├── faculty/        # Faculty monitoring, analytics, assistant
│   │   │   └── admin/          # Institutional executive dashboard, analytics, assistant
│   │   └── services/api.js     # Unified API service layer with resilient fallbacks
│   ├── package.json
│   └── vite.config.js
├── server/                     # API Gateway (Node.js + Express)
│   ├── src/
│   │   ├── controllers/        # Domain controllers (AI, Auth, Students, Recommendations, etc.)
│   │   ├── middleware/         # Security headers, JWT protect, RBAC authorize, error handling
│   │   ├── models/             # 13 Mongoose schemas (Student, User, Recommendation, etc.)
│   │   ├── routes/             # REST route registry
│   │   ├── services/           # AI proxy, Rule Engine, and Skill-Gap calculations
│   │   └── seed.js             # Automated database seeding
│   ├── tests/                  # Automated integration & unit test suites (24 tests)
│   └── package.json
├── ai-engine/                  # AI Microservice (Python + FastAPI)
│   ├── api/                    # FastAPI route declarations & Pydantic validation schemas
│   ├── datasets/               # 1,200 curated student academic records
│   ├── models/                 # Serialized Joblib artifacts (risk, performance, preprocessor)
│   ├── prediction/             # Inference engine & Explainable AI attribution calculator
│   ├── preprocessing/          # Data pipeline (StandardScaler + SimpleImputer)
│   ├── training/               # Empirical training and evaluation scripts
│   ├── test_ai_engine.py       # Python test suite (6 tests)
│   └── requirements.txt
├── docs/                       # Technical Specifications & Architecture Documentation
│   ├── architecture.md         # System architecture & multi-tier request lifecycle
│   ├── database.md             # MongoDB collections & Mongoose schema specifications
│   ├── api.md                  # REST & FastAPI endpoint documentation
│   ├── ai-models.md            # Dataset, model evaluation metrics, and feature metadata
│   ├── explainable-ai.md       # XAI methodology, contribution tiers, and non-causal rules
│   ├── testing.md              # Test execution guide and verification breakdown
│   └── deployment.md           # Production deployment guide (Vercel, Render, Atlas)
├── .env.example                # Environment variables template
├── package.json                # Root project orchestrator
└── README.md                   # Project overview & quickstart
```

---

## 📱 Responsive & Adaptive Architecture

CampusMind X is engineered with a **Responsive-First & Adaptive Design System** built to provide a premium, native-feeling experience across all screen sizes without compromising data density or analytical depth:

| Device Category | Breakpoint Range | Architectural Behavior |
| :--- | :--- | :--- |
| **Small Mobile** | 320px – 374px | Ultra-compact cards, condensed charts, bottom tab bar, full-screen touch targets |
| **Mobile** | 375px – 639px | Single-column fluid stack, slide-out drawer, bottom navigation, mobile card tables |
| **Tablet / iPad** | 640px – 1023px | 2-column balanced layouts, compact collapsible navigation, medium telemetry |
| **Laptop** | 1024px – 1279px | Multi-column analytics grid, persistent sidebar, rich visualization panels |
| **Desktop & Large Monitors** | 1280px – 1920px+ | Full multi-column dashboard, centered container constraints (`max-w-7xl`), zero horizontal scroll |

### Key Responsive Features:
1. **Adaptive Navigation**:
   - **Desktop**: Persistent sidebar with quick access to all portals and user workspace details.
   - **Tablet**: Collapsible navigation drawer with backdrop blur.
   - **Mobile**: Touch-optimized slide-out navigation drawer with top-level hamburger trigger + persistent **Bottom Navigation Bar** for high-frequency workflows (Home, Intelligence, Performance, Skills, AI Assistant, Profile).
2. **Responsive Data Tables**:
   - Complex tabular records (e.g. Faculty Cohort Monitoring, Coursework Registries) automatically convert into rich, touch-friendly **Mobile Cards** with risk badges, metrics, and instant action buttons below 768px (`md`).
3. **Adaptive Charts & Data Visualizations**:
   - Wrapped inside fluid `ResponsiveContainer` nodes with auto-calculated heights (`h-56` on mobile to `h-80` on desktop) and responsive tick counts to prevent axis crowding.
4. **Adaptive Modals**:
   - Render as centered floating dialogs on desktop/laptop viewports, and automatically morph into ergonomic **Bottom Sheets** on mobile (`items-end max-h-[92vh]`) with swipeable headers and internal scroll.

---

## 🚀 Running the Project Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24 LTS recommended)
- **Python**: v3.10 or higher (v3.14 verified)
- **MongoDB**: Local `mongod` service active on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-repo/campusmind-x.git
cd campusmind-x

# Install client and server dependencies
npm run install:all

# Install Python AI Engine dependencies
cd ai-engine
pip install -r requirements.txt
cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` into server environment:
```bash
cp .env.example server/.env
```

### 3. Launch Services
Open three terminals (or use root scripts):

**Terminal 1 — API Gateway (Port 5000)**:
```bash
npm run server
```

**Terminal 2 — Python AI Engine (Port 8000)**:
```bash
cd ai-engine
python main.py
```

**Terminal 3 — Frontend Client (Port 5173)**:
```bash
npm run client
```

Navigate to `http://localhost:5173` in your web browser.

---

## 🧪 Testing & Verification

CampusMind X includes test suites across all tiers:

```bash
# 1. Run Node.js Server & Integration Test Suite (24 tests)
cd server
npm test

# 2. Run Python AI Engine Test Suite (6 tests)
cd ../ai-engine
python test_ai_engine.py

# 3. Verify Frontend Linting & Production Build
cd ../client
npm run lint
npm run build
```

---

## 📚 Complete Technical Documentation

Comprehensive documentation is maintained in the [`docs/`](file:///c:/Users/Dell/Desktop/CampusMind%20X/docs) directory:
- [System Architecture](docs/architecture.md)
- [Database Schema & Collections](docs/database.md)
- [API Reference](docs/api.md)
- [AI Models & Training](docs/ai-models.md)
- [Explainable AI Methodology](docs/explainable-ai.md)
- [Testing & Quality Assurance](docs/testing.md)
- [Production Deployment Guide](docs/deployment.md)

---

## ⚠️ Known Limitations & Future Improvements

### Known Limitations
1. **Decision Support Boundary**: CampusMind X generates advisory indicators. The system must not be used as the sole determinant for disciplinary actions or examination debarment.
2. **Synthetic Training Baseline**: The current machine learning models were trained on a 1,200-student simulated academic dataset. While realistic and stratified, deployment in a live university requires recalibrating against institutional historical data.
3. **Conversational AI State**: Assistant session history is stored per student roll number in MongoDB; distributed web socket synchronization is planned for a future release.

### Future Improvements
1. **Real-Time Biometric Sensor Ingestion**: Webhook integration with RFID and biometric campus gate hardware.
2. **Deep Learning Sequence Modeling**: LSTM / Transformer sequence models to forecast semester trajectory based on multi-year time-series.
3. **Canvas / Moodle LMS Integration**: Native LTI 1.3 compliance for turnkey integration into Blackboard, Canvas, and Moodle.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
