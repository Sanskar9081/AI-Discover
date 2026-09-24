import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categories.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCategories);
router.post('/', requireAuth, requireAdmin, createCategory);
router.patch('/:id', requireAuth, requireAdmin, updateCategory);
router.delete('/:id', requireAuth, requireAdmin, deleteCategory);

export default router;
