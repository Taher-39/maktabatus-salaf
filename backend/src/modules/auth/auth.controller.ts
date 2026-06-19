import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import {
  verifyFirebaseToken,
  registerUser,
  loginUser,
  resetPassword,
} from "./auth.service";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
} from "./auth.validation";
import { User } from "./auth.model";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// POST /api/v1/auth/verify-otp
export const verifyOtpAndRegister = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const decoded = await verifyFirebaseToken(parsed.data.idToken);
    const { user, token } = await registerUser(parsed.data, decoded.phone_number!);

    res.cookie("token", token, cookieOptions);
    sendResponse(res, 201, "রেজিস্ট্রেশন সফল হয়েছে", {
      _id: user._id, name: user.name, phone: user.phone, role: user.role, token,
    });
  } catch (err) { next(err); }
};

// POST /api/v1/auth/login
export const login = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    console.log("Login request body:", req.body);
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const { user, token } = await loginUser(parsed.data.phone, parsed.data.password);

    res.cookie("token", token, cookieOptions);
    sendResponse(res, 200, "লগইন সফল হয়েছে", {
      _id: user._id, name: user.name, phone: user.phone, role: user.role, token,
    });
  } catch (err) { next(err); }
};

// GET /api/v1/auth/me
export const getMe = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");
    if (!user) throw new AppError("ব্যবহারকারী পাওয়া যায়নি", 404);
    sendResponse(res, 200, "সফল", user);
  } catch (err) { next(err); }
};

// POST /api/v1/auth/logout
export const logout = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("token");
    sendResponse(res, 200, "লগআউট সফল হয়েছে");
  } catch (err) { next(err); }
};

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const decoded = await verifyFirebaseToken(parsed.data.idToken);
    await resetPassword(parsed.data, decoded.phone_number!);

    sendResponse(res, 200, "পাসওয়ার্ড পরিবর্তন সফল হয়েছে");
  } catch (err) { next(err); }
};
