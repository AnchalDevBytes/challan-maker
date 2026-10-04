"use client";

import api from "@/lib/api";
import { setSessionCookie } from "@/lib/session";
import { useAuthStore } from "@/store/auth-store";
import { useGoogleLogin } from "@react-oauth/google";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

/*
  NOTE: Email & password signup is temporarily disabled while the email
  resend service is being configured. The schema and form handler are
  preserved below so they can be re-enabled seamlessly when ready.

  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import z from "zod";

  const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 8 characters long"),
  });
  type SignupFormValues = z.infer<typeof signupSchema>;
*/

const Signup = () => {
  const router = useRouter();
  const { setTempEmail } = useAuthStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  /*
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await api.post("/auth/signup", data);
      setTempEmail(data.email);
      toast.success("OTP sent to your email");
      router.push("/otp-verify");
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };
  */

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsGoogleLoading(true);
        await api.post("/auth/google", { code: tokenResponse.code });

        // Tokens are issued immediately on Google auth — write the session flag
        // so the Next.js middleware recognises the session on Vercel domain.
        setSessionCookie();

        toast.success("Login successful");
        router.push("/main");
      } catch {
        toast.error("Google login failed");
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setIsGoogleLoading(false);
    },
    onNonOAuthError: () => {
      setIsGoogleLoading(false);
    },
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 font-figtree">
      {/* ============================================================ */}
      {/* LEFT SIDE: Full-screen white on mobile (<sm); Blue accent   */}
      {/* rectangle on tablet/desktop (sm:) with white card over it.  */}
      {/* ============================================================ */}
      <div className="relative min-h-screen w-full bg-white sm:bg-[#496989] flex items-center justify-center p-0 sm:p-8 md:p-10 lg:p-12 overflow-hidden">
        {/* Decorative glow shapes (only shown when blue background is active) */}
        <div className="hidden sm:block absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="hidden sm:block absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#2c4561]/40 blur-3xl pointer-events-none" />

        {/* Auth Form: Full-screen on mobile (<sm); Floating rounded card on sm+ */}
        <div className="relative z-10 w-full min-h-screen sm:min-h-0 sm:max-w-md bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl border-none sm:border sm:border-neutral-100/80 px-6 py-10 sm:p-10 flex flex-col justify-center">
          {/* Logo & Brand Header */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
            <div className="bg-[#496989] p-2 rounded-xl transition-transform group-hover:scale-105">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-xl text-neutral-900 tracking-tight font-source-serif">
              Challan Maker
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Create your account
          </h1>
          <p className="text-neutral-500 text-sm mt-1.5 mb-8">
            Welcome to Challan Maker! Get started with your account in seconds.
          </p>

          {/* Google Sign-in / Sign-up Button */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setIsGoogleLoading(true);
                googleLogin();
              }}
              disabled={isGoogleLoading}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-neutral-300 rounded-xl font-medium text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#496989]" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span className="text-sm font-semibold">
                {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
              </span>
            </button>

            {/* Email + Password coming soon notice */}
            <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-neutral-50 border border-neutral-200/70">
              <span className="w-2 h-2 rounded-full bg-[#496989] shrink-0" />
              <p className="text-xs text-neutral-600 font-medium">
                Email + Password signup coming soon. Google login is active.
              </p>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Email/Password form commented out for now while resend email */}
          {/* is being configured.                                         */}
          {/* ============================================================ */}
          {/*
          <div className="relative flex py-4 items-center">
            <div className="grow border-t border-neutral-200" />
            <span className="mx-4 text-neutral-400 text-xs uppercase tracking-wider">or</span>
            <div className="grow border-t border-neutral-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                Name
              </label>
              <input
                {...register("name")}
                disabled={isPending}
                type="name"
                placeholder="Enter your name"
                className={cn(
                  "w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:outline-none placeholder-neutral-400 disabled:opacity-60 disabled:cursor-not-allowed",
                  errors.name && "border-red-500 focus:ring-red-500",
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                Email address
              </label>
              <input
                {...register("email")}
                disabled={isPending}
                type="email"
                placeholder="Enter your email address"
                className={cn(
                  "w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:outline-none placeholder-neutral-400 disabled:opacity-60 disabled:cursor-not-allowed",
                  errors.email && "border-red-500 focus:ring-red-500",
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                Password
              </label>
              <input
                {...register("password")}
                disabled={isPending}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={cn(
                  "w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:outline-none placeholder-neutral-400 disabled:opacity-60 disabled:cursor-not-allowed",
                  errors.password && "border-red-500 focus:ring-red-500",
                )}
              />
              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-blue hover:bg-dark-blue text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Continue"}
              {!isSubmitting && <ArrowRight size={20} />}
            </button>
          </form>
          */}

          {/* Card Footer */}
          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <p className="text-neutral-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#496989] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RIGHT SIDE: White Background with Geometric Graphic Shapes  */}
      {/* ============================================================ */}
      <div className="hidden lg:flex relative min-h-screen bg-white items-center justify-center p-12 overflow-hidden border-l border-neutral-100">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-size-[32px_32px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-60" />

        {/* Ambient circular backdrop elements */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-[#496989]/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-neutral-100 blur-3xl pointer-events-none" />

        {/* Central Graphic Composition */}
        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
          {/* Surrounding Geometric Shapes */}
          <div className="relative w-full">
            {/* Circular Graphic Accents */}
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full border border-dashed border-[#496989]/30 pointer-events-none" />
            <span className="absolute -top-2 -left-2 w-3.5 h-3.5 rounded-full bg-[#496989]/25 pointer-events-none" />
            <span className="absolute top-12 -right-4 w-5 h-5 rounded-full bg-emerald-400/20 pointer-events-none" />

            {/* Floating Top Satellite Badge (Rectangle Shape) */}
            <div className="absolute -top-4 -right-4 z-20 rounded-xl border border-neutral-200/80 bg-white/95 px-3.5 py-1.5 shadow-md shadow-neutral-900/5 backdrop-blur-xs flex items-center gap-2 text-xs font-medium text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live GST Preview
            </div>

            {/* Main Delivery Challan Preview Mockup (Rectangle Card) */}
            <div className="relative rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xl shadow-neutral-900/5 backdrop-blur-xs">
              {/* Challan Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#496989] flex items-center justify-center text-white">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-neutral-900 font-source-serif">
                      Delivery Challan
                    </h3>
                    <p className="text-[11px] text-neutral-400">#DC-2026-0842</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-medium">
                  Dispatched
                </span>
              </div>

              {/* Sender & Consignee details grid */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-neutral-50/70 border border-neutral-100">
                  <span className="text-neutral-400 block text-[10px] uppercase tracking-wider font-semibold">
                    Consignor
                  </span>
                  <span className="font-medium text-neutral-800 truncate block mt-0.5">
                    Apex Dynamics Ltd
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-50/70 border border-neutral-100">
                  <span className="text-neutral-400 block text-[10px] uppercase tracking-wider font-semibold">
                    Consignee
                  </span>
                  <span className="font-medium text-neutral-800 truncate block mt-0.5">
                    Metro Logistics Hub
                  </span>
                </div>
              </div>

              {/* Item Rows Preview */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50/60 border border-neutral-100/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#496989]" />
                    <span className="text-xs font-medium text-neutral-700">
                      Precision Aluminum Casing
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900">
                    120 pcs
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50/60 border border-neutral-100/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#496989]/50" />
                    <span className="text-xs font-medium text-neutral-700">
                      Fastener & Mounting Kit
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-neutral-900">
                    60 sets
                  </span>
                </div>
              </div>

              {/* Total & Verification Stamp */}
              <div className="mt-4 pt-3.5 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500">Total Quantity:</span>
                  <span className="text-xs font-bold text-neutral-900">
                    180 units
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#496989]/10 text-[#496989] flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <span className="text-[11px] font-medium text-neutral-600">
                    E-Sign Validated
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Bottom Satellite Badge (Rectangle Shape) */}
            <div className="absolute -bottom-4 -left-4 z-20 rounded-xl border border-neutral-200/80 bg-white/95 px-3.5 py-1.5 shadow-md shadow-neutral-900/5 backdrop-blur-xs flex items-center gap-2 text-xs font-medium text-neutral-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#496989]" />
              100% Paperless & Export Ready
            </div>
          </div>

          {/* Accompanying Editorial Copy */}
          <div className="mt-10 text-center max-w-sm">
            <h2 className="text-xl font-medium text-neutral-900 font-source-serif">
              Crafted for modern operations
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              Generate, print, and share GST-compliant delivery challans in
              seconds with clean typography and zero spreadsheet hassle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
