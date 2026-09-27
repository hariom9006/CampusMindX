import mongoose from 'mongoose';

const MarksSchema = new mongoose.Schema(
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
    internalMarks: { type: Number, required: true, default: 0 },
    maxInternalMarks: { type: Number, default: 30 },
    examMarks: { type: Number, default: 0 },
    maxExamMarks: { type: Number, default: 70 },
    totalMarks: { type: Number, default: 0 },
    grade: { type: String, default: 'B' },
    status: { type: String, default: 'Satisfactory' },
    semester: { type: Number, required: true, default: 5 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

MarksSchema.pre('save', function (next) {
  this.totalMarks = Math.round(
    ((this.internalMarks + this.examMarks) / (this.maxInternalMarks + this.maxExamMarks)) * 100
  );
  if (this.totalMarks >= 80) this.grade = 'A';
  else if (this.totalMarks >= 75) this.grade = 'B+';
  else if (this.totalMarks >= 65) this.grade = 'B';
  else if (this.totalMarks >= 55) this.grade = 'C+';
  else if (this.totalMarks >= 45) this.grade = 'C';
  else this.grade = 'F';
  next();
});

export default mongoose.models.Marks || mongoose.model('Marks', MarksSchema);
