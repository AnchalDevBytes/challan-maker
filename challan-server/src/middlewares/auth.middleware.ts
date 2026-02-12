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
        const token = req.cookies?.accessToken || (req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : null);

        if(!token) throw new AppError("Unauthorized, Please login", 401);

        const decoded = jwt.verify(
            token, 
            process.env.JWT_ACCESS_SECRET!
        ) as { id: string, email: string };

        const user = await prisma.user.findUnique({ 
            where: { id: decoded.id }, 
            select: { id: true, email: true }
        });

        if(!user) throw new AppError("User not found", 401);

        req.user = user;
        next();

    } catch (error) {
        next(new AppError(`error, "Invalid or expired token"`, 401));
    }
};
