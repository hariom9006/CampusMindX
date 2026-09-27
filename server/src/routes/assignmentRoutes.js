import express from 'express';
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment
} from '../controllers/assignmentController.js';

const router = express.Router();

router.route('/')
  .get(getAssignments)
  .post(createAssignment);

router.route('/:id')
  .get(getAssignmentById)
  .put(updateAssignment)
  .delete(deleteAssignment);

export default router;
