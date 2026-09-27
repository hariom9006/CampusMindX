import {
  Student,
  Attendance,
  Marks,
  Assignment,
  Skill,
  Recommendation,
  Subject,
  Department,
  Faculty
} from '../models/index.js';
import { skillGapService } from './skillGapService.js';
import { recommendationEngineService } from './recommendationEngineService.js';
import { aiService } from './aiService.js';

export const INTENTS = {
  // Student Intents
  ACADEMIC_FACTORS: 'INTENT_ACADEMIC_FACTORS',
  WEAK_SUBJECTS: 'INTENT_WEAK_SUBJECTS',
  ATTENDANCE_STATUS: 'INTENT_ATTENDANCE_STATUS',
  SKILL_GAPS: 'INTENT_SKILL_GAPS',
  STUDY_RECOMMENDATION: 'INTENT_STUDY_RECOMMENDATION',
  RECOMMENDATION_WHY: 'INTENT_RECOMMENDATION_WHY',
  ACADEMIC_TREND: 'INTENT_ACADEMIC_TREND',
  ASSIGNMENTS: 'INTENT_ASSIGNMENTS',
  PREDICTION_RISK: 'INTENT_PREDICTION_RISK',
  CAREER_ROADMAP: 'INTENT_CAREER_ROADMAP',

  // Faculty Intents
  FACULTY_STUDENTS_NEED_ATTENTION: 'INTENT_FACULTY_STUDENTS_NEED_ATTENTION',
  FACULTY_ATTENDANCE_TREND: 'INTENT_FACULTY_ATTENDANCE_TREND',
  FACULTY_LOWEST_PERFORMING_SUBJECT: 'INTENT_FACULTY_LOWEST_PERFORMING_SUBJECT',
  FACULTY_COHORT_SUMMARY: 'INTENT_FACULTY_COHORT_SUMMARY',

  // Admin Intents
  ADMIN_UNIVERSITY_OVERVIEW: 'INTENT_ADMIN_UNIVERSITY_OVERVIEW',
  ADMIN_DEPARTMENT_PERFORMANCE: 'INTENT_ADMIN_DEPARTMENT_PERFORMANCE',

  // Safety & Guardrail Intents
  PRIVACY_BREACH_ATTEMPT: 'INTENT_PRIVACY_BREACH_ATTEMPT',
  SAFETY_HIGH_STAKES: 'INTENT_SAFETY_HIGH_STAKES',
  UNAUTHORIZED_ADMIN_DATA: 'INTENT_UNAUTHORIZED_ADMIN_DATA',

  // Fallback
  FALLBACK: 'INTENT_FALLBACK'
};

class CampusMindAiService {
  /**
   * Main entry point for query processing
   */
  async processQuery({ message, role = 'student', studentId = null, facultyId = null, user = null }) {
    const rawQuery = (message || '').trim();
    const query = rawQuery.toLowerCase();

    // 1. Check for Cross-Student Privacy Violations (Student asking for another student's data)
    if (role === 'student' && this.detectPrivacyBreach(query)) {
      return this.handlePrivacyBreachResponse();
    }

    // 2. Check for Unauthorized Administrative Information Request from Student
    if (role === 'student' && this.detectUnauthorizedAdminQuery(query)) {
      return this.handleUnauthorizedAdminResponse();
    }

    // 3. Check for High-Stakes Deterministic / Certainty Inquiries
    if (this.detectHighStakesInquiry(query)) {
      return this.handleHighStakesResponse(studentId);
    }

    // 4. Role-Based Routing
    if (role === 'faculty') {
      return await this.handleFacultyQueries(query, facultyId);
    } else if (role === 'admin') {
      return await this.handleAdminQueries(query);
    } else {
      return await this.handleStudentQueries(query, studentId);
    }
  }

  // ==========================================
  // INTENT CLASSIFIER & SAFETY DETECTORS
  // ==========================================

  detectPrivacyBreach(query) {
    const otherStudentNames = ['priya', 'rohan', 'sneha', 'kabir', 'patel', 'das', 'iyer', 'mehta', 'vikram'];
    const otherKeywords = ['someone else', 'other student', 'classmate marks', 'peer attendance', 'cohort marks list'];
    
    // Check if query mentions another specific student's name
    const mentionsOther = otherStudentNames.some(name => query.includes(name));
    const asksPrivateData = ['marks', 'grade', 'attendance', 'cgpa', 'score', 'failed', 'risk'].some(k => query.includes(k));

    return (mentionsOther && asksPrivateData) || otherKeywords.some(k => query.includes(k));
  }

  detectUnauthorizedAdminQuery(query) {
    const adminRestricted = [
      'budget', 'salary', 'salaries', 'faculty payroll', 'internal audit logs',
      'administrative password', 'admin credentials', 'server logs', 'disciplinary committee confidential'
    ];
    return adminRestricted.some(term => query.includes(term));
  }

  detectHighStakesInquiry(query) {
    const highStakesTerms = [
      'guarantee', 'will i pass', 'will i fail', 'will i be expelled', 'will i get placed',
      'guaranteed pass', 'certainty', 'can you promise', 'make the decision'
    ];
    return highStakesTerms.some(term => query.includes(term));
  }

  // ==========================================
  // STUDENT QUERY HANDLER
  // ==========================================

