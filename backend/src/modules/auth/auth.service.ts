import { admin } from "../../config/firebase";
import { AppError } from "../../middlewares/errorHandler";
import { generateToken } from "../../utils/generateToken";
import { User } from "./auth.model";
import { z } from "zod";
import { registerSchema, forgotPasswordSchema } from "./auth.validation";

export const verifyFirebaseToken = async (idToken: string) => {
  const decoded = await admin.auth().verifyIdToken(idToken);
  if (!decoded.phone_number) {
    throw new AppError("ফোন নম্বর যাচাই করা যায়নি", 400);
  }
  return decoded;
};

export const registerUser = async (
  data: z.infer<typeof registerSchema>,
  phone: string
) => {
  const existing = await User.findOne({ phone });
  if (existing) throw new AppError("এই ফোন নম্বরে আগেই অ্যাকাউন্ট আছে", 409);

  const user = await User.create({
    name: data.name,
    phone,
    password: data.password,
    address: data.address,
  });

  const token = generateToken(user._id as any, user.role);
  return { user, token };
};

export const loginUser = async (phone: string, password: string) => {
  // Ensure phone is string
  const phoneStr = String(phone).trim();
  
  const user = await User.findOne({ phone: phoneStr }).select('+password');
  if (!user) throw new AppError("ফোন নম্বর বা পাসওয়ার্ড ভুল", 401);
  
  if (user.isBanned) throw new AppError("আপনার অ্যাকাউন্ট বাতিল করা হয়েছে", 403);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("ফোন নম্বর বা পাসওয়ার্ড ভুল", 401);

  const token = generateToken(user._id as any, user.role);
  return { user, token };
};

export const resetPassword = async (
  data: z.infer<typeof forgotPasswordSchema>,
  phone: string
) => {
  const user = await User.findOne({ phone });
  if (!user) throw new AppError("এই নম্বরে কোনো অ্যাকাউন্ট নেই", 404);
  user.password = data.newPassword;
  await user.save();
};
