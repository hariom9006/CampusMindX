/**
 * CampusMind X - Academic Performance Data
 * Phase 1 Prototype Dataset
 */

export const studentAcademicData = {
  semesterHistory: [
    { semester: "Sem 1", gpa: 7.8, batchAvg: 7.2, credits: 20 },
    { semester: "Sem 2", gpa: 7.6, batchAvg: 7.3, credits: 22 },
    { semester: "Sem 3", gpa: 7.5, batchAvg: 7.1, credits: 22 },
    { semester: "Sem 4", gpa: 7.1, batchAvg: 7.0, credits: 20 },
    { semester: "Sem 5 (Current)", gpa: 7.1, batchAvg: 7.25, credits: 20 }
  ],

  currentSubjects: [
    {
      code: "BCA-501",
      name: "Full Stack Web Technologies",
      credits: 4,
      instructor: "Prof. Rajesh Kannan",
      score: 84, // 84%
      grade: "A",
      status: "Strong",
      internalScore: 26, // out of 30
      assignmentScore: 88,
      trend: "up"
    },
    {
      code: "BCA-502",
      name: "Database Management Systems",
      credits: 4,
      instructor: "Dr. Ananya Roy",
      score: 78,
      grade: "B+",
      status: "Good",
      internalScore: 23,
      assignmentScore: 75,
      trend: "stable"
    },
    {
      code: "BCA-503",
      name: "Software Engineering & Agile",
      credits: 3,
      instructor: "Prof. Devendra Singh",
      score: 72,
      grade: "B",
      status: "Satisfactory",
      internalScore: 21,
      assignmentScore: 68,
      trend: "stable"
    },
    {
      code: "BCA-504",
      name: "Computer Networks & Protocols",
      credits: 4,
      instructor: "Dr. Alok Verma",
      score: 64,
      grade: "C+",
      status: "Needs Attention",
      internalScore: 18,
      assignmentScore: 60,
      trend: "down"
    },
    {
      code: "BCA-505",
      name: "Data Structures & Algorithms II",
      credits: 4,
      instructor: "Dr. Sunita Kulkarni",
      score: 58,
      grade: "C",
      status: "At Risk",
      internalScore: 16,
      assignmentScore: 50,
      trend: "down"
    }
  ],

  assignmentStatus: {
    total: 21,
    completed: 13,
    pending: 5,
    overdue: 3,
    completionPercentage: 62, // 62%
    recentSubmissions: [
      {
        id: "ASN-101",
        title: "React Component Lifecycle & State",
        subject: "Full Stack Web Technologies",
        dueDate: "2026-09-18",
        submittedDate: "2026-09-17",
        status: "Graded",
        score: "92/100"
      },
      {
        id: "ASN-102",
        title: "SQL Indexing & Normalization Queries",
        subject: "Database Management Systems",
        dueDate: "2026-09-21",
        submittedDate: "2026-09-20",
        status: "Graded",
        score: "80/100"
      },
      {
        id: "ASN-103",
        title: "TCP/IP Socket Programming in C",
        subject: "Computer Networks & Protocols",
        dueDate: "2026-09-24",
        submittedDate: "2026-09-26",
        status: "Late Submission",
        score: "Pending"
      },
      {
        id: "ASN-104",
        title: "Dijkstra & Minimum Spanning Trees Implementation",
        subject: "Data Structures & Algorithms II",
        dueDate: "2026-09-25",
        submittedDate: null,
        status: "Overdue",
        score: "-"
      }
    ]
  },

  departmentOverview: {
    department: "School of Computing & IT",
    averageCgpa: 7.28,
    passPercentage: 86.4,
    totalEnrolled: 420,
    studentsAtRisk: 42,
    studentsExemplary: 88,
    semesterPerformanceDist: [
      { range: "9.0 - 10.0", count: 34, color: "#10b981" },
      { range: "8.0 - 8.9", count: 112, color: "#06b6d4" },
      { range: "7.0 - 7.9", count: 164, color: "#3b82f6" },
      { range: "6.0 - 6.9", count: 68, color: "#f59e0b" },
      { range: "< 6.0", count: 42, color: "#ef4444" }
    ]
  }
};
