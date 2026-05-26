import { Router } from 'express';
import {
  getCartHandler,
  addToCartHandler,
  updateCartItemHandler,
  removeFromCartHandler,
  clearCartHandler
} from './cart.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

// Get cart (require auth)
router.get('/', protect, getCartHandler);

// Add to cart (require auth)
router.post('/', protect, addToCartHandler);

// Update cart item (require auth)
router.put('/:id', protect, updateCartItemHandler);

// Remove from cart (require auth)
router.delete('/:id', protect, removeFromCartHandler);

// Clear cart (require auth)
router.delete('/', protect, clearCartHandler);

export default router;
