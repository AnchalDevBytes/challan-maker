"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import api from "@/lib/api";
import { setSessionCookie } from "@/lib/session";
import { formatTime } from "@/helpers/formatTime";

const OtpVerify = ({ length = 6 }: { length?: number }) => {
  const router = useRouter();
  const { tempEmail, setUser } = useAuthStore();
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const [timer, setTimer] = useState(600);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!tempEmail) {
      toast.error("Session expired. Please signup again.");
      router.push("/signup");
    }
  }, [tempEmail, router]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const val = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasteData = e.clipboardData
      .getData("text")
      .slice(0, length)
      .split("");
    if (pasteData.every((char) => /^\d$/.test(char))) {
      setOtp(pasteData);
      inputRefs.current[length - 1]?.focus();
    }
  };

  const onSubmit = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== length) {
      toast.error("Please enter complete otp");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/verify-otp", {
        email: tempEmail,
        otp: otpValue,
      });

      const userData = response.data.data.user;
      setUser(userData);

      // Tokens are issued here (first time for this user). Write the
      // session flag so the Next.js middleware recognises the session.
      setSessionCookie();

      toast.success(response.data.message || "Account verified successfully");
      router.push("/main");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setIsResending(true);
    try {
      await api.post("/auth/resend-otp", { email: tempEmail });
      setTimer(600);
      toast.success("New OTP sent to your email");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");

      if (error.response?.status === 400) {
        router.push("/signup");
      }
    } finally {
      setIsResending(false);
    }
  };

  if (!tempEmail) return null;

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-100 sm:bg-white sm:rounded-xl sm:shadow-lg sm:border sm:border-neutral-200 overflow-hidden">
        <div className="p-10 pb-8 flex flex-col items-center">
          <h2 className="text-xl font-bold text-neutral-900 text-center">
            Check your email
          </h2>
          <p className="text-neutral-500 text-sm text-center mt-1">
            to complete your registration
          </p>

          <div className="flex items-center gap-2 mt-2 mb-8">
            <span className="text-neutral-700 font-medium">{tempEmail}</span>
            <button className="text-blue hover:opacity-80 transition">
              <Pencil size={18} />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            {otp.map((_, index) => {
              return (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={cn(
                    "flex w-10 h-10 sm:w-12 sm:h-12 border border-neutral-200 text-neutral-800 dark:border-neutral-700 rounded-md bg-transparent px-3 py-2 text-center text-sm font-semibold shadow-sm transition-all outline-none",
                    "focus:border-blue dark:focus:border-blue focus:ring-1 focus:ring-blue dark:focus:ring-blue",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                />
              );
            })}
          </div>

          <div className="mb-8 text-center">
            {timer > 0 ? (
              <p className="text-sm text-neutral-500">
                Resend code in{" "}
                <span className="font-medium text-neutral-900">
                  {formatTime(timer)}
                </span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-50 flex items-center gap-2"
              >
                {isResending && <Loader2 className="w-3 h-3 animate-spin" />}
                Didn't receive a code? Resend
              </button>
            )}
          </div>

          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            type="submit"
            className="w-full py-3 bg-blue hover:bg-dark-blue text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 mb-6"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Verify & Signup"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
