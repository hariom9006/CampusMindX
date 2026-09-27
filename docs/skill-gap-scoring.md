# CampusMind X — Skill Gap Engine & Scoring Methodology (Phase 4)

## 1. Overview & Objective

The **Skill Gap Analysis Engine** in CampusMind X quantifies the alignment between a student's assessed competencies and standard industry benchmarks for their declared career target.

Rather than treating skills as opaque badges, the engine calculates transparent, auditable gaps, assigns prioritized urgency tiers (High, Medium, Low), and feeds directly into the **Personalized Recommendation Engine** and **Personalized Learning Roadmap**.

---

## 2. Mathematical Scoring Formulas

### 2.1 Individual Skill Gap
For any given competency $i$:
$$\text{gap}_i = \max(0, \text{TargetLevel}_i - \text{CurrentLevel}_i)$$

Where:
- $\text{CurrentLevel}_i \in [0, 100]$: Student's assessed skill proficiency (from coursework, lab assessments, and verified certifications).
- $\text{TargetLevel}_i \in [0, 100]$: Standard role requirement benchmark.
- Negative values are bounded at zero: exceeding target proficiency produces a gap of $0$.

### 2.2 Priority Classification Rules
Every evaluated competency is assigned a priority tier to direct student attention to the highest-leverage developmental targets:

| Priority Tier | Mathematical Criteria | Action Mandate |
| :--- | :--- | :--- |
| **High** | $\text{gap}_i \ge 30\%$ **OR** ($\text{isCriticalSkill}_i = \text{true} \land \text{gap}_i \ge 20\%$) | Urgent focus required. Scheduled into Milestone 1 of the Personalized Roadmap and generates a High-priority recommendation. |
| **Medium** | $15\% \le \text{gap}_i < 30\%$ (for non-critical skills) | Scheduled into Milestone 2 or 3 of the learning roadmap. |
| **Low** | $\text{gap}_i < 15\%$ | Competency is near or exceeds target benchmark. Standard maintenance. |

### 2.3 Status Classifications

| Status Label | Condition | Description |
| :--- | :--- | :--- |
| **Mastered** | $\text{gap}_i = 0$ ($\text{CurrentLevel} \ge \text{TargetLevel}$) | Student exceeds professional entry criteria for this skill. |
| **On Track** | $0 < \text{gap}_i < 15\%$ | Minor refinement needed; student performs within expected range. |
| **Moderate Gap** | $15\% \le \text{gap}_i < 30\%$ | Noticeable deficiency requiring structured coursework or practice. |
| **Critical Gap** | $\text{gap}_i \ge 30\%$ | Major hiring blocker requiring focused clinic/sprint intervention. |

### 2.4 Overall Role Readiness Index
The aggregate readiness index represents a weighted percentage of mastery across all required competencies for a specific career target:

$$\text{Readiness Index (\%)} = \left( \frac{\sum_{i=1}^N \min(\text{CurrentLevel}_i, \text{TargetLevel}_i) \times w_i}{\sum_{i=1}^N \text{TargetLevel}_i \times w_i} \right) \times 100$$

Where $w_i \in [0.9, 1.3]$ is the pedagogical importance weight assigned to competency $i$ (e.g., core language and architectural fundamentals carry higher weights than auxiliary styling libraries).

---

## 3. Career Role Competency Catalogs

CampusMind X benchmarks 5 distinct technology career tracks:

### 3.1 Full Stack Developer (Default)
- **HTML & Semantic CSS**: Target 85% ($w=1.0$)
- **JavaScript (ES6+)**: Target 85% ($w=1.2$, Critical)
- **React.js & State Management**: Target 80% ($w=1.2$, Critical)
- **Tailwind CSS & Modern UI**: Target 75% ($w=0.9$)
- **Node.js & Runtime Internals**: Target 80% ($w=1.3$, Critical)
- **Express.js & Middleware**: Target 80% ($w=1.1$, Critical)
- **RESTful API Architecture**: Target 85% ($w=1.2$, Critical)
- **Authentication & JWT**: Target 75% ($w=1.1$, Critical)
- **MongoDB & Mongoose ODM**: Target 75% ($w=1.1$, Critical)
- **SQL & Relational Modeling**: Target 70% ($w=1.0$)
- **Data Structures & Algorithms**: Target 80% ($w=1.3$, Critical)
- **System Design Basics**: Target 70% ($w=1.2$, Critical)
- **Git & GitHub Collaboration**: Target 80% ($w=1.0$)
- **Deployment & Containerization**: Target 65% ($w=0.9$)

### 3.2 Additional Standard Catalogs
1. **Data Analyst / Data Scientist**: Python, SQL Optimization, Pandas/NumPy, Data Visualization, Statistical Inference, Scikit-Learn ML, ETL Pipelines.
2. **Cloud & DevOps Engineer**: Linux Administration, Git, Docker, Kubernetes, CI/CD Actions, AWS Infrastructure, Networking & TLS.
3. **Cybersecurity Analyst**: Packet Analysis, Linux Security, Vulnerability Scanning, Ethical Hacking, Cryptography, SIEM.
4. **AI / Machine Learning Engineer**: Advanced Python, Linear Algebra, DSA, Scikit-Learn Classical ML, Deep Learning (PyTorch), MLOps & FastAPI Serving.

---

## 4. Recommendation Engine Integration

When the Skill Gap Engine evaluates a student:
1. High-priority gaps are automatically transformed into **Skill Development** recommendations.
2. The recommendation includes a direct explanatory rationale answering:
   *"Why am I seeing this recommendation?"*  
   *Example: "For your target career as a Full Stack Developer, System Design Basics is benchmarked at 70%, while your assessed level is 42% (a 28% gap). Bridging this gap directly elevates your technical interview readiness."*
3. Each recommendation contains a 3-step actionable study plan.
