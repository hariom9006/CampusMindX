/**
 * CampusMind X - Faculty Class Analysis Engine
 * Calculates class-level intelligence, support indicators, transparent feature attribution,
 * recommendations, action plans, and AI assistant grounding.
 */

export function analyzeClassPerformance(students = [], performanceTarget = 65) {
  if (!students || students.length === 0) {
    return {
      totalStudents: 0,
      classAverage: 0,
      highestScore: 0,
      lowestScore: 0,
      highestStudent: null,
      lowestStudent: null,
      scoreDistribution: [
        { range: '90-100%', count: 0, label: 'Excellent' },
        { range: '75-89%', count: 0, label: 'Proficient' },
        { range: '60-74%', count: 0, label: 'Competent' },
        { range: '<60%', count: 0, label: 'Requires Attention' }
      ],
      studentsBelowTarget: [],
      highPerformingStudents: []
    };
  }

  let totalScore = 0;
  let highestScore = -1;
  let lowestScore = 999;
  let highestStudent = null;
  let lowestStudent = null;

  const distribution = {
    '90-100%': 0,
    '75-89%': 0,
    '60-74%': 0,
    '<60%': 0
  };

  const studentsBelowTarget = [];
  const highPerformingStudents = [];

  students.forEach((s) => {
    const max = Number(s.maxMarks) || 100;
    const score = Number(s.totalMarks) || 0;
    const pct = Math.round((score / max) * 100);

    totalScore += pct;

    if (pct > highestScore) {
      highestScore = pct;
      highestStudent = { name: s.name, rollNo: s.rollNo, score: pct };
    }
    if (pct < lowestScore) {
      lowestScore = pct;
      lowestStudent = { name: s.name, rollNo: s.rollNo, score: pct };
    }

    if (pct >= 90) distribution['90-100%']++;
    else if (pct >= 75) distribution['75-89%']++;
    else if (pct >= 60) distribution['60-74%']++;
    else distribution['<60%']++;

    if (pct < performanceTarget) {
      studentsBelowTarget.push({ ...s, calculatedPct: pct });
    }
    if (pct >= 80) {
      highPerformingStudents.push({ ...s, calculatedPct: pct });
    }
  });

  const classAverage = Math.round(totalScore / students.length);

  return {
    totalStudents: students.length,
    classAverage,
    highestScore: highestScore === -1 ? 0 : highestScore,
    lowestScore: lowestScore === 999 ? 0 : lowestScore,
    highestStudent,
    lowestStudent,
    scoreDistribution: [
      { range: '90-100%', count: distribution['90-100%'], label: 'Excellent' },
      { range: '75-89%', count: distribution['75-89%'], label: 'Proficient' },
      { range: '60-74%', count: distribution['60-74%'], label: 'Competent' },
      { range: '<60%', count: distribution['<60%'], label: 'Requires Attention' }
    ],
    studentsBelowTarget,
    highPerformingStudents
  };
}

export function analyzeClassAttendance(students = [], attendanceTarget = 75) {
  if (!students || students.length === 0) {
    return {
      averageAttendance: 0,
      studentsBelowTarget: [],
      studentsHealthy: [],
      distribution: {
        healthy: 0,
        needsAttention: 0,
        critical: 0
      }
    };
  }

  let totalAttPct = 0;
  const belowTarget = [];
  const healthyStudents = [];
  let healthyCount = 0;
  let needsAttentionCount = 0;
  let criticalCount = 0;

  students.forEach((s) => {
    const totalClasses = Number(s.totalClasses) || 1;
    const attended = Number(s.attendedClasses) || 0;
    const pct = Math.round((attended / totalClasses) * 100);
    totalAttPct += pct;

    let status = 'Healthy';
    if (pct < 60) {
      status = 'Critical';
      criticalCount++;
    } else if (pct < attendanceTarget) {
      status = 'Needs Attention';
      needsAttentionCount++;
    } else {
      healthyCount++;
    }

    const studentWithAtt = { ...s, attendancePct: pct, attendanceStatus: status };

    if (pct < attendanceTarget) {
      belowTarget.push(studentWithAtt);
    } else {
      healthyStudents.push(studentWithAtt);
    }
  });

  const averageAttendance = Math.round(totalAttPct / students.length);

  return {
    averageAttendance,
    studentsBelowTarget: belowTarget,
    studentsHealthy: healthyStudents,
    distribution: {
      healthy: healthyCount,
      needsAttention: needsAttentionCount,
      critical: criticalCount
    }
  };
}

