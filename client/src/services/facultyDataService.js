/**
 * CampusMind X - Faculty Personal Data Service
 * Manages localStorage persistence for Faculty Class Analysis Mode.
 * Strictly separated from fictional demo data (Dr. Sunita Kulkarni) and Student/Admin data.
 */

const STORAGE_KEY_DATA = 'campusmind_faculty_class_data';
const STORAGE_KEY_RESULTS = 'campusmind_faculty_analysis_results';

export const DEFAULT_FACULTY_CLASS_TEMPLATE = {
  facultyInfo: {
    facultyName: 'Dr. Priya Sharma',
    department: 'Computer Applications',
    subject: 'Computer Networks',
    semester: '5',
    section: 'A',
    academicYear: '2025-2026',
    numberOfStudents: 8,
    courseProgram: 'BCA (Honours)',
    classType: 'Theory + Laboratory'
  },
  thresholds: {
    attendanceTarget: 75,
    performanceTarget: 65,
    assignmentTarget: 70
  },
  topics: [
    { name: 'OSI & TCP/IP Architecture', maxMarks: 25, avgMarks: 21 },
    { name: 'Data Link Layer & Framing', maxMarks: 25, avgMarks: 18 },
    { name: 'Network Layer & IP Routing', maxMarks: 25, avgMarks: 15 },
    { name: 'Transport Layer & TCP Flow Control', maxMarks: 25, avgMarks: 14 }
  ],
  students: [
    {
      id: 'STU-01',
      name: 'Aarav Sharma',
      rollNo: '22BCA1042',
      quizMarks: 14,
      midTermMarks: 28,
      assignmentMarks: 18,
      practicalMarks: 16,
      externalMarks: 52,
      totalMarks: 64, // out of 100
      maxMarks: 100,
      totalClasses: 48,
      attendedClasses: 33, // 68.7%
      totalAssignments: 8,
      completedAssignments: 5,
      pendingAssignments: 2,
      overdueAssignments: 1,
      skills: [
        { name: 'Network Topologies', level: 65 },
        { name: 'Socket Programming', level: 40 },
        { name: 'Wireshark Analysis', level: 45 }
      ]
    },
    {
      id: 'STU-02',
      name: 'Riya Sen',
      rollNo: '22BCA1018',
      quizMarks: 18,
      midTermMarks: 36,
      assignmentMarks: 23,
      practicalMarks: 22,
      externalMarks: 76,
      totalMarks: 85,
      maxMarks: 100,
      totalClasses: 48,
      attendedClasses: 44, // 91.6%
      totalAssignments: 8,
      completedAssignments: 8,
      pendingAssignments: 0,
      overdueAssignments: 0,
      skills: [
        { name: 'Network Topologies', level: 85 },
        { name: 'Socket Programming', level: 80 },
        { name: 'Wireshark Analysis', level: 75 }
      ]
    },
    {
      id: 'STU-03',
      name: 'Vikram Joshi',
      rollNo: '22BCA1089',
      quizMarks: 11,
      midTermMarks: 22,
      assignmentMarks: 14,
      practicalMarks: 13,
      externalMarks: 44,
      totalMarks: 53,
      maxMarks: 100,
      totalClasses: 48,
      attendedClasses: 28, // 58.3%
      totalAssignments: 8,
      completedAssignments: 4,
      pendingAssignments: 2,
      overdueAssignments: 2,
      skills: [
        { name: 'Network Topologies', level: 50 },
        { name: 'Socket Programming', level: 30 },
        { name: 'Wireshark Analysis', level: 25 }
      ]
    },
    {
      id: 'STU-04',
      name: 'Sneha Patel',
      rollNo: '22BCA1055',
      quizMarks: 16,
      midTermMarks: 32,
      assignmentMarks: 20,
      practicalMarks: 19,
      externalMarks: 68,
      totalMarks: 76,
      maxMarks: 100,
      totalClasses: 48,
      attendedClasses: 39, // 81.2%
      totalAssignments: 8,
      completedAssignments: 7,
      pendingAssignments: 1,
      overdueAssignments: 0,
      skills: [
        { name: 'Network Topologies', level: 75 },
        { name: 'Socket Programming', level: 70 },
        { name: 'Wireshark Analysis', level: 65 }
      ]
    },
    {
      id: 'STU-05',
      name: 'Karan Mehra',
      rollNo: '22BCA1033',
      quizMarks: 13,
      midTermMarks: 26,
      assignmentMarks: 16,
      practicalMarks: 15,
      externalMarks: 50,
      totalMarks: 60,
      maxMarks: 100,
      totalClasses: 48,
      attendedClasses: 35, // 72.9%
      totalAssignments: 8,
      completedAssignments: 5,
      pendingAssignments: 2,
      overdueAssignments: 1,
      skills: [
        { name: 'Network Topologies', level: 60 },
        { name: 'Socket Programming', level: 45 },
        { name: 'Wireshark Analysis', level: 40 }
      ]
    },
    {
      id: 'STU-06',
      name: 'Ananya Verma',
      rollNo: '22BCA1012',
      quizMarks: 19,
      midTermMarks: 38,
      assignmentMarks: 24,
      practicalMarks: 24,
      externalMarks: 82,
      totalMarks: 91,
      maxMarks: 100,
      totalClasses: 48,
      attendedClasses: 46, // 95.8%
      totalAssignments: 8,
      completedAssignments: 8,
      pendingAssignments: 0,
      overdueAssignments: 0,
      skills: [
        { name: 'Network Topologies', level: 90 },
        { name: 'Socket Programming', level: 90 },
        { name: 'Wireshark Analysis', level: 85 }
      ]
    },
    {
      id: 'STU-07',
      name: 'Rohan Gupta',
      rollNo: '22BCA1071',
      quizMarks: 12,
      midTermMarks: 24,
      assignmentMarks: 15,
      practicalMarks: 14,
      externalMarks: 48,
      totalMarks: 58,
      maxMarks: 100,
      totalClasses: 48,
      attendedClasses: 29, // 60.4%
      totalAssignments: 8,
      completedAssignments: 4,
      pendingAssignments: 3,
      overdueAssignments: 1,
      skills: [
        { name: 'Network Topologies', level: 55 },
        { name: 'Socket Programming', level: 35 },
        { name: 'Wireshark Analysis', level: 30 }
      ]
    },
    {
      id: 'STU-08',
      name: 'Tanvi Nair',
      rollNo: '22BCA1064',
      quizMarks: 17,
      midTermMarks: 34,
      assignmentMarks: 21,
      practicalMarks: 20,
      externalMarks: 72,
      totalMarks: 80,
      maxMarks: 100,
      totalClasses: 48,
      attendedClasses: 42, // 87.5%
      totalAssignments: 8,
      completedAssignments: 7,
      pendingAssignments: 1,
      overdueAssignments: 0,
      skills: [
        { name: 'Network Topologies', level: 80 },
        { name: 'Socket Programming', level: 75 },
        { name: 'Wireshark Analysis', level: 70 }
      ]
    }
  ]
};

