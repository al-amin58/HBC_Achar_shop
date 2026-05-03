import express from "express";
import { signupUser, loginUser, logoutUser,sendOtp,verifyOtp,resetPassword, } from "../controllers/auth/authController.js";
import { userAuthMiddleware } from "../middleware/userAuthMiddleware.js";

const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);

// ── Forgot Password ──
router.post('/forgot-password/send-otp',   sendOtp);
router.post('/forgot-password/verify-otp', verifyOtp);
router.post('/forgot-password/reset',      resetPassword);

router.use(userAuthMiddleware);

router.post('/logout', logoutUser);

export default router;
