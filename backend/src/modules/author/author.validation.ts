import { z } from "zod";

export const authorSchema = z.object({
  name: z.string().min(2, "লেখকের নাম দিন"),
  slug: z
    .string()
    .optional()
    .transform((value) => (value ? value.trim() : ""))
    .refine(
      (value) => value === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
      "স্লাগ শুধুমাত্র ছোট হাতের অক্ষর, সংখ্যা এবং হাইফেন থাকতে পারে"
    ),
  description: z.string().optional().default(""),
});

export const updateAuthorSchema = authorSchema.partial();

export const authorQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