export function saveFacultyData(data) {
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving faculty class data:', error);
    return false;
  }
}

export function loadFacultyData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading faculty class data:', error);
    return null;
  }
}

export function updateFacultyData(partialData) {
  try {
    const current = loadFacultyData() || DEFAULT_FACULTY_CLASS_TEMPLATE;
    const merged = { ...current, ...partialData };
    return saveFacultyData(merged);
  } catch (error) {
    console.error('Error updating faculty class data:', error);
    return false;
  }
}

export function clearFacultyData() {
  try {
    localStorage.removeItem(STORAGE_KEY_DATA);
    localStorage.removeItem(STORAGE_KEY_RESULTS);
    return true;
  } catch (error) {
    console.error('Error clearing faculty data:', error);
    return false;
  }
}

export function saveFacultyAnalysisResults(results) {
  try {
    localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(results));
    return true;
  } catch (error) {
    console.error('Error saving faculty analysis results:', error);
    return false;
  }
}

export function loadFacultyAnalysisResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESULTS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading faculty analysis results:', error);
    return null;
  }
}

const facultyDataService = {
  saveFacultyData,
  loadFacultyData,
  updateFacultyData,
  clearFacultyData,
  saveFacultyAnalysisResults,
  loadFacultyAnalysisResults,
  DEFAULT_FACULTY_CLASS_TEMPLATE
};

export default facultyDataService;
