import { Router } from 'express';
import { getAllProperties, getPropertyById, seedProperties } from '../controllers/propertyController';
import { getPropertyReviews, addReview } from '../controllers/reviewController';

const router = Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.get('/:id/reviews', getPropertyReviews);
router.post('/:id/reviews', addReview);
router.post('/seed', seedProperties);

export default router;
