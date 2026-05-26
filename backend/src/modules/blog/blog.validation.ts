import { z } from "zod";

export const createBlogSchema = z.object({
  title:    z.string().min(5, "শিরোনাম কমপক্ষে ৫ অক্ষর দিন"),
  excerpt:  z.string().min(10, "সংক্ষিপ্ত বর্ণনা দিন"),
  content:  z.string().min(50, "ব্লগ কন্টেন্ট কমপক্ষে ৫০ অক্ষর দিন"),
  category: z.string().min(1, "ক্যাটাগরি নির্বাচন করুন"),
});

export const updateBlogSchema = createBlogSchema.partial();

export const blogQuerySchema = z.object({
  search:   z.string().optional(),
  category: z.string().optional(),
  author:   z.string().optional(),
  status:   z.enum(["published", "draft", "all"]).optional().default("published"),
  sortBy:   z.enum([
    "newest",  "oldest",
    "views_asc", "views_desc",
    "likes_asc", "likes_desc",
  ]).optional().default("newest"),
  page:  z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
