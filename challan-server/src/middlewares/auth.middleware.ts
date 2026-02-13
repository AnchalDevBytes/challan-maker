import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: { id: string, email: string };
        }
    }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const headerToken = req.headers.authorization?.startsWith("Bearer") 
            ? req.headers.authorization.split(" ")[1] 
            : null;
        
        const cookieToken = req.cookies?.accessToken;

        let decoded: { id: string, email: string } | null = null;

        if (headerToken) {
            try {
                decoded = jwt.verify(headerToken, process.env.JWT_ACCESS_SECRET!) as any;
            } catch (error) {
                decoded = null;
            }
        }

        if (!decoded && cookieToken) {
            try {
                decoded = jwt.verify(cookieToken, process.env.JWT_ACCESS_SECRET!) as any;
            } catch (error) {
                decoded = null;
            }
        }

        if(!decoded) {
            throw new AppError("Unauthorized: No valid token provided", 401);
        }

        const user = await prisma.user.findUnique({ 
            where: { id: decoded.id }, 
            select: { id: true, email: true }
        });

        if(!user) throw new AppError("User not found", 401);

        req.user = user;
        next();

    } catch (error) {
        next(error);
    }
};
