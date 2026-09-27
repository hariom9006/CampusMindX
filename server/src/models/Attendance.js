import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
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
    subjectCode: { type: String, default: '' },
    subjectName: { type: String, default: '' },
    totalClasses: { type: Number, required: true, default: 0 },
    attendedClasses: { type: Number, required: true, default: 0 },
    percentage: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['Safe', 'Marginal', 'Critical Deficit', 'Severe Deficit'],
      default: 'Marginal'
    },
    facultyName: { type: String, default: '' },
    weeklyHistory: [
      {
        week: { type: String, required: true },
        attendance: { type: Number, required: true },
        threshold: { type: Number, default: 75 }
      }
    ]
  },
  { timestamps: true }
);

// Auto-calculate percentage if not set or updated
AttendanceSchema.pre('save', function (next) {
  if (this.totalClasses > 0) {
    this.percentage = Math.round((this.attendedClasses / this.totalClasses) * 100);
  }
  if (this.percentage >= 75) this.status = 'Safe';
  else if (this.percentage >= 65) this.status = 'Marginal';
  else if (this.percentage >= 50) this.status = 'Critical Deficit';
  else this.status = 'Severe Deficit';
  next();
});

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
