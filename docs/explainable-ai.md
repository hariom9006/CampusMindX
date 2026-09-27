# CampusMind X: Explainable AI (XAI) Methodology & Ethical Guidelines

## 1. Motivation: The Problem with Black-Box Academic AI
Traditional Educational Data Mining (EDM) models predict academic failure or dropout risks using complex ensembles or neural networks. When a student is assigned a score like "Risk Level: High" without explanation:
1. **Students** experience anxiety without knowing what specific actions will remedy their status.
2. **Faculty advisors** cannot justify interventions or verify whether an algorithm is flagging an anomaly or a systemic issue.
3. **Institutions** face legal, regulatory, and ethical exposure under emerging AI safety and transparency standards.

CampusMind X solves this by mandating that **every prediction must be accompanied by an intelligible, non-causal explanation**.

---

## 2. Explainability Approach

### 2.1 Additive Feature Attribution
Inspired by **SHAP (SHapley Additive exPlanations)**, feature attribution decomposes a final score into the individual contributions of each academic variable:

$$\text{Attribution}_i = z_i \times w_i$$

Where:
- $z_i = \frac{x_i - \mu_i}{\sigma_i}$ is the student's standardized z-score deviation from the cohort benchmark mean.
- $w_i$ is the empirical feature importance derived from the trained Random Forest ensemble (or the linear coefficient in Ridge Regression).

### 2.2 Contribution Tiers
Feature attributions are categorized into intuitive human-readable tiers:
- **High contribution**: Absolute impact score $\ge 12.0\%$ (Primary predictive driver).
- **Medium contribution**: Absolute impact score between $5.0\%$ and $11.9\%$ (Notable contributing factor).
- **Low contribution**: Absolute impact score $< 5.0\%$ (Minor baseline factor).

### 2.3 Cohort Benchmarks
Attributions are grounded in verifiable institutional benchmarks rather than arbitrary abstract numbers:
- **Attendance**: Cohort benchmark is **75.0%** (University statutory examination requirement).
- **Assignments**: Cohort benchmark is **70.0%** completion.
- **Internal Marks**: Cohort benchmark is **18.0 / 30**.
- **Historical CGPA**: Cohort benchmark is **7.0 / 10.0**.
- **Missed Practical Labs**: Benchmark is **$\le 2$ sessions**.

---

## 3. Ethical Phrasing & Non-Causal Language Rules

Machine learning models detect statistical correlations within historical datasets; they do not establish deterministic causal mechanisms. CampusMind X enforces strict phrasing constraints:

### 3.1 Prohibited Language (Deterministic / Causal)
- ❌ *"Missing 4 labs caused the student to fail."*
- ❌ *"Low attendance forced the student into the high risk bracket."*
- ❌ *"The student's internal mark is the sole reason for failure."*

### 3.2 Required Language (Correlational / Contributory)
- ✅ *"Lecture & Lab Attendance (68.0%) fell below the mandatory 75% benchmark and contributed to the elevated risk tier prediction."*
- ✅ *"Historical Cumulative CGPA (7.42/10.0) exceeded cohort expectations and contributed positively toward stabilizing the student standing."*
- ✅ *"These factors contributed to the model prediction and do not imply direct deterministic causation."*

---

## 4. Decision-Support Boundaries & Human-in-the-Loop
1. **Advisory Tool Only**: CampusMind X outputs are decision-support aids for mentors and advisors.
2. **No Automated Adverse Action**: Predictions must never trigger automated sanctions, suspensions, debarments, or expulsion.
3. **Right to Explanation**: Any student flagged for academic support can inspect their feature attributions and view a concrete 5-pillar recovery plan.
