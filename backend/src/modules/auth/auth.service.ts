import { admin } from "../../config/firebase";
import { AppError } from "../../middlewares/errorHandler";
import { generateToken } from "../../utils/generateToken";
import { User } from "./auth.model";
import { z } from "zod";
import { verifyOtpSchema } from "./auth.validation";
import { sendPasswordResetEmail, sendOtpEmail } from "../../utils/email.service";
import { Otp } from "./otp.model";
import bcrypt from "bcryptjs";

export const verifyFirebaseToken = async (idToken: string) => {
  const decoded = await admin.auth().verifyIdToken(idToken);
  return decoded;
};

export const socialLogin = async (idToken: string) => {
  const decoded = await verifyFirebaseToken(idToken);
  const { uid, email, name, picture, phone_number } = decoded;

  let user = await User.findOne({ $or: [{ firebaseUid: uid }, { email: email?.toLowerCase() }] });

  if (!user) {
    user = await User.create({
      name: name || "Social User",
      email: email?.toLowerCase(),
      phone: phone_number || "",
      firebaseUid: uid,
      avatar: picture,
      password: Math.random().toString(36).slice(-10), // Random password for social users
    });
  }

  const token = generateToken(user._id as any, user.role);
  return { user, token };
};

export const sendOtpService = async (email: string, name: string) => {
  const emailLower = email.toLowerCase().trim();
  
  const existingUser = await User.findOne({ email: emailLower });
  if (existingUser) throw new AppError("এই ইমেইলে আগেই অ্যাকাউন্ট আছে", 409);

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otpCode, 10);
  
  await Otp.deleteMany({ email: emailLower });
  await Otp.create({ email: emailLower, otp: hashedOtp });

  await sendOtpEmail(emailLower, name, otpCode);
  return { success: true };
};

export const verifyOtpAndRegisterService = async (
  data: z.infer<typeof verifyOtpSchema>
) => {
  const { email, name, password, otp } = data;
  const emailLower = email.toLowerCase().trim();

  const existing = await User.findOne({ email: emailLower });
  if (existing) throw new AppError("এই ইমেইলে আগেই অ্যাকাউন্ট আছে", 409);

  const otpRecord = await Otp.findOne({ email: emailLower });
  if (!otpRecord) throw new AppError("ওটিপি এক্সপায়ার হয়ে গেছে অথবা ভুল", 400);

  const isMatch = await bcrypt.compare(otp, otpRecord.otp);
  if (!isMatch) throw new AppError("ভুল ওটিপি কোড দিয়েছেন", 400);

  const user = await User.create({
    name,
    email: emailLower,
    password,
  });
  
  await Otp.deleteOne({ _id: otpRecord._id });
  const token = generateToken(user._id as any, user.role);
  return { user, token };
};

export const loginUserService = async (email: string, password: string) => {
  const emailStr = String(email).trim().toLowerCase();
  
  const user = await User.findOne({ email: emailStr }).select('+password');
  if (!user) throw new AppError("ইমেইল বা পাসওয়ার্ড ভুল", 401);
  
  if (user.isBanned) throw new AppError("আপনার অ্যাকাউন্ট বাতিল করা হয়েছে", 403);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("ইমেইল বা পাসওয়ার্ড ভুল", 401);

  const token = generateToken(user._id as any, user.role);
  return { user, token };
};

// ৪. ফরগট পাসওয়ার্ড ওটিপি পাঠানো
export const forgotPasswordService = async (email: string) => {
  const emailLower = email.toLowerCase().trim();
  const user = await User.findOne({ email: emailLower });
  if (!user) throw new AppError("এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি", 404);

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otpCode, 10);

  await Otp.deleteMany({ email: emailLower });
  await Otp.create({ email: emailLower, otp: hashedOtp });

  await sendPasswordResetEmail(emailLower, user.name, otpCode);
  return { success: true };
};

// ৫. ওটিপি ভেরিফাই ও পাসওয়ার্ড রিসেট
export const resetPasswordService = async (data: any) => {
  const { email, otp, newPassword } = data;
  const emailLower = email.toLowerCase().trim();

  const otpRecord = await Otp.findOne({ email: emailLower });
  if (!otpRecord) throw new AppError("ওটিপি এক্সপায়ার হয়ে গেছে অথবা ভুল", 400);

  const isMatch = await bcrypt.compare(otp, otpRecord.otp);
  if (!isMatch) throw new AppError("ভুল ওটিপি কোড দিয়েছেন", 400);

  const user = await User.findOne({ email: emailLower });
  if (!user) throw new AppError("ব্যবহারকারী পাওয়া যায়নি", 404);

  user.password = newPassword; 
  await user.save();

  await Otp.deleteOne({ _id: otpRecord._id });
  return { success: true };
};

// change password service 
export const changePasswordService = async (userId: string, data: any) => {
  const { oldPassword, newPassword } = data;

  // পাসওয়ার্ড সহ ইউজার ডেটা বের করা
  const user = await User.findById(userId).select("+password");
  if (!user) throw new AppError("ব্যবহারকারী পাওয়া যায়নি", 404);

  // পুরোনো পাসওয়ার্ড ঠিক আছে কিনা চেক করা
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new AppError("বর্তমান পাসওয়ার্ডটি ভুল দিয়েছেন", 400);

  // নতুন পাসওয়ার্ড সেট করা (মডেলের pre-save হুক এটি অটো হ্যাশ করবে)
  user.password = newPassword;
  await user.save();

  return { success: true };
};