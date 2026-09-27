import Notification from '../models/Notification.js';
import Student from '../models/Student.js';

// @desc    Get notifications for student or user
// @route   GET /api/notifications
export const getNotifications = async (req, res, next) => {
  try {
    const { student, unreadOnly } = req.query;
    const query = {};

    if (student) {
      if (student.match(/^[0-9a-fA-F]{24}$/)) {
        query.student = student;
      } else {
        const studentDoc = await Student.findOne({ enrollmentNumber: student.toUpperCase() });
        if (studentDoc) query.student = studentDoc._id;
      }
    }
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark all notifications as read for student
// @route   PUT /api/notifications/mark-all-read
export const markAllRead = async (req, res, next) => {
  try {
    const { student } = req.body;
    const query = {};
    if (student) query.student = student;

    await Notification.updateMany(query, { read: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// @desc    Create notification
// @route   POST /api/notifications
export const createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Notification removed' });
  } catch (err) {
    next(err);
  }
};
