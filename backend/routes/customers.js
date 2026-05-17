import express from 'express';
import {
  getCustomers,
  getWalletSummary,
  getRecentWalletTransactions,
  adjustWalletBulk,
  getRewardsSummary,
  getRecentRewardTransactions,
  adjustRewardsBulk,
  getLandingRequests,
  createLandingRequest,
  updateLandingRequestStatus,
  deleteLandingRequest,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';

const router = express.Router();

router.get('/', getCustomers);

router.get('/wallet/summary', getWalletSummary);
router.get('/wallet/transactions', getRecentWalletTransactions);
router.post('/wallet/bulk', adjustWalletBulk);

router.get('/rewards/summary', getRewardsSummary);
router.get('/rewards/transactions', getRecentRewardTransactions);
router.post('/rewards/bulk', adjustRewardsBulk);

router.get('/landing-requests', getLandingRequests);
router.post('/landing-requests', createLandingRequest);
router.put('/landing-requests/:id', updateLandingRequestStatus);
router.delete('/landing-requests/:id', deleteLandingRequest);

router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
