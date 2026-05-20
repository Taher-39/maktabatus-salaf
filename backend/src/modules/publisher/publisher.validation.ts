import { z } from "zod";

export const publisherSchema = z.object({
  name: z.string().min(2, "প্রকাশনীর নাম দিন"),
  description: z.string().optional().default(""),
});

export const updatePublisherSchema = publisherSchema.partial();
