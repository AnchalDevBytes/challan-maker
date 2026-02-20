"use client";
import { cn } from "@/lib/utils";
import { Download, FileText, History, LayoutTemplate, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";

const Features = () => {
    const features = [
        {
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
            title: "Lightning Fast",
            desc: "Generate invoices in under 30 seconds with our intuitive editor."
        },
        {
            icon: <LayoutTemplate className="w-6 h-6 text-blue-400" />,
            title: "Professional Templates",
            desc: "Clean, minimal, and professional designs that impress clients."
        },
        {
            icon: <Download className="w-6 h-6 text-green-400" />,
            title: "Instant PDF Export",
            desc: "Download high-quality PDFs instantly. No watermarks on premium."
        },
        {
            icon: <History className="w-6 h-6 text-purple-400" />,
            title: "History & Management",
            desc: "Track your past invoices, edit them, or duplicate for recurring clients."
        },
        {
            icon: <ShieldCheck className="w-6 h-6 text-red-400" />,
            title: "Secure & Private",
            desc: "Your data is encrypted and stored securely. We value your privacy."
        },
        {
            icon: <FileText className="w-6 h-6 text-indigo-400" />,
            title: "GST Compliant",
            desc: "Add tax rates, shipping, and discounts easily. Perfect for Indian businesses."
        }
    ];

  return (
    <section 
        id="features" 
        className="relative overflow-hidden py-20 md:py-32 bg-neutral-50"
    >
        <div className="container mx-auto max-w-7xl relative z-10 px-6">
            <div className="text-center mb-10 md:mb-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -    -translate-y-1/2 w-80 h-40 bg-blue-200/60 blur-[100px] rounded-full -z-10"/>

                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl md:text-4xl tracking-tighter leading-[1.2] px-2 font-medium text-neutral-900 mb-2 md:mb-4 font-source-serif z-10"
                >
                    Everything you need
                </motion.h2>
                <p className="text-sm  md:text-base text-neutral-500 max-w-2xl mx-auto font-figtree">
                    Packed with features to make your invoicing experience smooth and professional.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, ease: "easeOut" }}
                        className="group relative flex flex-col bg-white p-6 rounded-2xl border border-neutral-100 shadow-md transition-all duration-300 overflow-hidden"
                    >
                        {/* dot pattern */}
                        <div
                            className={cn(
                                "absolute inset-0 opacity-50",
                                "bg-size-[10px_10px]",
                                "bg-[radial-gradient(#d4d4d4_1px,transparent_1px)]",
                            )}
                        />

                        {/* Card glow mask */}
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 mask-[radial-gradient(ellipse_at_center,transparent_5%,black)] pointer-events-none group-hover:bg-blue-100/40 transition-colors"/>

                        <div className="relative z-10 flex flex-col items-center justify-center text-center">
                            <div className="h-12 w-12 rounded-xl bg-neutral-50 flex items-center justify-center mb-4">
                                {feat.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feat.title}</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed">{feat.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
    </section>
  )
}

export default Features;
