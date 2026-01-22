import express from 'express';
import { generatePropertyInsights } from '../controllers/geminiController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

// Protected route - only logged in users can generate insights
router.post('/insights', authenticateUser, generatePropertyInsights);

export default router;
