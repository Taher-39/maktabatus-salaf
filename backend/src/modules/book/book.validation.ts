import { z } from "zod";

export const createBookSchema = z.object({
  title:       z.string().min(2, "বইয়ের নাম দিন"),
  slug:        z.string().min(2, "স্লাগ দিন").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "স্লাগ শুধুমাত্র ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন থাকতে পারে"),
  description: z.string().optional().default(""),
  author:      z.string().min(1, "লেখক নির্বাচন করুন"),
  category:    z.string().min(1, "ক্যাটাগরি নির্বাচন করুন"),
  publisher:   z.string().min(1, "প্রকাশনী নির্বাচন করুন"),
  price:       z.number().min(0, "দাম দিন"),
  stock:       z.number().min(0).default(0),
  coverImage:  z.string().optional().default(""),
  previewPdf:  z.string().optional().default(""),
  bookPage:        z.number().min(0).default(0),
  edition:     z.number().min(1).default(1),
  weight:      z.number().min(0).default(0),  
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