  async handleStudentQueries(query, studentId) {
    // Resolve student record
    let student = null;
    if (studentId) {
      student = await Student.findById(studentId);
    }
    if (!student) {
      student = await Student.findOne({ enrollmentNumber: '22BCA1042' }); // Default Aarav Sharma
    }

    if (!student) {
      return {
        reply: "I could not locate your student academic profile in the university database. Please check your credentials.",
        intent: INTENTS.FALLBACK,
        confidence: 0.1,
        suggestedFollowUps: ["Check student credentials"]
      };
    }

    // 1. Academic Performance Factors / Why did the model generate this?
    if (
      query.includes('affecting') ||
      query.includes('affect') ||
      query.includes('factors') ||
      query.includes('why did the model') ||
      query.includes('why is my predicted') ||
      query.includes('support indicator') ||
      (query.includes('explain') && query.includes('performance')) ||
      (query.includes('explain') && query.includes('risk'))
    ) {
      return await this.buildAcademicFactorsResponse(student);
    }

    // 2. Weak Subjects / Subjects needing attention
    if (
      query.includes('subjects need more attention') ||
      query.includes('weak subject') ||
      query.includes('lowest mark') ||
      query.includes('need more attention') ||
      query.includes('which subject') && (query.includes('attention') || query.includes('low') || query.includes('focus') || query.includes('lagging'))
    ) {
      return await this.buildWeakSubjectsResponse(student);
    }

    // 3. Attendance Status & Recovery
    if (
      query.includes('attendance') ||
      query.includes('shortage') ||
      query.includes('classes to attend') ||
      query.includes('attendance status') ||
      query.includes('consecutive classes')
    ) {
      return await this.buildAttendanceResponse(student);
    }

    // 4. Missing Skills / Skill Gaps for Career Goal
    if (
      query.includes('missing') ||
      query.includes('skill gap') ||
      query.includes('skills am i missing') ||
      query.includes('skills for') ||
      query.includes('readiness index') ||
      (query.includes('full stack') && query.includes('skill'))
    ) {
      return await this.buildSkillGapResponse(student, query);
    }

    // 5. Study Plan / What should I study this week?
    if (
      query.includes('what should i study') ||
      query.includes('study this week') ||
      query.includes('what to study') ||
      query.includes('weekly plan') ||
      query.includes('priority this week')
    ) {
      return await this.buildWeeklyStudyPlanResponse(student);
    }

    // 6. Why did the system recommend X?
    if (
      query.includes('why did the system recommend') ||
      query.includes('why recommend') ||
      query.includes('why am i seeing this recommendation') ||
      (query.includes('why') && query.includes('recommend'))
    ) {
      return await this.buildRecommendationWhyResponse(student, query);
    }

    // 7. Academic Trend / Historical Performance
    if (
      query.includes('academic trend') ||
      query.includes('performance trend') ||
      query.includes('cgpa trend') ||
      query.includes('gpa history') ||
      query.includes('show my academic trend') ||
      query.includes('trend')
    ) {
      return await this.buildAcademicTrendResponse(student);
    }

    // 8. Assignments Status / Overdue Work
    if (
      query.includes('assignment') ||
      query.includes('pending work') ||
      query.includes('overdue') ||
      query.includes('homework')
    ) {
      return await this.buildAssignmentsResponse(student);
    }

    // 9. Prediction & Risk Overview
    if (
      query.includes('risk') ||
      query.includes('prediction') ||
      query.includes('predict') ||
      query.includes('probabilistic indicator')
    ) {
      return await this.buildPredictionRiskResponse(student);
    }

    // 10. Career Goal & Learning Roadmap
    if (
      query.includes('career') ||
      query.includes('roadmap') ||
      query.includes('goal') ||
      query.includes('target role')
    ) {
      return await this.buildCareerRoadmapResponse(student);
    }

    // Fallback response required by prompt:
    return {
      reply: "I can currently help with your academic performance, attendance, assignments, skills, recommendations and career roadmap.",
      intent: INTENTS.FALLBACK,
      confidence: 0.95,
      suggestedFollowUps: [
        "What is affecting my academic performance?",
        "What subjects need more attention?",
        "What is my attendance status?",
        "What skills am I missing for Full Stack Development?"
      ]
    };
  }

  // ==========================================
  // STUDENT INTENT BUILDERS
  // ==========================================

