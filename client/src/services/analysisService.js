/**
 * CampusMind X - Personal Analysis Engine (Service Layer)
 * Transparent prototype/rule-based calculation engine for student-entered data.
 * Built to be directly swappable with backend ML/FastAPI endpoints in future phases.
 * 
 * STRICT COMPLIANCE:
 * - Never invents data or returns demo values if not provided.
 * - Clearly documents calculation rules and transparent weights.
 */

// Target benchmark competencies by career track
export const CAREER_COMPETENCIES = {
  'Full Stack Developer': [
    { skill: 'HTML & Semantic CSS', targetLevel: 85, category: 'Frontend', essential: true },
    { skill: 'JavaScript (ES6+)', targetLevel: 85, category: 'Language', essential: true },
    { skill: 'React.js', targetLevel: 80, category: 'Frontend', essential: true },
    { skill: 'Node.js & Express.js', targetLevel: 80, category: 'Backend', essential: true },
    { skill: 'REST APIs', targetLevel: 80, category: 'Architecture', essential: true },
    { skill: 'MongoDB / SQL', targetLevel: 75, category: 'Database', essential: true },
    { skill: 'Authentication & Security', targetLevel: 75, category: 'Security', essential: false },
    { skill: 'Git / GitHub', targetLevel: 80, category: 'Tooling', essential: true },
    { skill: 'Deployment & DevOps', targetLevel: 65, category: 'Cloud', essential: false }
  ],
  'Software Developer': [
    { skill: 'Data Structures & Algorithms', targetLevel: 85, category: 'Computer Science', essential: true },
    { skill: 'Java / C++ / Python', targetLevel: 85, category: 'Language', essential: true },
    { skill: 'Object Oriented Design', targetLevel: 80, category: 'Architecture', essential: true },
    { skill: 'SQL & Database Systems', targetLevel: 75, category: 'Database', essential: true },
    { skill: 'Operating Systems & Networks', targetLevel: 70, category: 'Systems', essential: false },
    { skill: 'Git / Version Control', targetLevel: 80, category: 'Tooling', essential: true },
    { skill: 'Unit Testing & Debugging', targetLevel: 70, category: 'Quality', essential: false }
  ],
  'Data Analyst': [
    { skill: 'Python / R', targetLevel: 85, category: 'Language', essential: true },
    { skill: 'SQL & Data Warehousing', targetLevel: 85, category: 'Database', essential: true },
    { skill: 'Data Visualization (PowerBI/Tableau)', targetLevel: 80, category: 'BI', essential: true },
    { skill: 'Pandas & NumPy', targetLevel: 80, category: 'Data', essential: true },
    { skill: 'Applied Statistics', targetLevel: 75, category: 'Mathematics', essential: true },
    { skill: 'Excel & Data Modeling', targetLevel: 80, category: 'Spreadsheets', essential: false },
    { skill: 'Business Storytelling', targetLevel: 70, category: 'Communication', essential: false }
  ],
  'AI/ML Engineer': [
    { skill: 'Python Programming', targetLevel: 90, category: 'Language', essential: true },
    { skill: 'Linear Algebra & Calculus', targetLevel: 80, category: 'Mathematics', essential: true },
    { skill: 'Scikit-Learn & Classical ML', targetLevel: 85, category: 'Machine Learning', essential: true },
    { skill: 'Deep Learning (PyTorch/TensorFlow)', targetLevel: 80, category: 'Deep Learning', essential: true },
    { skill: 'Data Preprocessing & Feature Eng.', targetLevel: 85, category: 'Data', essential: true },
    { skill: 'Model Deployment & APIs', targetLevel: 75, category: 'MLOps', essential: false },
    { skill: 'Git & Linux Shell', targetLevel: 75, category: 'Tooling', essential: false }
  ],
  'Cloud Engineer': [
    { skill: 'Linux Administration', targetLevel: 85, category: 'Operating Systems', essential: true },
    { skill: 'Cloud Fundamentals (AWS/Azure)', targetLevel: 85, category: 'Cloud', essential: true },
    { skill: 'Docker & Containerization', targetLevel: 80, category: 'DevOps', essential: true },
    { skill: 'Networking & VPC Architecture', targetLevel: 75, category: 'Networking', essential: true },
    { skill: 'CI/CD Pipelines (GitHub Actions)', targetLevel: 75, category: 'Automation', essential: true },
    { skill: 'Infrastructure as Code (Terraform)', targetLevel: 70, category: 'IaC', essential: false },
    { skill: 'Python / Bash Scripting', targetLevel: 75, category: 'Scripting', essential: false }
  ],
  'Cybersecurity': [
    { skill: 'Networking & Protocols (TCP/IP)', targetLevel: 85, category: 'Networking', essential: true },
    { skill: 'Linux & Command Line', targetLevel: 85, category: 'Systems', essential: true },
    { skill: 'Vulnerability Assessment', targetLevel: 80, category: 'Security', essential: true },
    { skill: 'Web App Security (OWASP Top 10)', targetLevel: 80, category: 'Security', essential: true },
    { skill: 'Cryptography Fundamentals', targetLevel: 75, category: 'Mathematics', essential: false },
    { skill: 'Python / Bash Scripting', targetLevel: 75, category: 'Scripting', essential: true },
    { skill: 'SIEM & Log Analysis', targetLevel: 70, category: 'Monitoring', essential: false }
  ],
  'Other': [
    { skill: 'Core Discipline Fundamentals', targetLevel: 80, category: 'Core', essential: true },
    { skill: 'Problem Solving & Logic', targetLevel: 85, category: 'Foundational', essential: true },
    { skill: 'Technical Communication', targetLevel: 75, category: 'Professional', essential: true },
    { skill: 'Tooling & Project Management', targetLevel: 70, category: 'Tooling', essential: false },
    { skill: 'Industry Specific Tool', targetLevel: 80, category: 'Specialization', essential: true }
  ]
};

