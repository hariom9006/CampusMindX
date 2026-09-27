import express from 'express';
import { handleChatMessage, getChatHistory, clearChatHistory } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/ai/chat -> Send prompt to CampusMind AI Assistant
router.post('/', handleChatMessage);

// GET /api/ai/chat/history -> Fetch persistent conversation history
router.get('/history', getChatHistory);

// DELETE /api/ai/chat/history -> Reset/clear conversation history
router.delete('/history', clearChatHistory);

export default router;
