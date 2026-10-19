import { Router } from 'express';
import {
  getUserReleases,
  createRelease,
  getReleaseById,
  deleteRelease,
} from '../controllers/releaseController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All release management routes require authentication and user-scoped isolation
router.use(requireAuth);

router.get('/', getUserReleases);
router.post('/', createRelease);
router.get('/:id', getReleaseById);
router.delete('/:id', deleteRelease);

export default router;
