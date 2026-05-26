import { z } from "zod";

export const createBannerSchema = z.object({
  title:       z.string().min(3, "শিরোনাম কমপক্ষে ৩ অক্ষর দিন"),
  description: z.string().optional().default(""),
  link:        z.string().url().optional().default(""),
  position:    z.enum(["hero", "featured", "promotion"]).default("promotion"),
  startDate:   z.string().datetime(),
  endDate:     z.string().datetime(),
}).refine((data) => new Date(data.endDate) > new Date(data.startDate), {
  message: "শেষ তারিখ শুরু তারিখের চেয়ে পরে হতে হবে",
  path: ["endDate"],
});

export const updateBannerSchema = createBannerSchema.partial();

export const bannerQuerySchema = z.object({
  position: z.enum(["hero", "featured", "promotion"]).optional(),
  status:   z.enum(["active", "inactive", "all"]).optional().default("active"),
  sortBy:   z.enum([
    "newest", "oldest",
    "startDate_asc", "startDate_desc",
  ]).optional().default("startDate_desc"),
  page:  z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
