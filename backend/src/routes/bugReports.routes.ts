import { Router } from 'express';
import { getBugReports, updateBugStatus, deleteBugReport } from '../controllers/bugReports.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', getBugReports);
router.patch('/:id/status', updateBugStatus);
router.delete('/:id', deleteBugReport);

export default router;
