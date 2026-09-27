"""
CampusMind X - Explainable AI Engine Microservice
Phase 3 Production Server
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as ai_router

app = FastAPI(
    title="CampusMind X — AI/ML Engine",
    description="Explainable Academic Risk Classification & Continuous GPA Performance Prediction Service",
    version="1.3.0-phase3"
)

# Enable CORS for local client and Express API gateway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Health Redirect / Health Check
@app.get("/health")
def root_health():
    return {
        "status": "healthy",
        "service": "CampusMind X AI/ML Engine",
        "phase": "Phase 3 - Real Python AI Engine Active",
        "version": "1.3.0-phase3"
    }

# Mount AI prediction routes
app.include_router(ai_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
