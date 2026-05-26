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
    const { bookId } = req.params;
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
    const review = await getReviewById(req.params.id);
    sendResponse(res, 200, "সফল", review);
  } catch (err) { next(err); }
};

export const createReviewHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createReviewSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const review = await createReview(parsed.data, (req as any).user._id);
    sendResponse(res, 201, "রিভিউ তৈরি হয়েছে", review);
  } catch (err) { next(err); }
};

export const updateReviewHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateReviewSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);
    const review = await updateReview(req.params.id, parsed.data, (req as any).user._id);
    sendResponse(res, 200, "আপডেট হয়েছে", review);
  } catch (err) { next(err); }
};

export const deleteReviewHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteReview(req.params.id, (req as any).user._id);
    sendResponse(res, 200, "ডিলিট হয়েছে");
  } catch (err) { next(err); }
};

export const markHelpfulHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await markHelpful(req.params.id);
    sendResponse(res, 200, "হেল্পফুল মার্ক করা হয়েছে");
  } catch (err) { next(err); }
};
