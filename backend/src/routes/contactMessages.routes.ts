import { Router } from 'express';
import { getContactMessages, updateContactMessageStatus, deleteContactMessage } from '../controllers/contactMessages.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', getContactMessages);
router.patch('/:id/status', updateContactMessageStatus);
router.delete('/:id', deleteContactMessage);

export default router;
