/**
 * UniversityApi
 * Client service interacting with CampusMind Express backend gateway.
 * Communicates with official university endpoints securely through server-side proxy.
 */
import UniversityAuth from './UniversityAuth';

const API_BASE = '/api/university';

export class UniversityApi {
  /**
   * Fetch list of supported universities, auth types & capabilities
   */
  static async getConfig() {
    try {
      const res = await fetch(`${API_BASE}/config`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('UniversityApi.getConfig fallback to local directory:', err);
      return {
        success: true,
        universities: [
          {
            id: 'galgotias',
            name: 'Galgotias University',
            portalName: 'GU iCloud / Student ERP Portal',
            authType: 'sso',
            status: 'live',
            capabilities: ['profile', 'attendance', 'marks', 'assignments', 'courses', 'exams', 'results'],
            attendanceThreshold: 75
          },
          {
            id: 'delhi_university',
            name: 'University of Delhi',
            portalName: 'DU Samarth eGov Student Portal',
            authType: 'oauth',
            status: 'live',
            capabilities: ['profile', 'attendance', 'marks', 'courses', 'exams', 'results'],
            attendanceThreshold: 75
          },
          {
            id: 'state_tech_univ',
            name: 'State Technical University',
            portalName: 'State Tech University ERP',
            authType: 'none',
            status: 'unsupported',
            capabilities: [],
            attendanceThreshold: 75
          },
          {
            id: 'demo_lms',
            name: 'Demo University LMS',
            portalName: 'CampusMind Synthetic Sandbox',
            authType: 'demo',
            status: 'demo_sandbox',
            capabilities: ['profile', 'attendance', 'marks', 'assignments', 'courses', 'exams', 'results'],
            attendanceThreshold: 75
          }
        ]
      };
    }
  }

  /**
   * Authenticate student with university portal
   * @param {Object} credentials - { universityId, studentId, authMethod }
   */
  static async authenticate(credentials) {
    const res = await fetch(`${API_BASE}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      const err = new Error(data.message || 'University authentication failed');
      err.supported = data.supported !== false;
      err.errorType = data.errorType || 'AUTH_ERROR';
      err.suggestedActions = data.suggestedActions || [];
      throw err;
    }

    // Securely cache session token (ZERO passwords)
    UniversityAuth.saveSession(data.sessionToken, {
      universityId: credentials.universityId,
      studentName: data.student?.name,
      admissionId: data.student?.admissionId,
      isLiveIntegration: data.student?.isLiveIntegration !== false
    });

    return data;
  }

  /**
   * Sync authorized student records from university API
   */
  static async sync(sessionToken) {
    const token = sessionToken || UniversityAuth.getSessionToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/sync`, {
      method: 'POST',
      headers
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to retrieve academic records');
    }

    return data.data;
  }

  /**
   * Disconnect and revoke active university session
   */
  static async disconnect() {
    const token = UniversityAuth.getSessionToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/disconnect`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.warn('Disconnect network call error:', err);
      }
    }
    UniversityAuth.clearSession();
    return { success: true };
  }
}

export default UniversityApi;
