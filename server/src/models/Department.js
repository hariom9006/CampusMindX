import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Department name is required'], unique: true, trim: true },
    code: { type: String, required: [true, 'Department code is required'], unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    headOfDepartment: { type: String, default: '' },
    building: { type: String, default: 'Academic Block A' }
  },
  { timestamps: true }
);

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
