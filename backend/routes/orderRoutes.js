import express from 'express';
import { userAuthMiddleware } from '../middleware/userAuthMiddleware.js';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from '../controllers/orderController.js';

const router = express.Router();

router.use(userAuthMiddleware);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.patch('/:id/cancel', cancelOrder);
router.get('/:id', getOrderById);

export default router;
