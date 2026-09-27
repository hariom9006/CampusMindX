import { UniversityConnector } from '../UniversityConnector';
import UniversityDataMapper from '../UniversityDataMapper';
import { DEMO_LMS_PAYLOAD } from '../../../data/demoUniversityData';

/**
 * DemoProvider
 * Simulates a university connection using realistic mock data.
 * Strictly flags data with isLiveIntegration = false and dataSource = 'DEMO SANDBOX'.
 */
export class DemoProvider extends UniversityConnector {
  constructor(config = {}) {
    super(config);
    this.providerName = 'CampusMind Demo Sandbox';
    this.universityId = 'demo_lms';
  }

  async connect() {
    return {
      connected: true,
      provider: this.providerName,
      status: 'SANDBOX_READY'
    };
  }

  async authenticate(credentials) {
    this.authenticated = true;
    this.sessionToken = `demo_token_${Date.now()}`;
    this.studentProfile = {
      name: 'Aarav Sharma',
      admissionId: credentials.studentId || 'DEMO2026',
      enrollmentNumber: 'DEMO-ENR-22BCA1042',
      university: 'Demo University LMS',
      universityId: 'demo_lms',
      program: 'Bachelor of Computer Applications (BCA)',
      department: 'Department of Computer Science',
      semester: 5,
      section: 'BCA-A',
      email: 'aarav.sharma@demo.ac.in',
      isLiveIntegration: false,
      dataSource: 'DEMO SANDBOX'
    };

    return {
      success: true,
      sessionToken: this.sessionToken,
      student: this.studentProfile,
      message: 'Demo Integration — No real university server is connected.'
    };
  }

  async syncAll(permissions = {}) {
    const raw = {
      ...DEMO_LMS_PAYLOAD,
      isLiveIntegration: false,
      dataSource: 'DEMO SANDBOX',
      syncTimestamp: new Date().toISOString()
    };
    return UniversityDataMapper.normalize(raw, permissions);
  }

  async getStudentProfile() {
    return this.studentProfile;
  }

  async getAttendance() {
    return DEMO_LMS_PAYLOAD.attendance;
  }

  async getMarks() {
    return DEMO_LMS_PAYLOAD.academics;
  }

  async getAssignments() {
    return DEMO_LMS_PAYLOAD.assignments;
  }

  async getCourses() {
    return DEMO_LMS_PAYLOAD.courses;
  }

  async getExaminations() {
    return DEMO_LMS_PAYLOAD.examinations;
  }

  async getResults() {
    return DEMO_LMS_PAYLOAD.academics.historicalSemesters;
  }

  async disconnect() {
    this.authenticated = false;
    this.sessionToken = null;
    this.studentProfile = null;
    return { disconnected: true };
  }
}

export default DemoProvider;
