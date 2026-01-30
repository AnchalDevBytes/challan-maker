import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { forgotPasswordSchema, googleLoginSchema, loginSchema, resetPasswordSchema, signupSchema, verifyOtpSchema } from "../schemas/auth.schema";
import { forgotPassword, googleLogin, loginController, logout, refreshToken, resetPassword, signup, verifyOtp } from "../controllers/auth.controller";

const router: Router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);

router.post("/login", validate(loginSchema), loginController);
router.post("/google", validate(googleLoginSchema), googleLogin);

router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
