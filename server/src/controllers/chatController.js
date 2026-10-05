import { campusMindAiService } from '../services/campusMindAiService.js';
import Conversation from '../models/Conversation.js';
import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';

// @desc    Send query to CampusMind AI Assistant
// @route   POST /api/ai/chat
export const handleChatMessage = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    let { role = 'student', studentId = null, facultyId = null } = req.body;

    // If authenticated user exists, extract role and IDs
    if (req.user) {
      role = req.user.role || role;
      if (req.user.student) studentId = req.user.student;
      if (req.user.faculty) facultyId = req.user.faculty;
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.'
      });
    }

    // Default resolution for student / faculty if not explicitly provided
    if (role === 'student' && !studentId) {
      const defaultStudent = await Student.findOne({ enrollmentNumber: '22BCA1042' });
      if (defaultStudent) studentId = defaultStudent._id;
    } else if (role === 'faculty' && !facultyId) {
      const defaultFaculty = await Faculty.findOne({});
      if (defaultFaculty) facultyId = defaultFaculty._id;
    }

    // Process query through CampusMind AI Service
    const aiResponse = await campusMindAiService.processQuery({
      message,
      role,
      studentId,
      facultyId,
      user: req.user || null
    });

    // Save message and reply to Conversation history
    let conversation = null;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = new Conversation({
        user: req.user?._id || null,
        student: studentId || null,
        faculty: facultyId || null,
        role,
        title: message.slice(0, 40) + '...',
        messages: []
      });
    }

    // Append user message
    conversation.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date()
    });

    // Append AI response
    conversation.messages.push({
      sender: 'assistant',
      text: aiResponse.reply,
      intent: aiResponse.intent,
      confidence: aiResponse.confidence,
      factors: aiResponse.factors || [],
      dataPoints: aiResponse.dataPoints || [],
      actionSuggestion: aiResponse.actionSuggestion || null,
      suggestedFollowUps: aiResponse.suggestedFollowUps || [],
      timestamp: new Date()
    });

    await conversation.save();

    res.status(200).json({
      success: true,
      data: {
        ...aiResponse,
        conversationId: conversation._id
      }
    });
  } catch (err) {
    console.error('❌ [Chat Controller] Error processing message:', err);
    next(err);
  }
};

// @desc    Get conversation history
// @route   GET /api/ai/chat/history
export const getChatHistory = async (req, res, next) => {
  try {
    const { studentId, conversationId } = req.query;

    let query = {};
    if (conversationId) {
      query._id = conversationId;
    } else if (studentId) {
      query.student = studentId;
    } else if (req.user?.student) {
      query.student = req.user.student;
    } else {
      // Find latest conversation for Hariom Anand or general
      const defaultStudent = await Student.findOne({ enrollmentNumber: '22BCA1042' });
      if (defaultStudent) query.student = defaultStudent._id;
    }

    const conversation = await Conversation.findOne(query).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: conversation ? conversation.messages : []
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear conversation history
// @route   DELETE /api/ai/chat/history
export const clearChatHistory = async (req, res, next) => {
  try {
    const { studentId, conversationId } = req.body;

    if (conversationId) {
      await Conversation.findByIdAndDelete(conversationId);
    } else if (studentId) {
      await Conversation.deleteMany({ student: studentId });
    } else if (req.user?.student) {
      await Conversation.deleteMany({ student: req.user.student });
    } else {
      const defaultStudent = await Student.findOne({ enrollmentNumber: '22BCA1042' });
      if (defaultStudent) {
        await Conversation.deleteMany({ student: defaultStudent._id });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Conversation history cleared successfully.'
    });
  } catch (err) {
    next(err);
  }
};
