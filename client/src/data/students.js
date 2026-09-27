/**
 * CampusMind X - Mock Student Repository
 * Phase 1 Prototype Dataset
 */

export const currentStudent = {
  id: "STD-2024-0582",
  name: "Aarav Sharma",
  email: "aarav.sharma@campus.edu.in",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  program: "BCA (Bachelor of Computer Applications)",
  shortProgram: "BCA",
  department: "School of Computing & IT",
  semester: 5,
  batch: "2022-2025",
  rollNo: "22BCA1042",
  careerGoal: "Full Stack Developer",
  targetIndustry: "Cloud Software & SaaS",
  overallPerformance: 71, // 71%
  attendance: 68, // 68%
  assignmentCompletion: 62, // 62%
  academicSupportIndicator: "Medium",
  riskLevel: "Medium",
  riskScore: 48, // 0-100 scale (higher = higher risk)
  predictedSemesterCgpa: 7.2,
  currentCgpa: 7.42,
  advisor: "Dr. Sunita Kulkarni",
  advisorEmail: "s.kulkarni@campus.edu.in",
  status: "Active - Monitoring",
  lastActive: "Today, 10:45 AM",
  explainabilityFactors: [
    {
      factor: "Low Lab Attendance in Data Structures",
      impact: "-14%",
      type: "negative",
      description: "Attendance in practical sessions dipped below the 70% threshold, hindering hands-on code reviews."
    },
    {
      factor: "Overdue Algorithmic Assignments",
      impact: "-9%",
      type: "negative",
      description: "2 out of 3 recent assignments in Algorithms and Computer Networks were submitted late."
    },
    {
      factor: "Strong Full-Stack Project Scores",
      impact: "+16%",
      type: "positive",
      description: "High performance in Web Technologies sprint and React components laboratory."
    },
    {
      factor: "Consistent Internal Quiz Participation",
      impact: "+8%",
      type: "positive",
      description: "Maintained 90%+ engagement in mid-term quick formative quizzes."
    }
  ],
  statsSummary: {
    totalCreditsEarned: 84,
    requiredCredits: 120,
    backlogs: 0,
    codingHoursWeekly: 14.5
  }
};

