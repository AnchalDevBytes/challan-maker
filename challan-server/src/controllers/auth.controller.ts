import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";
import { ApiResponse } from "../utils/ApiResponse";
import {  clearAuthCookies, setAuthCookies } from "../helpers/auth.helper";

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

        const result = await AuthService.verifyAndCreateUser(email, otp, req.ip);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        res.status(201).json(
            new ApiResponse(201, { user: result.user }, "User created successfully")
        );
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inComingRefreshToken = req.cookies.refreshToken;

        if(!inComingRefreshToken) return res.status(401).json({ message: "Token Required" });

        const result = await TokenService.refreshAuth(inComingRefreshToken, req.ip);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        res.status(200).json(
            new ApiResponse(200, { user: result.user }, "Token refreshed successfully")
        );
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const result = await AuthService.login(email, password, req.ip);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        res.status(200).json(new ApiResponse(200, { user: result.user }, "Login successful"));
    } catch (error) {
        next(error);
    }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.body;

        const result = await AuthService.loginWithGoogle(code, req.ip);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        res.status(200).json(
            new ApiResponse(200, { user: result.user }, "Google login successful")
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

export const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const result = await AuthService.resendOtp(email);

        res.status(200).json(
            new ApiResponse(200, null, result.message || "New OTP sent to your email")
        );
    } catch (error) {
        next(error);
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

        if(incomingToken) {
            await TokenService.revokeRefreshToken(incomingToken);
        }

        clearAuthCookies(res);

        res.status(200).json(
            new ApiResponse(200, null, "Logout successful")
        );  
    } catch (error) {
        next(error);
    }
};
