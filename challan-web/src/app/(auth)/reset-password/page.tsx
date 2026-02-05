"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const resetPasswordSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm Password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const router = useRouter();
  const { tempEmail } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const length = 6;
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!tempEmail) {
      toast.error("Invalid session. Please start over.");
      router.push("/forgot-password");
    }
  }, [tempEmail, router]);

    const handleChange = (index: number, value: string) => {
        if(!/^\d*$/.test(value)) return;

        const val = value.slice(-1);

        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        setValue("otp", newOtp.join(""), { shouldValidate: true });

        if(val && index < length-1) {
            inputRefs.current[index+1]?.focus();
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index-1]?.focus();
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const pasteData = e.clipboardData.getData("text").slice(0, length).split("");
        if(pasteData.every((char) => /^\d$/.test(char))) {
            setOtp(pasteData);
            setValue("otp", pasteData.join(""), { shouldValidate: true });
            inputRefs.current[length-1]?.focus();
        }
    }

  const onSubmit = async (data: ResetFormValues) => {
    if (!tempEmail) {
      toast.error("Email missing. Please restart reset process");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        email: tempEmail,
        otp: data.otp,
        newPassword: data.newPassword,
      });

      toast.success("Password reset successful! You can now login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  if (!tempEmail) return null;

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center">
        <div className="w-full max-w-100 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
            
            <div className="p-8 pb-6">
                <h2 className="text-2xl font-bold text-neutral-900 text-center">
                    Set new password
                </h2>
                <p className="text-neutral-500 text-sm text-center mt-2 mb-8">
                    Please enter the code sent to <span className="font-medium text-neutral-800">{tempEmail}</span> and your new password.
                </p>

                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2 text-center">
                        Verification Code
                      </label>
                      <div className="flex gap-2 mb-4">
                          {otp.map((_, index) => {
                              return (
                                  <input
                                      key={index}
                                      ref={(el) => { inputRefs.current[index] = el }}
                                      type="text"
                                      inputMode="numeric"
                                      value={otp[index]}
                                      onChange={(e) => handleChange(index, e.target.value)}
                                      onKeyDown={(e) => handleKeyDown(index, e)}
                                      onPaste={handlePaste}
                                      className={cn(
                                          "flex w-12 h-12 border border-neutral-200 text-neutral-800 dark:border-neutral-700 rounded-md bg-transparent px-3 py-2 text-center text-sm font-semibold shadow-sm transition-all outline-none",
                                          "focus:border-blue dark:focus:border-blue focus:ring-1 focus:ring-blue dark:focus:ring-blue",
                                          "disabled:cursor-not-allowed disabled:opacity-50"
                                      )}
                                  />
                              )
                          })}
                      </div>
                      <input type="hidden" { ...register("otp") }/>
                      {errors.otp && <p className="text-red-500 text-xs text-center">{errors.otp.message}</p>}
                    </div>

                    <div className="relative flex py-4 items-center">
                      <div className="grow border-t border-neutral-200"/>
                      <span className=" mx-4 text-neutral-400 text-sm">
                        or
                      </span>
                      <div className="grow border-t border-neutral-200"/>
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">
                        New Password
                      </label>
                      <input 
                        {...register("newPassword")}
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        className={cn(
                          "w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:outline-none placeholder-neutral-400",
                          errors.newPassword && "border-red-500 focus:ring-red-500"
                        )}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                      </button>
                      {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                    </div>  

                    <div className="relative">
                      <label className="block text-sm font-semibold text-neutral-700 mb-1">
                        Confirm Password
                      </label>
                      <input 
                        {...register("confirmPassword")}
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password" 
                        className={cn(
                          "w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:outline-none placeholder-neutral-400",
                          errors.confirmPassword && "border-red-500 focus:ring-red-500"
                        )}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                      </button>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>  

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-3 bg-blue hover:bg-dark-blue text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Send Code"}
                    </button>
                </form>
            </div>

            <div className="bg-neutral-50 p-6 border-t border-neutral-100 text-center">
                <p className="text-neutral-600 text-sm">
                    Want to back to Login? <Link href="/login" className="text-[#496989] font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    </div>
  );
};

export default ResetPassword;
