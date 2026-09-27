import express from 'express';
import {
  getRecommendations,
  getRecommendationsForStudent,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation
} from '../controllers/recommendationController.js';

const router = express.Router();

router.route('/')
  .get(getRecommendations)
  .post(createRecommendation);

// GET /api/recommendations/:studentId
router.route('/:studentId')
  .get(getRecommendationsForStudent)
  .put(updateRecommendation)
  .delete(deleteRecommendation);

export default router;
