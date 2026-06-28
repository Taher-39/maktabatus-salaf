import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.string().default("development"),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  CLIENT_URL: z.string().default("http://localhost:3000"),

  // SSLCOMMERZ
  SSLCOMMERZ_STORE_ID: z.string().default(""),
  SSLCOMMERZ_STORE_PASSWORD: z.string().default(""),
  SSLCOMMERZ_BASE_URL: z.string().default("https://sandbox.sslcommerz.com"),
  SSLCOMMERZ_SUCCESS_URL: z.string().default(""),
  SSLCOMMERZ_FAIL_URL: z.string().default(""),
  SSLCOMMERZ_CANCEL_URL: z.string().default(""),
  SSLCOMMERZ_CALLBACK_URL: z.string().default(""),
  SSLCOMMERZ_CURRENCY: z.string().default("BDT"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
