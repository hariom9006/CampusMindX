/**
 * CampusMind X - Attendance Analytics Data
 * Phase 1 Prototype Dataset
 */

export const studentAttendanceData = {
  overallPercentage: 68, // 68%
  requiredThreshold: 75,
  totalClassesHeld: 140,
  totalClassesAttended: 95,
  missedClasses: 45,
  shortageCount: 10, // classes needed to reach 75%
  riskWarning: "Action Required: 10 consecutive attended lectures required to attain 75% exam clearance.",

  subjectWiseAttendance: [
    {
      subject: "Full Stack Web Tech",
      code: "BCA-501",
      attended: 26,
      total: 33,
      percentage: 79,
      status: "Safe",
      color: "#10b981",
      faculty: "Prof. Rajesh Kannan"
    },
    {
      subject: "Database Management",
      code: "BCA-502",
      attended: 23,
      total: 31,
      percentage: 74,
      status: "Marginal",
      color: "#f59e0b",
      faculty: "Dr. Ananya Roy"
    },
    {
      subject: "Software Engineering",
      code: "BCA-503",
      attended: 18,
      total: 25,
      percentage: 72,
      status: "Marginal",
      color: "#f59e0b",
      faculty: "Prof. Devendra Singh"
    },
    {
      subject: "Data Structures & Algo",
      code: "BCA-505",
      attended: 16,
      total: 26,
      percentage: 62,
      status: "Critical Deficit",
      color: "#ef4444",
      faculty: "Dr. Sunita Kulkarni"
    },
    {
      subject: "Computer Networks",
      code: "BCA-504",
      attended: 12,
      total: 25,
      percentage: 48,
      status: "Severe Deficit",
      color: "#ef4444",
      faculty: "Dr. Alok Verma"
    }
  ],

  weeklyTrend: [
    { week: "Wk 1", attendance: 88, threshold: 75 },
    { week: "Wk 2", attendance: 82, threshold: 75 },
    { week: "Wk 3", attendance: 76, threshold: 75 },
    { week: "Wk 4", attendance: 70, threshold: 75 },
    { week: "Wk 5", attendance: 64, threshold: 75 },
    { week: "Wk 6", attendance: 58, threshold: 75 },
    { week: "Wk 7", attendance: 66, threshold: 75 },
    { week: "Wk 8", attendance: 68, threshold: 75 }
  ],

  monthlyComparison: [
    { month: "July", rate: 85, batchAvg: 82 },
    { month: "August", rate: 71, batchAvg: 80 },
    { month: "September", rate: 64, batchAvg: 79 }
  ],

  absenceTimeline: [
    { date: "2026-09-24", subject: "Computer Networks", slot: "09:00 - 10:30 AM", reason: "Medical Leave (Unverified)" },
    { date: "2026-09-23", subject: "Data Structures Lab", slot: "02:00 - 04:00 PM", reason: "Unexcused" },
    { date: "2026-09-19", subject: "Computer Networks", slot: "11:00 - 12:30 PM", reason: "Unexcused" },
    { date: "2026-09-17", subject: "Software Engineering", slot: "10:00 - 11:30 AM", reason: "Campus Hackathon Prep" }
  ]
};
