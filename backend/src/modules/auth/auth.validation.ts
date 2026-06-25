import { z } from "zod";

export const sendOtpSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  email: z.string().email("সঠিক ইমেইল অ্যাড্রেস দিন"),
});

export const verifyOtpSchema = z.object({
  name: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  email: z.string().email("সঠিক ইমেইল অ্যাড্রেস দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
  otp: z.string().length(6, "ওটিপি অবশ্যই ৬ ডিজিটের হতে হবে"),
});

export const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল অ্যাড্রেস দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("সঠিক ইমেইল অ্যাড্রেস দিন"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("সঠিক ইমেইল অ্যাড্রেস দিন"),
  otp: z.string().length(6, "ওটিপি অবশ্যই ৬ ডিজিটের হতে হবে"),
  newPassword: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});

export const googleLoginSchema = z.object({
  idToken: z.string().min(1, "Firebase token দিন"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "পুরোনো পাসওয়ার্ড দিন"),
  newPassword: z.string().min(6, "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"),
});