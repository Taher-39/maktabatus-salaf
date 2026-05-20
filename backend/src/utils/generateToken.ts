import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Types } from "mongoose";

export const generateToken = (userId: Types.ObjectId, role: string): string => {
  return jwt.sign(
    { userId, role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );
};
