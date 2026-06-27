import { z } from 'zod';

// প্রোফাইল আপডেট — address এখন object { village, thana, district }
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষর').optional(),
  address: z
    .object({
      village:  z.string().optional().default(''),
      thana:    z.string().optional().default(''),
      district: z.string().optional().default(''),
    })
    .optional(),
  avatar: z.string().url('সঠিক URL দিন').optional(),
});

// পাসওয়ার্ড পরিবর্তন
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'বর্তমান পাসওয়ার্ড দিন'),
    newPassword: z.string().min(6, 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'),
    confirmPassword: z.string().min(1, 'পাসওয়ার্ড নিশ্চিত করুন'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'পাসওয়ার্ড মিলছে না',
    path: ['confirmPassword'],
  });

// ─── Admin: Change User Role ────────────────────────────────────────────────
export const changeUserRoleSchema = z.object({
  role: z.enum(['admin', 'customer']),
});

