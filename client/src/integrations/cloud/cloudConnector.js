/**
 * CampusMind X - Cloud Storage Connector Base Interface
 * Defines standard contract for authorized academic document synchronization.
 */

export class CloudConnector {
  constructor(providerName = 'Generic Cloud') {
    this.providerName = providerName;
    this.isConnected = false;
    this.authorizedFiles = [];
  }

  async connect() {
    throw new Error('Method connect() must be implemented.');
  }

  async listAuthorizedAcademicDocuments() {
    throw new Error('Method listAuthorizedAcademicDocuments() must be implemented.');
  }

  async parseAcademicDocument(fileId) {
    throw new Error('Method parseAcademicDocument() must be implemented.');
  }
}

export default CloudConnector;
