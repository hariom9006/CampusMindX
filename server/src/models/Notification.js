import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    type: {
      type: String,
      enum: ['alert', 'deadline', 'event', 'achievement', 'system'],
      default: 'system'
    },
    title: { type: String, required: [true, 'Notification title is required'], trim: true },
    message: { type: String, required: [true, 'Message content is required'] },
    urgent: { type: Boolean, default: false },
    link: { type: String, default: '/student' },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
