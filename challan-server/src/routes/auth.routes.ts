import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { emailValidateSchema, googleLoginSchema, loginSchema, resetPasswordSchema, signupSchema, verifyOtpSchema } from "../schemas/auth.schema";
import { forgotPassword, googleLogin, loginController, logout, refreshToken, resendOtp, resetPassword, signup, verifyOtp } from "../controllers/auth.controller";

const router: Router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", validate(emailValidateSchema), resendOtp);

router.post("/login", validate(loginSchema), loginController);
router.post("/google", validate(googleLoginSchema), googleLogin);

router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.post("/forgot-password", validate(emailValidateSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