export function analyzeClassAssignments(students = [], assignmentTarget = 70) {
  if (!students || students.length === 0) {
    return {
      averageCompletion: 0,
      totalAssigned: 0,
      totalCompleted: 0,
      totalPending: 0,
      totalOverdue: 0,
      studentsBelowTarget: []
    };
  }

  let totalCompletedAll = 0;
  let totalAssignedAll = 0;
  let totalPendingAll = 0;
  let totalOverdueAll = 0;
  const belowTarget = [];

  students.forEach((s) => {
    const total = Number(s.totalAssignments) || 0;
    const completed = Number(s.completedAssignments) || 0;
    const pending = Number(s.pendingAssignments) || 0;
    const overdue = Number(s.overdueAssignments) || 0;

    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    totalAssignedAll += total;
    totalCompletedAll += completed;
    totalPendingAll += pending;
    totalOverdueAll += overdue;

    if (pct < assignmentTarget) {
      belowTarget.push({ ...s, assignmentPct: pct });
    }
  });

  const averageCompletion =
    totalAssignedAll > 0 ? Math.round((totalCompletedAll / totalAssignedAll) * 100) : 0;

  return {
    averageCompletion,
    totalAssigned: totalAssignedAll,
    totalCompleted: totalCompletedAll,
    totalPending: totalPendingAll,
    totalOverdue: totalOverdueAll,
    studentsBelowTarget: belowTarget
  };
}

export function calculateStudentSupportIndicators(
  students = [],
  thresholds = { attendanceTarget: 75, performanceTarget: 65, assignmentTarget: 70 }
) {
  return students.map((s) => {
    const maxMarks = Number(s.maxMarks) || 100;
    const totalMarks = Number(s.totalMarks) || 0;
    const perfPct = Math.round((totalMarks / maxMarks) * 100);

    const totalClasses = Number(s.totalClasses) || 1;
    const attended = Number(s.attendedClasses) || 0;
    const attPct = Math.round((attended / totalClasses) * 100);

    const totalAssign = Number(s.totalAssignments) || 1;
    const completedAssign = Number(s.completedAssignments) || 0;
    const assignPct = Math.round((completedAssign / totalAssign) * 100);

    // Rule-based prototype composite score:
    // Attendance 35%, Performance 30%, Assignments 20%, Assessment balance 15%
    const compositeRisk =
      (100 - attPct) * 0.35 +
      (100 - perfPct) * 0.30 +
      (100 - assignPct) * 0.20 +
      (s.overdueAssignments > 0 ? 15 : 0);

    let indicator = 'Low Attention';
    let indicatorColor = 'emerald';
    let riskLevel = 'Low';

    if (compositeRisk >= 35 || attPct < 60 || perfPct < 55) {
      indicator = 'High Attention';
      indicatorColor = 'red';
      riskLevel = 'High';
    } else if (
      compositeRisk >= 22 ||
      attPct < thresholds.attendanceTarget ||
      perfPct < thresholds.performanceTarget ||
      assignPct < thresholds.assignmentTarget
    ) {
      indicator = 'Moderate Attention';
      indicatorColor = 'amber';
      riskLevel = 'Moderate';
    }

    // Reasons explaining why the student was flagged
    const flagReasons = [];
    if (attPct < 60) {
      flagReasons.push(`Critical attendance level at ${attPct}% (well below ${thresholds.attendanceTarget}% threshold).`);
    } else if (attPct < thresholds.attendanceTarget) {
      flagReasons.push(`Attendance at ${attPct}% is below the course minimum of ${thresholds.attendanceTarget}%.`);
    }

    if (perfPct < thresholds.performanceTarget) {
      flagReasons.push(`Cumulative performance is ${perfPct}%, below the ${thresholds.performanceTarget}% pass threshold.`);
    }

    if (s.overdueAssignments > 0) {
      flagReasons.push(`${s.overdueAssignments} assignment(s) currently recorded as overdue.`);
    } else if (assignPct < thresholds.assignmentTarget) {
      flagReasons.push(`Assignment submission rate is ${assignPct}%, lagging behind class expectations.`);
    }

    if (flagReasons.length === 0) {
      flagReasons.push('Performance, attendance, and coursework submission are within healthy parameters.');
    }

    return {
      ...s,
      calculatedPerfPct: perfPct,
      calculatedAttPct: attPct,
      calculatedAssignPct: assignPct,
      compositeRisk: Math.round(compositeRisk),
      indicator,
      indicatorColor,
      riskLevel,
      flagReasons
    };
  });
}

