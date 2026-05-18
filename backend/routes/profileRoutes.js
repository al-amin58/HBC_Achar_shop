import express from 'express';
import { userAuthMiddleware } from '../middleware/userAuthMiddleware.js';
import {
  getMyWallet,
  getMyAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  updateNotificationSettings,
  getMyLandingRequests,
  createMyLandingRequest,
  getMySupportTickets,
  createSupportTicket,
  getMyDevices,
  removeDevice,
} from '../controllers/profileController.js';

const router = express.Router();

router.use(userAuthMiddleware);

router.get('/wallet', getMyWallet);

router.get('/addresses', getMyAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.patch('/addresses/:id/default', setDefaultAddress);

router.get('/wishlist', getMyWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:id', removeFromWishlist);

router.get('/notifications', getMyNotifications);
router.patch('/notifications/read-all', markAllNotificationsRead);
router.patch('/notifications/:id/read', markNotificationRead);
router.put('/notification-settings', updateNotificationSettings);

router.get('/landing-requests', getMyLandingRequests);
router.post('/landing-requests', createMyLandingRequest);

router.get('/support-tickets', getMySupportTickets);
router.post('/support-tickets', createSupportTicket);

router.get('/devices', getMyDevices);
router.delete('/devices/:id', removeDevice);

export default router;
