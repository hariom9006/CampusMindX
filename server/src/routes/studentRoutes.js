import express from 'express';
import {
  getStudents,
  getStudentById,
  getStudentDashboard,
  createStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';

const router = express.Router();

router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

router.get('/:id/dashboard', getStudentDashboard);

export default router;
