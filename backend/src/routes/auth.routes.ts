import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', requireAuth, getUserProfile);

export default router;
