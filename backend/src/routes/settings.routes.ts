import { Router } from 'express';
import { getSettings, updateSetting } from '../controllers/settings.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getSettings);
router.patch('/:key', requireAuth, requireAdmin, updateSetting);

export default router;
