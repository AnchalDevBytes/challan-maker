"use client";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const rotateX = useTransform(smoothProgress, [0, 0.4], [25, 0]);
  const scale = useTransform(smoothProgress, [0, 0.4], [0.85, 1]);
  const translateZ = useTransform(smoothProgress, [0, 0.4], [-100, 0]);
  const translateY = useTransform(scrollYProgress, [0, 0.4], [0, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[150vh] bg-white pt-20 sm:pt-28"
    >
      <div
        className={cn(
          "absolute inset-0 z-1",
          "bg-size-[20px_20px]",
          "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]",
          "mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]",
        )}
      />

      <div className="sticky top-0 h-screen flex flex-col items-center overflow-hidden z-10">
        <motion.div
          style={{ opacity }}
          className="container w-full max-w-7xl relative mx-auto px-4"
        >
          <div className="w-full max-w-4xl mx-auto text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center mb-6"
            >
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white text-[11px] font-semibold text-neutral-500 uppercase tracking-widest shadow-sm">
                <Sparkles className="w-3 h-3 text-blue" />
                Professional Invoicing, Simplified
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-5xl md:text-7xl font-medium tracking-[-0.04em] text-neutral-900 leading-[1.05] mb-6 font-source-serif"
            >
              Create Professional
              <br />
              <span className="text-neutral-500">Invoices in Seconds</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="text-lg md:text-xl text-neutral-500 mx-auto max-w-2xl leading-relaxed mb-10 font-figtree"
            >
              Stop wrestling with spreadsheets. Challan Maker helps freelancers
              and small businesses generate beautiful, compliant invoices
              instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-6 items-center justify-center"
            >
              <Link href="/guest">
                <button className="bg-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-dark-blue transition-all active:scale-95 shadow-xl shadow-blue/20">
                  Start your free trial
                </button>
              </Link>
              <Link
                href="/login"
                className="group flex items-center gap-2 font-bold text-neutral-900 hover:text-neutral-600 transition-colors"
              >
                View role based demos
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div
          className="w-full max-w-6xl mx-auto px-4"
          style={{ perspective: "1500px" }}
        >
          <motion.div
            style={{
              rotateX,
              scale,
              translateZ,
              translateY,
            }}
            className="relative rounded-3xl border border-neutral-200 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden origin-top"
          >
            <div className="relative aspect-16/10 sm:aspect-auto">
              <img
                src="/dashboard.png"
                alt="Challan Maker Dashboard"
                className="w-full h-auto object-cover"
              />

              <motion.div
                style={{
                  opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
                }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className="absolute inset-0 bg-linear-to-t from-white/50 via-transparent to-transparent h-full w-full" />
                <div className="absolute inset-0 bg-linear-to-r from-white/20 via-transparent to-white/20" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="h-[50vh]" />
    </section>
  );
};

export default HeroSection;
