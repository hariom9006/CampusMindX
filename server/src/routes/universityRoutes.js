import express from 'express';
import {
  getUniversityConfig,
  authenticateStudent,
  syncStudentData,
  disconnectStudent
} from '../controllers/universityController.js';

const router = express.Router();

// Configuration & Capabilities Catalog
router.get('/config', getUniversityConfig);

// Authentication & Token Handshake (Zero plaintext password retention)
router.post('/auth', authenticateStudent);

// Authorized Academic Records Retrieval
router.post('/sync', syncStudentData);

// Disconnect & Session Invalidation
router.post('/disconnect', disconnectStudent);

export default router;