// Skill level converter helper
export function normalizeSkillLevel(level) {
  if (typeof level === 'number') return Math.max(0, Math.min(100, Math.round(level)));
  if (typeof level === 'string') {
    const l = level.trim().toLowerCase();
    if (l === 'beginner' || l === 'basic') return 30;
    if (l === 'intermediate' || l === 'medium') return 60;
    if (l === 'advanced' || l === 'expert' || l === 'master') return 90;
    const parsed = parseFloat(level);
    if (!isNaN(parsed)) return Math.max(0, Math.min(100, Math.round(parsed)));
  }
  return 40;
}

export const analysisService = {
  // 1. ACADEMIC PERFORMANCE ANALYSIS
  analyzeAcademicPerformance(subjects = []) {
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return {
        hasData: false,
        overallPercentage: null,
        averageMarks: null,
        highestSubject: null,
        lowestSubject: null,
        subjectResults: []
      };
    }

    const calculated = subjects
      .filter((s) => s.name && s.maxMarks > 0)
      .map((s) => {
        const max = Number(s.maxMarks) || 100;
        const obtained = Number(s.obtainedMarks) || 0;
        const pct = Math.round((obtained / max) * 100);
        return {
          name: s.name.trim(),
          maxMarks: max,
          obtainedMarks: obtained,
          percentage: pct
        };
      });

    if (calculated.length === 0) {
      return {
        hasData: false,
        overallPercentage: null,
        averageMarks: null,
        highestSubject: null,
        lowestSubject: null,
        subjectResults: []
      };
    }

    const totalPct = calculated.reduce((acc, curr) => acc + curr.percentage, 0);
    const overallPercentage = Math.round(totalPct / calculated.length);

    // Highest and lowest scoring
    const sorted = [...calculated].sort((a, b) => b.percentage - a.percentage);
    const highestSubject = sorted[0];
    const lowestSubject = sorted[sorted.length - 1];

    const totalObtained = calculated.reduce((acc, curr) => acc + curr.obtainedMarks, 0);
    const averageMarks = (totalObtained / calculated.length).toFixed(1);

    return {
      hasData: true,
      overallPercentage,
      averageMarks,
      highestSubject,
      lowestSubject,
      subjectResults: calculated
    };
  },

  // 2. ATTENDANCE ANALYSIS
  analyzeAttendance(attendanceRecords = [], threshold = 75) {
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return {
        hasData: false,
        overallAttendance: null,
        totalClasses: 0,
        attendedClasses: 0,
        belowTargetCount: 0,
        aboveTargetCount: 0,
        status: 'Data Not Available',
        threshold,
        subjectAttendance: []
      };
    }

    const calculated = attendanceRecords
      .filter((r) => r.subjectName && r.totalClasses > 0)
      .map((r) => {
        const total = Number(r.totalClasses) || 0;
        const attended = Math.min(total, Number(r.attendedClasses) || 0);
        const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
        
        let status = 'Healthy';
        if (pct < 60) status = 'Critical';
        else if (pct < threshold) status = 'Needs Attention';

        // Calculation of consecutive classes needed to clear threshold
        // (attended + x) / (total + x) >= threshold / 100
        let neededForClearance = 0;
        if (pct < threshold && threshold < 100) {
          const req = threshold / 100;
          const numerator = req * total - attended;
          const denominator = 1 - req;
          neededForClearance = Math.max(0, Math.ceil(numerator / denominator));
        }

        return {
          subjectName: r.subjectName.trim(),
          totalClasses: total,
          attendedClasses: attended,
          percentage: pct,
          status,
          neededForClearance
        };
      });

    if (calculated.length === 0) {
      return {
        hasData: false,
        overallAttendance: null,
        totalClasses: 0,
        attendedClasses: 0,
        belowTargetCount: 0,
        aboveTargetCount: 0,
        status: 'Data Not Available',
        threshold,
        subjectAttendance: []
      };
    }

    const totalAll = calculated.reduce((acc, r) => acc + r.totalClasses, 0);
    const attendedAll = calculated.reduce((acc, r) => acc + r.attendedClasses, 0);
    const overallAttendance = totalAll > 0 ? Math.round((attendedAll / totalAll) * 100) : 0;

    const belowTarget = calculated.filter((r) => r.percentage < threshold);
    const aboveTarget = calculated.filter((r) => r.percentage >= threshold);

    let status = 'Healthy';
    if (overallAttendance < 60) status = 'Critical';
    else if (overallAttendance < threshold) status = 'Needs Attention';

    return {
      hasData: true,
      overallAttendance,
      totalClasses: totalAll,
      attendedClasses: attendedAll,
      belowTargetCount: belowTarget.length,
      aboveTargetCount: aboveTarget.length,
      belowTargetSubjects: belowTarget,
      aboveTargetSubjects: aboveTarget,
      status,
      threshold,
      subjectAttendance: calculated
    };
  },

  // 3. ASSIGNMENTS ANALYSIS
  analyzeAssignments(assignmentData) {
    if (!assignmentData || Number(assignmentData.total || 0) <= 0) {
      return {
        hasData: false,
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        completionPercentage: null,
        message: 'No assignment data available.'
      };
    }

    const total = Number(assignmentData.total) || 0;
    const completed = Number(assignmentData.completed) || 0;
    const pending = Number(assignmentData.pending) || 0;
    const overdue = Number(assignmentData.overdue) || 0;
    const completionPercentage = Math.round((completed / total) * 100);

    return {
      hasData: true,
      total,
      completed,
      pending,
      overdue,
      completionPercentage,
      message: `Assignment completion is ${completionPercentage}%. ${pending} pending, ${overdue} overdue.`
    };
  },

  // 4. SKILL GAP ANALYSIS
  analyzeSkillGaps(studentSkills = [], careerGoal = 'Full Stack Developer') {
    const targetCatalog = CAREER_COMPETENCIES[careerGoal] || CAREER_COMPETENCIES['Other'];
    
    // Normalize student skill lookup
    const studentMap = {};
    if (Array.isArray(studentSkills)) {
      studentSkills.forEach((s) => {
        if (s && s.name) {
          studentMap[s.name.trim().toLowerCase()] = normalizeSkillLevel(s.level);
        }
      });
    }

    const evaluated = targetCatalog.map((req) => {
      const key = req.skill.trim().toLowerCase();
      // Match exact or contains
      let current = studentMap[key];
      if (current === undefined) {
        // Try fuzzy partial key match
        const foundKey = Object.keys(studentMap).find((k) => k.includes(key) || key.includes(k));
        current = foundKey !== undefined ? studentMap[foundKey] : 0;
      }

      const target = req.targetLevel;
      const gap = Math.max(0, target - current);

      let gapPriority = 'Low';
      let gapStatus = 'On Track';

      if (gap >= 30) {
        gapPriority = 'High';
        gapStatus = 'Critical Gap';
      } else if (gap >= 15) {
        gapPriority = 'Medium';
        gapStatus = 'Moderate Gap';
      } else if (gap === 0) {
        gapStatus = 'Mastered';
      }

      return {
        skill: req.skill,
        category: req.category,
        currentLevel: current,
        targetLevel: target,
        gap,
        gapPriority,
        gapStatus,
        essential: req.essential
      };
    });

    // Also include extra skills entered by the student that are not in the standard target catalog
    const extraSkills = (studentSkills || [])
      .filter((s) => {
        if (!s || !s.name) return false;
        const norm = s.name.trim().toLowerCase();
        return !targetCatalog.some((req) => req.skill.trim().toLowerCase() === norm);
      })
      .map((s) => ({
        skill: s.name.trim(),
        category: 'Additional Skill',
        currentLevel: normalizeSkillLevel(s.level),
        targetLevel: 80,
        gap: Math.max(0, 80 - normalizeSkillLevel(s.level)),
        gapPriority: 'Low',
        gapStatus: 'Bonus Competency',
        essential: false
      }));

    const allSkills = [...evaluated, ...extraSkills];

    // Calculate Role Readiness Index
    // Readiness = average percentage of (currentLevel / targetLevel) capped at 100%
    const totalRatios = evaluated.reduce((acc, curr) => {
      const ratio = Math.min(100, Math.round((curr.currentLevel / curr.targetLevel) * 100));
      return acc + ratio;
    }, 0);
    const readinessPercentage = evaluated.length > 0 ? Math.round(totalRatios / evaluated.length) : 0;

    const strongSkills = allSkills.filter((s) => s.currentLevel >= 70 || s.gap === 0);
    const skillsToImprove = evaluated.filter((s) => s.gap >= 20).sort((a, b) => b.gap - a.gap);

    return {
      hasData: studentSkills && studentSkills.length > 0,
      careerGoal,
      readinessPercentage,
      skills: evaluated,
      allSkills,
      strongSkills,
      skillsToImprove,
      highPriorityCount: evaluated.filter((s) => s.gapPriority === 'High').length,
      mediumPriorityCount: evaluated.filter((s) => s.gapPriority === 'Medium').length,
      masteredCount: evaluated.filter((s) => s.gapStatus === 'Mastered').length
    };
  },

  // 5. ACADEMIC SUPPORT INDICATOR (Rule-Based Prototype Weighting)
  calculateAcademicSupportIndicator(academicAnalysis, attendanceAnalysis, assignmentAnalysis, skillAnalysis) {
    // Demo contribution weights (Transparent prototype heuristic)
    // Attendance: 35%
    // Academic Performance: 30%
    // Assignment Completion: 20%
    // Skill Readiness: 15%

    const weights = {
      attendance: 0.35,
      academic: 0.30,
      assignment: 0.20,
      skill: 0.15
    };

    let totalWeightUsed = 0;
    let weightedScore = 0;

    const contributions = [];

    if (attendanceAnalysis && attendanceAnalysis.hasData) {
      const att = attendanceAnalysis.overallAttendance;
      weightedScore += att * weights.attendance;
      totalWeightUsed += weights.attendance;
      contributions.push({
        factor: 'Attendance',
        weight: '35%',
        value: `${att}%`,
        status: att >= 75 ? 'positive' : (att >= 60 ? 'warning' : 'critical'),
        impact: att >= 75 ? 'Healthy compliance' : 'Below target requirement'
      });
    }

    if (academicAnalysis && academicAnalysis.hasData) {
      const acad = academicAnalysis.overallPercentage;
      weightedScore += acad * weights.academic;
      totalWeightUsed += weights.academic;
      contributions.push({
        factor: 'Academic Performance',
        weight: '30%',
        value: `${acad}%`,
        status: acad >= 70 ? 'positive' : (acad >= 50 ? 'warning' : 'critical'),
        impact: acad >= 70 ? 'Strong subject marks' : 'Needs academic reinforcement'
      });
    }

    if (assignmentAnalysis && assignmentAnalysis.hasData) {
      const asg = assignmentAnalysis.completionPercentage;
      weightedScore += asg * weights.assignment;
      totalWeightUsed += weights.assignment;
      contributions.push({
        factor: 'Assignment Completion',
        weight: '20%',
        value: `${asg}%`,
        status: asg >= 75 ? 'positive' : (asg >= 50 ? 'warning' : 'critical'),
        impact: asg >= 75 ? 'Coursework on track' : `${assignmentAnalysis.pending} pending tasks`
      });
    }

    if (skillAnalysis && skillAnalysis.hasData) {
      const skl = skillAnalysis.readinessPercentage;
      weightedScore += skl * weights.skill;
      totalWeightUsed += weights.skill;
      contributions.push({
        factor: 'Career Skill Readiness',
        weight: '15%',
        value: `${skl}%`,
        status: skl >= 65 ? 'positive' : (skl >= 40 ? 'warning' : 'critical'),
        impact: skl >= 65 ? 'Aligning with career track' : 'Noticeable skill deficits'
      });
    }

    if (totalWeightUsed === 0) {
      return {
        level: 'Data Not Available',
        score: null,
        description: 'Insufficient information to evaluate academic support indicator.',
        contributions: []
      };
    }

    const normalizedScore = Math.round(weightedScore / totalWeightUsed);

    let level = 'Low'; // Low risk / On Track
    let label = 'Low (On Track)';
    let badgeColor = 'emerald';
    let explanation = 'Your academic indicators meet target benchmarks across entered coursework.';

    if (normalizedScore < 60 || (attendanceAnalysis.hasData && attendanceAnalysis.overallAttendance < 60)) {
      level = 'High';
      label = 'High (Targeted Support Needed)';
      badgeColor = 'rose';
      explanation = 'Your support indicator is influenced by attendance below the configured target and lower performance in key areas.';
    } else if (normalizedScore < 75 || (attendanceAnalysis.hasData && attendanceAnalysis.overallAttendance < attendanceAnalysis.threshold)) {
      level = 'Moderate';
      label = 'Moderate (Early Advising Recommended)';
      badgeColor = 'amber';
      explanation = 'Your academic indicators show overall progress, but specific attendance or coursework deficits require attention.';
    }

    return {
      level,
      label,
      score: normalizedScore,
      badgeColor,
      explanation,
      contributions,
      scoringMethod: 'Demo Contribution Weights (Attendance 35%, Academic 30%, Assignments 20%, Skills 15%)'
    };
  },

  // 6. GENERATE PERSONALIZED INSIGHTS
  generateInsights(studentData, analysis) {
    const { academic, attendance, assignments, skills, indicator } = analysis;

    const parts = [];

    if (academic.hasData && academic.highestSubject) {
      parts.push(`your strongest area is ${academic.highestSubject.name} (${academic.highestSubject.percentage}%)`);
    }

    const deficits = [];
    if (attendance.hasData && attendance.belowTargetCount > 0) {
      deficits.push(`attendance in ${attendance.belowTargetCount} subject${attendance.belowTargetCount > 1 ? 's' : ''}`);
    }
    if (academic.hasData && academic.lowestSubject && academic.lowestSubject.percentage < 65) {
      deficits.push(`${academic.lowestSubject.name} (${academic.lowestSubject.percentage}%)`);
    }
    if (assignments.hasData && assignments.pending > 0) {
      deficits.push(`${assignments.pending} pending assignment${assignments.pending > 1 ? 's' : ''}`);
    }
    if (skills.hasData && skills.skillsToImprove.length > 0) {
      deficits.push(`${skills.skillsToImprove[0].skill} skill gap (${skills.skillsToImprove[0].gap}% deficit)`);
    }

    let summaryText = 'Based on the information you entered, ';
    if (parts.length > 0) {
      summaryText += parts[0];
      if (deficits.length > 0) {
        summaryText += `, while ${deficits.slice(0, 2).join(' and ')} require additional attention.`;
      } else {
        summaryText += `, and all other tracked metrics are in good standing.`;
      }
    } else if (deficits.length > 0) {
      summaryText += `${deficits.slice(0, 2).join(' and ')} require priority attention.`;
    } else {
      summaryText += 'your records reflect balanced performance across all recorded parameters.';
    }

    return {
      headline: `Personalized Academic Standing: ${indicator.label}`,
      summary: summaryText,
      explanationTitle: 'Why did CampusMind generate this insight?',
      contributions: indicator.contributions
    };
  },

  // 7. GENERATE PERSONALIZED RECOMMENDATIONS (Strictly based on actual weaknesses)
  generateRecommendations(studentData, analysis) {
    const { academic, attendance, assignments, skills } = analysis;
    const recommendations = [];

    // Attendance Recommendation
    if (attendance.hasData && attendance.belowTargetSubjects && attendance.belowTargetSubjects.length > 0) {
      const worstAtt = attendance.belowTargetSubjects[0];
      recommendations.push({
        id: 'rec-att',
        category: 'Attendance',
        title: `Improve Attendance in ${worstAtt.subjectName}`,
        reason: `Your attendance in ${worstAtt.subjectName} is currently ${worstAtt.percentage}%, which is below the configured ${attendance.threshold}% target.`,
        actionPlan: [
          `Attend the next ${worstAtt.neededForClearance > 0 ? worstAtt.neededForClearance : 3} consecutive scheduled classes without absence.`,
          `Notify your course instructor regarding any excused medical or institutional absences.`,
          `Review lab schedule to prevent practical session deficits.`
        ],
        priority: worstAtt.percentage < 60 ? 'Critical' : 'High',
        impact: '+12% Exam Eligibility'
      });
    }

    // Academic Subject Recommendation
    if (academic.hasData && academic.lowestSubject && academic.lowestSubject.percentage < 70) {
      const low = academic.lowestSubject;
      recommendations.push({
        id: 'rec-acad',
        category: 'Academic Performance',
        title: `Strengthen Fundamentals in ${low.name}`,
        reason: `${low.name} is currently your lowest-performing subject at ${low.percentage}%.`,
        actionPlan: [
          `Schedule 2 focused revision blocks weekly for ${low.name}.`,
          `Re-solve past continuous internal test questions and problem sets.`,
          `Consult with faculty mentor during weekly office hours.`
        ],
        priority: low.percentage < 50 ? 'Critical' : 'High',
        impact: '+8-12 Marks in Finals'
      });
    }

    // Assignment Recommendation
    if (assignments.hasData && (assignments.pending > 0 || assignments.overdue > 0)) {
      recommendations.push({
        id: 'rec-asg',
        category: 'Coursework',
        title: `Clear Pending Coursework Backlog`,
        reason: `You have ${assignments.pending} pending assignment${assignments.pending > 1 ? 's' : ''} (${assignments.overdue} overdue). Coursework directly contributes to continuous evaluation.`,
        actionPlan: [
          `Dedicate an uninterrupted 90-minute study block to submit the oldest pending assignment.`,
          `Verify lab rubric submission guidelines before deadlines.`,
          `Aim for 100% submission rate before semester cut-off.`
        ],
        priority: assignments.overdue > 0 ? 'High' : 'Moderate',
        impact: '+15% Internal Assessment'
      });
    }

    // Skill Gap Recommendation
    if (skills.hasData && skills.skillsToImprove && skills.skillsToImprove.length > 0) {
      const topGap = skills.skillsToImprove[0];
      recommendations.push({
        id: 'rec-skill',
        category: 'Career Readiness',
        title: `Learn & Practice ${topGap.skill}`,
        reason: `${topGap.skill} has one of the largest gaps (${topGap.gap}%) between your current skill level (${topGap.currentLevel}%) and your target career goal (${skills.careerGoal}).`,
        actionPlan: [
          `Build a practical mini-project implementing ${topGap.skill}.`,
          `Complete online modular exercises and push repository to GitHub.`,
          `Target elevating your self-assessed proficiency from ${topGap.currentLevel}% to at least ${topGap.targetLevel}%.`
        ],
        priority: 'High',
        impact: `+${Math.round(topGap.gap / 2)}% Role Readiness`
      });
    }

    // Project / Career Recommendation
    if (skills.hasData) {
      recommendations.push({
        id: 'rec-career',
        category: 'Career Track',
        title: `Align Portfolio with ${skills.careerGoal}`,
        reason: `Your overall Role Readiness for ${skills.careerGoal} is currently ${skills.readinessPercentage}%. A comprehensive capstone project demonstrates hands-on mastery.`,
        actionPlan: [
          `Create a portfolio project highlighting ${skills.strongSkills.slice(0, 2).map((s) => s.skill).join(' and ')}.`,
          `Document project architecture and deployment live link in your resume.`,
          `Track remaining skill deficits in your personalized roadmap.`
        ],
        priority: 'Moderate',
        impact: 'Placement Portfolio'
      });
    }

    return recommendations;
  },

  // 8. GENERATE PERSONALIZED WEEKLY STUDY PLAN
  generateStudyPlan(studentData, analysis) {
    const weeklyHours = Number(studentData.weeklyStudyHours) || 8;
    const { academic, attendance, assignments, skills } = analysis;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const plan = [];

    const lowSubject = academic.hasData && academic.lowestSubject ? academic.lowestSubject.name : null;
    const topSkill = skills.hasData && skills.skillsToImprove.length > 0 ? skills.skillsToImprove[0].skill : 'Core Tech Practice';
    const secondSkill = skills.hasData && skills.skillsToImprove.length > 1 ? skills.skillsToImprove[1].skill : 'Project Development';
    const pendingAsg = assignments.hasData && assignments.pending > 0;

    const slotHour = (weeklyHours / 6).toFixed(1);

    days.forEach((day, idx) => {
      let task = '';
      let focus = '';

      if (idx === 0) {
        task = lowSubject ? `Revision & Notes: ${lowSubject}` : 'Academic Subject Review';
        focus = 'Academic Reinforcement';
      } else if (idx === 1) {
        task = `Skill Building: ${topSkill} Hands-on Coding`;
        focus = 'Career Track';
      } else if (idx === 2) {
        task = pendingAsg ? 'Coursework & Pending Assignment Submission' : 'Problem Solving & Quiz Practice';
        focus = 'Coursework Deliverables';
      } else if (idx === 3) {
        task = lowSubject ? `Problem Solving & Lab Exercises: ${lowSubject}` : 'Technical Foundation';
        focus = 'Lab & Theory Practice';
      } else if (idx === 4) {
        task = `Skill Deep Dive: ${secondSkill}`;
        focus = 'Career Competency';
      } else {
        task = 'Portfolio Project Sprint & GitHub Commit';
        focus = 'Practical Application';
      }

      plan.push({
        day,
        duration: `${slotHour} hrs`,
        task,
        focus
      });
    });

    return plan;
  },

  // 9. GENERATE PERSONALIZED LEARNING ROADMAP (Changes by career and actual gaps)
  generateRoadmap(studentData, analysis) {
    const { skills } = analysis;
    const career = studentData.careerGoal || 'Software Developer';
    
    // Pick top skill gaps
    const gaps = (skills.hasData ? skills.skillsToImprove : []).slice(0, 4);

    const weeks = [
      {
        week: 'Week 1',
        title: gaps[0] ? `${gaps[0].skill} Fundamentals` : `${career} Foundation`,
        desc: gaps[0]
          ? `Bridge the ${gaps[0].gap}% gap in ${gaps[0].skill}. Complete core theory and initial code syntax.`
          : 'Establish primary concepts and development setup.',
        milestone: 'Complete 3 foundational exercises'
      },
      {
        week: 'Week 2',
        title: gaps[0] ? `Applied ${gaps[0].skill} Programming` : 'Modular Development',
        desc: 'Build functional modular components and write unit tests.',
        milestone: 'Push first milestone repo to GitHub'
      },
      {
        week: 'Week 3',
        title: gaps[1] ? `${gaps[1].skill} Integration` : 'Integration & Architecture',
        desc: gaps[1]
          ? `Address secondary deficit in ${gaps[1].skill}. Focus on real-world implementation patterns.`
          : 'Connect frontend and backend architectures.',
        milestone: 'Create working API endpoints'
      },
      {
        week: 'Week 4',
        title: gaps[2] ? `${gaps[2].skill} & Database Modeling` : 'Data & Persistence Layer',
        desc: 'Connect database models and handle asynchronous data workflows.',
        milestone: 'Full CRUD flow verified'
      },
      {
        week: 'Week 5',
        title: 'Authentication & Security Best Practices',
        desc: 'Implement user auth, protected endpoints, and input sanitization.',
        milestone: 'JWT / Session security tested'
      },
      {
        week: 'Week 6',
        title: `${career} Capstone Project & Cloud Deployment`,
        desc: `Synthesize your skills into an end-to-end portfolio application aligned with ${career}.`,
        milestone: 'Live production URL + README'
      }
    ];

    return weeks;
  },

  // 10. CAMPUSMIND AI ASSISTANT CHAT HANDLER (Uses strictly student-entered data)
  processStudentChat(query, studentData, analysis) {
    if (!studentData) {
      return {
        reply: "I don't have enough information to answer that. Please complete the **Analyze My Data** form to generate your personal analysis.",
        intent: 'INTENT_NO_DATA'
      };
    }

    const q = (query || '').toLowerCase().trim();
    const { academic, attendance, assignments, skills, indicator } = analysis;

    // 1. Weakest Subject
    if (q.includes('weakest subject') || q.includes('lowest subject') || q.includes('low mark') || q.includes('lowest mark')) {
      if (!academic.hasData || !academic.lowestSubject) {
        return {
          reply: "I don't have your subject marks recorded. Please edit your data and add your subjects to analyze your weakest areas.",
          intent: 'INTENT_WEAK_SUBJECTS'
        };
      }
      return {
        reply: `Based on your entered marks, your lowest-scoring subject is **${academic.lowestSubject.name}** with **${academic.lowestSubject.percentage}%** (${academic.lowestSubject.obtainedMarks}/${academic.lowestSubject.maxMarks}). Focusing revision on ${academic.lowestSubject.name} will have the highest immediate impact on your academic average.`,
        intent: 'INTENT_WEAK_SUBJECTS'
      };
    }

    // 2. What is affecting my performance?
    if (q.includes('affecting my performance') || q.includes('affecting') || q.includes('factors') || q.includes('academic support')) {
      const parts = [];
      if (attendance.hasData && attendance.overallAttendance < attendance.threshold) {
        parts.push(`- **Attendance (${attendance.overallAttendance}%):** Below your target ${attendance.threshold}% threshold, with ${attendance.belowTargetCount} subject(s) needing clearance.`);
      }
      if (academic.hasData && academic.lowestSubject && academic.lowestSubject.percentage < 65) {
        parts.push(`- **Academic Subjects:** Marks in **${academic.lowestSubject.name}** (${academic.lowestSubject.percentage}%) are pulling down your average.`);
      }
      if (assignments.hasData && assignments.pending > 0) {
        parts.push(`- **Coursework:** You have **${assignments.pending}** pending assignment(s) (${assignments.overdue} overdue).`);
      }
      if (skills.hasData && skills.readinessPercentage < 70) {
        parts.push(`- **Skill Alignment:** Role readiness for **${skills.careerGoal}** is **${skills.readinessPercentage}%**, with key deficits in ${skills.skillsToImprove.slice(0, 2).map((s) => s.skill).join(', ')}.`);
      }

      if (parts.length === 0) {
        return {
          reply: `Based on your entered data, all your tracked indicators are in good standing! Your overall academic score is **${academic.overallPercentage}%** and attendance is **${attendance.overallAttendance}%**. Keep up the steady cadence!`,
          intent: 'INTENT_FACTORS'
        };
      }

      return {
        reply: `### Factors Influencing Your Standing (${indicator.label})\n\nBased on your entered data:\n${parts.join('\n')}\n\n*Note: This analysis uses transparent prototype contribution weights to help target your weekly priorities.*`,
        intent: 'INTENT_FACTORS'
      };
    }

    // 3. Which skill should I learn first? / Career skill gap
    if (q.includes('skill should i learn') || q.includes('skill gap') || q.includes('biggest gap') || q.includes('learn first')) {
      if (!skills.hasData || !skills.skillsToImprove || skills.skillsToImprove.length === 0) {
        return {
          reply: "I don't have enough skill data recorded. Please edit your data and add your current skills to receive a tailored skill gap analysis.",
          intent: 'INTENT_SKILL_GAPS'
        };
      }
      const top = skills.skillsToImprove[0];
      return {
        reply: `Your largest developmental gap for **${skills.careerGoal}** is in **${top.skill}**.\n\n- **Current Level:** ${top.currentLevel}%\n- **Target Level:** ${top.targetLevel}%\n- **Deficit:** **${top.gap}%**\n\nI recommend prioritizing ${top.skill} before moving to advanced frameworks, as it forms an essential foundation for ${skills.careerGoal}.`,
        intent: 'INTENT_SKILL_GAPS'
      };
    }

    // 4. How can I improve my attendance? / Attendance status
    if (q.includes('attendance') || q.includes('improve attendance') || q.includes('classes')) {
      if (!attendance.hasData) {
        return {
          reply: "I don't have your attendance records yet. Please enter your subject-wise attendance to get your personalized clearance plan.",
          intent: 'INTENT_ATTENDANCE'
        };
      }
      if (attendance.belowTargetCount === 0) {
        return {
          reply: `Great news! Your overall attendance is **${attendance.overallAttendance}%**, and all your subjects meet or exceed the ${attendance.threshold}% threshold. No remedial clearance is required!`,
          intent: 'INTENT_ATTENDANCE'
        };
      }
      const worst = attendance.belowTargetSubjects[0];
      return {
        reply: `Your overall attendance is **${attendance.overallAttendance}%** (configured target: ${attendance.threshold}%). You have **${attendance.belowTargetCount}** subject(s) below target.\n\nMost urgent: **${worst.subjectName}** at **${worst.percentage}%** (${worst.attendedClasses}/${worst.totalClasses} classes attended).\n\n**Action Plan:** Attending your next **${worst.neededForClearance > 0 ? worst.neededForClearance : 3}** consecutive scheduled classes without absence will bring this subject back above the ${attendance.threshold}% mark.`,
        intent: 'INTENT_ATTENDANCE'
      };
    }

    // 5. What should I study this week? / Study plan
    if (q.includes('study this week') || q.includes('study plan') || q.includes('what should i study')) {
      const topSubject = academic.hasData && academic.lowestSubject ? academic.lowestSubject.name : null;
      const topSkill = skills.hasData && skills.skillsToImprove.length > 0 ? skills.skillsToImprove[0].skill : null;
      
      return {
        reply: `### Recommended Study Focus This Week\n\nBased on your weakest parameters:\n1. **${topSubject || 'Academic Core'}:** Review difficult chapter concepts and past test questions (${academic.lowestSubject ? academic.lowestSubject.percentage : 60}% current standing).\n2. **${topSkill || 'Technical Skills'}:** Dedicate 2-3 hours to building a practical mini-project in ${topSkill || 'your target language'}.\n3. **Coursework:** Submit any pending assignments before the upcoming cut-off.\n\nCheck your **Personalized Weekly Study Plan** below for a detailed day-by-day timetable!`,
        intent: 'INTENT_STUDY_PLAN'
      };
    }

    // 6. Am I ready for my career? / Career readiness
    if (q.includes('ready for my career') || q.includes('career readiness') || q.includes('am i ready')) {
      if (!skills.hasData) {
        return {
          reply: "I don't have enough skill information recorded. Please add your skills and target career goal to evaluate your readiness.",
          intent: 'INTENT_CAREER_READY'
        };
      }
      return {
        reply: `Your current Role Readiness for **${skills.careerGoal}** is **${skills.readinessPercentage}%**.\n\n- **Mastered / Strong Competencies:** ${skills.strongSkills.length > 0 ? skills.strongSkills.map((s) => s.skill).join(', ') : 'In progress'}\n- **Top Skills to Develop:** ${skills.skillsToImprove.slice(0, 3).map((s) => `${s.skill} (${s.gap}% gap)`).join(', ')}\n\n*This is a prototype calculation based on your self-assessed skill levels and standard industry benchmarks.*`,
        intent: 'INTENT_CAREER_READY'
      };
    }

    // 7. Explain my analysis
    if (q.includes('explain') || q.includes('why') || q.includes('how was this calculated')) {
      return {
        reply: `### How CampusMind Analyzed Your Data\n\nYour Academic Support Indicator is evaluated using transparent prototype contribution weights:\n- **Biometric Attendance (35% weight):** Your score is ${attendance.hasData ? `${attendance.overallAttendance}%` : 'Not entered'}.\n- **Academic Subject Marks (30% weight):** Your score is ${academic.hasData ? `${academic.overallPercentage}%` : 'Not entered'}.\n- **Assignment Completion (20% weight):** Your score is ${assignments.hasData ? `${assignments.completionPercentage}%` : 'Not entered'}.\n- **Career Skill Readiness (15% weight):** Your score is ${skills.hasData ? `${skills.readinessPercentage}%` : 'Not entered'}.\n\nClick **"Why did CampusMind generate this insight?"** on your dashboard to inspect full factor attributions and your supporting data.`,
        intent: 'INTENT_EXPLAIN'
      };
    }

    // Fallback using actual data
    return {
      reply: `I analyzed your question regarding your profile (${studentData.name || 'Student'}). You are currently studying ${studentData.program || 'your degree'} with a career target of **${studentData.careerGoal || 'Software Engineer'}**.\n\nYou can ask me:\n- *"What is my weakest subject?"*\n- *"What is affecting my performance?"*\n- *"Which skill should I learn first?"*\n- *"How can I improve my attendance?"*\n- *"What should I study this week?"*`,
      intent: 'INTENT_GENERAL'
    };
  }
};

export default analysisService;
