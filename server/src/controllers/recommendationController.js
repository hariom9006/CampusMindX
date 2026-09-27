import Recommendation from '../models/Recommendation.js';
import Student from '../models/Student.js';
import { recommendationEngineService } from '../services/recommendationEngineService.js';

// @desc    Get recommendations (filter by student, urgency)
// @route   GET /api/recommendations
export const getRecommendations = async (req, res, next) => {
  try {
    const { student, urgency } = req.query;
    const query = {};

    if (student) {
      if (student.match(/^[0-9a-fA-F]{24}$/)) {
        query.student = student;
      } else {
        const studentDoc = await Student.findOne({ enrollmentNumber: student.toUpperCase() });
        if (studentDoc) query.student = studentDoc._id;
      }
    }
    if (urgency) query.urgency = urgency;

    const recommendations = await Recommendation.find(query).populate('student', 'name enrollmentNumber');
    res.status(200).json({ success: true, count: recommendations.length, data: recommendations });
  } catch (err) {
    next(err);
  }
};

// @desc    Get recommendations for a student (or single recommendation by ID)
// @route   GET /api/recommendations/:studentId
export const getRecommendationsForStudent = async (req, res, next) => {
  try {
    const identifier = req.params.studentId || req.params.id;

    // Check if identifier is an existing student (by enrollmentNumber or student ObjectId)
    let studentDoc = null;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      studentDoc = await Student.findById(identifier);
    }
    if (!studentDoc) {
      studentDoc = await Student.findOne({ enrollmentNumber: identifier.toUpperCase() });
    }

    if (studentDoc) {
      // Generate intelligent, rule-based recommendations from student's live data
      const result = await recommendationEngineService.generateRecommendations(studentDoc._id.toString());
      return res.status(200).json({
        success: true,
        count: result.recommendations.length,
        student: {
          id: studentDoc._id,
          name: studentDoc.name,
          enrollmentNumber: studentDoc.enrollmentNumber,
          careerGoal: studentDoc.careerGoal
        },
        data: result.recommendations
      });
    }

    // Otherwise check if identifier is a Recommendation ObjectId
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      const rec = await Recommendation.findById(identifier).populate('student');
      if (rec) {
        return res.status(200).json({ success: true, data: rec });
      }
    }

    return res.status(404).json({ success: false, message: `Student or recommendation not found for: ${identifier}` });
  } catch (err) {
    next(err);
  }
};

// @desc    Create recommendation
// @route   POST /api/recommendations
export const createRecommendation = async (req, res, next) => {
  try {
    const rec = await Recommendation.create(req.body);
    res.status(201).json({ success: true, data: rec });
  } catch (err) {
    next(err);
  }
};

// @desc    Update recommendation
// @route   PUT /api/recommendations/:id
export const updateRecommendation = async (req, res, next) => {
  try {
    const rec = await Recommendation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!rec) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }
    res.status(200).json({ success: true, data: rec });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete recommendation
// @route   DELETE /api/recommendations/:id
export const deleteRecommendation = async (req, res, next) => {
  try {
    const rec = await Recommendation.findByIdAndDelete(req.params.id);
    if (!rec) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }
    res.status(200).json({ success: true, message: 'Recommendation removed' });
  } catch (err) {
    next(err);
  }
};
