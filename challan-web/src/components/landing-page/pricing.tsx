"use client";
import { CheckCircle2, Clock, Sparkles, User, UserCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-20 md:py-32 bg-white"
    >
      <div className="container relative max-w-7xl mx-auto z-10 px-6">
        <div className="text-center mb-10 md:mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-blue-200/60 blur-[100px] rounded-full -z-10" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl tracking-tighter leading-[1.2] px-2 font-medium text-neutral-900 mb-2 md:mb-4 font-source-serif z-10"
          >
            Simple, transparent pricing
          </motion.h2>
          <p className="text-sm  md:text-base text-neutral-500 max-w-2xl mx-auto font-figtree">
            No hidden fees. Upgrade or downgrade as your business needs change.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Free/Guest */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl border border-neutral-200 bg-white shadow-sm flex flex-col"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-normal font-source-serif text-neutral-900 mb-1 flex items-center gap-2">
                Free Forever
              </h3>
              <p className="text-neutral-500 text-sm">
                No credit card, no strings attached.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-figtree font-bold uppercase tracking-widest text-neutral-500">
                <User className="w-3 h-3" /> Guest Mode
              </div>
              <ul className="space-y-3">
                <FeatureItem text="Unlimited Invoices" active />
                <FeatureItem text="Standard Template" active />
                <FeatureItem text="Watermarked PDF" muted />
                <FeatureItem text="No History Storage" muted />
              </ul>
            </div>

            <div className="relative my-8">
              <hr className="border-neutral-100" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-bold text-blue uppercase tracking-tighter">
                Unlock with login
              </div>
            </div>

            <div className="space-y-4 grow">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue">
                <UserCheck className="w-3 h-3" /> Registered Account
              </div>
              <ul className="space-y-3">
                <FeatureItem text="Everything in Guest Mode" active />
                <FeatureItem text="Remove Watermark" active />
                <FeatureItem text="Save 5 Invoice History" active />
              </ul>
            </div>

            <Link href="/guest" className="mt-10">
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl border-neutral-200 text-base font-medium hover:bg-neutral-50 transition-all cursor-pointer"
              >
                Start for Free
              </Button>
            </Link>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group p-8 rounded-3xl border border-blue-100 bg-linear-to-b from-blue-50/50 to-white relative overflow-hidden flex flex-col shadow-xl shadow-blue-100/20"
          >
            <div className="absolute top-0 right-0 bg-blue text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              Coming Soon
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-medium font-source-serif text-dark-blue mb-1 flex items-center gap-2">
                Premium <Sparkles className="w-4 h-4 text-green-600" />
              </h3>
              <p className="text-neutral-500 text-sm">
                The ultimate tool for scaling.
              </p>
            </div>

            <div className="space-y-6 grow">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-medium text-green-600">
                  ₹100
                </span>
                <span className="text-neutral-400 font-medium">/month</span>
              </div>

              <ul className="space-y-4">
                <FeatureItem text="Everything in Free Tier" active lg />
                <FeatureItem text="Unlimited History Storage" active lg />
                <FeatureItem text="Multiple Template Support" active lg />
                <FeatureItem text="Multi-Currency Support" active lg />
                <FeatureItem text="Advanced Dashboard Analytics" active lg />
                <FeatureItem text="Priority Email Support" active lg />
              </ul>
            </div>

            {/* Disabled State Interaction */}
            <div className="mt-10 relative">
              <Button
                disabled
                className="w-full h-14 rounded-2xl bg-neutral-100 text-neutral-400 border-none text-lg font-bold cursor-not-allowed"
              >
                Coming Soon
              </Button>
              <p className="text-center text-[10px] font-bold text-neutral-400 mt-3 uppercase tracking-widest">
                We will notify you when we launch
              </p>
            </div>

            {/* background pattern for Premium */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2563eb_1.5px,transparent_1.5px)] bg-size:[24px_24px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({
  text,
  active = false,
  muted = false,
  lg = false,
}: {
  text: string;
  active?: boolean;
  muted?: boolean;
  lg?: boolean;
}) => (
  <li
    className={cn(
      "flex items-center gap-3 transition-all",
      muted ? "text-neutral-400 opacity-60" : "text-neutral-600",
      lg && "text-neutral-800",
    )}
  >
    <CheckCircle2
      className={cn(
        "shrink-0",
        lg ? "w-5 h-5" : "w-4 h-4",
        active ? "text-blue" : "text-neutral-300",
      )}
    />
    <span
      className={cn(lg ? "text-base font-semibold" : "text-sm font-medium")}
    >
      {text}
    </span>
  </li>
);

export default Pricing;
