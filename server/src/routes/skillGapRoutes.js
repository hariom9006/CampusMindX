import express from 'express';
import { analyzeSkillGap } from '../controllers/skillGapController.js';

const router = express.Router();

// POST /api/skill-gap/analyze
router.post('/analyze', analyzeSkillGap);

export default router;
