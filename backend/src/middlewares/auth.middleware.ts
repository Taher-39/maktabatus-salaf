import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "./errorHandler";
import { User } from "../modules/auth/auth.model";

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) throw new AppError("অনুমতি নেই — login করুন", 401);

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) throw new AppError("ব্যবহারকারী পাওয়া যায়নি", 404);
    if (user.isBanned) throw new AppError("আপনার অ্যাকাউন্ট বাতিল করা হয়েছে", 403);

    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    next(error as Error);
  }
};

export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "admin") {
    return next(new AppError("শুধুমাত্র admin এর অনুমতি আছে", 403));
  }
  next();
};
