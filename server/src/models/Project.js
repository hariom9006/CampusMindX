import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required']
    },
    title: { type: String, required: [true, 'Project title is required'], trim: true },
    description: { type: String, default: '' },
    technologies: [{ type: String }],
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Planned'],
      default: 'In Progress'
    },
    grade: { type: String, default: 'A' },
    repoUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
