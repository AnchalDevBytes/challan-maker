"use client";

import { useApiStatusStore } from "@/store/api-status-store";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Server } from "lucide-react";

interface AuthServerNoticeProps {
  className?: string;
}

export const AuthServerNotice = ({ className = "" }: AuthServerNoticeProps) => {
  const isSlowLoading = useApiStatusStore((state) => state.isSlowLoading);

  return (
    <AnimatePresence>
      {isSlowLoading && (
        <motion.aside
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{ opacity: 0, y: -20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.97 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={`fixed top-3 sm:top-4 left-0 right-0 z-100 mx-auto w-[calc(100%-2rem)] max-w-lg pointer-events-auto ${className}`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 border-l-4 border-l-[#496989] bg-white/98 p-4 sm:p-5 shadow-xl shadow-neutral-900/10 backdrop-blur-md">
            <div className="flex items-start gap-3.5">
              {/* Brand-accent spinner container */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#496989]/10 text-[#496989]">
                <Loader2 className="h-4 w-4 animate-spin text-[#496989]" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-neutral-700">
                    <Server className="w-3 h-3 text-[#496989]" />
                    Render.com Free Tier
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Cold reboot in progress
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-normal leading-relaxed text-neutral-600 font-figtree">
                  Our server is deployed on the free tier of render.com and
                  might take 10–15 seconds to respond due to spin-up. Kindly
                  have patience while the API connects.
                </p>
              </div>
            </div>

            {/* Subtle animated brand-blue loading progress track */}
            <div className="mt-3.5 h-1 w-full overflow-hidden rounded-full bg-neutral-100">
              <motion.div
                className="h-full rounded-full bg-[#496989]"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.6,
                  ease: "easeInOut",
                }}
                style={{ width: "40%" }}
              />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default AuthServerNotice;
