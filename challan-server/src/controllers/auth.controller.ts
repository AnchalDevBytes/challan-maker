import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { ApiResponse } from "../utils/ApiResponse";
import { setRefreshCookie } from "../helpers/auth.helper";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        const result = await AuthService.initiateSignup(email, password, name);

        res.status(200).json(
            new ApiResponse(200, null, result.message || "OTP sent to email")
        );
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;

        const tokens = await AuthService.verifyAndCreateUser(email, otp, req.ip);

        setRefreshCookie(res, tokens.refreshToken);

        res.status(201).json(
            new ApiResponse(201, { accessToken: tokens.accessToken }, "User created successfully")
        );
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inComingRefreshToken = req.cookies.refreshToken || req.body.refreshToken; 

        if(!inComingRefreshToken) return res.status(401).json({ message: "Token Required" });

        const tokens = await TokenService.refreshAuth(inComingRefreshToken, req.ip);

        setRefreshCookie(res, tokens.refreshToken);

        res.status(200).json(
            new ApiResponse(200, { accessToken: tokens.accessToken }, "Token refreshed successfully")
        );
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const tokens = await AuthService.login(email, password, req.ip);

        setRefreshCookie(res, tokens.refreshToken);

        res.status(200).json(new ApiResponse(200, { accessToken: tokens.accessToken }, "Login successful"));
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

        if(incomingToken) {
            await TokenService.revokeRefreshToken(incomingToken);
        }

        res.clearCookie("refreshToken");

        res.status(200).json(
            new ApiResponse(200, null, "Logout successful")
        );  
    } catch (error) {
        next(error);
    }
}

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.body;

        const tokens = await AuthService.loginWithGoogle(code, req.ip);

        setRefreshCookie(res, tokens.refreshToken);

        res.status(200).json(
            new ApiResponse(200, { accessToken: tokens.accessToken }, "Google login successful")
        );
    } catch (error) {
        next(error);
    }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        const result = await AuthService.forgotPassword(email);

        res.status(200).json(
            new ApiResponse(200, null, result.message || "If email exists, OTP sent to email")  
        );
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, newPassword } = req.body;

        const result = await AuthService.resetPassword(email, otp, newPassword);
        
        res.status(200).json(
            new ApiResponse(200, null, result.message || "Password reset successful")
        );
    } catch (error) {
        next(error);
    }
}
