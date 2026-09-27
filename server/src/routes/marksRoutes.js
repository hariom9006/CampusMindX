import express from 'express';
import {
  getMarks,
  getMarksById,
  createMarks,
  updateMarks,
  deleteMarks
} from '../controllers/marksController.js';

const router = express.Router();

router.route('/')
  .get(getMarks)
  .post(createMarks);

router.route('/:id')
  .get(getMarksById)
  .put(updateMarks)
  .delete(deleteMarks);

export default router;
