"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const router = useRouter();
  const { setTempEmail } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await api.post("auth/forgot-password", data);

      setTempEmail(data.email);
      toast.success("OTP sent to your email");
      router.push("/reset-password");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center">
      <div className="w-full max-w-100 sm:bg-white sm:rounded-xl sm:shadow-lg sm:border sm:border-neutral-200 overflow-hidden">
        <div className="p-8 pb-6">
          <div className="flex justify-center mb-6">
            <div className="hidden h-12 w-12 bg-blue-50 rounded-full sm:flex items-center justify-center text-blue">
              <Mail size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 text-center">
            Forgot Password?
          </h2>
          <p className="text-neutral-500 text-sm text-center mt-2 mb-8">
            No worries, we'll send you reset instructions.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email address"
                className={cn(
                  "w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:outline-none placeholder-neutral-400",
                  errors.email && "border-red-500 focus:ring-red-500",
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue hover:bg-dark-blue text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Send Code"
              )}
            </button>
          </form>
        </div>

        <div className="bg-neutral-50 p-6 border-t border-neutral-100 text-center">
          <p className="text-neutral-600 text-sm">
            Want to back to Login?{" "}
            <Link
              href="/login"
              className="text-[#496989] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
