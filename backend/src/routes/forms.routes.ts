import { Router } from 'express';
import { submitBugReport, submitAdRequest, submitContactMessage } from '../controllers/forms.controller';

const router = Router();

router.post('/bug-report', submitBugReport);
router.post('/ad-request', submitAdRequest);
router.post('/contact', submitContactMessage);

export default router;
