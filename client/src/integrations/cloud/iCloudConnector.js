/**
 * CampusMind X - iCloud & Cloud Storage Integration Connector
 * Provides simulated or token-based authorization for iCloud Drive, Google Drive, and OneDrive.
 * Includes Document Intelligence parsing pipeline for academic marksheets and certificates.
 */

import { CloudConnector } from './cloudConnector';

export const SAMPLE_CLOUD_DOCUMENTS = [
  {
    id: 'doc-001',
    fileName: 'Official_Transcript_Semester_4.pdf',
    category: 'Marksheet',
    fileSize: '320 KB',
    lastModified: 'Aug 24, 2026',
    extractedData: {
      studentName: 'Aarav Sharma',
      semester: 4,
      program: 'BCA',
      cgpa: 7.30,
      percentage: 70,
      subjects: [
        { name: 'Operating Systems', marks: 74, grade: 'B+' },
        { name: 'Software Engineering', marks: 72, grade: 'B+' },
        { name: 'Web Technologies', marks: 80, grade: 'A' },
        { name: 'Advanced Java Lab', marks: 85, grade: 'A+' }
      ]
    }
  },
  {
    id: 'doc-002',
    fileName: 'AWS_Cloud_Practitioner_Certificate.pdf',
    category: 'Certification',
    fileSize: '1.2 MB',
    lastModified: 'Sep 02, 2026',
    extractedData: {
      certificationName: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      validationId: 'AWS-CERT-998124',
      issueDate: 'August 2026',
      skillsCredited: ['Cloud Fundamentals', 'AWS IAM', 'Cloud Architecture']
    }
  },
  {
    id: 'doc-003',
    fileName: 'Internship_Evaluation_FullStack.pdf',
    category: 'Industry Project',
    fileSize: '410 KB',
    lastModified: 'Jul 15, 2026',
    extractedData: {
      projectTitle: 'Student Peer Marketplace (React & Node.js)',
      evaluator: 'Senior Engineering Mentor',
      score: '9.2 / 10',
      technologies: ['React', 'Node.js', 'MongoDB', 'REST APIs']
    }
  }
];

export class ICloudConnector extends CloudConnector {
  constructor() {
    super('Apple iCloud Drive');
    this.status = 'Demo Connector';
  }

  async connect(cloudProvider = 'iCloud') {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.providerName = cloudProvider;
        resolve({
          success: true,
          provider: cloudProvider,
          status: 'Authorized & Connected (Demo Mode)',
          cloudStorageUsed: '1.93 MB',
          availableDocuments: SAMPLE_CLOUD_DOCUMENTS.length
        });
      }, 700);
    });
  }

  async listAuthorizedAcademicDocuments() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SAMPLE_CLOUD_DOCUMENTS);
      }, 400);
    });
  }

  async parseAcademicDocument(docId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const found = SAMPLE_CLOUD_DOCUMENTS.find((d) => d.id === docId);
        if (!found) {
          reject(new Error('Document not found in authorized cloud storage directory.'));
          return;
        }

        // Simulates Document Parser -> Text Extraction -> Data Extraction -> Validation
        resolve({
          success: true,
          pipelineStatus: 'Extraction & Validation Complete',
          documentId: found.id,
          fileName: found.fileName,
          category: found.category,
          extractedData: found.extractedData,
          confidenceScore: 0.96,
          message: 'Data successfully extracted. Review below before incorporating into academic profile.'
        });
      }, 800);
    });
  }
}

export default ICloudConnector;
