import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Subject name is required'], trim: true },
    code: { type: String, required: [true, 'Subject code is required'], unique: true, uppercase: true, trim: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department reference is required']
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      default: null
    },
    instructorName: { type: String, default: '' },
    credits: { type: Number, required: true, default: 4 },
    semester: { type: Number, required: true, default: 5 },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
