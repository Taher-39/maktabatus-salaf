import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "ক্যাটাগরির নাম দিন"),
  description: z.string().optional().default(""),
});

export const updateCategorySchema = categorySchema.partial();
