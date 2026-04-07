import express from 'express';
import { generatePropertyInsights, chatWithAI } from '../controllers/aiController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

// Protected route - only logged in users can generate insights
router.post('/insights', authenticateUser, generatePropertyInsights);
router.post('/chat', authenticateUser, chatWithAI);

export default router;
