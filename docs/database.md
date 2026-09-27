# CampusMind X: Database Architecture & Schema Specifications

## 1. Overview
CampusMind X uses **MongoDB** as its primary persistence engine, accessed through **Mongoose ODM** in the Express.js API gateway. The schema models a typical higher education institution comprising students, faculty advisors, departments, curriculum subjects, academic telemetry (attendance, marks, assignments), career competencies, actionable recommendations, and conversational interactions.

---

## 2. Collections Overview

The database contains **13 primary collections**:

| Collection Name | Mongoose Model | Primary Key / Unique Identifier | Description |
| :--- | :--- | :--- | :--- |
| `users` | `User` | `_id`, `email` | Authentication credentials, hashed passwords, roles (`student`, `faculty`, `admin`). |
| `students` | `Student` | `_id`, `enrollmentNumber` | Academic profile, CGPA, risk status, career goal, department, advisor reference. |
| `faculties` | `Faculty` | `_id`, `employeeId` | Faculty advisors, department affiliation, designations, office details. |
| `departments` | `Department` | `_id`, `code` | Academic departments (e.g., Computing & IT, CS, EC, IS). |
| `subjects` | `Subject` | `_id`, `code` | Course curriculum catalog, credits, semester, syllabus details. |
| `attendances` | `Attendance` | `_id` | Lecture and lab session attendance logs, percentages, and clearance metrics. |
| `marks` | `Marks` | `_id` | Continuous internal evaluations (CIE), mid-terms, and grade records. |
| `assignments` | `Assignment` | `_id` | Coursework deliverables, deadlines, submission timestamps, and grades. |
| `skills` | `Skill` | `_id` | Industry technical skills, competency categories, target levels. |
| `recommendations` | `Recommendation` | `_id` | Prescribed interventions across Academic, Attendance, Assignment, Skill, Career. |
| `notifications` | `Notification` | `_id` | Academic alerts, attendance shortage warnings, and system notices. |
| `projects` | `Project` | `_id` | Capstone and semester project records, github repos, milestones. |
| `conversations` | `Conversation` | `_id` | Persistent chat logs for the CampusMind AI Assistant by student roll number. |

---

## 3. Detailed Schema Definitions

### 3.1 `User` Schema
```javascript
{
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', default: null }
}
```
- **Password Hashing**: Pre-save hook uses `bcryptjs.hash(this.password, salt)` with 10 salt rounds.
- **Security**: The `password` field is excluded in queries using `.select('-password')`.

### 3.2 `Student` Schema
```javascript
{
  name: { type: String, required: true },
  enrollmentNumber: { type: String, required: true, unique: true, uppercase: true },
  email: { type: String, required: true, unique: true },
  program: { type: String, default: 'Bachelor of Computer Applications (BCA)' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  semester: { type: Number, default: 5 },
  section: { type: String, default: 'A' },
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  currentCgpa: { type: Number, default: 7.42 },
  overallPerformance: { type: Number, default: 71.0 },
  attendance: { type: Number, default: 68.0 },
  assignmentCompletion: { type: Number, default: 62.0 },
  riskLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  academicSupportIndicator: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  predictedSemesterCgpa: { type: Number, default: 7.15 },
  careerGoal: { type: String, default: 'Full Stack Developer' },
  riskFactors: [{
    factor: String,
    impact: String,
    type: { type: String, enum: ['positive', 'negative'] },
    description: String
  }]
}
```

### 3.3 `Recommendation` Schema
```javascript
{
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  category: { 
    type: String, 
    enum: ['Academic', 'Attendance', 'Assignment', 'Skill Development', 'Career'], 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  impactRating: { type: String, enum: ['Critical', 'High', 'Moderate'], default: 'Moderate' },
  urgency: { type: String, enum: ['Immediate', 'Upcoming', 'Optional'], default: 'Upcoming' },
  rationale: { type: String, required: true }, // Explicit "Why am I seeing this recommendation?"
  actionPlan: [{ type: String }],
  status: { type: String, enum: ['Active', 'In Progress', 'Completed', 'Dismissed'], default: 'Active' },
  estimatedEffortHours: { type: Number, default: 5 }
}
```

### 3.4 `Conversation` Schema
```javascript
{
  studentRollNo: { type: String, required: true, index: true },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  messages: [{
    sender: { type: String, enum: ['user', 'assistant'], required: true },
    text: { type: String, required: true },
    intent: { type: String },
    timestamp: { type: Date, default: Date.now },
    factors: [{ name: String, impact: String, value: String }]
  }],
  lastActive: { type: Date, default: Date.now }
}
```

---

## 4. Seeding & Demo Data
The database automatically seeds when empty via [`server/src/seed.js`](file:///c:/Users/Dell/Desktop/CampusMind%20X/server/src/seed.js):
- **Core Demo Student**: Aarav Sharma (`22BCA1042`), BCA Semester 5.
- **Core Faculty Mentor**: Dr. Sunita Kulkarni (`FAC-2018-04`), Department of Computing & IT.
- **Core University Admin**: Dean of Academic Affairs (`admin@campus.edu.in`).
- **Additional Cohort Records**: 4 diverse student profiles (Priya Patel, Rohan Gupta, Ananya Nair, Vikram Singh) spanning Low, Medium, and High academic support tiers.
- **Coursework & Telemetry**: Full semester 5 subjects (DSA II, Computer Networks, Database Systems, Web Tech, Software Engineering), marks, attendance sessions, and 5 targeted recommendations.
