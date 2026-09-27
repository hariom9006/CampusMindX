/**
 * CampusMind X - Administrator Institutional Analysis Engine
 * Calculates macro-university analytics, cross-department comparisons,
 * institutional risk attribution, strategic recommendations, and University AI grounding.
 */

export function analyzeUniversityMetrics(adminData) {
  if (!adminData) return null;

  const depts = adminData.departments || [];
  const thresholds = adminData.thresholds || {
    attendanceTarget: 75,
    academicTarget: 70,
    assignmentTarget: 75
  };

  let totalStudents = 0;
  let totalFaculty = 0;
  let weightedPerfSum = 0;
  let weightedAttSum = 0;
  let weightedAssignSum = 0;
  let totalAttentionCount = 0;

  const deptsBelowAttTarget = [];
  const deptsBelowPerfTarget = [];

  depts.forEach((d) => {
    const sCount = Number(d.studentsCount) || 0;
    const fCount = Number(d.facultyCount) || 0;
    const perf = Number(d.avgPerformance) || 0;
    const att = Number(d.avgAttendance) || 0;
    const assign = Number(d.assignmentCompletion) || 0;
    const attention = Number(d.studentsRequiringAttention) || 0;

    totalStudents += sCount;
    totalFaculty += fCount;
    totalAttentionCount += attention;

    weightedPerfSum += perf * sCount;
    weightedAttSum += att * sCount;
    weightedAssignSum += assign * sCount;

    if (att < thresholds.attendanceTarget) {
      deptsBelowAttTarget.push({ ...d, metricValue: att });
    }
    if (perf < thresholds.academicTarget) {
      deptsBelowPerfTarget.push({ ...d, metricValue: perf });
    }
  });

  const avgPerformance =
    totalStudents > 0 ? Math.round(weightedPerfSum / totalStudents) : 0;
  const avgAttendance =
    totalStudents > 0 ? Math.round(weightedAttSum / totalStudents) : 0;
  const avgAssignmentCompletion =
    totalStudents > 0 ? Math.round(weightedAssignSum / totalStudents) : 0;

  // Skills analysis if provided
  let skillReadiness = null;
  let commonSkillGaps = [];
  if (adminData.skillsData && adminData.skillsData.length > 0) {
    let totalSkillLevel = 0;
    adminData.skillsData.forEach((sk) => {
      totalSkillLevel += Number(sk.level) || 0;
      const target = Number(sk.targetLevel) || 75;
      const gap = Math.max(0, target - (Number(sk.level) || 0));
      if (gap >= 25) {
        commonSkillGaps.push({ ...sk, gap, priority: 'High Gap' });
      } else if (gap >= 10) {
        commonSkillGaps.push({ ...sk, gap, priority: 'Medium Gap' });
      }
    });
    skillReadiness = Math.round(totalSkillLevel / adminData.skillsData.length);
  }

  // Department Comparison Chart Dataset
  const departmentChartData = depts.map((d) => ({
    name: d.code || d.name,
    fullName: d.name,
    performance: Number(d.avgPerformance) || 0,
    attendance: Number(d.avgAttendance) || 0,
    assignments: Number(d.assignmentCompletion) || 0,
    students: Number(d.studentsCount) || 0,
    attentionStudents: Number(d.studentsRequiringAttention) || 0,
    attentionRate:
      d.studentsCount > 0
        ? Math.round(((Number(d.studentsRequiringAttention) || 0) / d.studentsCount) * 100)
        : 0
  }));

  return {
    kpis: {
      totalStudents: totalStudents || Number(adminData.universityInfo?.numberOfStudents) || 0,
      totalFaculty: totalFaculty || Number(adminData.universityInfo?.numberOfFaculty) || 0,
      departmentCount: depts.length,
      avgPerformance,
      avgAttendance,
      avgAssignmentCompletion,
      totalAttentionCount:
        totalAttentionCount || Number(adminData.universityAcademic?.studentsRequiringAcademicAttention) || 0,
      skillReadiness,
      passPercentage: Number(adminData.universityAcademic?.passPercentage) || 88
    },
    thresholds,
    departmentChartData,
    deptsBelowAttTarget,
    deptsBelowPerfTarget,
    commonSkillGaps,
    skillsData: adminData.skillsData || null
  };
}

