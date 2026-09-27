import { UniversityConnector } from '../UniversityConnector';
import UniversityApi from '../UniversityApi';
import UniversityDataMapper from '../UniversityDataMapper';

/**
 * UniversityProvider
 * Concrete connector for officially supported universities (e.g. Galgotias, DU, Amity).
 * Communicates with official university systems through the backend proxy.
 */
export class UniversityProvider extends UniversityConnector {
  constructor(config = {}) {
    super(config);
    this.providerName = config.name || 'Official University Provider';
    this.universityId = config.id;
  }

  async connect() {
    return {
      connected: true,
      provider: this.providerName,
      status: 'READY'
    };
  }

  async authenticate(credentials) {
    const authResult = await UniversityApi.authenticate({
      universityId: this.universityId || credentials.universityId,
      studentId: credentials.studentId,
      authMethod: credentials.authMethod || 'sso'
    });

    this.authenticated = true;
    this.sessionToken = authResult.sessionToken;
    this.studentProfile = authResult.student;
    return authResult;
  }

  async syncAll(permissions = {}) {
    if (!this.sessionToken) {
      throw new Error('Not authenticated with university portal.');
    }

    const rawData = await UniversityApi.sync(this.sessionToken);
    return UniversityDataMapper.normalize(rawData, permissions);
  }

  async getStudentProfile() {
    return this.studentProfile;
  }

  async getAttendance() {
    const data = await UniversityApi.sync(this.sessionToken);
    return data.attendance;
  }

  async getMarks() {
    const data = await UniversityApi.sync(this.sessionToken);
    return data.academics;
  }

  async getAssignments() {
    const data = await UniversityApi.sync(this.sessionToken);
    return data.assignments;
  }

  async getCourses() {
    const data = await UniversityApi.sync(this.sessionToken);
    return data.courses;
  }

  async getExaminations() {
    const data = await UniversityApi.sync(this.sessionToken);
    return data.examinations;
  }

  async getResults() {
    const data = await UniversityApi.sync(this.sessionToken);
    return data.academics?.historicalSemesters || [];
  }

  async disconnect() {
    await UniversityApi.disconnect();
    this.authenticated = false;
    this.sessionToken = null;
    this.studentProfile = null;
    return { disconnected: true };
  }
}

export default UniversityProvider;
