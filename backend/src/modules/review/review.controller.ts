import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import { createReviewSchema, updateReviewSchema, reviewQuerySchema } from "./review.validation";
import {
  getAllReviews, getReviewById, getBookReviews,
  createReview, updateReview, deleteReview, markHelpful,
} from "./review.service";

export const getAllReviewsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = reviewQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const result = await getAllReviews(parsed.data);
    sendResponse(res, 200, "সফল", result.reviews, {
      page: result.page, limit: result.limit,
      total: result.total, totalPages: result.totalPages,
    });
  } catch (err) { next(err); }
};

export const getBookReviewsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookId = Array.isArray(req.params.bookId) ? req.params.bookId[0] : req.params.bookId;
    if (!bookId) throw new AppError("bookId is required", 400);
    const parsed = reviewQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const result = await getBookReviews(bookId, parsed.data);
    sendResponse(res, 200, "সফল", result.reviews, {
      page: result.page, limit: result.limit,
      total: result.total, totalPages: result.totalPages,
    });
  } catch (err) { next(err); }
};

export const getReviewByIdHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) throw new AppError("id is required", 400);
    const review = await getReviewById(id);
    sendResponse(res, 200, "সফল", review);
  } catch (err) { next(err); }
};

export const createReviewHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    console.log("User ID from request:", req.user?.userId, parsed); // Debugging line
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Authentication required", 401);
    const review = await createReview(parsed.data, userId);
    sendResponse(res, 201, "রিভিউ তৈরি হয়েছে", review);
  } catch (err) { next(err); }
};

export const updateReviewHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) throw new AppError("id is required", 400);
    const parsed = updateReviewSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Authentication required", 401);
    const review = await updateReview(id, parsed.data, userId);
    sendResponse(res, 200, "আপডেট হয়েছে", review);
  } catch (err) { next(err); }
};

export const deleteReviewHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) throw new AppError("id is required", 400);
    const userId = req.user?.userId;
    if (!userId) throw new AppError("Authentication required", 401);
    await deleteReview(id, userId);
    sendResponse(res, 200, "ডিলিট হয়েছে");
  } catch (err) { next(err); }
};

export const markHelpfulHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) throw new AppError("id is required", 400);
    await markHelpful(id);
    sendResponse(res, 200, "হেল্পফুল মার্ক করা হয়েছে");
  } catch (err) { next(err); }
};
