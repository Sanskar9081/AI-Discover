import { Router } from 'express';
import { getSubscriptions, subscribe, unsubscribe, updateFrequency, deleteSubscription } from '../controllers/newsletter.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

router.get('/', requireAuth, requireAdmin, getSubscriptions);
router.patch('/:id/frequency', requireAuth, requireAdmin, updateFrequency);
router.delete('/:id', requireAuth, requireAdmin, deleteSubscription);

export default router;
