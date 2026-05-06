import express from 'express';
import { adminLogin, adminLoginValidation} from '../controllers/auth/adminController.js';

const router = express.Router();
// ── Public (no auth) ──
router.post('/login', adminLoginValidation, adminLogin);


export default router;