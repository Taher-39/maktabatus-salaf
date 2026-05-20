import { z } from "zod";

export const createBookSchema = z.object({
  title:       z.string().min(2, "বইয়ের নাম দিন"),
  description: z.string().optional().default(""),
  author:      z.string().min(1, "লেখক নির্বাচন করুন"),
  category:    z.string().min(1, "ক্যাটাগরি নির্বাচন করুন"),
  publisher:   z.string().min(1, "প্রকাশনী নির্বাচন করুন"),
  price:       z.number().min(0, "দাম দিন"),
  stock:       z.number().min(0).default(0),
});

export const updateBookSchema = createBookSchema.partial();

export const bookQuerySchema = z.object({
  search:   z.string().optional(),
  category: z.string().optional(),
  author:   z.string().optional(),
  publisher:z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy:   z.enum([
    "price_asc", "price_desc",
    "name_asc",  "name_desc",
    "newest",    "oldest",
    "popular_asc","popular_desc",
  ]).optional().default("newest"),
  page:  z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});
