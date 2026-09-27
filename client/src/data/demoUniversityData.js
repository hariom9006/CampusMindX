/**
 * CampusMind X - Demo University LMS Data
 * Provides realistic academic, attendance, assignment, and curriculum payloads
 * for the Demo LMS Connector simulation.
 * Clearly marked as Demo Integration data.
 */

export const SUPPORTED_UNIVERSITIES = [
  {
    id: 'galgotias',
    name: 'Galgotias University',
    code: 'GU',
    lmsType: 'iCloudEMS & Moodle Student Portal',
    authType: 'University SSO (OAuth 2.0)',
    status: 'live',
    isLive: true,
    isDemo: false,
    defaultStudentId: '24BCA1089',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&auto=format&fit=crop&q=80',
    description: 'Official ERP integration with real-time student registry, attendance telemetry, and marks records.'
  },
  {
    id: 'delhi_university',
    name: 'University of Delhi (DU)',
    code: 'DU',
    lmsType: 'Samarth eGov ERP Portal',
    authType: 'Samarth SSO & Digital Locker',
    status: 'live',
    isLive: true,
    isDemo: false,
    defaultStudentId: '24DU5091',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&auto=format&fit=crop&q=80',
    description: 'Official Samarth eGov OAuth integration for affiliated colleges and departments.'
  },
  {
    id: 'mumbai_univ',
    name: 'University of Mumbai',
    code: 'MU',
    lmsType: 'MU Digital Portal & Canvas LMS',
    authType: 'Institutional Single Sign-On',
    status: 'live',
    isLive: true,
    isDemo: false,
    defaultStudentId: '24MU3042',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&auto=format&fit=crop&q=80',
    description: 'Digital transcript and continuous evaluation system.'
  },
  {
    id: 'amity',
    name: 'Amity University',
    code: 'AMIZONE',
    lmsType: 'Amizone Student Intranet',
    authType: 'Amizone Student ID SSO',
    status: 'live',
    isLive: true,
    isDemo: false,
    defaultStudentId: '24AM7821',
    logo: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=100&auto=format&fit=crop&q=80',
    description: 'Integrated semester grade book, lecture telemetry, and assignment vault.'
  },
  {
    id: 'state_tech_univ',
    name: 'State Technical University',
    code: 'STU',
    lmsType: 'State ERP Portal (No API Gateway)',
    authType: 'Unsupported',
    status: 'unsupported',
    isLive: false,
    isDemo: false,
    defaultStudentId: '24STU1001',
    logo: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=100&auto=format&fit=crop&q=80',
    description: 'This university does not currently provide a supported integration for CampusMind X.'
  },
  {
    id: 'demo_lms',
    name: 'Demo University LMS [Instant Test]',
    code: 'DEMO-U',
    lmsType: 'CampusMind Synthetic Sandbox',
    authType: 'Demo SSO / Quick Connect',
    status: 'demo_sandbox',
    isLive: false,
    isDemo: true,
    defaultStudentId: 'DEMO2026',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=100&auto=format&fit=crop&q=80',
    description: 'Preconfigured testing connector with instant token issuance and simulated academic records.'
  }
];