  async buildAcademicFactorsResponse(student) {
    const attendance = await Attendance.find({ student: student._id });
    const marks = await Marks.find({ student: student._id });
    const assignments = await Assignment.find({ student: student._id });

    const overdueCount = assignments.filter(a => a.status === 'Overdue').length;
    const lowestMark = marks.sort((a, b) => a.totalMarks - b.totalMarks)[0];

    return {
      reply: `Based on your Semester 5 academic data, the predictive model evaluated your **Academic Support Indicator** as **${student.academicSupportIndicator || 'Medium'}**.\n\n### Primary Contributing Factors:\n\n1. **Attendance Rate (${student.attendance}%):** High contribution. Sitting at 68% (below the 75% institutional requirement), this contributed to the model prediction by shifting the support tier higher.\n2. **DSA & Algorithmic Performance (${lowestMark ? lowestMark.totalMarks : 58}%):** Medium contribution. Lower scores in internal evaluations contributed toward reducing the predicted GPA projection.\n3. **Assignment Completion (${student.assignmentCompletion}% with ${overdueCount} overdue):** Medium contribution. Late or pending submissions contributed to lower continuity scores.\n4. **Web Technologies Aptitude (84%):** Positive contribution. Strong project marks in Full Stack Web Tech contributed to stabilizing your overall standing.\n\n*Note: These factors contributed to the model prediction as probabilistic support indicators and do not represent deterministic causes.*`,
      intent: INTENTS.ACADEMIC_FACTORS,
      confidence: 0.94,
      factors: [
        { name: "Attendance Rate", value: `${student.attendance}%`, impact: "High contribution" },
        { name: "Assignment Completion", value: `${student.assignmentCompletion}%`, impact: "Medium contribution" },
        { name: "Recent Subject Score", value: `${lowestMark ? lowestMark.subjectName : 'DSA'}: ${lowestMark ? lowestMark.totalMarks : 58}%`, impact: "Medium contribution" },
        { name: "Previous Performance", value: `CGPA ${student.currentCgpa}`, impact: "Low contribution" }
      ],
      actionSuggestion: "Review your Attendance Recovery Sprint and submit the pending Dijkstra assignment for partial marks.",
      suggestedFollowUps: [
        "What subjects need more attention?",
        "What is my attendance status?",
        "What should I study this week?"
      ]
    };
  }

  async buildWeakSubjectsResponse(student) {
    const marks = await Marks.find({ student: student._id }).sort({ totalMarks: 1 });
    const attendance = await Attendance.find({ student: student._id });

    const weakSubjects = marks.filter(m => m.totalMarks < 70);

    let reply = `Here is an analysis of your academic performance across your enrolled subjects in **${student.shortProgram} Semester ${student.semester}**:\n\n### Subjects Requiring Attention:\n`;

    marks.forEach(m => {
      const att = attendance.find(a => a.subjectCode === m.subjectCode || (m.subject && a.subject && a.subject.toString() === m.subject.toString()));
      const attPercent = att ? `${att.percentage}%` : 'N/A';
      const statusIcon = m.totalMarks < 65 ? '🔴' : m.totalMarks < 75 ? '🟡' : '🟢';

      reply += `- ${statusIcon} **${m.subjectName} (${m.subjectCode || 'Core'})**: Score **${m.totalMarks}%** (Internal: ${m.internalMarks}/${m.maxInternalMarks}) | Attendance: **${attPercent}**\n`;
    });

    reply += `\n**Key Finding:** **${weakSubjects.length > 0 ? weakSubjects[0].subjectName : 'Data Structures & Algorithms II'}** has your lowest internal mark (58%), primarily impacted by lab attendance and 1 overdue programming assignment. Full Stack Web Technologies remains your strongest subject at 84%.`;

    return {
      reply,
      intent: INTENTS.WEAK_SUBJECTS,
      confidence: 0.96,
      factors: [
        { name: "Lowest Subject", value: `${weakSubjects[0]?.subjectName || 'DSA II'} (58%)`, impact: "High Priority" },
        { name: "Attendance Deficit Subject", value: "Computer Networks (48%)", impact: "Urgent" }
      ],
      actionSuggestion: "Attend the DSA Remedial Clinic on Thursday 4:00 PM with Dr. Sunita Kulkarni.",
      suggestedFollowUps: [
        "What is affecting my academic performance?",
        "What should I study this week?",
        "What is my attendance status?"
      ]
    };
  }

  async buildAttendanceResponse(student) {
    const records = await Attendance.find({ student: student._id });
    const overallAtt = student.attendance || 68;
    const isShortage = overallAtt < 75;

    let reply = `### Attendance Status Overview\n\n`;
    reply += `Your current overall attendance is **${overallAtt}%**, which is **${isShortage ? 'below the mandatory 75% university requirement' : 'in good standing'}**.\n\n`;
    reply += `| Subject | Attended / Total | Percentage | Standing |\n`;
    reply += `| :--- | :--- | :--- | :--- |\n`;

    records.forEach(r => {
      const standing = r.percentage >= 75 ? 'Safe' : r.percentage >= 65 ? 'Marginal' : 'Deficit';
      reply += `| ${r.subjectName || r.subjectCode} | ${r.attendedClasses} / ${r.totalClasses} | ${r.percentage}% | ${standing} |\n`;
    });

    // Calculate recovery classes
    // formula: (attended + x) / (total + x) >= 0.75 => x >= (0.75 * total - attended) / 0.25
    let totalClasses = 0;
    let attendedClasses = 0;
    records.forEach(r => {
      totalClasses += r.totalClasses;
      attendedClasses += r.attendedClasses;
    });

    const neededOverall = Math.max(0, Math.ceil((0.75 * totalClasses - attendedClasses) / 0.25));

    reply += `\n### Recovery Roadmap:\n`;
    reply += `- To reach or surpass **75% overall**, you must attend your next **${neededOverall > 0 ? neededOverall : 10} consecutive scheduled classes** without unexcused absences.\n`;
    reply += `- **Critical Subject:** Computer Networks (BCA-504) is currently at **48%**. Attending the next 7 classes in this course is critical for exam clearance.`;

    return {
      reply,
      intent: INTENTS.ATTENDANCE_STATUS,
      confidence: 0.98,
      factors: [
        { name: "Overall Attendance", value: `${overallAtt}%`, impact: isShortage ? "Below 75% Threshold" : "Safe" },
        { name: "Consecutive Sessions Required", value: `${neededOverall > 0 ? neededOverall : 10} classes`, impact: "High Priority" }
      ],
      actionSuggestion: "Activate attendance notifications and register your medical slip for Sept 24.",
      suggestedFollowUps: [
        "What subjects need more attention?",
        "What should I study this week?",
        "What is affecting my academic performance?"
      ]
    };
  }

