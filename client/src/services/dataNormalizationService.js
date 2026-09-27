/**
 * CampusMind X - Data Normalization Service
 * Normalizes disparate LMS/ERP/SIS and cloud formats into a unified internal representation.
 */

export function normalizeLMSData(rawPayload) {
  if (!rawPayload) return null;

  // Student profile normalization
  const student = {
    name: rawPayload.student?.name || 'Authorized Student',
    admissionId: rawPayload.student?.admissionId || 'N/A',
    university: rawPayload.student?.university || 'Connected University LMS',
    program: rawPayload.student?.program || 'Undergraduate Program',
    semester: rawPayload.student?.semester || 'Semester 5',
    academicYear: rawPayload.student?.academicYear || '2025-2026',
    email: rawPayload.student?.email || 'student@university.edu',
    section: rawPayload.student?.section || 'A',
    avatar: rawPayload.student?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  };

  // Academics normalization
  let academics = null;
  if (rawPayload.academics && rawPayload.academics.subjects) {
    const subjects = rawPayload.academics.subjects.map((s) => {
      const max = Number(s.maxMarks) || 100;
      const total = Number(s.totalMarks) || 0;
      const pct = Math.round((total / max) * 100);
      return {
        id: s.id || s.code,
        code: s.code || '',
        name: s.name,
        internalMarks: Number(s.internalMarks) || 0,
        externalMarks: Number(s.externalMarks) || 0,
        totalMarks: total,
        maxMarks: max,
        percentage: pct,
        grade: s.grade || (pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : 'C'),
        credits: Number(s.credits) || 3
      };
    });

    const totalPct = subjects.reduce((acc, curr) => acc + curr.percentage, 0);
    const overallPct = subjects.length > 0 ? Math.round(totalPct / subjects.length) : 0;

    let highestSubject = null;
    let lowestSubject = null;
    let maxPct = -1;
    let minPct = 999;

    subjects.forEach((s) => {
      if (s.percentage > maxPct) {
        maxPct = s.percentage;
        highestSubject = s;
      }
      if (s.percentage < minPct) {
        minPct = s.percentage;
        lowestSubject = s;
      }
    });

    academics = {
      cgpa: rawPayload.academics.cgpa || 7.4,
      overallPercentage: overallPct || rawPayload.academics.overallPercentage || 71,
      subjects,
      highestSubject,
      lowestSubject,
      semesterTrend: rawPayload.academics.semesterTrend || []
    };
  }

  // Attendance normalization
  let attendance = null;
  if (rawPayload.attendance) {
    const threshold = Number(rawPayload.attendance.configuredThreshold) || 75;
    const subjects = (rawPayload.attendance.subjects || []).map((s) => {
      const total = Number(s.totalClasses) || 1;
      const attended = Number(s.attendedClasses) || 0;
      const pct = Math.round((attended / total) * 100);

      // Classes needed to reach threshold
      let needed = 0;
      if (pct < threshold) {
        needed = Math.ceil((threshold * total - 100 * attended) / (100 - threshold));
        needed = Math.max(0, needed);
      }

      let status = 'Healthy';
      if (pct < 60) status = 'Critical Alert';
      else if (pct < threshold) status = 'Attention Required';

      return {
        name: s.name,
        totalClasses: total,
        attendedClasses: attended,
        percentage: pct,
        status,
        requiredToClear: needed
      };
    });

    const totalAttendedAll = subjects.reduce((a, c) => a + c.attendedClasses, 0);
    const totalScheduledAll = subjects.reduce((a, c) => a + c.totalClasses, 0);
    const overallAttendance =
      totalScheduledAll > 0 ? Math.round((totalAttendedAll / totalScheduledAll) * 100) : rawPayload.attendance.overallPercentage || 68;

    const subjectsBelowTarget = subjects.filter((s) => s.percentage < threshold);

    attendance = {
      overallPercentage: overallAttendance,
      totalClassesScheduled: totalScheduledAll,
      totalClassesAttended: totalAttendedAll,
      totalClassesMissed: totalScheduledAll - totalAttendedAll,
      configuredThreshold: threshold,
      subjects,
      subjectsBelowTarget
    };
  }

  // Assignments normalization
  let assignments = null;
  if (rawPayload.assignments) {
    const total = Number(rawPayload.assignments.total) || 0;
    const completed = Number(rawPayload.assignments.completed) || 0;
    const pending = Number(rawPayload.assignments.pending) || 0;
    const late = Number(rawPayload.assignments.late) || 0;
    const rate = total > 0 ? Math.round((completed / total) * 100) : rawPayload.assignments.completionRate || 0;

    assignments = {
      total,
      completed,
      pending,
      late,
      completionRate: rate,
      recentList: rawPayload.assignments.recentList || []
    };
  }

  // Support Indicator Calculation (Prototype Explainability)
  let supportIndicator = 'LOW';
  let indicatorColor = 'emerald';
  const factors = [];

  const attVal = attendance ? attendance.overallPercentage : 75;
  const acadVal = academics ? academics.overallPercentage : 75;
  const assignVal = assignments ? assignments.completionRate : 80;

  // Composite risk weights: Attendance 35%, Performance 30%, Assignments 20%, Trend 15%
  const compositeRisk = (100 - attVal) * 0.35 + (100 - acadVal) * 0.30 + (100 - assignVal) * 0.20 + 8;

  if (compositeRisk >= 32 || attVal < 65 || acadVal < 60) {
    supportIndicator = 'HIGH';
    indicatorColor = 'red';
  } else if (compositeRisk >= 20 || attVal < 75 || acadVal < 70 || assignVal < 75) {
    supportIndicator = 'MEDIUM';
    indicatorColor = 'amber';
  }

  if (attVal < 75) factors.push({ name: 'Attendance', status: 'Contributing factor', value: `${attVal}%` });
  if (assignVal < 85) factors.push({ name: 'Assignment rate', status: 'Contributing factor', value: `${assignVal}%` });
  factors.push({ name: 'Academic Performance', status: acadVal >= 70 ? 'Stable' : 'Needs attention', value: `${acadVal}%` });
  factors.push({ name: 'Recent trend', status: 'Slight decline', value: 'Recent Period' });

  return {
    student,
    academics,
    attendance,
    assignments,
    examinations: rawPayload.examinations || { upcoming: [], previous: [] },
    skills: rawPayload.skills || [],
    certifications: rawPayload.certifications || [],
    projects: rawPayload.projects || [],
    authorizedDocuments: rawPayload.authorizedDocuments || [],
    analytics: {
      supportIndicator,
      indicatorColor,
      compositeRisk: Math.round(compositeRisk),
      contributingFactors: factors,
      careerReadiness: 68,
      skillCoverage: 72,
      learningConsistency: 81
    },
    meta: {
      source: rawPayload.universitySource || 'Connected University LMS',
      isDemoIntegration: Boolean(rawPayload.isDemoIntegration),
      lastSyncedAt: new Date().toISOString()
    }
  };
}

export default {
  normalizeLMSData
};