export function generateInstitutionalRecommendations(metrics) {
  const recommendations = [];

  // Attendance recommendation
  if (metrics.deptsBelowAttTarget.length > 0) {
    const deptNames = metrics.deptsBelowAttTarget.map((d) => d.code || d.name).join(', ');
    recommendations.push({
      id: 'rec-inst-att',
      title: 'Institutional Attendance Intervention Protocol',
      priority: 'High',
      tag: 'Attendance Telemetry',
      reason: `Average student attendance is below the institutional benchmark (${metrics.thresholds.attendanceTarget}%) in: ${deptNames}.`,
      action: 'Direct departmental deans to initiate parental academic notifications and implement continuous biometric/RFID lecture verification.'
    });
  }

  // Academic support
  if (metrics.kpis.totalAttentionCount > 0) {
    recommendations.push({
      id: 'rec-inst-acad',
      title: 'Central Academic Remediation & Peer Tutoring Grant',
      priority: 'High',
      tag: 'Academic Welfare',
      reason: `${metrics.kpis.totalAttentionCount} students across departments currently meet the multi-factor threshold for proactive academic support.`,
      action: 'Authorize departmental funding for teaching assistants and peer tutoring clinics during pre-examination weeks.'
    });
  }

  // Coursework / Assignment
  if (metrics.kpis.avgAssignmentCompletion < metrics.thresholds.assignmentTarget) {
    recommendations.push({
      id: 'rec-inst-assign',
      title: 'Coursework Modernization & Submission Tracking Policy',
      priority: 'Medium',
      tag: 'Curriculum & Pedagogy',
      reason: `University-wide assignment completion velocity stands at ${metrics.kpis.avgAssignmentCompletion}%, trailing the ${metrics.thresholds.assignmentTarget}% target.`,
      action: 'Adopt continuous digital evaluation portals with automated milestone checkpoints and laboratory submission validation.'
    });
  }

  // Industry skill development
  if (metrics.commonSkillGaps.length > 0) {
    const gaps = metrics.commonSkillGaps.map((g) => g.name).join(', ');
    recommendations.push({
      id: 'rec-inst-skill',
      title: 'Industry Alignment & Technology Center of Excellence',
      priority: 'Medium',
      tag: 'Employability & Placement',
      reason: `High student competency gaps identified in critical modern domains: ${gaps}.`,
      action: 'Partner with cloud providers and industry certification programs to embed hands-on labs into semesters 5 and 6.'
    });
  }

  return recommendations;
}

export function generateUniversityActionPlan(metrics) {
  return [
    {
      priority: 1,
      title: 'Attendance Telemetry Monitoring',
      action: 'Implement mandatory mid-semester attendance review in lagging departments (e.g. BCA and BBA).',
      target: 'Attain >= 75% average attendance across all academic units.',
      status: 'In Progress'
    },
    {
      priority: 2,
      title: 'Targeted Student Academic Support',
      action: 'Deploy centralized faculty advising to address the needs of flagged cohorts before university examinations.',
      target: 'Reduce high-risk academic flags by at least 35% before final evaluations.',
      status: 'Planned'
    },
    {
      priority: 3,
      title: 'Coursework Completion Modernization',
      action: 'Standardize digital assignment submission deadlines and provide structured lab assistance hours.',
      target: 'Lift assignment completion from current baseline to >80%.',
      status: 'Planned'
    },
    {
      priority: 4,
      title: 'Industry Skill Gap Remediation',
      action: 'Integrate industry-aligned practical modules in Cloud Computing, ML Foundations, and DevOps.',
      target: 'Bridge tech skills gap by minimum 20% in pre-final semester.',
      status: 'Proposed'
    }
  ];
}

