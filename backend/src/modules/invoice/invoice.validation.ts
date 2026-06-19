import { z } from 'zod';

// MongoDB ObjectId validation regex
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const downloadInvoiceSchema = z.object({
  orderId: z.string()
    .min(1, 'অর্ডার আইডি প্রয়োজন')
    .regex(objectIdRegex, 'অর্ডার আইডি বৈধ নয়'),
});

export const viewInvoiceSchema = z.object({
  orderId: z.string()
    .min(1, 'অর্ডার আইডি প্রয়োজন')
    .regex(objectIdRegex, 'অর্ডার আইডি বৈধ নয়'),
});
