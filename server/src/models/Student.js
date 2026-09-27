import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Student name is required'], trim: true },
    enrollmentNumber: {
      type: String,
      required: [true, 'Enrollment number is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    program: { type: String, required: true, default: 'BCA (Bachelor of Computer Applications)' },
    shortProgram: { type: String, default: 'BCA' },
    semester: { type: Number, required: true, default: 5 },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null
    },
    departmentName: { type: String, default: 'School of Computing & IT' },
    careerGoal: { type: String, required: true, default: 'Full Stack Developer' },
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      default: null
    },
    advisorName: { type: String, default: 'Dr. Sunita Kulkarni' },
    overallPerformance: { type: Number, default: 71 }, // 71%
    attendance: { type: Number, default: 68 }, // 68%
    assignmentCompletion: { type: Number, default: 62 }, // 62%
    academicSupportIndicator: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    riskScore: { type: Number, default: 48 },
    currentCgpa: { type: Number, default: 7.42 },
    predictedSemesterCgpa: { type: Number, default: 7.2 },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    explainabilityFactors: [
      {
        factor: { type: String, required: true },
        impact: { type: String, required: true },
        type: { type: String, enum: ['positive', 'negative'], required: true },
        description: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