  async buildSkillGapResponse(student, query) {
    let targetRole = student.careerGoal || 'Full Stack Developer';
    if (query.includes('data science') || query.includes('data analyst')) targetRole = 'Data Analyst / Data Scientist';
    else if (query.includes('devops') || query.includes('cloud')) targetRole = 'Cloud & DevOps Engineer';
    else if (query.includes('cybersecurity')) targetRole = 'Cybersecurity Analyst';
    else if (query.includes('ai') || query.includes('machine learning')) targetRole = 'AI / Machine Learning Engineer';

    const currentSkills = await Skill.find({ student: student._id });
    const gapAnalysis = skillGapService.analyzeSkillGap({
      currentSkills,
      careerTarget: targetRole
    });

    let reply = `### Skill Gap Analysis for Target Role: **${targetRole}**\n\n`;
    reply += `Your current **Role Readiness Index** is **${gapAnalysis.readinessPercentage}%**.\n\n`;
    reply += `| Skill | Current Level | Target Level | Deficit Gap | Priority |\n`;
    reply += `| :--- | :--- | :--- | :--- | :--- |\n`;

    gapAnalysis.skills.slice(0, 6).forEach(s => {
      reply += `| ${s.skill} | ${s.currentLevel}% | ${s.targetLevel}% | ${s.gap > 0 ? `-${s.gap}%` : '0%'} | **${s.priority}** |\n`;
    });

    const highGaps = gapAnalysis.skills.filter(s => s.priority === 'High');
    reply += `\n### Primary Competency Deficits:\n`;
    if (highGaps.length > 0) {
      highGaps.forEach(g => {
        reply += `- **${g.skill}** (Gap: -${g.gap}%): Priority **High**. ${g.action || 'Target proficiency requires project application.'}\n`;
      });
    } else {
      reply += `- You have achieved baseline proficiency across core target competencies.\n`;
    }

    reply += `\n*Scoring Formula: Gap = max(0, Target - Current). Priority is High if Gap >= 30% or critical prerequisite with Gap >= 20%.*`;

    return {
      reply,
      intent: INTENTS.SKILL_GAPS,
      confidence: 0.97,
      factors: [
        { name: "Target Career", value: targetRole, impact: "Target" },
        { name: "Readiness Index", value: `${gapAnalysis.readinessPercentage}%`, impact: "Overall Score" },
        { name: "Highest Priority Gap", value: highGaps[0]?.skill || "System Design Basics", impact: "High Priority" }
      ],
      actionSuggestion: `Enroll in the ${highGaps[0]?.skill || 'Node.js'} guided learning path in your Learning Roadmap.`,
      suggestedFollowUps: [
        `Why did the system recommend ${highGaps[0]?.skill || 'Node.js'}?`,
        "What should I study this week?",
        "Show my academic trend."
      ]
    };
  }

  async buildWeeklyStudyPlanResponse(student) {
    const assignments = await Assignment.find({ student: student._id });
    const overdue = assignments.filter(a => a.status === 'Overdue');
    const pending = assignments.filter(a => a.status === 'Pending');

    return {
      reply: `### Recommended Weekly Study Plan (Week 5 Focus)\n\nBased on your active backlog, skill gaps, and upcoming deadlines, here is your prioritized plan:\n\n1. **High Priority (Immediate Action):**\n   - **Submit Overdue Dijkstra Assignment (BCA-505):** Complete the minimum spanning tree implementation today to recover partial assessment points.\n   - **Attend DSA Remedial Clinic:** Thursday 4:00 PM with Dr. Sunita Kulkarni to reinforce graph algorithms.\n\n2. **Medium Priority (Academic & Skills):**\n   - **Full Stack Authentication Sprint (BCA-501):** Build JWT-based middleware in Express to bridge your Node.js skill gap (-12%).\n   - **Computer Networks Attendance Clearance:** Ensure 100% attendance in Monday & Wednesday lectures to begin your attendance recovery.\n\n3. **Career Track Milestone:**\n   - Dedicate 3 hours this weekend to Milestone 1 of your **Full Stack Roadmap** (MongoDB aggregation pipeline & Schema design).`,
      intent: INTENTS.STUDY_RECOMMENDATION,
      confidence: 0.95,
      factors: [
        { name: "Overdue Submissions", value: `${overdue.length} tasks`, impact: "Urgent" },
        { name: "Priority Skill Track", value: "Node.js & Graph Traversal", impact: "High" }
      ],
      actionSuggestion: "Start with the Dijkstra graph assignment before Thursday's clinical session.",
      suggestedFollowUps: [
        "Why did the system recommend Node.js?",
        "What is my attendance status?",
        "What skills am I missing for Full Stack Development?"
      ]
    };
  }

