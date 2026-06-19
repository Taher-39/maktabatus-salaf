import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "ক্যাটাগরির নাম দিন"),
  slug: z.string().min(2, "স্লাগ দিন").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "স্লাগ শুধুমাত্র ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন থাকতে পারে"),
  description: z.string().optional().default(""),
});

export const updateCategorySchema = categorySchema.partial();

export const categoryQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