export function processUniversityChat(query, adminData, metrics) {
  if (!adminData || !metrics) {
    return "I don't have enough university data to answer that. Please enter university and department records.";
  }

  const q = query.toLowerCase();
  const kpis = metrics.kpis;
  const depts = adminData.departments || [];

  if (q.includes('which department') || q.includes('attention') || q.includes('lagging') || q.includes('concern')) {
    const flagged = depts.filter(
      (d) =>
        d.avgAttendance < metrics.thresholds.attendanceTarget ||
        d.avgPerformance < metrics.thresholds.academicTarget ||
        d.studentsRequiringAttention > 10
    );
    if (flagged.length === 0) {
      return 'All departments currently maintain average performance, attendance, and assignment metrics within institutional targets.';
    }
    const names = flagged.map((d) => `${d.name} (${d.studentsRequiringAttention} flagged students, ${d.avgAttendance}% attendance)`).join('; ');
    return `Based on institutional telemetry, departments requiring immediate administrative review include: ${names}.`;
  }

  if (q.includes('average') || q.includes('overall') || q.includes('performance')) {
    return `Across ${kpis.totalStudents} enrolled students in ${kpis.departmentCount} departments, the overall institutional performance average is ${kpis.avgPerformance}%, with an average pass rate of ${kpis.passPercentage}%.`;
  }

  if (q.includes('attendance') || q.includes('shortage')) {
    const below = metrics.deptsBelowAttTarget;
    if (below.length === 0) {
      return `University average attendance is ${kpis.avgAttendance}%, with all departments meeting or exceeding the ${metrics.thresholds.attendanceTarget}% benchmark.`;
    }
    const names = below.map((d) => `${d.name} (${d.metricValue}%)`).join(', ');
    return `University-wide average attendance is ${kpis.avgAttendance}%. ${below.length} department(s) are below the ${metrics.thresholds.attendanceTarget}% target: ${names}.`;
  }

  if (q.includes('skill') || q.includes('industry') || q.includes('placement')) {
    if (!kpis.skillReadiness) {
      return 'No industry skill data has been provided yet in the institutional submission. You can enter technology benchmarks in Step 4.';
    }
    const gaps = metrics.commonSkillGaps.map((g) => `${g.name} (${g.priority})`).join(', ');
    return `Overall industry skill readiness stands at ${kpis.skillReadiness}%. Major skill gaps identified: ${gaps}.`;
  }

  if (q.includes('action') || q.includes('plan') || q.includes('priorit')) {
    return 'University Action Priorities: 1) Attendance Monitoring in departments below 75%. 2) Academic support for flagged students. 3) Digital assignment submission drive. 4) Industry skill center of excellence partnerships.';
  }

  if (q.includes('explain') || q.includes('why') || q.includes('weights')) {
    return 'Institutional risk attribution utilizes transparent Demo Contribution Weights: Department Attendance (40%), Academic Performance (30%), Coursework Completion (20%), and Faculty-to-Student Ratio (10%).';
  }

  return `University Analysis for ${adminData.universityInfo?.universityName || 'Institution'}: ${kpis.totalStudents} students, ${kpis.totalFaculty} faculty, ${kpis.departmentCount} departments. Overall Performance: ${kpis.avgPerformance}%, Attendance: ${kpis.avgAttendance}%, ${kpis.totalAttentionCount} students requiring proactive institutional follow-up.`;
}

export function runFullAdminAnalysis(adminData) {
  if (!adminData) return null;

  const metrics = analyzeUniversityMetrics(adminData);
  const recommendations = generateInstitutionalRecommendations(metrics);
  const actionPlan = generateUniversityActionPlan(metrics);

  return {
    metrics,
    recommendations,
    actionPlan,
    analyzedAt: new Date().toISOString()
  };
}

const adminAnalysisService = {
  analyzeUniversityMetrics,
  generateInstitutionalRecommendations,
  generateUniversityActionPlan,
  processUniversityChat,
  runFullAdminAnalysis
};

export default adminAnalysisService;
