import express from 'express';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';
import {
  assignCourier,
  bulkDeleteOrders,
  bulkUpdateOrderStatus,
  deleteAdminOrder,
  getAdminOrderById,
  getAdminOrders,
  getOrderDistricts,
  sendOrderSms,
  updateAdminOrder,
  updateFraudStatus,
} from '../controllers/admin/adminOrderController.js';

const router = express.Router();

router.use(adminAuthMiddleware);

router.get('/meta/districts', getOrderDistricts);
router.patch('/bulk/status', bulkUpdateOrderStatus);
router.delete('/bulk', bulkDeleteOrders);
router.get('/', getAdminOrders);
router.get('/:id', getAdminOrderById);
router.patch('/:id', updateAdminOrder);
router.delete('/:id', deleteAdminOrder);
router.post('/:id/courier', assignCourier);
router.post('/:id/fraud', updateFraudStatus);
router.post('/:id/sms', sendOrderSms);

export default router;
