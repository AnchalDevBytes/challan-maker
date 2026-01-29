import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        const result = await AuthService.initiateSignup(email, password, name);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;

        const tokens = await AuthService.verifyAndCreateUser(email, otp, req.ip);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.send(201).json({
            accessToken: tokens.accessToken
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inComingRefreshToken = req.cookies.refreshToken || req.body.refreshToken; 

        if(!inComingRefreshToken) return res.status(401).json({ message: "Token Required" });

        const tokens = await TokenService.refreshAuth(inComingRefreshToken, req.ip);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            accessToken: tokens.accessToken
        });
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const tokens = await AuthService.login(email, password, req.ip);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            accessToken: tokens.accessToken
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logout successful" });  
    } catch (error) {
        next(error);
    }
}
