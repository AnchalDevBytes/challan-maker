"use client";

import { useApiStatusStore } from "@/store/api-status-store";
import { AnimatePresence, motion } from "motion/react";
import { Info, Loader2 } from "lucide-react";

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
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-full max-w-lg pointer-events-auto ${className}`}
        >
          <div className="relative overflow-hidden rounded-xl border border-amber-300/90 dark:border-amber-700/80 bg-amber-50/95 dark:bg-amber-950/90 p-4 shadow-xl shadow-amber-900/10 backdrop-blur-md">
            <div className="flex items-start gap-3">
              {/* Animated pulsating icon indicator */}
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-lg bg-amber-400 opacity-20" />
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/70 dark:bg-amber-800/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200">
                    <Info className="h-3 w-3" />
                    Server Cold Boot
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed text-amber-900 dark:text-amber-100">
                  Sometime it might take 10-15 secs to respond by api as our
                  server is deployed on free tier of render.com, Kindly have
                  patience.
                </p>
              </div>
            </div>

            {/* Continuous animated loading progress bar at the bottom */}
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-amber-200/50 dark:bg-amber-900/50">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                style={{ width: "45%" }}
              />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default AuthServerNotice;
