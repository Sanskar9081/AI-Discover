import { Router } from 'express';
import { chatAssistant } from '../controllers/assistant.controller';

const router = Router();
router.post('/chat', chatAssistant);
export default router;
