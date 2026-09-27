import { aiService } from '../services/aiService.js';
import Student from '../models/Student.js';

// @desc    Check Python AI Engine health
// @route   GET /api/ai/health
export const getAiHealth = async (req, res, next) => {
  try {
    const health = await aiService.checkHealth();
    res.status(200).json({
      success: true,
      data: health
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Predict student academic risk using trained Python Random Forest model
// @route   POST /api/ai/predict-risk
export const predictRisk = async (req, res, next) => {
  try {
    let academicData = req.body;
    let studentDoc = null;

    // If student ID or enrollmentNumber is provided, fetch student from MongoDB
    if (academicData.studentId) {
      if (academicData.studentId.match(/^[0-9a-fA-F]{24}$/)) {
        studentDoc = await Student.findById(academicData.studentId);
      } else {
        studentDoc = await Student.findOne({ enrollmentNumber: academicData.studentId.toUpperCase() });
      }

      if (studentDoc) {
        academicData = {
          attendance: studentDoc.attendance,
          assignment_completion: studentDoc.assignmentCompletion,
          internal_marks: 16.0,
          previous_gpa: studentDoc.currentCgpa,
          recent_trend: -0.3,
          core_subject_score: 58.0,
          study_hours_weekly: 14.5,
          missed_labs: 4,
          ...req.body
        };
      }
    }

    // Call Python FastAPI Model
    const prediction = await aiService.predictRisk(academicData);

    // If student was identified in MongoDB, persist the model predictions & feature contributions
    if (studentDoc && prediction.status === 'model') {
      const riskScoreMap = { Low: 18, Medium: 48, High: 82 };
      const updatedFactors = (prediction.feature_contributions || []).slice(0, 4).map((f) => ({
        factor: f.label,
        impact: f.impact,
        type: f.type,
        description: `Model attribution value for ${f.label} (${f.value}).`
      }));

      await Student.findByIdAndUpdate(studentDoc._id, {
        riskLevel: prediction.risk_level,
        riskScore: riskScoreMap[prediction.risk_level] || studentDoc.riskScore,
        academicSupportIndicator: prediction.risk_level,
        ...(updatedFactors.length > 0 ? { explainabilityFactors: updatedFactors } : {})
      });
    }

    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Predict student future GPA using trained Python Ridge Regression model
// @route   POST /api/ai/predict-performance
export const predictPerformance = async (req, res, next) => {
  try {
    let academicData = req.body;
    let studentDoc = null;

    if (academicData.studentId) {
      if (academicData.studentId.match(/^[0-9a-fA-F]{24}$/)) {
        studentDoc = await Student.findById(academicData.studentId);
      } else {
        studentDoc = await Student.findOne({ enrollmentNumber: academicData.studentId.toUpperCase() });
      }

      if (studentDoc) {
        academicData = {
          attendance: studentDoc.attendance,
          assignment_completion: studentDoc.assignmentCompletion,
          internal_marks: 16.0,
          previous_gpa: studentDoc.currentCgpa,
          recent_trend: -0.3,
          core_subject_score: 58.0,
          study_hours_weekly: 14.5,
          missed_labs: 4,
          ...req.body
        };
      }
    }

    const prediction = await aiService.predictPerformance(academicData);

    // Update predictedSemesterCgpa in student's MongoDB record
    if (studentDoc && prediction.predicted_gpa) {
      await Student.findByIdAndUpdate(studentDoc._id, {
        predictedSemesterCgpa: prediction.predicted_gpa
      });
    }

    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Explain AI prediction with non-causal plain-language factor attributions
// @route   POST /api/ai/explain
export const explainPrediction = async (req, res, next) => {
  try {
    let academicData = req.body;
    let studentDoc = null;
    const target = req.body.target || 'risk';

    if (academicData.studentId) {
      if (academicData.studentId.match(/^[0-9a-fA-F]{24}$/)) {
        studentDoc = await Student.findById(academicData.studentId);
      } else {
        studentDoc = await Student.findOne({ enrollmentNumber: academicData.studentId.toUpperCase() });
      }

      if (studentDoc) {
        academicData = {
          attendance: studentDoc.attendance,
          assignment_completion: studentDoc.assignmentCompletion,
          internal_marks: 16.0,
          previous_gpa: studentDoc.currentCgpa,
          recent_trend: -0.3,
          core_subject_score: 58.0,
          study_hours_weekly: 14.5,
          missed_labs: 4,
          ...req.body
        };
      }
    }

    const explanation = await aiService.explainPrediction(academicData, target);

    res.status(200).json({
      success: true,
      data: {
        ...explanation,
        student: studentDoc ? {
          id: studentDoc._id,
          name: studentDoc.name,
          enrollmentNumber: studentDoc.enrollmentNumber,
          careerGoal: studentDoc.careerGoal
        } : null
      }
    });
  } catch (err) {
    next(err);
  }
};
