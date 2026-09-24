import { Router } from 'express';
import { getRatings, addRating } from '../controllers/ratings.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/:toolId', getRatings);
router.post('/:toolId', requireAuth, addRating);

export default router;
