import { Router } from 'express';
import { getPrompts, getPromptById, createPrompt, updatePrompt, deletePrompt } from '../controllers/prompts.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getPrompts);
router.get('/:id', getPromptById);
router.post('/', requireAuth, requireAdmin, createPrompt);
router.patch('/:id', requireAuth, requireAdmin, updatePrompt);
router.delete('/:id', requireAuth, requireAdmin, deletePrompt);

export default router;