  async buildRecommendationWhyResponse(student, query) {
    const isNodeJs = query.includes('node') || query.includes('backend');

    if (isNodeJs) {
      return {
        reply: `### Why did the system recommend Node.js?\n\n**Explicit Rationale:**\n1. **Career Target Alignment:** Your selected career track is **Full Stack Developer**, which designates **Node.js, Express.js & REST APIs** as a foundational core competency with a benchmark target of **80%**.\n2. **Competency Assessment Gap:** Your assessed skill level in Node.js/Backend is currently **68%**, yielding a **12% proficiency deficit**.\n3. **Curricular Synergy:** You are currently enrolled in **BCA-501 (Full Stack Web Technologies)**. Completing the recommended Node.js authentication module simultaneously improves your course grade and bridges your placement readiness index.\n\n*All recommendations are generated deterministically by correlating your curriculum marks, career targets, and assessed skill gaps.*`,
        intent: INTENTS.RECOMMENDATION_WHY,
        confidence: 0.98,
        factors: [
          { name: "Target Benchmark", value: "80% (Full Stack Developer)", impact: "Core Requirement" },
          { name: "Current Level", value: "68%", impact: "12% Deficit" },
          { name: "Associated Course", value: "BCA-501 (Full Stack Web)", impact: "Direct Academic Impact" }
        ],
        actionSuggestion: "Access Module 2 of your Learning Roadmap to begin the Node.js JWT practical.",
        suggestedFollowUps: [
          "What should I study this week?",
          "What skills am I missing for Full Stack Development?",
          "What is affecting my academic performance?"
        ]
      };
    }

    // Generic recommendation rationale
    return {
      reply: `### Why are you seeing your personalized recommendations?\n\nCampusMind X correlates five live data signals to generate recommendations:\n1. **Academic Weaknesses:** Subjects where marks fall below 65% trigger revision clinics and TA sessions (e.g., DSA II at 58%).\n2. **Attendance Deficits:** Courses with attendance below 75% generate consecutive attendance recovery targets (e.g., Computer Networks at 48%).\n3. **Assignment Backlog:** Overdue or pending homework items generate urgent submission alerts (e.g., Dijkstra algorithm assignment).\n4. **Skill Deficits:** Missing technologies needed for your target career role generate targeted learning paths.\n5. **Career Milestones:** Projects required for technical recruitment screening.\n\nEvery recommendation card in your portal specifies the explicit rule that triggered it.`,
      intent: INTENTS.RECOMMENDATION_WHY,
      confidence: 0.95,
      factors: [
        { name: "Recommendation Logic", value: "Multi-factor correlation", impact: "Deterministic Rules" }
      ],
      actionSuggestion: "Visit your Learning Roadmap to view week-by-week actionable milestones.",
      suggestedFollowUps: [
        "What should I study this week?",
        "What is affecting my academic performance?"
      ]
    };
  }

  async buildAcademicTrendResponse(student) {
    return {
      reply: `### Academic Performance Trend: Aarav Sharma\n\nHere is your semester-by-semester CGPA trajectory:\n\n- **Semester 1:** 7.10 CGPA (Foundations)\n- **Semester 2:** 7.30 CGPA (+0.20)\n- **Semester 3:** 7.50 CGPA (+0.20)\n- **Semester 4:** 7.60 CGPA (+0.10)\n- **Semester 5 (Current):** **7.42 CGPA** (-0.18 dip)\n- **Semester 5 (AI Predicted):** **7.20 CGPA** (Ridge Regression Model, Confidence: 89%)\n\n### Trend Interpretation:\nYour academic trajectory showed steady improvement through Semesters 1–4. The slight dip in Semester 5 (7.42 current, projected 7.20) is primarily correlated with Data Structures II internal scores (58%) and attendance drops in Computer Networks. Implementing the suggested remedial clinics can help restore your trajectory above 7.50+.`,
      intent: INTENTS.ACADEMIC_TREND,
      confidence: 0.96,
      factors: [
        { name: "Historical Peak", value: "7.60 CGPA (Sem 4)", impact: "Benchmark" },
        { name: "Current CGPA", value: "7.42", impact: "Active" },
        { name: "Projected CGPA", value: "7.20 (±0.3)", impact: "Ridge Regression" }
      ],
      actionSuggestion: "Focus on upcoming internal tests in DSA and DBMS to prevent the projected dip.",
      suggestedFollowUps: [
        "What is affecting my academic performance?",
        "What subjects need more attention?",
        "What should I study this week?"
      ]
    };
  }

  async buildAssignmentsResponse(student) {
    const assignments = await Assignment.find({ student: student._id }).sort({ dueDate: 1 });

    let reply = `### Assignment Status & Deadlines\n\n`;
    assignments.forEach(a => {
      const statusEmoji = a.status === 'Overdue' ? '⚠️' : a.status === 'Pending' ? '⏳' : '✅';
      const dueStr = new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      reply += `- ${statusEmoji} **${a.title}** (${a.subjectName}): Status **${a.status}** | Due: **${dueStr}**\n`;
    });

    const overdue = assignments.filter(a => a.status === 'Overdue');
    if (overdue.length > 0) {
      reply += `\n**Urgent Action Required:** You have **${overdue.length} overdue assignment** (*${overdue[0].title}*). Late submissions are accepted for partial credit until Friday.`;
    }

    return {
      reply,
      intent: INTENTS.ASSIGNMENTS,
      confidence: 0.97,
      factors: [
        { name: "Overdue Tasks", value: `${overdue.length} task`, impact: "Immediate Priority" },
        { name: "Total Tracked", value: `${assignments.length} assignments`, impact: "Active" }
      ],
      actionSuggestion: "Submit the Dijkstra Implementation to Prof. Sunita Kulkarni's portal.",
      suggestedFollowUps: [
        "What should I study this week?",
        "What is affecting my academic performance?"
      ]
    };
  }

