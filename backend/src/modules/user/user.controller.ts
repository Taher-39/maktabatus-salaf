import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../middlewares/errorHandler';
import { UserService } from './user.service';
import { updateProfileSchema, changePasswordSchema, changeUserRoleSchema } from './user.validation';


// ─── Get My Profile ───────────────────────────────────────────────────────────
export const getMyProfile = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const result = await UserService.getMyProfile(req.user?.userId || '');
    sendResponse(res, 200, 'প্রোফাইল পাওয়া গেছে', result);
  } catch (err) { next(err); }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const result = await UserService.updateProfile(req.user?.userId || '', parsed.data);
    sendResponse(res, 200, 'প্রোফাইল আপডেট হয়েছে', result);
  } catch (err) { next(err); }
};

// ─── Change Password ──────────────────────────────────────────────────────────
export const changePassword = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const result = await UserService.changePassword(
      req.user?.userId || '',
      parsed.data.currentPassword,
      parsed.data.newPassword
    );
    sendResponse(res, 200, result.message, null);
  } catch (err) { next(err); }
};

// ─── Get All Users (Admin) ────────────────────────────────────────────────────
export const getAllUsers = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const result = await UserService.getAllUsers(req.query);
    sendResponse(res, 200, 'সকল ইউজার পাওয়া গেছে', result.data, result.meta);
  } catch (err) { next(err); }
};

// ─── Get Single User (Admin) ──────────────────────────────────────────────────
export const getSingleUser = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await UserService.getSingleUser(id);
    sendResponse(res, 200, 'ইউজার পাওয়া গেছে', result);
  } catch (err) { next(err); }
};

// ─── Ban / Unban User (Admin) ─────────────────────────────────────────────────
export const toggleBanUser = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await UserService.toggleBanUser(id);
    sendResponse(res, 200, result.message, { isBanned: result.isBanned });
  } catch (err) { next(err); }
};

// ─── Delete User (Admin) ──────────────────────────────────────────────────────
export const deleteUser = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const result = await UserService.deleteUser(id);
    sendResponse(res, 200, result.message, null);
  } catch (err) { next(err); }
};

// ─── Change Role (Admin) ─────────────────────────────────────────────────────
export const changeUserRole = async (
  req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const parsed = changeUserRoleSchema.safeParse(req.body);
    if (!parsed.success) throw new AppError(parsed.error.message, 400);

    const result = await UserService.changeUserRole(id, parsed.data.role);
    sendResponse(res, 200, result.message, { role: result.role });
  } catch (err) { next(err); }
};

