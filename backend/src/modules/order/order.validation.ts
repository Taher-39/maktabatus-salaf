import { z } from 'zod';

const orderItemSchema = z.object({
  book: z.string().min(1, 'বই আইডি দিন'),
  quantity: z
    .number()
    .min(1, 'পরিমাণ কমপক্ষে ১ হতে হবে'),
  price: z.number().min(0, 'মূল্য ০ এর বেশি হতে হবে'),
});

export const createOrderSchema = z.object({
  name: z
    .string()
    .min(2, 'নাম কমপক্ষে ২ অক্ষর'),
  phone: z
    .string()
    .min(11, 'সঠিক ফোন নম্বর দিন')
    .max(14),
  email: z.string().email('সঠিক ইমেইল দিন').optional(),
  address: z.string().min(3, 'ঠিকানা দিন'),
  thana: z.string().min(1, 'থানা দিন'),
  district: z.string().min(1, 'জেলা দিন'),
  items: z
    .array(orderItemSchema)
    .min(1, 'কমপক্ষে একটি বই লাগবে'),
  paymentProof: z.string().optional(),

  paymentMethod: z.enum(['COD', 'SSLCOMMERZ']).optional(),
});


export const updateOrderStatusSchema = z.object({
  orderStatus: z
    .enum(['pending', 'shipped', 'delivered', 'cancelled'])
    .optional(),
  paymentStatus: z.enum(['pending', 'approved']).optional(),
  adminNote: z.string().optional(),
});

export const uploadPaymentProofSchema = z.object({
  proofUrl: z.string().optional(), // For backward compatibility
});
