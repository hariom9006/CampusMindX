/**
 * CampusMind X - LMS Connector Base Interface
 * Defines standard contract for all university ERP, LMS, and Student Information System (SIS) adapters.
 */

export class LMSConnector {
  constructor(config = {}) {
    this.name = config.name || 'Generic LMS Connector';
    this.university = config.university || 'Generic University';
    this.isConnected = false;
    this.lastSyncTime = null;
  }

  async authenticate(credentials) {
    throw new Error('Method authenticate() must be implemented by LMS connector subclass.');
  }

  async fetchAcademicRecords(token, permissions) {
    throw new Error('Method fetchAcademicRecords() must be implemented.');
  }

  async fetchAttendance(token, permissions) {
    throw new Error('Method fetchAttendance() must be implemented.');
  }

  async fetchAssignments(token, permissions) {
    throw new Error('Method fetchAssignments() must be implemented.');
  }

  async fetchCoursework(token, permissions) {
    throw new Error('Method fetchCoursework() must be implemented.');
  }

  async disconnect() {
    this.isConnected = false;
    this.lastSyncTime = null;
    return true;
  }
}

export default LMSConnector;
