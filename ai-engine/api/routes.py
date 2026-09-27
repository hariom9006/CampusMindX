from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import os
import sys

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from prediction.predictor import predictor

router = APIRouter()

# Input Validation Schemas
class StudentAcademicInput(BaseModel):
    attendance: float = Field(..., ge=0.0, le=100.0, description="Attendance percentage", example=68.0)
    assignment_completion: float = Field(..., ge=0.0, le=100.0, description="Assignment completion rate", example=62.0)
    internal_marks: float = Field(..., ge=0.0, le=30.0, description="Continuous internal marks (out of 30)", example=16.0)
    previous_gpa: float = Field(..., ge=0.0, le=10.0, description="Prior cumulative CGPA (scale 0-10)", example=7.42)
    recent_trend: Optional[float] = Field(default=-0.3, ge=-5.0, le=5.0, description="Semester-over-semester GPA delta", example=-0.3)
    core_subject_score: Optional[float] = Field(default=58.0, ge=0.0, le=100.0, description="Core subject / DSA mark", example=58.0)
    study_hours_weekly: Optional[float] = Field(default=14.5, ge=0.0, le=100.0, description="Weekly study/coding hours", example=14.5)
    missed_labs: Optional[int] = Field(default=4, ge=0, le=50, description="Number of missed practical labs", example=4)

    model_config = {
        "json_schema_extra": {
            "example": {
                "attendance": 68.0,
                "assignment_completion": 62.0,
                "internal_marks": 16.0,
                "previous_gpa": 7.42,
                "recent_trend": -0.3,
                "core_subject_score": 58.0,
                "study_hours_weekly": 14.5,
                "missed_labs": 4
            }
        }
    }

# 1. GET /health
@router.get("/health", status_code=status.HTTP_200_OK)
def health_status():
    return {
        "status": "healthy",
        "service": "CampusMind X AI/ML Engine",
        "phase": "Phase 3 - Real Python AI Engine Active",
        "models_loaded": {
            "risk_model": "Random Forest Classifier (Empirically Selected)",
            "performance_model": "Ridge Regression (Empirically Selected)",
            "preprocessor": "AcademicPreprocessor (StandardScaler + Imputer)"
        },
        "model_version": predictor.model_version
    }

# 2. POST /predict/risk
@router.post("/predict/risk", status_code=status.HTTP_200_OK)
def predict_academic_risk(payload: StudentAcademicInput):
    try:
        data_dict = payload.model_dump()
        result = predictor.predict_risk(data_dict)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing risk prediction: {str(e)}"
        )

# 3. POST /predict/performance
@router.post("/predict/performance", status_code=status.HTTP_200_OK)
def predict_academic_performance(payload: StudentAcademicInput):
    try:
        data_dict = payload.model_dump()
        result = predictor.predict_performance(data_dict)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing performance prediction: {str(e)}"
        )

# 4. POST /predict/explain
@router.post("/predict/explain", status_code=status.HTTP_200_OK)
def explain_academic_prediction(payload: StudentAcademicInput, target: str = "risk"):
    """
    Phase 4 Explainability Endpoint:
    Provides intelligible, non-causal plain-language factor contributions and benchmarks.
    """
    try:
        data_dict = payload.model_dump()
        if target.lower() == "performance":
            return predictor.explain_performance(data_dict)
        return predictor.explain_risk(data_dict)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing prediction explanation: {str(e)}"
        )