  async buildPredictionRiskResponse(student) {
    return {
      reply: `### Predictive Academic Risk Overview\n\n- **Academic Support Indicator:** **${student.academicSupportIndicator || 'Medium'}**\n- **Estimated Risk Score:** **${student.riskScore || 48}/100**\n- **Predicted Semester CGPA:** **${student.predictedSemesterCgpa || 7.2}** (Range: 6.9 - 7.5)\n- **Model Confidence:** **88.6%** (Evaluated using Random Forest & Ridge Regression models)\n\n### Model Interpretation:\nThe model flagged your profile for **Medium Academic Support** primarily due to attendance in Computer Networks (48%) and internal assessment scores in DSA (58%). This indicator is designed for **early intervention**, allowing you to clear deficits well before end-semester examinations.\n\n*Ethical Notice: AI predictions are probabilistic pattern indicators for student support, not automated academic decisions.*`,
      intent: INTENTS.PREDICTION_RISK,
      confidence: 0.95,
      factors: [
        { name: "Support Indicator", value: student.academicSupportIndicator || "Medium", impact: "Active Monitoring" },
        { name: "Risk Score", value: `${student.riskScore || 48}/100`, impact: "Moderate" }
      ],
      actionSuggestion: "Review your Explainable AI modal on your Student Dashboard for full feature breakdown.",
      suggestedFollowUps: [
        "What is affecting my academic performance?",
        "What is my attendance status?",
        "What should I study this week?"
      ]
    };
  }

  async buildCareerRoadmapResponse(student) {
    return {
      reply: `### Career Roadmap: **${student.careerGoal || 'Full Stack Developer'}**\n\nYour 12-week roadmap is organized into 4 progressive phases:\n\n- **Phase 1 (Weeks 1–3):** Foundation & Remedial Algorithms (*Active: Graph Traversals & Dijkstra*)\n- **Phase 2 (Weeks 4–6):** Backend Scalability & REST APIs (*JWT Auth, MongoDB Aggregation*)\n- **Phase 3 (Weeks 7–9):** Cloud, Containers & CI/CD (*Docker basics, GitHub Actions*)\n- **Phase 4 (Weeks 10–12):** End-to-End Production Capstone & Placement Prep\n\n**Current Progress:** You are on **Week 5**. Next recommended milestone: *Build REST API with Express & JWT Authentication*.`,
      intent: INTENTS.CAREER_ROADMAP,
      confidence: 0.96,
      factors: [
        { name: "Target Goal", value: student.careerGoal || "Full Stack Developer", impact: "Active Goal" },
        { name: "Current Milestone", value: "Week 5: Backend API Architecture", impact: "In Progress" }
      ],
      actionSuggestion: "Check off your completed roadmap items on your Learning Roadmap page.",
      suggestedFollowUps: [
        "What skills am I missing for Full Stack Development?",
        "What should I study this week?",
        "Why did the system recommend Node.js?"
      ]
    };
  }

  // ==========================================
  // FACULTY QUERY HANDLERS
  // ==========================================

