import { Router } from "express";
import {
  verifyOtpAndRegister,
  login,
  getMe,
  logout,
  forgotPassword,
} from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/login",           login);
router.post("/verify-otp",      verifyOtpAndRegister);
router.post("/forgot-password", forgotPassword);
router.get("/me",    protect,   getMe);
router.post("/logout", protect, logout);

export default router;
