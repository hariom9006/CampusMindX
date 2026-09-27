/**
 * UniversityConnector Base Interface
 * Every university integration provider MUST implement this common interface.
 */
export class UniversityConnector {
  constructor(config = {}) {
    this.config = config;
    this.authenticated = false;
    this.sessionToken = null;
    this.studentProfile = null;
  }

  /**
   * Initialize connection to university portal or gateway
   */
  async connect() {
    throw new Error('Method connect() must be implemented by subclass');
  }

  /**
   * Authenticate student with official university credentials or SSO token
   * @param {Object} credentials - { studentId, universityId, authMethod, ssoToken }
   */
  async authenticate(credentials) {
    throw new Error('Method authenticate() must be implemented by subclass');
  }

  /**
   * Retrieve official student identity from university registry
   */
  async getStudentProfile() {
    throw new Error('Method getStudentProfile() must be implemented by subclass');
  }

  /**
   * Retrieve continuous attendance telemetry
   */
  async getAttendance() {
    throw new Error('Method getAttendance() must be implemented by subclass');
  }

  /**
   * Retrieve internal and external examination marks
   */
  async getMarks() {
    throw new Error('Method getMarks() must be implemented by subclass');
  }

  /**
   * Retrieve LMS assignments and submission deadlines
   */
  async getAssignments() {
    throw new Error('Method getAssignments() must be implemented by subclass');
  }

  /**
   * Retrieve enrolled courses and faculty details
   */
  async getCourses() {
    throw new Error('Method getCourses() must be implemented by subclass');
  }

  /**
   * Retrieve scheduled upcoming and past semester examinations
   */
  async getExaminations() {
    throw new Error('Method getExaminations() must be implemented by subclass');
  }

  /**
   * Retrieve semester grade cards and historical results
   */
  async getResults() {
    throw new Error('Method getResults() must be implemented by subclass');
  }

  /**
   * Disconnect and revoke authorized session token
   */
  async disconnect() {
    throw new Error('Method disconnect() must be implemented by subclass');
  }
}

export default UniversityConnector;