  async handleFacultyQueries(query, facultyId) {
    const students = await Student.find({});
    const faculty = facultyId ? await Faculty.findById(facultyId) : await Faculty.findOne({});

    // 1. Which students need attention?
    if (
      query.includes('students need attention') ||
      query.includes('which students') ||
      query.includes('at-risk students') ||
      query.includes('who needs help') ||
      query.includes('high risk')
    ) {
      const atRisk = students.filter(s => s.riskLevel === 'High' || s.academicSupportIndicator === 'High' || s.attendance < 65);
      const mediumRisk = students.filter(s => s.riskLevel === 'Medium' || s.academicSupportIndicator === 'Medium');

      let reply = `### Cohort Monitoring: Students Requiring Faculty Attention\n\n`;
      reply += `From your BCA Semester 5 cohort (${students.length} students monitored), **${atRisk.length} students require immediate attention** and **${mediumRisk.length} require active monitoring**:\n\n`;
      reply += `#### 🚨 High Priority Interventions:\n`;

      atRisk.forEach(s => {
        reply += `- **${s.name} (${s.enrollmentNumber})**: Risk Score **${s.riskScore}/100** | Attendance: **${s.attendance}%** | Aggregate: **${s.overallPerformance}%**\n  *Key Driver:* Critical attendance deficit & multiple overdue lab submissions.\n`;
      });

      reply += `\n#### ⚠️ Moderate Monitoring:\n`;
      mediumRisk.slice(0, 2).forEach(s => {
        reply += `- **${s.name} (${s.enrollmentNumber})**: Attendance: **${s.attendance}%** | Aggregate: **${s.overallPerformance}%**\n  *Key Driver:* DSA internal assessment deficit (58%) & BCA-504 attendance drop.\n`;
      });

      return {
        reply,
        intent: INTENTS.FACULTY_STUDENTS_NEED_ATTENTION,
        confidence: 0.98,
        factors: [
          { name: "Critical Students", value: `${atRisk.length} students`, impact: "High Priority" },
          { name: "Moderate Students", value: `${mediumRisk.length} students`, impact: "Medium Priority" }
        ],
        actionSuggestion: "Schedule group academic advisory clinic for students with attendance < 65%.",
        suggestedFollowUps: [
          "What is the class attendance trend?",
          "Which subject has the lowest average performance?",
          "Give me an overview of the BCA cohort"
        ]
      };
    }

    // 2. Class Attendance Trend
    if (
      query.includes('class attendance trend') ||
      query.includes('attendance trend') ||
      query.includes('attendance average') ||
      query.includes('how is attendance')
    ) {
      const avgAtt = Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length);
      const below75 = students.filter(s => s.attendance < 75).length;

      return {
        reply: `### Class Attendance Trend: BCA Semester 5\n\n- **Cohort Average Attendance:** **${avgAtt}%** (Benchmark: 75%)\n- **Students Below 75% Threshold:** **${below75} of ${students.length} students (${Math.round((below75 / students.length) * 100)}%)**\n\n#### Course-Wise Attendance Overview:\n- **Software Engineering (BCA-503):** 84.6% (Highest)\n- **Database Management Systems (BCA-502):** 76.2% (Satisfactory)\n- **Full Stack Web Tech (BCA-501):** 74.8% (Marginal)\n- **Data Structures II (BCA-505):** 69.4% (Marginal Deficit)\n- **Computer Networks (BCA-504):** **62.8% (Lowest - Immediate Intervention Required)**\n\n*Recommendation: Trigger automated attendance shortage warnings to parents and students in BCA-504.*`,
        intent: INTENTS.FACULTY_ATTENDANCE_TREND,
        confidence: 0.97,
        factors: [
          { name: "Cohort Average", value: `${avgAtt}%`, impact: "Benchmark 75%" },
          { name: "Lowest Course", value: "Computer Networks (62.8%)", impact: "Urgent" }
        ],
        actionSuggestion: "Export attendance shortage list for Academic Dean review.",
        suggestedFollowUps: [
          "Which students need attention?",
          "Which subject has the lowest average performance?",
          "Give me an overview of the BCA cohort"
        ]
      };
    }

    // 3. Lowest Average Performing Subject
    if (
      query.includes('lowest average performance') ||
      query.includes('lowest performing subject') ||
      query.includes('subject has the lowest') ||
      query.includes('which subject')
    ) {
      return {
        reply: `### Subject Performance Evaluation: BCA Semester 5\n\nBased on internal evaluations and continuous assessments across the cohort:\n\n1. **Computer Networks & Protocols (BCA-504):** **64.2% Class Average** (Lowest)\n   - *Bottleneck:* Socket programming practicals & routing protocol theory.\n2. **Data Structures & Algorithms II (BCA-505):** **68.5% Class Average**\n   - *Bottleneck:* Graph traversal implementations and dynamic programming complexity.\n3. **Database Management Systems (BCA-502):** **74.1% Class Average**\n4. **Full Stack Web Technologies (BCA-501):** **79.4% Class Average**\n5. **Software Engineering & Agile (BCA-503):** **82.6% Class Average** (Highest)\n\n*Actionable Suggestion: Schedule joint tutorial sessions between Computer Networks and DSA teaching assistants.*`,
        intent: INTENTS.FACULTY_LOWEST_PERFORMING_SUBJECT,
        confidence: 0.98,
        factors: [
          { name: "Lowest Average Subject", value: "Computer Networks (64.2%)", impact: "Critical" },
          { name: "Secondary Deficit", value: "DSA II (68.5%)", impact: "Moderate" }
        ],
        actionSuggestion: "Review mid-term quiz question difficulty for BCA-504.",
        suggestedFollowUps: [
          "Which students need attention?",
          "What is the class attendance trend?",
          "Give me an overview of the BCA cohort"
        ]
      };
    }

