import { Router } from 'express';
import { getRecentlyViewed, addRecentlyViewed } from '../controllers/recentlyViewed.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, getRecentlyViewed);
router.post('/:toolId', requireAuth, addRecentlyViewed);

export default router;
