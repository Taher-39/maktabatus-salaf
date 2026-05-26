import express from 'express';
import { protect, adminOnly } from '../../middlewares/auth.middleware';
import * as UserController from './user.controller';

const router = express.Router();

// ──────────────────────────────────────────────────────────────
// CUSTOMER ROUTES (Auth required)
// ──────────────────────────────────────────────────────────────

// GET  /api/users/me          — আমার প্রোফাইল
router.get('/me', protect, UserController.getMyProfile);

// PATCH /api/users/me         — প্রোফাইল আপডেট (নাম, ঠিকানা)
router.patch('/me', protect, UserController.updateProfile);

// PATCH /api/users/me/change-password — পাসওয়ার্ড পরিবর্তন
router.patch(
  '/me/change-password',
  protect,
  UserController.changePassword
);

// ──────────────────────────────────────────────────────────────
// ADMIN ROUTES
// ──────────────────────────────────────────────────────────────

// GET  /api/users             — সকল customer list (search, filter, pagination)
router.get('/', protect, adminOnly, UserController.getAllUsers);

// GET  /api/users/:id         — single user details
router.get('/:id', protect, adminOnly, UserController.getSingleUser);

// PATCH /api/users/:id/ban    — ban / unban toggle
router.patch('/:id/ban', protect, adminOnly, UserController.toggleBanUser);

// DELETE /api/users/:id       — user delete
router.delete('/:id', protect, adminOnly, UserController.deleteUser);

export default router;
