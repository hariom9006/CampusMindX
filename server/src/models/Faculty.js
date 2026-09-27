import mongoose from 'mongoose';

const FacultySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Faculty name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Faculty email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department reference is required']
    },
    designation: { type: String, default: 'Assistant Professor' },
    officeHours: { type: String, default: 'Mon-Fri 2:00 PM - 4:00 PM' },
    room: { type: String, default: 'Lab 304' },
    specialization: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.models.Faculty || mongoose.model('Faculty', FacultySchema);