export const DEMO_LMS_PAYLOAD = {
  student: {
    name: 'Aarav Sharma',
    admissionId: 'GU2024-BCA1042',
    university: 'Galgotias University (LMS Portal)',
    program: 'Bachelor of Computer Applications (BCA)',
    semester: '5th Semester',
    academicYear: '2025-2026',
    email: 'aarav.sharma@campus.edu',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  academics: {
    cgpa: 7.42,
    overallPercentage: 71,
    subjects: [
      {
        id: 'SUB-301',
        code: 'BCA-501',
        name: 'Data Structures & Algorithms',
        internalMarks: 24, // out of 30
        externalMarks: 54, // out of 70
        totalMarks: 78,
        maxMarks: 100,
        percentage: 78,
        grade: 'A',
        credits: 4
      },
      {
        id: 'SUB-302',
        code: 'BCA-502',
        name: 'Database Management Systems (DBMS)',
        internalMarks: 22,
        externalMarks: 52,
        totalMarks: 74,
        maxMarks: 100,
        percentage: 74,
        grade: 'B+',
        credits: 4
      },
      {
        id: 'SUB-303',
        code: 'BCA-503',
        name: 'Computer Networks',
        internalMarks: 18,
        externalMarks: 47,
        totalMarks: 65,
        maxMarks: 100,
        percentage: 65,
        grade: 'B',
        credits: 4
      },
      {
        id: 'SUB-304',
        code: 'BCA-504',
        name: 'Java Programming & OOP',
        internalMarks: 25,
        externalMarks: 47,
        totalMarks: 72,
        maxMarks: 100,
        percentage: 72,
        grade: 'B+',
        credits: 4
      },
      {
        id: 'SUB-305',
        code: 'BCA-505',
        name: 'Artificial Intelligence & Machine Learning',
        internalMarks: 27,
        externalMarks: 54,
        totalMarks: 81,
        maxMarks: 100,
        percentage: 81,
        grade: 'A+',
        credits: 3
      }
    ],
    semesterTrend: [
      { semester: 'Sem 1', cgpa: 7.8, percentage: 76 },
      { semester: 'Sem 2', cgpa: 7.6, percentage: 74 },
      { semester: 'Sem 3', cgpa: 7.5, percentage: 73 },
      { semester: 'Sem 4', cgpa: 7.3, percentage: 70 },
      { semester: 'Sem 5 (Current)', cgpa: 7.42, percentage: 71 }
    ]
  },
  attendance: {
    overallPercentage: 68,
    totalClassesScheduled: 240,
    totalClassesAttended: 164,
    totalClassesMissed: 76,
    configuredThreshold: 75,
    subjects: [
      {
        name: 'Data Structures & Algorithms',
        totalClasses: 48,
        attendedClasses: 39,
        percentage: 81,
        status: 'Healthy',
        requiredToClear: 0
      },
      {
        name: 'Database Management Systems',
        totalClasses: 48,
        attendedClasses: 36,
        percentage: 75,
        status: 'Healthy',
        requiredToClear: 0
      },
      {
        name: 'Computer Networks',
        totalClasses: 48,
        attendedClasses: 29,
        percentage: 61,
        status: 'Attention Required',
        requiredToClear: 7
      },
      {
        name: 'Java Programming & OOP',
        totalClasses: 48,
        attendedClasses: 35,
        percentage: 73,
        status: 'Borderline',
        requiredToClear: 2
      },
      {
        name: 'AI & Machine Learning',
        totalClasses: 48,
        attendedClasses: 25,
        percentage: 52,
        status: 'Critical Alert',
        requiredToClear: 11
      }
    ]
  },
  assignments: {
    total: 24,
    completed: 18,
    pending: 4,
    late: 2,
    completionRate: 82,
    recentList: [
      { title: 'B-Tree & Indexing Simulation', subject: 'DBMS', status: 'Completed', score: '19/20', dueDate: 'Sep 18, 2026' },
      { title: 'Subnet Masking & CIDR Problem Set', subject: 'Computer Networks', status: 'Pending', score: 'Pending', dueDate: 'Sep 30, 2026' },
      { title: 'Socket Programming Client-Server Lab', subject: 'Computer Networks', status: 'Pending', score: 'Pending', dueDate: 'Oct 04, 2026' },
      { title: 'A* Search Pathfinding Algorithm', subject: 'AI/ML', status: 'Completed', score: '20/20', dueDate: 'Sep 12, 2026' },
      { title: 'Multithreading Chat Server', subject: 'Java OOP', status: 'Late Submitted', score: '16/20', dueDate: 'Sep 22, 2026' }
    ]
  },
  examinations: {
    upcoming: [
      { subject: 'Computer Networks Mid-Term', date: 'Oct 14, 2026', time: '10:00 AM - 01:00 PM', hall: 'Hall B-204' },
      { subject: 'DBMS Practical Examination', date: 'Oct 18, 2026', time: '02:00 PM - 05:00 PM', hall: 'Lab 4' }
    ],
    previous: [
      { subject: 'AI & ML Quiz 1', date: 'Aug 28, 2026', score: '18/20', status: 'Pass' },
      { subject: 'DSA Laboratory Evaluation', date: 'Sep 05, 2026', score: '22/25', status: 'Pass' }
    ]
  },
  skills: [
    { name: 'React', currentLevel: 80, targetLevel: 80, gap: 0, priority: 'Low Gap' },
    { name: 'JavaScript (ES6+)', currentLevel: 85, targetLevel: 85, gap: 0, priority: 'Low Gap' },
    { name: 'HTML5 & CSS3', currentLevel: 90, targetLevel: 90, gap: 0, priority: 'Low Gap' },
    { name: 'Node.js & Express', currentLevel: 45, targetLevel: 80, gap: 35, priority: 'High Gap' },
    { name: 'MongoDB & Mongoose', currentLevel: 50, targetLevel: 75, gap: 25, priority: 'High Gap' },
    { name: 'REST APIs & JWT Auth', currentLevel: 55, targetLevel: 80, gap: 25, priority: 'High Gap' },
    { name: 'Git & GitHub Workflows', currentLevel: 75, targetLevel: 80, gap: 5, priority: 'Low Gap' },
    { name: 'System Design Basics', currentLevel: 30, targetLevel: 70, gap: 40, priority: 'Critical Gap' },
    { name: 'Unit Testing (Jest/RTL)', currentLevel: 35, targetLevel: 65, gap: 30, priority: 'Medium Gap' }
  ],
  certifications: [
    { name: 'Meta Front-End Developer Professional Certificate', issuer: 'Coursera', date: 'June 2026', verified: true },
    { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', date: 'August 2026', verified: true }
  ],
  projects: [
    { name: 'CampusMarket — Student Peer Marketplace', tech: 'React, Node.js, Express, MongoDB', status: 'Completed' },
    { name: 'AI Attendance Verifier', tech: 'Python, OpenCV, FastAPI', status: 'In Progress' }
  ],
  authorizedDocuments: [
    { name: 'Semester_4_Official_Marksheet.pdf', size: '245 KB', type: 'PDF', dateUploaded: 'Sep 24, 2026', status: 'Parsed & Verified' },
    { name: 'AWS_Cloud_Certificate.pdf', size: '180 KB', type: 'PDF', dateUploaded: 'Aug 15, 2026', status: 'Verified' }
  ]
};

export default {
  SUPPORTED_UNIVERSITIES,
  DEMO_LMS_PAYLOAD
};
