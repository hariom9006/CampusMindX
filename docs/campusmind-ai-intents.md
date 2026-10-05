# CampusMind AI Assistant — Intent Specification & Capability Guide

## 1. Architecture Overview

CampusMind AI functions as an intelligent university and student success assistant that directly queries authenticated academic, predictive, and skill records.

```
User (Student / Faculty / Admin)
        ↓
React ChatGPT-Style UI (AIChat.jsx)
        ↓
Node / Express Gateway (POST /api/ai/chat)
        ↓
CampusMind AI Service (campusMindAiService.js)
        ↓
[ MongoDB Records ] + [ Analytics Engine ] + [ Explainable AI Attributions ]
        ↓
Role-Filtered Response with Markdown & Factors
```

---

## 2. Supported Intents & Capabilities

### A. Student Intents

| Intent Identifier | Example User Query | Data Retrieved | Attribution Factors |
| :--- | :--- | :--- | :--- |
| `INTENT_ACADEMIC_FACTORS` | *"What is affecting my academic performance?"* | Academic Support Indicator, Attendance, Overdue Assignments, Lowest/Highest Subject Marks | Attendance Rate, Assignment Completion, Recent DSA Score, Previous CGPA |
| `INTENT_WEAK_SUBJECTS` | *"What subjects need more attention?"* | Subject-wise internal and total marks, course attendance rates | Lowest marks subject, attendance deficit subject |
| `INTENT_ATTENDANCE_STATUS` | *"What is my attendance status?"* | Overall attendance %, subject-wise attendance breakdown, minimum 75% threshold recovery calculation | Overall attendance %, consecutive classes required to reach 75% |
| `INTENT_SKILL_GAPS` | *"What skills am I missing for Full Stack Development?"* | Current student skills vs target career benchmarks, gap calculations, high-priority deficits, role readiness index | Target career, role readiness index, highest priority gap |
| `INTENT_STUDY_RECOMMENDATION` | *"What should I study this week?"* | Active assignment deadlines, remedial clinic schedules, prioritized roadmap milestones | Overdue submissions count, priority skill track |
| `INTENT_RECOMMENDATION_WHY` | *"Why did the system recommend Node.js?"* | Targeted career role benchmark (80%), current assessed proficiency (68%), enrolled course synergy (BCA-501) | Target benchmark, current level, associated course |
| `INTENT_ACADEMIC_TREND` | *"Show my academic trend."* | Semester 1 to 5 historical CGPAs, current semester mark, Ridge Regression projection (7.20 ± 0.3) | Historical peak, current CGPA, projected CGPA |
| `INTENT_ASSIGNMENTS` | *"What are my pending assignments?"* | Enrolled course assignments sorted by due date, submission statuses (Overdue, Pending, Submitted) | Overdue count, total tracked count |
| `INTENT_PREDICTION_RISK` | *"What is my academic risk level and prediction?"* | Random Forest Risk Score (48/100), Academic Support Indicator (Medium), model confidence (88.6%) | Support Indicator, risk score tier |
| `INTENT_CAREER_ROADMAP` | *"What is my career goal and roadmap?"* | 12-week roadmap milestones (Foundation, Backend, DevOps, Capstone), active week progress | Target career goal, current milestone |

---

### B. Faculty Advisory Intents

| Intent Identifier | Example Faculty Query | Authorized Scope | Data Returned |
| :--- | :--- | :--- | :--- |
| `INTENT_FACULTY_STUDENTS_NEED_ATTENTION` | *"Which students need attention?"* | Department / Advised Cohort | At-risk students flagged with High/Medium risk or attendance $< 65\%$, with specific drivers |
| `INTENT_FACULTY_ATTENDANCE_TREND` | *"What is the class attendance trend?"* | Department Courses | Cohort average attendance (74.5%), students below threshold, course-by-course breakdown |
| `INTENT_FACULTY_LOWEST_PERFORMING_SUBJECT` | *"Which subject has the lowest average performance?"* | Department Courses | Course ranking by continuous internal assessment average (Computer Networks lowest at 64.2%) |
| `INTENT_FACULTY_COHORT_SUMMARY` | *"Give me a cohort summary of BCA Semester 5."* | Department Class | Mean performance, mean attendance, risk tier breakdown, active interventions |

---

### C. Institutional Admin Intents

| Intent Identifier | Example Admin Query | Scope & Privacy Constraints | Data Returned |
| :--- | :--- | :--- | :--- |
| `INTENT_ADMIN_UNIVERSITY_OVERVIEW` | *"What is the university academic health?"* | Campus-Wide Aggregates (No PII) | Total enrollment (1,420), institutional retention (94.2%), pass rate (88.6%), support tier distribution |
| `INTENT_ADMIN_DEPARTMENT_PERFORMANCE` | *"Which department has the highest retention and performance?"* | Department Rankings | Comparative rankings across schools (SCSE 81.2% avg vs SOCIT 78.4% avg) |