export const allStudents = [
  currentStudent,
  {
    id: "STD-2024-0583",
    name: "Priya Patel",
    email: "priya.p@campus.edu.in",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    program: "BCA",
    department: "School of Computing & IT",
    semester: 5,
    rollNo: "22BCA1043",
    careerGoal: "AI/ML Engineer",
    overallPerformance: 89,
    attendance: 94,
    assignmentCompletion: 96,
    academicSupportIndicator: "Low",
    riskLevel: "Low",
    riskScore: 12,
    predictedSemesterCgpa: 9.1,
    currentCgpa: 8.95,
    status: "Exemplary",
    explainabilityFactors: [
      { factor: "High Attendance Consistency", impact: "+18%", type: "positive", description: "Consistently above 92% across all theoretical and lab courses." },
      { factor: "Early Assignment Submissions", impact: "+12%", type: "positive", description: "All submissions completed 48 hours prior to deadline." }
    ]
  },
  {
    id: "STD-2024-0584",
    name: "Rohan Das",
    email: "rohan.d@campus.edu.in",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    program: "BCA",
    department: "School of Computing & IT",
    semester: 5,
    rollNo: "22BCA1044",
    careerGoal: "DevOps Engineer",
    overallPerformance: 54,
    attendance: 52,
    assignmentCompletion: 48,
    academicSupportIndicator: "High",
    riskLevel: "High",
    riskScore: 78,
    predictedSemesterCgpa: 5.6,
    currentCgpa: 6.1,
    status: "Urgent Intervention Needed",
    explainabilityFactors: [
      { factor: "Severe Attendance Deficit in Networks", impact: "-24%", type: "negative", description: "Attendance at 49%, violates eligibility criteria for mid-terms." },
      { factor: "Missing Continuous Assessments", impact: "-20%", type: "negative", description: "Missed 3 laboratory evaluations." }
    ]
  },
  {
    id: "STD-2024-0585",
    name: "Sneha Iyer",
    email: "sneha.i@campus.edu.in",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    program: "BCA",
    department: "School of Computing & IT",
    semester: 5,
    rollNo: "22BCA1045",
    careerGoal: "Cybersecurity Analyst",
    overallPerformance: 78,
    attendance: 82,
    assignmentCompletion: 80,
    academicSupportIndicator: "Low",
    riskLevel: "Low",
    riskScore: 26,
    predictedSemesterCgpa: 8.0,
    currentCgpa: 7.85,
    status: "Steady",
    explainabilityFactors: [
      { factor: "Strong Problem-Solving in Cryptography", impact: "+15%", type: "positive", description: "Scored 92% on network security protocols." }
    ]
  },
  {
    id: "STD-2024-0586",
    name: "Vikram Rao",
    email: "vikram.r@campus.edu.in",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    program: "BCA",
    department: "School of Computing & IT",
    semester: 5,
    rollNo: "22BCA1046",
    careerGoal: "Data Analyst",
    overallPerformance: 64,
    attendance: 65,
    assignmentCompletion: 68,
    academicSupportIndicator: "Medium",
    riskLevel: "Medium",
    riskScore: 52,
    predictedSemesterCgpa: 6.7,
    currentCgpa: 6.9,
    status: "Active - Monitoring",
    explainabilityFactors: [
      { factor: "Declining Midterm Scores", impact: "-11%", type: "negative", description: "Statistical methods test scored 15 points below batch average." }
    ]
  },
  {
    id: "STD-2024-0587",
    name: "Ananya Sen",
    email: "ananya.s@campus.edu.in",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    program: "BCA",
    department: "School of Computing & IT",
    semester: 5,
    rollNo: "22BCA1047",
    careerGoal: "Product Manager",
    overallPerformance: 85,
    attendance: 90,
    assignmentCompletion: 92,
    academicSupportIndicator: "Low",
    riskLevel: "Low",
    riskScore: 18,
    predictedSemesterCgpa: 8.7,
    currentCgpa: 8.6,
    status: "Exemplary",
    explainabilityFactors: [
      { factor: "High Agile Project Leadership", impact: "+14%", type: "positive", description: "Earned distinction for software engineering sprint management." }
    ]
  },
  {
    id: "STD-2024-0588",
    name: "Kabir Mehta",
    email: "kabir.m@campus.edu.in",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    program: "BCA",
    department: "School of Computing & IT",
    semester: 5,
    rollNo: "22BCA1048",
    careerGoal: "Cloud Architect",
    overallPerformance: 49,
    attendance: 46,
    assignmentCompletion: 42,
    academicSupportIndicator: "High",
    riskLevel: "High",
    riskScore: 84,
    predictedSemesterCgpa: 5.1,
    currentCgpa: 5.8,
    status: "Critical Academic Notice",
    explainabilityFactors: [
      { factor: "Chronic Absence", impact: "-28%", type: "negative", description: "Missed 18 consecutive lectures across 3 core subjects." },
      { factor: "Incomplete Lab Submissions", impact: "-18%", type: "negative", description: "Zero submissions in Web Development Lab 3 & 4." }
    ]
  },
  {
    id: "STD-2024-0589",
    name: "Neha Verma",
    email: "neha.v@campus.edu.in",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    program: "BCA",
    department: "School of Computing & IT",
    semester: 5,
    rollNo: "22BCA1049",
    careerGoal: "UI/UX Engineer",
    overallPerformance: 76,
    attendance: 80,
    assignmentCompletion: 78,
    academicSupportIndicator: "Low",
    riskLevel: "Low",
    riskScore: 29,
    predictedSemesterCgpa: 7.9,
    currentCgpa: 7.8,
    status: "Steady",
    explainabilityFactors: [
      { factor: "Creative Frontend Output", impact: "+16%", type: "positive", description: "Highest UX score in human-computer interaction lab." }
    ]
  }
];
