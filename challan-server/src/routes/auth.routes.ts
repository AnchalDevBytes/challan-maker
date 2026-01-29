import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, signupSchema, verifyOtpSchema } from "../schemas/auth.schema";
import { loginController, logout, refreshToken, signup, verifyOtp } from "../controllers/auth.controller";

const router: Router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/login", validate(loginSchema), loginController);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;
