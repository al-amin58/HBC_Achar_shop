import express from 'express';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '../controllers/notificationController.js';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

router.get('/', adminAuthMiddleware, getNotifications);
router.put('/:id/read', adminAuthMiddleware, markAsRead);
router.put('/read-all', adminAuthMiddleware, markAllAsRead);
router.delete('/:id', adminAuthMiddleware, deleteNotification);

export default router;