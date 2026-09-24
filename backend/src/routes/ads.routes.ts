import { Router } from 'express';
import { getAds, createAd, updateAd, deleteAd } from '../controllers/ads.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAds);
router.post('/', requireAuth, requireAdmin, createAd);
router.patch('/:id', requireAuth, requireAdmin, updateAd);
router.delete('/:id', requireAuth, requireAdmin, deleteAd);

export default router;
