import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoritesController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateUser);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:id', removeFavorite);

export default router;
