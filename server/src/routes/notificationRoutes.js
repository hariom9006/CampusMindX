import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllRead,
  createNotification,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

router.route('/')
  .get(getNotifications)
  .post(createNotification);

router.put('/mark-all-read', markAllRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
