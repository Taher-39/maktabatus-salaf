import { z } from "zod";

export const registerSchema = z.object({
  idToken: z.string().min(1, "Firebase token দিন"),
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
  address: z
    .object({
      village: z.string().optional().default(""),
      thana: z.string().optional().default(""),
      district: z.string().optional().default(""),
    })
    .optional(),
});

export const loginSchema = z.object({
  phone: z.string().min(11, "সঠিক ফোন নম্বর দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

export const forgotPasswordSchema = z.object({
  idToken: z.string().min(1, "Firebase token দিন"),
  newPassword: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
});
