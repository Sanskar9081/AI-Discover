import { Router } from 'express';
import { getSavedItems, saveItem, deleteSavedItem } from '../controllers/saved.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, getSavedItems);
router.post('/', requireAuth, saveItem);
router.delete('/:id', requireAuth, deleteSavedItem);

export default router;
