import express from 'express';
import { userAuthMiddleware } from '../middleware/userAuthMiddleware.js';
import {
  getMyCart,
  addCartItem,
  updateCartItemQty,
  removeCartItem,
  clearMyCart,
  updateCartPreferences,
} from '../controllers/cartController.js';

const router = express.Router();

router.use(userAuthMiddleware);

router.get('/', getMyCart);
router.patch('/preferences', updateCartPreferences);
router.post('/items', addCartItem);
router.patch('/items/:cartId', updateCartItemQty);
router.delete('/items/:cartId', removeCartItem);
router.delete('/', clearMyCart);

export default router;
