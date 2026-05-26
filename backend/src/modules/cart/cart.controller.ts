import { Request, Response, NextFunction } from 'express';
import {
  getCartService,
  addToCartService,
  updateCartItemService,
  removeFromCartService,
  clearCartService
} from './cart.service';
import { sendResponse, AppError } from '../../utils/sendResponse';

// Get cart
export const getCartHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user._id;
    const cart = await getCartService(userId);

    sendResponse(res, 200, 'Cart retrieved successfully', cart);
  } catch (error) {
    next(error);
  }
};

// Add to cart
export const addToCartHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user._id;
    const { bookId, quantity } = req.body;

    const cart = await addToCartService(userId, bookId, quantity);

    sendResponse(res, 201, 'Item added to cart successfully', cart);
  } catch (error) {
    next(error);
  }
};

// Update cart item
export const updateCartItemHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user._id;
    const { id } = req.params;
    const { quantity } = req.body;

    const cart = await updateCartItemService(userId, id, quantity);

    sendResponse(res, 200, 'Cart item updated successfully', cart);
  } catch (error) {
    next(error);
  }
};

// Remove from cart
export const removeFromCartHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user._id;
    const { id } = req.params;

    const cart = await removeFromCartService(userId, id);

    sendResponse(res, 200, 'Item removed from cart successfully', cart);
  } catch (error) {
    next(error);
  }
};

// Clear cart
export const clearCartHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user._id;

    const cart = await clearCartService(userId);

    sendResponse(res, 200, 'Cart cleared successfully', cart);
  } catch (error) {
    next(error);
  }
};
