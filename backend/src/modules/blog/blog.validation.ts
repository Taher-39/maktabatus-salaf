import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().trim().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().trim().min(50, "Content must be at least 50 characters"),
  category: z.string().trim().min(1, "Category is required"),
  image: z.string().trim().optional(),
  isPublished: z.boolean().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();

export const blogQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(["published", "draft", "all"]).optional().default("published"),
  sortBy: z
    .enum(["newest", "oldest", "views_asc", "views_desc", "likes_asc", "likes_desc"])
    .optional()
    .default("newest"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
