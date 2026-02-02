import { OAuth2Client } from "google-auth-library";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { sendEmail } from "../utils/email";
import { generateOtp } from "../utils/otp";
import { hashVaue, compareValue } from "../utils/password";
import { TokenService } from "./token.service";

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
);

export class AuthService {
    static async initiateSignup(email: string, password: string, name?: string) {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser) throw new AppError("User already exists", 409);

        const hashedPassword = await hashVaue(password);
        const otp = generateOtp(6);
        const hashedOtp = await hashVaue(otp);

        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.pendingUser.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                name: name ?? null,
                otp: hashedOtp,
                expiresAt: otpExpiry
            },
            create: {
                email,
                password: hashedPassword,
                name: name ?? null,
                otp: hashedOtp,
                expiresAt: otpExpiry
            }
        });

        await sendEmail(email, "Your Signup OTP", `Your OTP is ${otp}. It is valid for 10 minutes.`);

        return { message: "OTP sent to email" };
    }

    static async verifyAndCreateUser(email: string, otp: string, ipAddress?: string) {
        const pendingUser = await prisma.pendingUser.findUnique({ where: { email } });

        if(!pendingUser) throw new AppError("Signup session expired", 400);

        const isValidOtp = await compareValue(otp, pendingUser.otp);
        if(!isValidOtp) throw new AppError("Invalid OTP", 400);

        if(pendingUser.expiresAt < new Date()) throw new AppError("OTP expired", 400);

        const newUser = await prisma.$transaction(async(tx) => {
            const user = await tx.user.create({
                data: {
                    email: pendingUser.email,
                    password: pendingUser.password,
                    name: pendingUser.name
                }
            });

            await tx.pendingUser.delete({ where: { id: pendingUser.id }});

            return user;
        });

        const tokens = await TokenService.generateAuthToken(newUser.id, ipAddress);

        return {
            ...tokens,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name ?? null,
                avatar: newUser.avatar ?? null     
            }
        }
    }

    static async login(email: string, password: string, ipAddress?: string) {
        const user = await prisma.user.findUnique({ where: { email}});

        if(!user) throw new AppError("Email not found. Invalid credentials", 401);

        if(!user.password) throw new AppError("Invalid Credentials", 401);

        const isValid = await compareValue(password, user.password);

        if(!isValid) throw new AppError("Inorrect password. Invalid credentials", 401);

        const tokens = await TokenService.generateAuthToken(user.id, ipAddress);

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name ?? null,
                avatar: user.avatar ?? null,
            }
        }
    }

    static async loginWithGoogle(code: string, ipAddress?: string ) {
        const { tokens: googleTokens } = await googleClient.getToken(code);

        const ticket = await googleClient.verifyIdToken({
            idToken: googleTokens.id_token!,
            audience: process.env.GOOGLE_CLIENT_ID!,
        });

        const payload = ticket.getPayload();
        if(!payload || !payload.email) throw new AppError("Invalid Google token", 400);

        const { email, name, sub: googleId, picture } = payload;

        let user = await prisma.user.findUnique({ where: { email } });

        if(!user) {
            user = await prisma.user.create({
                data: { 
                    email, 
                    name: name ?? null, 
                    googleId, 
                    avatar: picture ?? null, 
                    password: null 
                }
            });
        } else if(!user.googleId) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId, avatar: (user.avatar || picture) ?? null }
            });
        }

        const tokens = await TokenService.generateAuthToken(user.id, ipAddress);

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                name: user.name ?? null,
                avatar: user.avatar ?? null,
            }
        }
    }

    static async forgotPassword(email: string) {
        const user = await prisma.user.findUnique({ where: { email }});

        if(!user) return { message: "If email exists, OTP sent to email" };

        const otp = generateOtp(6);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.passwordReset.upsert({
            where: { email },
            update: { token: otp, expiresAt },
            create: { email, token: otp, expiresAt },
        });

        await sendEmail(email, "Reset Password OTP", `Your password reset OTP is ${otp}. It is valid for 10 minutes.`);

        return { message: "If email exists, OTP sent to email" };
    }

    static async resetPassword(email: string, otp: string, newPassword: string)  {
        const record = await prisma.passwordReset.findUnique({ where: { email }});
        if(!record) throw new AppError("Invalid or expired OTP", 400);

        const isValidOtp = await compareValue(otp, record.token);
        if(!isValidOtp) throw new AppError("Invalid OTP", 400);

        if(record.expiresAt < new Date()) throw new AppError("OTP expired", 400);

        const hashedPassword = await hashVaue(newPassword);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        await prisma.passwordReset.delete({ where: { email } });

        return { message: "Password reset successful. You can now login with new password" };
    }
}