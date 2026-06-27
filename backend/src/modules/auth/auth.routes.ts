import { Router } from "express";
import {
  sendOtpHandler,        
  verifyOtpAndRegister, 
  login,
  socialLoginHandler,
  forgotPassword,
  resetPasswordHandler,
  changePasswordHandler,
  getMe,
  logout,
} from "./auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/send-otp",        sendOtpHandler);         
router.post("/verify-otp",      verifyOtpAndRegister);
router.post("/login",           login);
router.post("/social-login", socialLoginHandler);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password",  resetPasswordHandler);
router.post("/change-password", protect, changePasswordHandler);
router.get("/me",    protect,   getMe);
router.post("/logout", protect, logout);

export default router;