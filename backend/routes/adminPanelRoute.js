import express from 'express';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';


const router = express.Router();

// ── Protected (admin token required) ──
router.use(adminAuthMiddleware);

// router.get('/dashboard', getDashboard);


export default router;