import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    text: {
      type: String,
      required: true
    },
    intent: {
      type: String,
      default: null
    },
    confidence: {
      type: Number,
      default: null
    },
    factors: [
      {
        name: { type: String },
        value: { type: String },
        impact: { type: String }
      }
    ],
    dataPoints: [
      {
        label: { type: String },
        value: { type: String }
      }
    ],
    actionSuggestion: {
      type: String,
      default: null
    },
    suggestedFollowUps: [
      {
        type: String
      }
    ],
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const ConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      default: null
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      default: 'student'
    },
    title: {
      type: String,
      default: 'Academic & Career Consultation'
    },
    messages: [MessageSchema]
  },
  { timestamps: true }
);

export default mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
