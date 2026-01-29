import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { sendEmail } from "../utils/email";
import { generateOtp } from "../utils/otp";
import { hashPassword, verifyPassword } from "../utils/password";
import { TokenService } from "./token.service";

export class AuthService {
    static async initiateSignup(email: string, password: string, name?: string) {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser) throw new AppError("User already exists", 409);

        const hashedPassword = await hashPassword(password);
        const otp = generateOtp(6);
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.pendingUser.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                name: name ?? null,
                otp,
                expiresAt: otpExpiry
            },
            create: {
                email,
                password: hashedPassword,
                name: name ?? null,
                otp,
                expiresAt: otpExpiry
            }
        });

        await sendEmail(email, "Your Signup OTP", `Your OTP is ${otp}. It is valid for 10 minutes.`);

        return { message: "OTP sent to email" };
    }

    static async verifyAndCreateUser(email: string, otp: string, ipAddress?: string) {
        const pendingUser = await prisma.pendingUser.findUnique({ where: { email } });

        if(!pendingUser) throw new AppError("Signup session expired", 400);

        if(pendingUser.otp !== otp) throw new AppError("Invalid OTP", 400);

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

        return TokenService.generateAuthToken(newUser.id, ipAddress);
    }

    static async login(email: string, password: string, ipAddress?: string) {
        const user = await prisma.user.findUnique({ where: { email}});

        if(!user) throw new AppError("Email not found. Invalid credentials", 401);

        const isValid = await verifyPassword(password, user.password);

        if(!isValid) throw new AppError("Inorrect password. Invalid credentials", 401);

        return TokenService.generateAuthToken(user.id, ipAddress);
    }
}