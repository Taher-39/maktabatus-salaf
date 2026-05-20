import { z } from "zod";

export const authorSchema = z.object({
  name:        z.string().min(2, "লেখকের নাম দিন"),
  description: z.string().optional().default(""),
});

export const updateAuthorSchema = authorSchema.partial();
