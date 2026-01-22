import express from 'express';
import { getUserProfile, updateUserProfile, getPublicProfile } from '../controllers/userController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

// Protected routes
router.get('/profile', authenticateUser, getUserProfile);
router.put('/profile', authenticateUser, updateUserProfile);

// Public routes
router.get('/:id', getPublicProfile);

export default router;
