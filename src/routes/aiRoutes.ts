import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import { generateStatement } from '../controllers/aiController';

const router = Router();
router.use(protect);

router.post('/generate-statement', generateStatement);

export default router;