export function analyzeTopicPerformance(topics = []) {
  if (!topics || topics.length === 0) return null;

  const analyzed = topics.map((t) => {
    const max = Number(t.maxMarks) || 25;
    const avg = Number(t.avgMarks) || 0;
    const pct = Math.round((avg / max) * 100);
    return {
      name: t.name,
      avgMarks: avg,
      maxMarks: max,
      percentage: pct,
      status: pct >= 75 ? 'Strong Topic' : pct >= 65 ? 'Moderate' : 'Needs Revision'
    };
  });

  const sorted = [...analyzed].sort((a, b) => b.percentage - a.percentage);
  const strongTopics = sorted.filter((t) => t.percentage >= 70);
  const topicsNeedingAttention = sorted.filter((t) => t.percentage < 70);

  return {
    topics: analyzed,
    strongTopics,
    topicsNeedingAttention
  };
}

export function generateFacultyRecommendations(classMetrics, flaggedStudents = [], topicAnalysis = null) {
  const recommendations = [];

  // Attendance recommendation
  if (classMetrics.attendance.studentsBelowTarget.length > 0) {
    recommendations.push({
      id: 'rec-att',
      title: 'Attendance Follow-Up & Academic Advisory',
      priority: 'High',
      tag: 'Attendance Telemetry',
      reason: `${classMetrics.attendance.studentsBelowTarget.length} student(s) currently hold attendance below the configured ${classMetrics.thresholds.attendanceTarget}% target.`,
      action: 'Send automated attendance warning notifications and schedule quick 1-on-1 check-ins before semester condonation lock.'
    });
  }

  // Weak topic recommendation
  if (topicAnalysis && topicAnalysis.topicsNeedingAttention.length > 0) {
    const weakNames = topicAnalysis.topicsNeedingAttention.map((t) => t.name).join(', ');
    recommendations.push({
      id: 'rec-topic',
      title: 'Schedule Targeted Concept Revision Clinic',
      priority: 'High',
      tag: 'Curriculum Focus',
      reason: `Class-wide performance is notably lower in: ${weakNames}.`,
      action: 'Conduct a 45-minute interactive revision workshop or share tutorial walkthrough modules before mid-term assessments.'
    });
  } else if (classMetrics.academic.studentsBelowTarget.length > 0) {
    recommendations.push({
      id: 'rec-perf',
      title: 'Remedial Academic Support Group',
      priority: 'Medium',
      tag: 'Subject Performance',
      reason: `${classMetrics.academic.studentsBelowTarget.length} student(s) are performing below the benchmark score of ${classMetrics.thresholds.performanceTarget}%.`,
      action: 'Form collaborative peer-study groups and offer targeted quiz re-evaluations.'
    });
  }

  // Assignment recommendation
  if (classMetrics.assignments.totalOverdue > 0 || classMetrics.assignments.studentsBelowTarget.length > 0) {
    recommendations.push({
      id: 'rec-assign',
      title: 'Coursework Deadline Grace & Submission Drive',
      priority: 'Medium',
      tag: 'Assignments',
      reason: `${classMetrics.assignments.totalOverdue} overdue assignment submission(s) recorded across the cohort.`,
      action: 'Open a 48-hour submission grace window with laboratory assistant support to resolve blocker questions.'
    });
  }

  // High performers enrichment
  if (classMetrics.academic.highPerformingStudents.length > 0) {
    recommendations.push({
      id: 'rec-enrich',
      title: 'Advance Projects for High-Performing Students',
      priority: 'Low',
      tag: 'Enrichment',
      reason: `${classMetrics.academic.highPerformingStudents.length} student(s) demonstrated advanced mastery (score >= 80%).`,
      action: 'Encourage participation in hackathons, research open-source projects, and advanced laboratory challenges.'
    });
  }

  return recommendations;
}

