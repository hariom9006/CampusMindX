import express from 'express';
import { getAiHealth, predictRisk, predictPerformance, explainPrediction } from '../controllers/aiController.js';
import { handleChatMessage, getChatHistory, clearChatHistory } from '../controllers/chatController.js';

const router = express.Router();

// GET /api/ai/health -> Checks Python FastAPI connection and model statuses
router.get('/health', getAiHealth);

// POST /api/ai/predict-risk -> Risk classification (Random Forest)
router.post('/predict-risk', predictRisk);

// POST /api/ai/predict-performance -> Performance regression (Ridge)
router.post('/predict-performance', predictPerformance);

// POST /api/ai/explain -> Intelligible plain-language factor explanations
router.post('/explain', explainPrediction);

// CampusMind AI Assistant Conversational Endpoints
// POST /api/ai/chat
router.post('/chat', handleChatMessage);

// GET /api/ai/chat/history
router.get('/chat/history', getChatHistory);

// DELETE /api/ai/chat/history
router.delete('/chat/history', clearChatHistory);

export default router;

