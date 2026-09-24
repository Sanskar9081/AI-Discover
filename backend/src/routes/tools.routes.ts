import { Router } from 'express';
import { getTools, getToolById, createTool, updateTool, deleteTool, incrementClicks, incrementViews } from '../controllers/tools.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getTools);
router.get('/:id', getToolById);
router.post('/:id/click', incrementClicks);
router.post('/:id/view', incrementViews);
router.post('/', requireAuth, requireAdmin, createTool);
router.patch('/:id', requireAuth, requireAdmin, updateTool);
router.delete('/:id', requireAuth, requireAdmin, deleteTool);

export default router;