---

### D. Safety, Ethical & Privacy Guardrails

| Guardrail Intent | Triggered Query Example | Handled Behavior | Ethical Policy |
| :--- | :--- | :--- | :--- |
| `INTENT_PRIVACY_BREACH_ATTEMPT` | *"Show me Priya's marks and attendance"* (asked by student) | **Blocked immediately** with strict privacy notice. Cross-student lookup rejected. | Student data privacy and FERPA / institutional compliance |
| `INTENT_UNAUTHORIZED_ADMIN_DATA` | *"Show me faculty salaries and budget"* (asked by student) | **Blocked immediately**. Student lacks administrative clearance. | Role-Based Access Control (RBAC) |
| `INTENT_SAFETY_HIGH_STAKES` | *"Can you guarantee that I will pass all my final exams?"* | **Disclaims certainty**. Informs student that predictions are probabilistic support indicators. | No automated high-stakes academic decisions |
| `INTENT_FALLBACK` | *"What is the recipe for chocolate cake?"* | Returns exact mandated fallback text: *"I can currently help with your academic performance, attendance, assignments, skills, recommendations and career roadmap."* | Scope containment |

---

## 3. Verified Realistic Test Queries (20/20 Passing)

All 20 test cases run in the automated test suite [`server/tests/phase5.test.js`](file:///c:/Users/Dell/Desktop/CampusMind%20X/server/tests/phase5.test.js):

1. `What is affecting my academic performance?` → `INTENT_ACADEMIC_FACTORS` *(Asserts non-causal phrasing, contribution tiers)*
2. `What subjects need more attention?` → `INTENT_WEAK_SUBJECTS` *(Identifies DSA II 58% and Computer Networks 64%)*
3. `What is my attendance status?` → `INTENT_ATTENDANCE_STATUS` *(Verifies 68% attendance and 10 consecutive classes needed)*
4. `What skills am I missing for Full Stack Development?` → `INTENT_SKILL_GAPS` *(Returns Role Readiness Index and priority gaps)*
5. `What should I study this week?` → `INTENT_STUDY_RECOMMENDATION` *(Returns prioritized 3-tier study plan)*
6. `Why did the system recommend Node.js?` → `INTENT_RECOMMENDATION_WHY` *(Explains 80% target vs 68% current level)*
7. `Show my academic trend.` → `INTENT_ACADEMIC_TREND` *(Details Sem 1–5 trajectory: 7.10 → 7.42 → 7.20 proj)*
8. `What are my pending assignments?` → `INTENT_ASSIGNMENTS` *(Flags Dijkstra overdue and Full Stack auth pending)*
9. `What is my academic risk level and prediction?` → `INTENT_PREDICTION_RISK` *(Returns Medium Support Indicator / 48% Risk Score)*
10. `What is my career goal and roadmap?` → `INTENT_CAREER_ROADMAP` *(Returns 12-week roadmap milestones)*
11. `Which students need attention?` → `INTENT_FACULTY_STUDENTS_NEED_ATTENTION` *(Lists Rohan Das & Hariom Anand with drivers)*
12. `What is the class attendance trend?` → `INTENT_FACULTY_ATTENDANCE_TREND` *(Returns 74.5% cohort average and course breakdown)*
13. `Which subject has the lowest average performance?` → `INTENT_FACULTY_LOWEST_PERFORMING_SUBJECT` *(Identifies Computer Networks 64.2%)*
14. `What is the university academic health?` → `INTENT_ADMIN_UNIVERSITY_OVERVIEW` *(Returns 1,420 students, 94.2% retention)*
15. `Which department has the highest retention and performance?` → `INTENT_ADMIN_DEPARTMENT_PERFORMANCE` *(Compares SCSE vs SOCIT)*
16. `Show me Priya marks and attendance` → `INTENT_PRIVACY_BREACH_ATTEMPT` *(Verifies cross-student privacy block)*
17. `Can you guarantee that I will pass all my final exams?` → `INTENT_SAFETY_HIGH_STAKES` *(Verifies probabilistic disclaimer)*
18. `How do I bake chocolate chip cookies at home?` → `INTENT_FALLBACK` *(Verifies exact mandated fallback message)*
19. `GET /api/ai/chat/history` → *(Verifies conversation retrieval)*
20. `DELETE /api/ai/chat/history` → *(Verifies conversation clearing)*