export function generateClassActionPlan(classMetrics, flaggedStudents = []) {
  const highAttentionCount = flaggedStudents.filter((s) => s.indicator === 'High Attention').length;

  return {
    thisWeek: [
      {
        task: 'Contact High-Attention Students',
        detail: `Conduct immediate counseling with ${highAttentionCount} flagged student(s) regarding attendance and submission gaps.`,
        done: false
      },
      {
        task: 'Review Lower-Scoring Concepts',
        detail: 'Dedicate the first 15 minutes of the next class to clarify questions from the latest quiz/lab evaluation.',
        done: false
      },
      {
        task: 'Issue Coursework Reminders',
        detail: `Notify students with ${classMetrics.assignments.totalPending} pending assignments before upcoming grade aggregation.`,
        done: false
      }
    ],
    nextWeek: [
      {
        task: 'Conduct Revision / Remedial Clinic',
        detail: 'Run an interactive tutorial session focused on practical problem-solving.',
        done: false
      },
      {
        task: 'Recheck Attendance Telemetry',
        detail: 'Verify whether borderline attendance students have recovered above 75%.',
        done: false
      },
      {
        task: 'Mid-Semester Progress Report',
        detail: 'Publish consolidated internal assessment marks and update cohort intervention records.',
        done: false
      }
    ]
  };
}

