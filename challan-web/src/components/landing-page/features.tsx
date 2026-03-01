"use client";
import { cn } from "@/lib/utils";
import {
  Download,
  FileText,
  History,
  LayoutTemplate,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: <Zap className="w-5 h-5 text-blue" />,
    title: "Lightning Fast",
    desc: "Generate invoices in under 30 seconds with our intuitive editor.",
    span: "col-span-6 md:col-span-4",
    large: true,
  },
  {
    icon: <LayoutTemplate className="w-5 h-5 text-blue" />,
    title: "Professional Templates",
    desc: "Clean, minimal, and professional designs that impress clients.",
    span: "col-span-6 md:col-span-2",
    large: false,
  },
  {
    icon: <Download className="w-5 h-5 text-blue" />,
    title: "Instant PDF Export",
    desc: "Download high-quality PDFs instantly. No watermarks on premium.",
    span: "col-span-6 md:col-span-3",
    large: false,
  },
  {
    icon: <History className="w-5 h-5 text-blue" />,
    title: "History & Management",
    desc: "Track your past invoices, edit them, or duplicate for recurring clients.",
    span: "col-span-6 md:col-span-3",
    large: false,
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-blue" />,
    title: "Secure & Private",
    desc: "Your data is encrypted and stored securely. We value your privacy.",
    span: "col-span-6 md:col-span-3",
    large: false,
  },
  {
    icon: <FileText className="w-5 h-5 text-blue" />,
    title: "GST Compliant",
    desc: "Add tax rates, shipping, and discounts easily. Perfect for Indian businesses.",
    span: "col-span-6 md:col-span-3",
    large: false,
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-28 md:py-40 bg-neutral-50"
    >
      <div className="container mx-auto max-w-7xl relative z-10 px-6">
        <div className="text-center mb-12 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-bold uppercase tracking-widest text-blue mb-4"
          >
            ✦ Built for Speed
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl md:text-4xl tracking-[-0.03em] leading-[1.15] font-medium text-neutral-900 mb-4 font-source-serif"
          >
            Everything you need
          </motion.h2>
          <p className="text-sm md:text-base text-neutral-500 max-w-xl mx-auto font-figtree">
            Packed with features to make your invoicing experience smooth and
            professional.
          </p>
        </div>

        <div className="grid grid-cols-6 gap-5">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, ease: "easeOut" }}
              className={cn(
                "group relative flex flex-col bg-white p-7 rounded-2xl border border-neutral-100 shadow-sm",
                "hover:-translate-y-1 hover:shadow-md transition-all duration-300",
                feat.span,
                feat.large && "md:py-10 md:px-10",
              )}
            >
              <div className="h-10 w-10 rounded-xl bg-blue/5 border border-blue/10 flex items-center justify-center mb-5">
                {feat.icon}
              </div>

              <h3
                className={cn(
                  "font-semibold text-neutral-900 mb-2",
                  feat.large ? "text-2xl" : "text-lg",
                )}
              >
                {feat.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
