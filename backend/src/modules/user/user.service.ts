import bcrypt from 'bcryptjs';
import { AppError } from '../../middlewares/errorHandler';
// ✅ auth.model থেকে User import — আলাদা model নেই
import { User } from '../auth/auth.model';

// ─── Get My Profile ───────────────────────────────────────────────────────────
const getMyProfile = async (userId: string) => {
  const user = await User.findById(userId).select('-password');

  if (!user) throw new AppError('ইউজার পাওয়া যায়নি', 404);

  return user;
};

// ─── Update Profile ───────────────────────────────────────────────────────────
const updateProfile = async (
  userId: string,
  payload: {
    name?: string;
    address?: { village?: string; thana?: string; district?: string };
    avatar?: string;
  }
) => {
  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) throw new AppError('ইউজার পাওয়া যায়নি', 404);

  return user;
};

// ─── Change Password ──────────────────────────────────────────────────────────
const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  // password select: false আছে তাই +password দিতে হবে
  const user = await User.findById(userId).select('+password');

  if (!user) throw new AppError('ইউজার পাওয়া যায়নি', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('বর্তমান পাসওয়ার্ড সঠিক নয়', 400);

  user.password = newPassword; // pre('save') hook bcrypt hash করবে
  await user.save();

  return { message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে' };
};

// ─── Get All Users (Admin) ────────────────────────────────────────────────────
const getAllUsers = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 10, search, isBanned } = query;

  // Filter for customer role (not admin)
  const filter: Record<string, unknown> = { role: 'customer' };

  if (isBanned !== undefined) filter.isBanned = isBanned === 'true';

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(filter);

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    data: users,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPage: Math.ceil(total / Number(limit)),
    },
  };
};

// ─── Get Single User (Admin) ──────────────────────────────────────────────────
const getSingleUser = async (userId: string) => {
  const user = await User.findById(userId).select('-password');

  if (!user) throw new AppError('ইউজার পাওয়া যায়নি', 404);

  return user;
};

// ─── Ban / Unban Toggle (Admin) ───────────────────────────────────────────────
const toggleBanUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError('ইউজার পাওয়া যায়নি', 404);

  // ✅ role 'admin' কে ban করা যাবে না
  if (user.role === 'admin') {
    throw new AppError('অ্যাডমিনকে ban করা যাবে না', 403);
  }

  user.isBanned = !user.isBanned;
  await user.save();

  const status = user.isBanned ? 'ban' : 'unban';
  return {
    message: `ইউজার সফলভাবে ${status} করা হয়েছে`,
    isBanned: user.isBanned,
  };
};

// ─── Delete User (Admin) ──────────────────────────────────────────────────────
const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError('ইউজার পাওয়া যায়নি', 404);

  if (user.role === 'admin') {
    throw new AppError('অ্যাডমিনকে delete করা যাবে না', 403);
  }

  await User.findByIdAndDelete(userId);

  return { message: 'ইউজার মুছে ফেলা হয়েছে' };
};

export const UserService = {
  getMyProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getSingleUser,
  toggleBanUser,
  deleteUser,
};