    // 4. Cohort Overview
    return {
      reply: `### BCA Semester 5 Faculty Cohort Overview\n\n- **Monitored Students:** **${students.length} students**\n- **Cohort Mean Performance:** **73.4%**\n- **Cohort Mean Attendance:** **68.4%**\n- **Support Distribution:** 40% Low Support, 40% Medium Support, 20% High Support\n- **Active Interventions:** 6 ongoing remedial clinics & attendance recovery sprints.\n\nHow can I assist you with student monitoring or course analytics today?`,
      intent: INTENTS.FACULTY_COHORT_SUMMARY,
      confidence: 0.94,
      suggestedFollowUps: [
        "Which students need attention?",
        "What is the class attendance trend?",
        "Which subject has the lowest average performance?"
      ]
    };
  }

  // ==========================================
  // ADMIN QUERY HANDLERS
  // ==========================================

  async handleAdminQueries(query) {
    // 1. Department Comparison / Highest Retention
    if (
      query.includes('department') ||
      query.includes('highest retention') ||
      query.includes('compare') ||
      query.includes('comparison')
    ) {
      return {
        reply: `### Department Comparative Performance & Retention\n\n1. **School of Computer Science & Engineering (SCSE):**\n   - Mean Performance: **81.2%** | Attendance: **79.5%** | Retention: **96.1%**\n2. **School of Computing & IT (SOCIT):**\n   - Mean Performance: **78.4%** | Attendance: **74.5%** | Retention: **94.8%**\n3. **School of Electronics & Communication (SECE):**\n   - Mean Performance: **76.1%** | Attendance: **72.8%** | Retention: **93.2%**\n4. **School of Management Studies (SMS):**\n   - Mean Performance: **75.3%** | Attendance: **76.0%** | Retention: **92.7%**\n\n*SOCIT (BCA/MCA) maintains strong software capstone placement rates, while attendance compliance is flagged for enhanced automated reminders.*`,
        intent: INTENTS.ADMIN_DEPARTMENT_PERFORMANCE,
        confidence: 0.96,
        factors: [
          { name: "Top Department", value: "SCSE (81.2% Performance)", impact: "Exemplary" },
          { name: "Intervention Focus", value: "SOCIT Attendance (74.5%)", impact: "Advisory" }
        ],
        actionSuggestion: "Conduct Dean-level review on attendance compliance in Computing.",
        suggestedFollowUps: [
          "What is the university academic health?"
        ]
      };
    }

    // 2. University Overview
    return {
      reply: `### University Academic Health & Intelligence Overview\n\n- **Total University Enrollment:** **1,420 students** across 8 departments\n- **Institutional Student Retention Rate:** **94.2%** (+1.4% vs previous academic year)\n- **Overall Pass Percentage:** **88.6%**\n- **Predictive Support Distribution:**\n  - **Low Risk (On Track):** 68% (965 students)\n  - **Medium Risk (Early Monitoring):** 22% (312 students)\n  - **High Risk (Targeted Intervention):** 10% (143 students)\n- **Active AI-Assisted Interventions:** 128 campus-wide peer & faculty remedial clinics.\n\n*Privacy Notice: Aggregate analytics protect individual student data privacy in compliance with institutional policies.*`,
      intent: INTENTS.ADMIN_UNIVERSITY_OVERVIEW,
      confidence: 0.98,
      factors: [
        { name: "Total Enrollment", value: "1,420 students", impact: "Scale" },
        { name: "Retention Rate", value: "94.2%", impact: "Healthy" },
        { name: "High Support Tier", value: "10% (143 students)", impact: "Monitored" }
      ],
      actionSuggestion: "Review department intervention budgets for next quarter.",
      suggestedFollowUps: [
        "Which department has the highest retention and performance?",
        "What is the university academic health?"
      ]
    };
  }


  // ==========================================
  // SAFETY & PRIVACY RESPONSE HANDLERS
  // ==========================================

  handlePrivacyBreachResponse() {
    return {
      reply: `🛡️ **Access Restricted: Student Privacy Protection**\n\nYou are only authorized to access your own academic records, attendance logs, and personalized explainable AI predictions.\n\nUnder university policy and student data privacy regulations, **individual grades, attendance records, and risk indicators of classmates or peers cannot be disclosed**.\n\n*How can I assist you with your own academic performance or career roadmap?*`,
      intent: INTENTS.PRIVACY_BREACH_ATTEMPT,
      confidence: 1.0,
      factors: [
        { name: "Privacy Protocol", value: "FERPA / Institutional Compliance", impact: "Enforced" }
      ],
      actionSuggestion: "Ask questions regarding your own academic status.",
      suggestedFollowUps: [
        "What is affecting my academic performance?",
        "What is my attendance status?",
        "What subjects need more attention?"
      ]
    };
  }

  handleUnauthorizedAdminResponse() {
    return {
      reply: `🔒 **Permission Denied: Administrative Clearance Required**\n\nThe information requested involves institutional administration, payroll, or confidential server operations. Your account role (**Student**) does not possess administrative access permissions.\n\nIf you require administrative assistance, please contact the **Office of Academic Affairs** or your Faculty Advisor.`,
      intent: INTENTS.UNAUTHORIZED_ADMIN_DATA,
      confidence: 1.0,
      actionSuggestion: "Return to student academic queries.",
      suggestedFollowUps: [
        "What is affecting my academic performance?",
        "What is my attendance status?"
      ]
    };
  }

  handleHighStakesResponse(studentId) {
    return {
      reply: `⚖️ **AI Ethical Disclaimer & Probabilistic Guidance**\n\nCampusMind AI **cannot make definitive promises, pass/fail guarantees, or high-stakes academic determinations**.\n\nOur machine-learning models generate **probabilistic pattern indicators** strictly to support you and your faculty in identifying academic risks early. Real academic outcomes depend on:\n- Official end-semester examination scores\n- Laboratory practical submissions\n- University board regulations and attendance eligibility clearance\n\nWe encourage you to review your current predictions as constructive guidance to focus your revision.`,
      intent: INTENTS.SAFETY_HIGH_STAKES,
      confidence: 0.99,
      factors: [
        { name: "Guidance Nature", value: "Probabilistic Support Indicator", impact: "Non-Deterministic" }
      ],
      actionSuggestion: "Consult your advisor Dr. Sunita Kulkarni for formal academic evaluation inquiries.",
      suggestedFollowUps: [
        "What is affecting my academic performance?",
        "What subjects need more attention?",
        "What is my attendance status?"
      ]
    };
  }
}

export const campusMindAiService = new CampusMindAiService();
