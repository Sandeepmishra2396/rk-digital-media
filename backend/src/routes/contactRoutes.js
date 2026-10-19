import { Router } from 'express';
import { submitInquiry } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', contactLimiter, submitInquiry);

export default router;
