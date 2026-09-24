import { Router } from 'express';
import { getUseCases, createUseCase, updateUseCase, deleteUseCase } from '../controllers/useCases.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getUseCases);
router.post('/', requireAuth, requireAdmin, createUseCase);
router.patch('/:id', requireAuth, requireAdmin, updateUseCase);
router.delete('/:id', requireAuth, requireAdmin, deleteUseCase);

export default router;
