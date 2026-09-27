# CampusMind X: Testing & Verification Strategy

## 1. Test Architecture Overview
CampusMind X implements a multi-layer verification suite spanning frontend production builds, API Gateway contract tests, AI intent evaluations, deterministic skill-gap scoring, and Python machine learning inference validation.

---

## 2. Test Execution Commands

### 2.1 Backend API & System Tests (Node.js)
```bash
cd server
npm test
```
- **Engine**: Node.js built-in test runner (`node --test --test-force-exit`).
- **Setup**: Automated test helper boots Express on port 5000 and connects to MongoDB if not already active.
- **Total Test Cases**: 24 tests.
- **Pass Rate**: 100% (24 / 24 passing).

### 2.2 Python AI Engine Tests (FastAPI & ML Predictor)
```bash
cd ai-engine
python test_ai_engine.py
```
- **Engine**: Python `unittest` + FastAPI `TestClient`.
- **Total Test Cases**: 6 tests.
- **Pass Rate**: 100% (6 / 6 passing).

### 2.3 Frontend Build & Lint Verification (React)
```bash
cd client
npm run lint
npm run build
```
- **Linter**: `oxlint` (0 errors).
- **Bundle**: `vite build` (Code-split production chunks, built in ~460ms).

---

## 3. Test Suites & Coverage Breakdown

### 3.1 Unit Test Suite: Explainability & Skill-Gap Engine (`server/tests/phase4.test.js`)
1. **Explainable AI Phrasing & Attribution**:
   - Asserts non-causal language constraints (no "caused", no "forced", uses "contributed").
   - Verifies prediction is Low, Medium, or High with valid confidence $(0.0 - 1.0)$.
   - Validates that all contributing factors include human-readable labels, valid contribution levels (`High contribution`, `Medium contribution`, `Low contribution`), student values, and cohort benchmarks.
2. **Deterministic Skill Gap Scoring**:
   - Validates formula: $\text{gap} = \max(0, \text{targetLevel} - \text{currentLevel})$.
   - Validates priority classification:
     - High Priority: $\text{gap} \ge 30$, or $\text{gap} \ge 20$ with critical flag.
     - Medium Priority: $\text{gap}$ between 15 and 29.
     - Low Priority: $\text{gap} < 15$ or Mastered ($\text{gap} = 0$).
   - Verifies Role Readiness Index: $\text{Readiness} = \frac{\sum \text{achievement}_i \times w_i}{\sum w_i} \times 100$.
3. **Multi-Career Target Support**:
   - Tests across 5 career tracks: Full Stack Developer, Data Analyst / Data Scientist, Cloud & DevOps Engineer, Cybersecurity Analyst, and AI/ML Engineer.
4. **Targeted Recommendation Engine**:
   - Enforces coverage across all 5 mandatory categories: `Academic`, `Attendance`, `Assignment`, `Skill Development`, and `Career`.
   - Validates that every recommendation includes the explicit *"Why am I seeing this recommendation?"* rationale and actionable step plans.

### 3.2 Unit Test Suite: Conversational AI Intents & Safety (`server/tests/phase5.test.js`)
Validates all 19 conversational intents and guardrails:
1. `INTENT_ACADEMIC_FACTORS` — Attributions and non-causal phrasing.
2. `INTENT_WEAK_SUBJECTS` — Identification of weak technical subjects (DSA II).
3. `INTENT_ATTENDANCE_STATUS` — Biometric lecture tracking and 75% consecutive class recovery.
4. `INTENT_SKILL_GAPS` — Target career deficits and Role Readiness Index.
5. `INTENT_STUDY_RECOMMENDATION` — Actionable weekly focus schedules.
6. `INTENT_RECOMMENDATION_WHY` — Explainable rationale behind specific learning interventions.
7. `INTENT_ACADEMIC_TREND` — Semester-by-semester historical trajectory.
8. `INTENT_ASSIGNMENTS` — Overdue coursework status and upcoming deadlines.
9. `INTENT_PREDICTION_RISK` — Predictive risk tier and confidence ratings.
10. `INTENT_CAREER_ROADMAP` — Targeted career track milestones.
11. `INTENT_FACULTY_STUDENTS_NEED_ATTENTION` — High/Medium support student triage.
12. `INTENT_FACULTY_ATTENDANCE_TREND` — Cohort biometric distribution.
13. `INTENT_FACULTY_LOWEST_PERFORMING_SUBJECT` — Departmental course bottlenecks.
14. `INTENT_ADMIN_UNIVERSITY_OVERVIEW` — University enrollment, pass rates, retention.
15. `INTENT_ADMIN_DEPARTMENT_PERFORMANCE` — Cross-department comparative benchmarks.
16. **Privacy Guardrail**: Blocks cross-student data queries by unprivileged students.
17. **Safety Guardrail**: Enforces high-stakes decision boundaries and disclaims automated certainty.
18. **Fallback Intent**: Returns exact mandated institutional fallback message for unclassified queries.
19. **Conversation History API**: Verifies session message retrieval and deletion.

### 3.3 Python AI Engine Test Suite (`ai-engine/test_ai_engine.py`)
1. Health endpoint and artifact verification.
2. Academic risk classifier inference and probability distribution.
3. Continuous GPA performance prediction and 95% confidence interval bounds.
4. Explainability endpoint verification and non-causal phrasing checks.
5. Pydantic input boundary validation (rejects invalid attendance $> 100\%$ or internal marks $> 30$).
6. Prediction explanation API verification.
