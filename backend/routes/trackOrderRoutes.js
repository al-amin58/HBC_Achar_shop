import express from 'express';
import { searchTrackOrder } from '../controllers/trackOrderController.js';

const router = express.Router();

router.post('/search', searchTrackOrder);

export default router;
