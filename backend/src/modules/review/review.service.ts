import { AppError } from "../../middlewares/errorHandler";
import { Review } from "./review.model";
import { z } from "zod";
import { reviewQuerySchema, createReviewSchema, updateReviewSchema } from "./review.validation";

type ReviewQuery = z.infer<typeof reviewQuerySchema>;
type CreateReviewData = z.infer<typeof createReviewSchema>;
type UpdateReviewData = z.infer<typeof updateReviewSchema>;

const sortMap: Record<string, Record<string, 1 | -1>> = {
  newest:       { createdAt: -1 },
  oldest:       { createdAt: 1 },
  rating_asc:   { rating: 1 },
  rating_desc:  { rating: -1 },
  helpful_asc:  { helpful: 1 },
  helpful_desc: { helpful: -1 },
};

export const getAllReviews = async (query: ReviewQuery) => {
  const { book, rating, isApproved, sortBy, page, limit } = query;

  const filter: Record<string, any> = {};

  if (book)       filter.book = book;
  if (rating)     filter.rating = rating;
  if (isApproved) filter.isApproved = isApproved === "true";

  const sort = sortMap[sortBy] || { createdAt: -1 };
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("book", "title")
      .populate("user", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getBookReviews = async (bookId: string, query: ReviewQuery) => {
  const { rating, sortBy, page, limit } = query;

  const filter: Record<string, any> = { book: bookId, isApproved: true };
  if (rating) filter.rating = rating;

  const sort = sortMap[sortBy] || { createdAt: -1 };
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("user", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getReviewById = async (id: string) => {
  const review = await Review.findById(id)
    .populate("book", "title")
    .populate("user", "name");

  if (!review) throw new AppError("রিভিউ খুঁজে পাওয়া যায়নি", 404);
  return review;
};

export const createReview = async (data: CreateReviewData, userId: string) => {
  // Check if user already reviewed this book
  const existing = await Review.findOne({ book: data.book, user: userId });
  if (existing) throw new AppError("আপনি ইতিমধ্যে এই বই রিভিউ করেছেন", 400);

  const review = new Review({ ...data, user: userId });
  await review.save();
  return review.populate(["book", "user"]);
};

export const updateReview = async (id: string, data: UpdateReviewData, userId: string) => {
  const review = await Review.findById(id);
  if (!review) throw new AppError("রিভিউ খুঁজে পাওয়া যায়নি", 404);

  if (review.user.toString() !== userId) {
    throw new AppError("আপনি এই রিভিউ আপডেট করতে পারেন না", 403);
  }

  Object.assign(review, data);
  await review.save();
  return review.populate(["book", "user"]);
};

export const deleteReview = async (id: string, userId: string) => {
  const review = await Review.findById(id);
  if (!review) throw new AppError("রিভিউ খুঁজে পাওয়া যায়নি", 404);

  if (review.user.toString() !== userId) {
    throw new AppError("আপনি এই রিভিউ ডিলিট করতে পারেন না", 403);
  }

  await Review.findByIdAndDelete(id);
};

export const markHelpful = async (id: string) => {
  const review = await Review.findByIdAndUpdate(
    id,
    { $inc: { helpful: 1 } },
    { new: true }
  );
  if (!review) throw new AppError("রিভিউ খুঁজে পাওয়া যায়নি", 404);
  return review;
};
