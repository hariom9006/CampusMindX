import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
  User,
  Department,
  Faculty,
  Subject,
  Student,
  Attendance,
  Marks,
  Assignment,
  Skill,
  Project,
  Recommendation,
  Notification
} from './models/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusmind_x';

export const seedDatabase = async () => {
  try {
    console.log('🔄 [CampusMind Seeder] Connecting to MongoDB...');
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    console.log('✓ Connected to MongoDB. Purging previous data collections...');

    // Clean existing collections
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Faculty.deleteMany({}),
      Subject.deleteMany({}),
      Student.deleteMany({}),
      Attendance.deleteMany({}),
      Marks.deleteMany({}),
      Assignment.deleteMany({}),
      Skill.deleteMany({}),
      Project.deleteMany({}),
      Recommendation.deleteMany({}),
      Notification.deleteMany({})
    ]);

    console.log('🌱 Seeding Departments...');
    const computingDept = await Department.create({
      name: 'School of Computing & IT',
      code: 'SOCIT',
      description: 'Department of Computer Applications, Software Engineering & Systems',
      headOfDepartment: 'Dr. Sunita Kulkarni',
      building: 'Alan Turing Computing Complex'
    });

    const cseDept = await Department.create({
      name: 'School of Computer Science & Engineering',
      code: 'SCSE',
      description: 'Undergraduate and Graduate Computer Science & AI Systems',
      headOfDepartment: 'Dr. K. Venkatesh',
      building: 'Von Neumann Hall'
    });

    console.log('🌱 Seeding Faculty...');
    const facultySunita = await Faculty.create({
      name: 'Dr. Sunita Kulkarni',
      email: 's.kulkarni@campus.edu.in',
      department: computingDept._id,
      designation: 'Associate Professor & BCA Chair',
      officeHours: 'Mon, Wed, Fri 2:00 PM - 4:00 PM',
      room: 'Complex Block B - Room 304',
      specialization: ['Data Structures', 'Algorithm Optimization', 'Machine Learning in Pedagogy']
    });

    const facultyRajesh = await Faculty.create({
      name: 'Prof. Rajesh Kannan',
      email: 'r.kannan@campus.edu.in',
      department: computingDept._id,
      designation: 'Assistant Professor',
      officeHours: 'Tue, Thu 10:00 AM - 12:00 PM',
      room: 'Complex Block B - Room 306',
      specialization: ['Full Stack Web Development', 'Microservices', 'Cloud Architecture']
    });

    const facultyAnanya = await Faculty.create({
      name: 'Dr. Ananya Roy',
      email: 'a.roy@campus.edu.in',
      department: computingDept._id,
      designation: 'Associate Professor',
      officeHours: 'Wed, Fri 11:00 AM - 1:00 PM',
      room: 'Complex Block A - Room 202',
      specialization: ['Database Management', 'Query Optimization', 'NoSQL Architectures']
    });

    const facultyAlok = await Faculty.create({
      name: 'Dr. Alok Verma',
      email: 'a.verma@campus.edu.in',
      department: computingDept._id,
      designation: 'Assistant Professor',
      officeHours: 'Mon, Thu 3:00 PM - 5:00 PM',
      room: 'Complex Block A - Room 208',
      specialization: ['Computer Networks', 'Network Security', 'Distributed Protocols']
    });

    console.log('🌱 Seeding Subjects for BCA Semester 5...');
    const subWeb = await Subject.create({
      name: 'Full Stack Web Technologies',
      code: 'BCA-501',
      department: computingDept._id,
      instructor: facultyRajesh._id,
      instructorName: facultyRajesh.name,
      credits: 4,
      semester: 5,
      description: 'Modern web architectures, React, Node.js, Express REST APIs, and state systems.'
    });

    const subDbms = await Subject.create({
      name: 'Database Management Systems',
      code: 'BCA-502',
      department: computingDept._id,
      instructor: facultyAnanya._id,
      instructorName: facultyAnanya.name,
      credits: 4,
      semester: 5,
      description: 'Relational database modeling, SQL indexing, ACID properties, and query execution plans.'
    });

    const subSe = await Subject.create({
      name: 'Software Engineering & Agile',
      code: 'BCA-503',
      department: computingDept._id,
      instructor: facultySunita._id,
      instructorName: facultySunita.name,
      credits: 3,
      semester: 5,
      description: 'Agile sprints, test-driven development, CI/CD pipelines, and software design patterns.'
    });

    const subNet = await Subject.create({
      name: 'Computer Networks & Protocols',
      code: 'BCA-504',
      department: computingDept._id,
      instructor: facultyAlok._id,
      instructorName: facultyAlok.name,
      credits: 4,
      semester: 5,
      description: 'TCP/IP stack, socket programming, flow control, routing algorithms, and network security.'
    });

    const subDsa = await Subject.create({
      name: 'Data Structures & Algorithms II',
      code: 'BCA-505',
      department: computingDept._id,
      instructor: facultySunita._id,
      instructorName: facultySunita.name,
      credits: 4,
      semester: 5,
      description: 'Advanced graph traversals, Dijkstra, Minimum Spanning Trees, Dynamic Programming.'
    });

    console.log('🌱 Seeding Hariom Anand & Cohort Students...');
    const aarav = await Student.create({
      name: 'Hariom Anand',
      enrollmentNumber: '22BCA1042',
      email: 'hariom.anand@campus.edu.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      program: 'BCA (Bachelor of Computer Applications)',
      shortProgram: 'BCA',
      semester: 5,
      department: computingDept._id,
      departmentName: computingDept.name,
      careerGoal: 'Full Stack Developer',
      advisor: facultySunita._id,
      advisorName: facultySunita.name,
      overallPerformance: 71,
      attendance: 68,
      assignmentCompletion: 62,
      academicSupportIndicator: 'Medium',
      riskLevel: 'Medium',
      riskScore: 48,
      currentCgpa: 7.42,
      predictedSemesterCgpa: 7.2,
      explainabilityFactors: [
        {
          factor: 'Low Lab Attendance in Data Structures',
          impact: '-14%',
          type: 'negative',
          description: 'Attendance in practical sessions dipped below the 70% threshold, hindering hands-on code reviews.'
        },
        {
          factor: 'Overdue Algorithmic Assignments',
          impact: '-9%',
          type: 'negative',
          description: '2 out of 3 recent assignments in Algorithms and Computer Networks were submitted late.'
        },
        {
          factor: 'Strong Full-Stack Project Scores',
          impact: '+16%',
          type: 'positive',
          description: 'High performance in Web Technologies sprint and React components laboratory.'
        },
        {
          factor: 'Consistent Internal Quiz Participation',
          impact: '+8%',
          type: 'positive',
          description: 'Maintained 90%+ engagement in mid-term quick formative quizzes.'
        }
      ]
    });

    const cohortStudents = await Student.insertMany([
      {
        name: 'Priya Patel',
        enrollmentNumber: '22BCA1043',
        email: 'priya.p@campus.edu.in',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        program: 'BCA',
        semester: 5,
        department: computingDept._id,
        departmentName: computingDept.name,
        careerGoal: 'AI/ML Engineer',
        advisor: facultySunita._id,
        advisorName: facultySunita.name,
        overallPerformance: 89,
        attendance: 94,
        assignmentCompletion: 96,
        academicSupportIndicator: 'Low',
        riskLevel: 'Low',
        riskScore: 12,
        currentCgpa: 8.95,
        predictedSemesterCgpa: 9.1
      },
      {
        name: 'Rohan Das',
        enrollmentNumber: '22BCA1044',
        email: 'rohan.d@campus.edu.in',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        program: 'BCA',
        semester: 5,
        department: computingDept._id,
        departmentName: computingDept.name,
        careerGoal: 'DevOps Engineer',
        advisor: facultySunita._id,
        advisorName: facultySunita.name,
        overallPerformance: 54,
        attendance: 52,
        assignmentCompletion: 48,
        academicSupportIndicator: 'High',
        riskLevel: 'High',
        riskScore: 78,
        currentCgpa: 6.1,
        predictedSemesterCgpa: 5.6
      },
      {
        name: 'Sneha Iyer',
        enrollmentNumber: '22BCA1045',
        email: 'sneha.i@campus.edu.in',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        program: 'BCA',
        semester: 5,
        department: computingDept._id,
        departmentName: computingDept.name,
        careerGoal: 'Cybersecurity Analyst',
        advisor: facultySunita._id,
        advisorName: facultySunita.name,
        overallPerformance: 78,
        attendance: 82,
        assignmentCompletion: 80,
        academicSupportIndicator: 'Low',
        riskLevel: 'Low',
        riskScore: 26,
        currentCgpa: 7.85,
        predictedSemesterCgpa: 8.0
      },
      {
        name: 'Kabir Mehta',
        enrollmentNumber: '22BCA1048',
        email: 'kabir.m@campus.edu.in',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        program: 'BCA',
        semester: 5,
        department: computingDept._id,
        departmentName: computingDept.name,
        careerGoal: 'Cloud Architect',
        advisor: facultySunita._id,
        advisorName: facultySunita.name,
        overallPerformance: 49,
        attendance: 46,
        assignmentCompletion: 42,
        academicSupportIndicator: 'High',
        riskLevel: 'High',
        riskScore: 84,
        currentCgpa: 5.8,
        predictedSemesterCgpa: 5.1
      }
    ]);

    console.log('🌱 Seeding Users (Password: Password123!)...');
    await User.create([
      {
        name: 'Hariom Anand',
        email: 'hariom.anand@campus.edu.in',
        password: 'Password123!',
        role: 'student',
        student: aarav._id
      },
      {
        name: 'Dr. Sunita Kulkarni',
        email: 's.kulkarni@campus.edu.in',
        password: 'Password123!',
        role: 'faculty',
        faculty: facultySunita._id
      },
      {
        name: 'Dean of Academic Affairs',
        email: 'admin@campus.edu.in',
        password: 'Password123!',
        role: 'admin'
      }
    ]);

    console.log('🌱 Seeding Attendance for Hariom Anand...');
    const weeklyData = [
      { week: 'Wk 1', attendance: 88, threshold: 75 },
      { week: 'Wk 2', attendance: 82, threshold: 75 },
      { week: 'Wk 3', attendance: 76, threshold: 75 },
      { week: 'Wk 4', attendance: 70, threshold: 75 },
      { week: 'Wk 5', attendance: 64, threshold: 75 },
      { week: 'Wk 6', attendance: 58, threshold: 75 },
      { week: 'Wk 7', attendance: 66, threshold: 75 },
      { week: 'Wk 8', attendance: 68, threshold: 75 }
    ];

    await Attendance.create([
      {
        student: aarav._id,
        subject: subWeb._id,
        subjectCode: subWeb.code,
        subjectName: subWeb.name,
        totalClasses: 33,
        attendedClasses: 26,
        percentage: 79,
        status: 'Safe',
        facultyName: facultyRajesh.name,
        weeklyHistory: weeklyData
      },
      {
        student: aarav._id,
        subject: subDbms._id,
        subjectCode: subDbms.code,
        subjectName: subDbms.name,
        totalClasses: 31,
        attendedClasses: 23,
        percentage: 74,
        status: 'Marginal',
        facultyName: facultyAnanya.name,
        weeklyHistory: weeklyData
      },
      {
        student: aarav._id,
        subject: subSe._id,
        subjectCode: subSe.code,
        subjectName: subSe.name,
        totalClasses: 25,
        attendedClasses: 18,
        percentage: 72,
        status: 'Marginal',
        facultyName: facultySunita.name,
        weeklyHistory: weeklyData
      },
      {
        student: aarav._id,
        subject: subNet._id,
        subjectCode: subNet.code,
        subjectName: subNet.name,
        totalClasses: 25,
        attendedClasses: 12,
        percentage: 48,
        status: 'Severe Deficit',
        facultyName: facultyAlok.name,
        weeklyHistory: weeklyData
      },
      {
        student: aarav._id,
        subject: subDsa._id,
        subjectCode: subDsa.code,
        subjectName: subDsa.name,
        totalClasses: 26,
        attendedClasses: 16,
        percentage: 62,
        status: 'Critical Deficit',
        facultyName: facultySunita.name,
        weeklyHistory: weeklyData
      }
    ]);

    console.log('🌱 Seeding Marks for Hariom Anand...');
    await Marks.create([
      {
        student: aarav._id,
        subject: subWeb._id,
        subjectCode: subWeb.code,
        subjectName: subWeb.name,
        internalMarks: 26,
        maxInternalMarks: 30,
        examMarks: 58,
        maxExamMarks: 70,
        totalMarks: 84,
        grade: 'A',
        status: 'Strong',
        semester: 5
      },
      {
        student: aarav._id,
        subject: subDbms._id,
        subjectCode: subDbms.code,
        subjectName: subDbms.name,
        internalMarks: 23,
        maxInternalMarks: 30,
        examMarks: 55,
        maxExamMarks: 70,
        totalMarks: 78,
        grade: 'B+',
        status: 'Good',
        semester: 5
      },
      {
        student: aarav._id,
        subject: subSe._id,
        subjectCode: subSe.code,
        subjectName: subSe.name,
        internalMarks: 21,
        maxInternalMarks: 30,
        examMarks: 51,
        maxExamMarks: 70,
        totalMarks: 72,
        grade: 'B',
        status: 'Satisfactory',
        semester: 5
      },
      {
        student: aarav._id,
        subject: subNet._id,
        subjectCode: subNet.code,
        subjectName: subNet.name,
        internalMarks: 18,
        maxInternalMarks: 30,
        examMarks: 46,
        maxExamMarks: 70,
        totalMarks: 64,
        grade: 'C+',
        status: 'Needs Attention',
        semester: 5
      },
      {
        student: aarav._id,
        subject: subDsa._id,
        subjectCode: subDsa.code,
        subjectName: subDsa.name,
        internalMarks: 16,
        maxInternalMarks: 30,
        examMarks: 42,
        maxExamMarks: 70,
        totalMarks: 58,
        grade: 'C',
        status: 'At Risk',
        semester: 5
      }
    ]);

    console.log('🌱 Seeding Assignments for Hariom Anand...');
    await Assignment.create([
      {
        student: aarav._id,
        subject: subWeb._id,
        subjectName: subWeb.name,
        title: 'React Component Lifecycle & State Machine',
        status: 'Graded',
        dueDate: new Date(Date.now() - 8 * 86400000),
        submissionDate: new Date(Date.now() - 9 * 86400000),
        score: '92/100'
      },
      {
        student: aarav._id,
        subject: subDbms._id,
        subjectName: subDbms.name,
        title: 'SQL Indexing & Normalization Queries',
        status: 'Graded',
        dueDate: new Date(Date.now() - 5 * 86400000),
        submissionDate: new Date(Date.now() - 6 * 86400000),
        score: '80/100'
      },
      {
        student: aarav._id,
        subject: subNet._id,
        subjectName: subNet.name,
        title: 'TCP/IP Socket Programming in C',
        status: 'Late Submission',
        dueDate: new Date(Date.now() - 2 * 86400000),
        submissionDate: new Date(),
        score: 'Pending'
      },
      {
        student: aarav._id,
        subject: subDsa._id,
        subjectName: subDsa.name,
        title: 'Dijkstra & Minimum Spanning Trees Implementation',
        status: 'Overdue',
        dueDate: new Date(Date.now() - 1 * 86400000),
        submissionDate: null,
        score: '-'
      }
    ]);

    console.log('🌱 Seeding Skills for Hariom Anand...');
    const skills = await Skill.create([
      {
        student: aarav._id,
        skillName: 'React.js & Frontend Architecture',
        category: 'Frontend',
        currentLevel: 78,
        targetLevel: 85,
        priority: 'Medium',
        status: 'Approaching Standard',
        description: 'Good understanding of hooks and state; requires practice with SSR and state machines.'
      },
      {
        student: aarav._id,
        skillName: 'Node.js, Express & REST APIs',
        category: 'Backend',
        currentLevel: 68,
        targetLevel: 80,
        priority: 'Medium',
        status: 'Moderate Gap',
        description: 'Familiar with basic routing; needs middleware design and JWT session management mastery.'
      },
      {
        student: aarav._id,
        skillName: 'Database Design & SQL / NoSQL',
        category: 'Database',
        currentLevel: 72,
        targetLevel: 75,
        priority: 'Low',
        status: 'Nearly Ready',
        description: 'Strong ER diagramming and indexing; slight gap in aggregation pipelines.'
      },
      {
        student: aarav._id,
        skillName: 'Data Structures & Algorithms',
        category: 'Core Computer Science',
        currentLevel: 52,
        targetLevel: 85,
        priority: 'High',
        status: 'Critical Gap',
        description: 'Requires urgent focus on Dynamic Programming, Trees, and Graph Traversal for technical rounds.'
      },
      {
        student: aarav._id,
        skillName: 'System Design & Microservices',
        category: 'Architecture',
        currentLevel: 42,
        targetLevel: 70,
        priority: 'High',
        status: 'Substantial Gap',
        description: 'Lacks knowledge of load balancing, caching (Redis), and event brokers.'
      },
      {
        student: aarav._id,
        skillName: 'Git, CI/CD & Cloud Basics',
        category: 'DevOps',
        currentLevel: 65,
        targetLevel: 75,
        priority: 'Medium',
        status: 'Moderate Gap',
        description: 'Comfortable with Git branching; needs Docker containerization workflow practice.'
      }
    ]);

    // Attach skill ids to aarav
    await Student.findByIdAndUpdate(aarav._id, { skills: skills.map((s) => s._id) });

    console.log('🌱 Seeding Projects for Hariom Anand...');
    const project = await Project.create({
      student: aarav._id,
      title: 'Campus Resource Management Portal',
      description: 'Full stack React and Express portal for university laboratory and asset reservation.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      status: 'Completed',
      grade: 'A',
      repoUrl: 'https://github.com/hariomanand/campus-resource-portal',
      liveUrl: 'https://campus-resource-demo.vercel.app'
    });
    await Student.findByIdAndUpdate(aarav._id, { $push: { projects: project._id } });

    console.log('🌱 Seeding Recommendations for Hariom Anand...');
    await Recommendation.create([
      {
        student: aarav._id,
        title: 'DSA Graph Algorithms Remedial Clinic',
        category: 'Academic Support',
        urgency: 'High',
        urgencyColor: 'red',
        estimatedTime: '3 Hours / Week',
        impactRating: '+14% Potential Exam Boost',
        rationale: 'SHAP feature analysis identified Data Structures internal assessment (58%) as the primary negative driver of your predicted semester GPA.',
        actionPlan: [
          'Attend Thursday 4:00 PM hands-on clinic with Teaching Assistant.',
          'Complete 5 assigned practice problems on Graph Traversals.',
          'Submit pending Dijkstra code assignment for partial credit review.'
        ],
        courseCode: 'BCA-505',
        linkText: 'Enroll in Clinic Slot'
      },
      {
        student: aarav._id,
        title: 'Attendance Recovery Sprint (Computer Networks)',
        category: 'Attendance Compliance',
        urgency: 'High',
        urgencyColor: 'red',
        estimatedTime: '2 Weeks',
        impactRating: 'Restore Exam Clearance (>75%)',
        rationale: 'Your attendance in Computer Networks currently stands at 48%. Attending the next 7 consecutive scheduled lectures will restore your status above 65%, avoiding disciplinary freeze.',
        actionPlan: [
          'Attend Monday & Wednesday 9:00 AM lectures without absence.',
          'Submit medical certificate for 24th Sept absence to Academic Dean office.',
          'Activate attendance reminder push notifications in CampusMind X.'
        ],
        courseCode: 'BCA-504',
        linkText: 'View Schedule & Reminders'
      },
      {
        student: aarav._id,
        title: 'Full-Stack Portfolio Capstone Acceleration',
        category: 'Career & Placement',
        urgency: 'Medium',
        urgencyColor: 'cyan',
        estimatedTime: '4 Hours / Weekend',
        impactRating: '+22% Skill Match for Campus Drives',
        rationale: 'Your Web Technologies score is 84%, showing high aptitude. Channeling this into an end-to-end full-stack portfolio will bridge the gap for 6th-semester early recruitments.',
        actionPlan: [
          'Integrate MongoDB Atlas with your BCA-501 Express backend.',
          'Deploy live demo on Vercel/Render with README documentation.',
          'Request project review from Prof. Rajesh Kannan.'
        ],
        courseCode: 'BCA-501',
        linkText: 'Explore Capstone Templates'
      }
    ]);

    console.log('🌱 Seeding Notifications for Hariom Anand...');
    await Notification.create([
      {
        student: aarav._id,
        type: 'alert',
        title: 'Attendance Shortage Alert',
        message: 'Computer Networks (BCA-504) is at 48%. Attending the next 7 classes is required for exam clearance.',
        urgent: true,
        link: '/student/attendance',
        read: false
      },
      {
        student: aarav._id,
        type: 'deadline',
        title: 'Overdue Assignment Notice',
        message: 'Dijkstra Implementation (BCA-505) was due yesterday. Submit today for partial credit.',
        urgent: true,
        link: '/student/performance',
        read: false
      },
      {
        student: aarav._id,
        type: 'event',
        title: 'DSA Remedial Clinic Scheduled',
        message: 'Dr. Sunita Kulkarni announced an XAI-recommended clinic session for this Thursday, 4:00 PM.',
        urgent: false,
        link: '/student/roadmap',
        read: true
      },
      {
        student: aarav._id,
        type: 'achievement',
        title: 'Web Technologies Excellence',
        message: 'Congratulations! Your React portfolio lab scored 92/100, ranking in top 5% of BCA Sem 5.',
        urgent: false,
        link: '/student/skills',
        read: true
      }
    ]);

    console.log('✅ [CampusMind Seeder] Complete database seeding successful!');
    return true;
  } catch (err) {
    console.error('❌ [CampusMind Seeder] Error during seeding:', err);
    throw err;
  }
};

// If run directly via CLI: node src/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  }).catch(() => {
    mongoose.connection.close();
    process.exit(1);
  });
}
