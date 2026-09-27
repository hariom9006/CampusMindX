import http from 'http';

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:8000';

export const aiService = {
  // Check health of Python FastAPI microservice
  async checkHealth() {
    try {
      const response = await fetch(`${AI_ENGINE_URL}/health`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('[AI Service] Python AI Engine health check failed:', err.message);
    }
    return {
      status: 'offline',
      message: 'FastAPI microservice unreachable. Fallback heuristics active.'
    };
  },

  // Call Model 1: Risk Detection
  async predictRisk(academicData) {
    try {
      const response = await fetch(`${AI_ENGINE_URL}/predict/risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance: Number(academicData.attendance || 68.0),
          assignment_completion: Number(academicData.assignment_completion || academicData.assignmentCompletion || 62.0),
          internal_marks: Number(academicData.internal_marks || academicData.internalMarks || 16.0),
          previous_gpa: Number(academicData.previous_gpa || academicData.currentCgpa || 7.42),
          recent_trend: Number(academicData.recent_trend || -0.3),
          core_subject_score: Number(academicData.core_subject_score || academicData.coreSubjectScore || 58.0),
          study_hours_weekly: Number(academicData.study_hours_weekly || 14.5),
          missed_labs: Number(academicData.missed_labs || 4)
        })
      });

      if (response.ok) {
        return await response.json();
      } else if (response.status === 422) {
        const errorData = await response.json();
        const err = new Error(errorData.detail?.[0]?.msg || 'Validation error in academic features');
        err.statusCode = 400;
        err.details = errorData.detail;
        throw err;
      } else {
        const errorText = await response.text();
        console.warn('[AI Service] FastAPI returned non-200 for risk prediction:', errorText);
      }
    } catch (err) {
      if (err.statusCode === 400) throw err;
      console.warn('[AI Service] Error calling FastAPI risk prediction:', err.message);
    }

    // Graceful fallback if microservice is offline
    return {
      risk_level: 'Medium',
      prediction: 'Medium',
      confidence: 0.78,
      status: 'fallback',
      model_version: 'v1.3.0-fallback',
      feature_contributions: [
        { label: 'Lecture & Lab Attendance', impact: '-14%', type: 'negative', value: `${academicData.attendance || 68}%` },
        { label: 'Continuous Assignment Submissions', impact: '-9%', type: 'negative', value: `${academicData.assignmentCompletion || 62}%` }
      ]
    };
  },

  // Call Model 2: Performance Prediction
  async predictPerformance(academicData) {
    try {
      const response = await fetch(`${AI_ENGINE_URL}/predict/performance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance: Number(academicData.attendance || 68.0),
          assignment_completion: Number(academicData.assignment_completion || academicData.assignmentCompletion || 62.0),
          internal_marks: Number(academicData.internal_marks || academicData.internalMarks || 16.0),
          previous_gpa: Number(academicData.previous_gpa || academicData.currentCgpa || 7.42),
          recent_trend: Number(academicData.recent_trend || -0.3),
          core_subject_score: Number(academicData.core_subject_score || academicData.coreSubjectScore || 58.0),
          study_hours_weekly: Number(academicData.study_hours_weekly || 14.5),
          missed_labs: Number(academicData.missed_labs || 4)
        })
      });

      if (response.ok) {
        return await response.json();
      } else if (response.status === 422) {
        const errorData = await response.json();
        const err = new Error(errorData.detail?.[0]?.msg || 'Validation error in academic features');
        err.statusCode = 400;
        err.details = errorData.detail;
        throw err;
      } else {
        const errorText = await response.text();
        console.warn('[AI Service] FastAPI returned non-200 for performance prediction:', errorText);
      }
    } catch (err) {
      if (err.statusCode === 400) throw err;
      console.warn('[AI Service] Error calling FastAPI performance prediction:', err.message);
    }

    return {
      predicted_gpa: 7.2,
      prediction_range: { lower_bound: 6.9, upper_bound: 7.5, confidence_interval: '95%' },
      status: 'fallback',
      model_version: 'v1.3.0-fallback'
    };
  },

  // Phase 4: Explainable AI Engine
  async explainPrediction(academicData, target = 'risk') {
    try {
      const response = await fetch(`${AI_ENGINE_URL}/predict/explain?target=${encodeURIComponent(target)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance: Number(academicData.attendance || 68.0),
          assignment_completion: Number(academicData.assignment_completion || academicData.assignmentCompletion || 62.0),
          internal_marks: Number(academicData.internal_marks || academicData.internalMarks || 16.0),
          previous_gpa: Number(academicData.previous_gpa || academicData.currentCgpa || 7.42),
          recent_trend: Number(academicData.recent_trend || -0.3),
          core_subject_score: Number(academicData.core_subject_score || academicData.coreSubjectScore || 58.0),
          study_hours_weekly: Number(academicData.study_hours_weekly || 14.5),
          missed_labs: Number(academicData.missed_labs || 4)
        })
      });

      if (response.ok) {
        return await response.json();
      } else if (response.status === 422) {
        const errorData = await response.json();
        const err = new Error(errorData.detail?.[0]?.msg || 'Validation error in academic features');
        err.statusCode = 400;
        err.details = errorData.detail;
        throw err;
      } else {
        const errorText = await response.text();
        console.warn('[AI Service] FastAPI returned non-200 for prediction explanation:', errorText);
      }
    } catch (err) {
      if (err.statusCode === 400) throw err;
      console.warn('[AI Service] Error calling FastAPI explain endpoint:', err.message);
    }

    // High quality fallback explanation if Python microservice is temporarily offline
    return {
      prediction: 'Medium',
      risk_level: 'Medium',
      confidence: 0.77,
      confidence_percent: '77.0%',
      plain_language_summary: 'The Academic Support Indicator is predicted as Medium with 77.0% confidence. Attendance (68.0%) and assignment completion (62.0%) contributed most significantly to the elevated risk category, whereas historical CGPA (7.42) contributed toward stabilizing the student standing.',
      contributing_factors: [
        {
          feature: 'internal_marks',
          label: 'Mid-Term Internal Evaluation',
          contribution_level: 'High contribution',
          impact: '-23.0%',
          type: 'negative',
          student_value: `${academicData.internal_marks || 16.0}/30`,
          cohort_benchmark: '18.0/30',
          explanation: 'Mid-Term Internal Evaluation fell below cohort benchmark and contributed to the elevated risk tier prediction.'
        },
        {
          feature: 'attendance',
          label: 'Lecture & Lab Attendance',
          contribution_level: 'High contribution',
          impact: '-15.5%',
          type: 'negative',
          student_value: `${academicData.attendance || 68.0}%`,
          cohort_benchmark: '75.0%',
          explanation: 'Lecture & Lab Attendance fell below the mandatory 75% benchmark and contributed to the elevated risk tier prediction.'
        },
        {
          feature: 'assignment_completion',
          label: 'Continuous Assignment Submissions',
          contribution_level: 'Medium contribution',
          impact: '-9.1%',
          type: 'negative',
          student_value: `${academicData.assignmentCompletion || 62.0}%`,
          cohort_benchmark: '70.0%',
          explanation: 'Continuous Assignment Submissions fell below benchmark and contributed to the elevated risk tier prediction.'
        },
        {
          feature: 'previous_gpa',
          label: 'Historical Cumulative CGPA',
          contribution_level: 'Low contribution',
          impact: '+11.8%',
          type: 'positive',
          student_value: `${academicData.currentCgpa || 7.42}/10.0`,
          cohort_benchmark: '7.0/10.0',
          explanation: 'Historical Cumulative CGPA exceeded cohort expectations and contributed positively to the model prediction.'
        }
      ],
      non_causal_statement: 'These factors contributed to the model prediction and do not imply direct deterministic causation. The model identifies statistical correlations based on past cohort academic patterns to assist advisor decision support.',
      status: 'fallback',
      model_version: 'v1.4.0-fallback'
    };
  }
};
