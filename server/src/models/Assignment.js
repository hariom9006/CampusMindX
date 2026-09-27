import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required']
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject reference is required']
    },
    subjectName: { type: String, default: '' },
    title: { type: String, required: [true, 'Assignment title is required'], trim: true },
    status: {
      type: String,
      enum: ['Graded', 'Submitted', 'Pending', 'Overdue', 'Late Submission'],
      default: 'Pending'
    },
    dueDate: { type: Date, required: true },
    submissionDate: { type: Date, default: null },
    score: { type: String, default: 'Pending' }
  },
  { timestamps: true }
);

export default mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
