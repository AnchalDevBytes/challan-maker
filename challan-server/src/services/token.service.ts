import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export class TokenService {
    static async generateAuthToken(userId: string, ipAddress?: string) {
        const accessToken = jwt.sign(
            { sub: userId },
            ACCESS_SECRET, 
            { expiresIn: '15m'}
        );

        const refreshToken = jwt.sign(
            { sub: userId },
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await prisma.refreshToken.create({
            data : {
                token : refreshToken,
                userId : userId,
                expiresAt : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                ipAddress: ipAddress ?? null
            }
        });

        return { accessToken, refreshToken };
    }

    // Rotate token: invalidate old refresh token and issue a new pair
    static async refreshAuth(inComingRefreshToken: string, ipAddress?: string) {
        const existingToken = await prisma.refreshToken.findUnique({
            where: { token: inComingRefreshToken }
        });

        if(!existingToken) throw new AppError("Invalid token", 401);

        if(existingToken.revoked) {
            await prisma.refreshToken.updateMany({
                where: { userId: existingToken.userId },
                data: { revoked: true }
            });
            throw new AppError("Security Alert: Token reuse detected. Please login again.",  403);
        }

        if(existingToken.expiresAt < new Date()) {
            throw new AppError("Token expired.", 401);
        }

        const { accessToken, refreshToken: newRefreshToken } = await this.generateAuthToken(existingToken.userId, ipAddress);

        await prisma.refreshToken.update({
            where: { id: existingToken.id },
            data: {
                revoked: true,
                replacedByToken: newRefreshToken
            }
        });

        return { accessToken, refreshToken: newRefreshToken };
    }

    // For logout we revoke refreshToken from db
    static async revokeRefreshToken(token: string) {
        const record = await prisma.refreshToken.findUnique({ where: { token }});

        if(!record) return;

        await prisma.refreshToken.update({
            where: { token },
            data: { revoked: true }
        });
    }
}