export function processFacultyChat(query, facultyData, classMetrics) {
  if (!facultyData || !classMetrics) {
    return "I don't have enough class data to answer that. Please ensure you have entered student and assessment details.";
  }

  const q = query.toLowerCase();
  const students = classMetrics.flaggedStudents || [];
  const highAttention = students.filter((s) => s.indicator === 'High Attention');
  const modAttention = students.filter((s) => s.indicator === 'Moderate Attention');

  if (q.includes('weakest') || q.includes('attention') || q.includes('who needs') || q.includes('flagged')) {
    if (highAttention.length === 0 && modAttention.length === 0) {
      return 'Great news! All entered students currently maintain scores, attendance, and coursework submissions within healthy thresholds.';
    }
    const names = highAttention.map((s) => `${s.name} (${s.rollNo} - ${s.indicator})`).join(', ');
    return `Based on your entered data, ${highAttention.length} student(s) require high attention: ${names}. Primarily influenced by attendance below the 75% target and pending coursework.`;
  }

  if (q.includes('average') || q.includes('performance') || q.includes('class score')) {
    return `The average performance of ${facultyData.facultyInfo.subject} (Section ${facultyData.facultyInfo.section}) is ${classMetrics.academic.classAverage}%. Highest score: ${classMetrics.academic.highestScore}% (${classMetrics.academic.highestStudent?.name || 'N/A'}), Lowest score: ${classMetrics.academic.lowestScore}% (${classMetrics.academic.lowestStudent?.name || 'N/A'}).`;
  }

  if (q.includes('attendance') || q.includes('shortage')) {
    const below = classMetrics.attendance.studentsBelowTarget;
    if (below.length === 0) {
      return `Class average attendance is healthy at ${classMetrics.attendance.averageAttendance}%. No students are currently below the ${classMetrics.thresholds.attendanceTarget}% target.`;
    }
    const names = below.map((s) => `${s.name} (${s.calculatedAttPct || s.attendancePct}%)`).join(', ');
    return `Class average attendance is ${classMetrics.attendance.averageAttendance}%. There are ${below.length} student(s) below the ${classMetrics.thresholds.attendanceTarget}% target: ${names}.`;
  }

  if (q.includes('assignment') || q.includes('pending') || q.includes('overdue')) {
    return `Overall assignment completion is ${classMetrics.assignments.averageCompletion}%. Across the class, there are ${classMetrics.assignments.totalCompleted} completed, ${classMetrics.assignments.totalPending} pending, and ${classMetrics.assignments.totalOverdue} overdue submission(s).`;
  }

  if (q.includes('topic') || q.includes('revision') || q.includes('concept')) {
    if (classMetrics.topics && classMetrics.topics.topicsNeedingAttention.length > 0) {
      const topics = classMetrics.topics.topicsNeedingAttention.map((t) => `${t.name} (${t.percentage}%)`).join(', ');
      return `Topics identified as needing revision based on assessment scores: ${topics}.`;
    }
    return `Based on current assessments, general concept understanding is solid. Reviewing fundamental topics before major examinations is always recommended.`;
  }

  if (q.includes('focus') || q.includes('week') || q.includes('action') || q.includes('plan')) {
    return `Top priorities this week: 1) Initiate 1-on-1 follow-up with the ${highAttention.length} high-attention student(s). 2) Issue reminders for the ${classMetrics.assignments.totalPending} pending assignments. 3) Schedule a 30-minute revision module on lower-scoring topics.`;
  }

  if (q.includes('explain') || q.includes('weight') || q.includes('why')) {
    return `CampusMind X support indicators use transparent Demo Contribution Weights: Attendance (35%), Academic Performance (30%), Assignment Completion (20%), and Assessment Balance (15%). These rule-based weights ensure early, non-punitive intervention before semester-end.`;
  }

  return `Based on ${facultyData.facultyInfo.facultyName}'s class data for ${facultyData.facultyInfo.subject}: Average performance is ${classMetrics.academic.classAverage}%, average attendance is ${classMetrics.attendance.averageAttendance}%, and ${highAttention.length} student(s) currently require proactive academic attention.`;
}

export function runFullFacultyAnalysis(facultyData) {
  if (!facultyData) return null;

  const thresholds = facultyData.thresholds || {
    attendanceTarget: 75,
    performanceTarget: 65,
    assignmentTarget: 70
  };

  const students = facultyData.students || [];

  const academic = analyzeClassPerformance(students, thresholds.performanceTarget);
  const attendance = analyzeClassAttendance(students, thresholds.attendanceTarget);
  const assignments = analyzeClassAssignments(students, thresholds.assignmentTarget);
  const flaggedStudents = calculateStudentSupportIndicators(students, thresholds);
  const topics = analyzeTopicPerformance(facultyData.topics || []);

  const classMetrics = {
    thresholds,
    academic,
    attendance,
    assignments,
    flaggedStudents,
    topics
  };

  const recommendations = generateFacultyRecommendations(classMetrics, flaggedStudents, topics);
  const actionPlan = generateClassActionPlan(classMetrics, flaggedStudents);

  return {
    classMetrics,
    recommendations,
    actionPlan,
    analyzedAt: new Date().toISOString()
  };
}

const facultyAnalysisService = {
  analyzeClassPerformance,
  analyzeClassAttendance,
  analyzeClassAssignments,
  calculateStudentSupportIndicators,
  analyzeTopicPerformance,
  generateFacultyRecommendations,
  generateClassActionPlan,
  processFacultyChat,
  runFullFacultyAnalysis
};

export default facultyAnalysisService;
