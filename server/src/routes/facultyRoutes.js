import express from 'express';
import {
  getFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty
} from '../controllers/facultyController.js';

const router = express.Router();

router.route('/')
  .get(getFaculty)
  .post(createFaculty);

router.route('/:id')
  .get(getFacultyById)
  .put(updateFaculty)
  .delete(deleteFaculty);

export default router;
