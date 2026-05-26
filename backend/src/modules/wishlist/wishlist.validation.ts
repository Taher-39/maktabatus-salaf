import { z } from "zod";

export const addToWishlistSchema = z.object({
  bookId: z.string().min(1, "বই নির্বাচন করুন"),
});

export const removeFromWishlistSchema = z.object({
  bookId: z.string().min(1, "বই নির্বাচন করুন"),
});

export const updateWishlistSchema = z.object({
  isPublic: z.boolean().optional(),
  books: z.array(z.string()).optional(),
});

export const wishlistQuerySchema = z.object({
  sortBy: z.enum([
    "newest", "oldest",
    "price_asc", "price_desc",
  ]).optional().default("newest"),
  page:  z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});
