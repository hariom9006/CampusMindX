/**
 * CampusMind X - Official University API Connector
 * Provides endpoints for live production integrations (Moodle, Canvas, Ellucian Banner, Samarth).
 */

import { LMSConnector } from './lmsConnector';

export class UniversityApiConnector extends LMSConnector {
  constructor(config = {}) {
    super({
      name: 'Official University REST API Connector',
      university: config.universityName || 'Official University Portal',
      ...config
    });
    this.apiBaseUrl = config.apiBaseUrl || '/api/lms';
  }

  async authenticateWithBearer(token) {
    if (!token) throw new Error('Valid bearer authorization token is required.');
    this.isConnected = true;
    this.lastSyncTime = new Date().toISOString();
    return {
      success: true,
      isDemo: false,
      connectionStatus: 'Connected',
      sessionToken: token
    };
  }

  async fetchAuthorizedData(token, permissions = {}) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ permissions })
      });

      if (!response.ok) {
        throw new Error(`University API returned HTTP ${response.status}: Unable to sync academic records.`);
      }

      return await response.json();
    } catch (err) {
      console.warn('Official University API offline or unconfigured; falling back to demo connector:', err.message);
      throw err;
    }
  }
}

export default UniversityApiConnector;
