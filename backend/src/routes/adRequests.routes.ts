import { Router } from 'express';
import { getAdRequests, deleteAdRequest } from '../controllers/adRequests.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', getAdRequests);
router.delete('/:id', deleteAdRequest);

export default router;
