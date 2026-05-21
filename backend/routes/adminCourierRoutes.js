import express from 'express';
import { adminAuthMiddleware } from '../middleware/adminAuthMiddleware.js';
import {
  bulkUpdateCouriers,
  getActiveCourierNames,
  getCouriers,
  testCourierApi,
  updateCourier,
} from '../controllers/admin/adminCourierController.js';

const router = express.Router();

router.use(adminAuthMiddleware);

router.get('/active-names', getActiveCourierNames);
router.get('/', getCouriers);
router.put('/bulk', bulkUpdateCouriers);
router.put('/:slug', updateCourier);
router.post('/:slug/test', testCourierApi);

export default router;
