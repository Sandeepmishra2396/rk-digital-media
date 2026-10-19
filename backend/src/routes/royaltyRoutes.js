import { Router } from 'express';
import { getUserRoyalties } from '../controllers/royaltyController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Royalties are strictly user-isolated
router.use(requireAuth);

router.get('/', getUserRoyalties);

export default router;
