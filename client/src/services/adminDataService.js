/**
 * CampusMind X - Administrator University Data Service
 * Manages localStorage persistence for University Institutional Analysis Mode.
 * Strictly separated from fictional demo data (Central Academic Directorate) and Student/Faculty data.
 */

const STORAGE_KEY_DATA = 'campusmind_admin_university_data';
const STORAGE_KEY_RESULTS = 'campusmind_admin_analysis_results';

export const DEFAULT_ADMIN_UNIVERSITY_TEMPLATE = {
  universityInfo: {
    universityName: 'Apex National Institute of Technology',
    academicYear: '2025-2026',
    numberOfDepartments: 4,
    numberOfStudents: 420,
    numberOfFaculty: 32,
    campusLocation: 'Central University Campus, Sector 4',
    programCategories: 'Engineering, Computing, Management'
  },
  thresholds: {
    attendanceTarget: 75,
    academicTarget: 70,
    assignmentTarget: 75
  },
  departments: [
    {
      id: 'DEP-01',
      name: 'Department of Computer Applications (BCA)',
      code: 'BCA',
      studentsCount: 120,
      facultyCount: 8,
      avgPerformance: 72,
      avgAttendance: 71, // below 75%
      assignmentCompletion: 68,
      studentsRequiringAttention: 14,
      headOfDepartment: 'Dr. Sunita Kulkarni'
    },
    {
      id: 'DEP-02',
      name: 'Department of Computer Science & Engineering (B.Tech)',
      code: 'B.Tech CSE',
      studentsCount: 180,
      facultyCount: 14,
      avgPerformance: 78,
      avgAttendance: 82,
      assignmentCompletion: 81,
      studentsRequiringAttention: 11,
      headOfDepartment: 'Dr. Rajesh Deshmukh'
    },
    {
      id: 'DEP-03',
      name: 'Department of Management Studies (BBA)',
      code: 'BBA',
      studentsCount: 75,
      facultyCount: 5,
      avgPerformance: 75,
      avgAttendance: 68, // below 75%
      assignmentCompletion: 69,
      studentsRequiringAttention: 9,
      headOfDepartment: 'Prof. Meenakshi Iyer'
    },
    {
      id: 'DEP-04',
      name: 'Master of Computer Applications (MCA)',
      code: 'MCA',
      studentsCount: 45,
      facultyCount: 5,
      avgPerformance: 74,
      avgAttendance: 79,
      assignmentCompletion: 76,
      studentsRequiringAttention: 4,
      headOfDepartment: 'Dr. Arvind Swaminathan'
    }
  ],
  universityAcademic: {
    passPercentage: 88,
    studentsRequiringAcademicAttention: 38,
    attendanceBelowTargetCount: 45,
    pendingSubmissionsCount: 142
  },
  skillsData: [
    { name: 'JavaScript & Web Technologies', level: 72, targetLevel: 80 },
    { name: 'Python & Data Analytics', level: 68, targetLevel: 75 },
    { name: 'React & Frontend Frameworks', level: 61, targetLevel: 75 },
    { name: 'Cloud Computing (AWS/Azure)', level: 42, targetLevel: 75 },
    { name: 'Machine Learning Foundations', level: 35, targetLevel: 70 },
    { name: 'DevOps & CI/CD Pipelines', level: 38, targetLevel: 70 }
  ]
};

export function saveAdminData(data) {
  try {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving admin university data:', error);
    return false;
  }
}

export function loadAdminData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATA);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading admin university data:', error);
    return null;
  }
}

export function updateAdminData(partialData) {
  try {
    const current = loadAdminData() || DEFAULT_ADMIN_UNIVERSITY_TEMPLATE;
    const merged = { ...current, ...partialData };
    return saveAdminData(merged);
  } catch (error) {
    console.error('Error updating admin university data:', error);
    return false;
  }
}

export function clearAdminData() {
  try {
    localStorage.removeItem(STORAGE_KEY_DATA);
    localStorage.removeItem(STORAGE_KEY_RESULTS);
    return true;
  } catch (error) {
    console.error('Error clearing admin university data:', error);
    return false;
  }
}

export function saveAdminAnalysisResults(results) {
  try {
    localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(results));
    return true;
  } catch (error) {
    console.error('Error saving admin analysis results:', error);
    return false;
  }
}

export function loadAdminAnalysisResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESULTS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading admin analysis results:', error);
    return null;
  }
}

const adminDataService = {
  saveAdminData,
  loadAdminData,
  updateAdminData,
  clearAdminData,
  saveAdminAnalysisResults,
  loadAdminAnalysisResults,
  DEFAULT_ADMIN_UNIVERSITY_TEMPLATE
};

export default adminDataService;
