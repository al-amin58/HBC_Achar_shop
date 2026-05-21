import express from 'express';
import { 
  adminLogin, 
  adminLoginValidation,
  getAdminProfile,
  updateAdminProfile 
} from '../controllers/auth/adminController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// ── Public (no auth) ──
router.post('/login', adminLoginValidation, adminLogin);

// ── Protected (requires auth) ──
router.get('/profile', adminAuthMiddleware, getAdminProfile);
router.put('/profile', adminAuthMiddleware, updateAdminProfile);

export default router;