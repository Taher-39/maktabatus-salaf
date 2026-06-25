import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../middlewares/errorHandler";
import {
  verifyOtpAndRegisterService,
  loginUserService,
  resetPasswordService,
  socialLogin,
  forgotPasswordService,
  sendOtpService,
  changePasswordService
} from "./auth.service";
import {
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  sendOtpSchema,
  resetPasswordSchema,
  changePasswordSchema
} from "./auth.validation";
import { User } from "./auth.model";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// POST /api/v1/auth/social-login
export const socialLoginHandler = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const { idToken } = req.body;
    if (!idToken) throw new AppError("ID Token প্রয়োজন", 400);

    const { user, token } = await socialLogin(idToken);

    res.cookie("token", token, cookieOptions);
    sendResponse(res, 200, "সফল", {
      _id: user._id, name: user.name, phone: user.phone, role: user.role, token,
    });
  } catch (err) { next(err); }
};


// ১. ওটিপি জেনারেট এবং ইমেইলে পাঠানো
export const sendOtpHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = sendOtpSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    await sendOtpService(parsed.data.email, parsed.data.name);
    sendResponse(res, 200, "ওটিপি সফলভাবে ইমেইলে পাঠানো হয়েছে");
  } catch (err) { next(err); }
};

// POST /api/v1/auth/verify-otp
export const verifyOtpAndRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const { user, token } = await verifyOtpAndRegisterService(parsed.data);

    res.cookie("token", token, cookieOptions);
    sendResponse(res, 201, "রেজিস্ট্রেশন সফল হয়েছে", {
      _id: user._id, name: user.name, email: user.email, role: user.role, token,
    });
  } catch (err) { next(err); }
};

// POST /api/v1/auth/login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const { user, token } = await loginUserService(parsed.data.email, parsed.data.password);

    res.cookie("token", token, cookieOptions);
    sendResponse(res, 200, "লগইন সফল হয়েছে", {
      _id: user._id, name: user.name, email: user.email, role: user.role, token,
    });
  } catch (err) { next(err); }
};

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    await forgotPasswordService(parsed.data.email);
    sendResponse(res, 200, "পাসওয়ার্ড রিসেট ওটিপি ইমেইলে পাঠানো হয়েছে");
  } catch (err) { next(err); }
};

export const resetPasswordHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    await resetPasswordService(parsed.data);
    sendResponse(res, 200, "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে");
  } catch (err) { next(err); }
};

export const changePasswordHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    await changePasswordService(req.user!.userId, parsed.data);

    sendResponse(res, 200, "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে");
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