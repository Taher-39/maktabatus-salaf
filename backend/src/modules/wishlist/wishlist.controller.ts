import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import { addToWishlistSchema, removeFromWishlistSchema, updateWishlistSchema, wishlistQuerySchema } from "./wishlist.validation";
import {
  getUserWishlist, addToWishlist, removeFromWishlist,
  clearWishlist, updateWishlist, checkIfInWishlist,
} from "./wishlist.service";

export const getUserWishlistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = wishlistQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const result = await getUserWishlist((req as any).user._id, parsed.data);
    sendResponse(res, 200, "সফল", result.wishlist, {
      page: result.page, limit: result.limit,
      total: result.total, totalPages: result.totalPages,
    });
  } catch (err) { next(err); }
};

export const addToWishlistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = addToWishlistSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const wishlist = await addToWishlist((req as any).user._id, parsed.data.bookId);
    sendResponse(res, 200, "উইশলিস্টে যোগ হয়েছে", wishlist);
  } catch (err) { next(err); }
};

export const removeFromWishlistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = removeFromWishlistSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const wishlist = await removeFromWishlist((req as any).user._id, parsed.data.bookId);
    sendResponse(res, 200, "উইশলিস্ট থেকে সরানো হয়েছে", wishlist);
  } catch (err) { next(err); }
};

export const checkIfInWishlistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookId } = req.params;
    const isInWishlist = await checkIfInWishlist((req as any).user._id, bookId);
    sendResponse(res, 200, "সফল", { isInWishlist });
  } catch (err) { next(err); }
};

export const clearWishlistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await clearWishlist((req as any).user._id);
    sendResponse(res, 200, "উইশলিস্ট পরিষ্কার করা হয়েছে");
  } catch (err) { next(err); }
};

export const updateWishlistHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateWishlistSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const wishlist = await updateWishlist((req as any).user._id, parsed.data);
    sendResponse(res, 200, "আপডেট হয়েছে", wishlist);
  } catch (err) { next(err); }
};
