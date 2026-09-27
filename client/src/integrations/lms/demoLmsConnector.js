/**
 * CampusMind X - Demo University LMS Connector
 * Simulates complete end-to-end LMS integration for prototype evaluations
 * where live institutional credentials or intranet access is unavailable.
 * Explicitly disclaims that this is a simulated demo connector.
 */

import { LMSConnector } from './lmsConnector';
import { DEMO_LMS_PAYLOAD } from '../../data/demoUniversityData';

export class DemoLMSConnector extends LMSConnector {
  constructor(config = {}) {
    super({
      name: 'Demo University LMS Connector',
      university: config.universityName || 'Demo University LMS',
      ...config
    });
    this.isDemo = true;
  }

  async authenticate({ admissionId, universityName, permissions }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!admissionId) {
          reject(new Error('Invalid Student Admission ID.'));
          return;
        }

        this.isConnected = true;
        this.lastSyncTime = new Date().toISOString();

        resolve({
          success: true,
          isDemo: true,
          connectionStatus: 'Connected',
          admissionId,
          universityName: universityName || 'Galgotias University (LMS Portal)',
          sessionToken: `cmx_demo_tok_${Date.now()}`,
          message: 'Demo Integration Connected — No real university server is contacted.'
        });
      }, 600);
    });
  }

  async fetchAuthorizedData(permissions = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Clone demo payload to avoid mutating reference
        const raw = JSON.parse(JSON.stringify(DEMO_LMS_PAYLOAD));

        // Filter data based on explicit student permissions
        const filteredPayload = {
          isDemoIntegration: true,
          universitySource: this.university,
          syncedAt: new Date().toISOString(),
          student: raw.student,
          academics: permissions.academicResults !== false ? raw.academics : null,
          attendance: permissions.attendance !== false ? raw.attendance : null,
          assignments: permissions.assignments !== false ? raw.assignments : null,
          examinations: permissions.examinations !== false ? raw.examinations : null,
          skills: permissions.skills !== false ? raw.skills : [],
          certifications: permissions.skills !== false ? raw.certifications : [],
          projects: permissions.academicDocuments !== false ? raw.projects : [],
          authorizedDocuments: permissions.academicDocuments !== false ? raw.authorizedDocuments : []
        };

        resolve(filteredPayload);
      }, 700);
    });
  }
}

export default DemoLMSConnector;
