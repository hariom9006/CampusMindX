import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required']
    },
    skillName: { type: String, required: [true, 'Skill name is required'], trim: true },
    category: {
      type: String,
      required: true,
      default: 'General'
    },
    currentLevel: { type: Number, required: true, min: 0, max: 100, default: 50 },
    targetLevel: { type: Number, required: true, min: 0, max: 100, default: 80 },
    gap: { type: Number, default: 0 },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    status: { type: String, default: 'In Progress' },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

SkillSchema.pre('save', function (next) {
  this.gap = this.currentLevel - this.targetLevel;
  next();
});

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
