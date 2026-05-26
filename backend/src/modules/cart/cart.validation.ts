import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    bookId: z.string().min(1, 'Book ID is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100')
  })
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100')
  }),
  params: z.object({
    id: z.string().min(1, 'Cart item ID is required')
  })
});

export const removeFromCartSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Cart item ID is required')
  })
});
