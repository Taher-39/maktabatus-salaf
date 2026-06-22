import { z } from "zod";

export const createReviewSchema = z.object({
  book:    z.string().min(1, "বই নির্বাচন করুন"),
  rating:  z.number().min(1, "রেটিং দিন").max(5, "রেটিং ১-৫ এর মধ্যে হতে হবে"),
  comment: z.string().min(4, "রিভিউ কমপক্ষে ৪ অক্ষর দিন"), 
});

export const updateReviewSchema = createReviewSchema.partial();

export const reviewQuerySchema = z.object({
  book:       z.string().optional(),
  rating:     z.coerce.number().min(1).max(5).optional(),
  isApproved: z.enum(["true", "false"]).optional(),
  sortBy:     z.enum([
    "newest",  "oldest",
    "rating_asc", "rating_desc",
    "helpful_asc", "helpful_desc",
  ]).optional().default("newest"),
  page:  z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
