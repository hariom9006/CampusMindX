import mongoose from 'mongoose';

const RecommendationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required']
    },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    category: { type: String, required: true },
    urgency: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    urgencyColor: { type: String, default: 'cyan' },
    estimatedTime: { type: String, default: '2 Hours / Week' },
    impactRating: { type: String, required: true },
    rationale: { type: String, required: true },
    actionPlan: [{ type: String }],
    courseCode: { type: String, default: '' },
    linkText: { type: String, default: 'View Action' }
  },
  { timestamps: true }
);

export default mongoose.models.Recommendation || mongoose.model('Recommendation', RecommendationSchema);
