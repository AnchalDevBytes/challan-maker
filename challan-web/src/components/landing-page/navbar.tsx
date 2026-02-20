"use client";
import { FileText, Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "FAQ", href: "#faq" },
    ];

  return (
    <>
        <nav className="w-full px-2 md:max-w-5xl mx-auto py-1 sticky top-2 z-100 bg-white/80 backdrop-blur-md rounded-2xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="#hero-section" className="flex items-center gap-2.5 group">
                    <div className="bg-blue p-2 rounded-xl transition-transform group-hover:scale-105">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium text-xl text-neutral-900 tracking-tight font-source-serif">
                        Challan Maker
                    </span>
                </Link>
                
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600 font-figtree">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href}
                            className="hover:text-blue transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link href="/login" className="hidden md:block">
                        <Button variant="ghost" className="text-neutral-600 hover:text-blue font-figtree">
                            Login
                        </Button>
                    </Link>

                    <Link href="/guest" className="hidden md:block">
                        <Button className="bg-blue hover:bg-dark-blue text-white shadow-lg transition-all shadow-dark-blue/40 px-4 sm:px-6 rounded-xl active:scale-95 text-xs sm:text-sm">
                            Get Started
                        </Button>
                    </Link>

                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-all active:scale-90"
                    >
                        {isOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
                    </button>
                </div>
            </div>
        </nav>

        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-80 bg-neutral-900/20 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-24 inset-x-4 z-90 md:hidden overflow-hidden bg-white rounded-[2rem] p-8"
                    >
                        <div className="flex flex-col gap-6">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2">Navigation</p>
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-bold text-neutral-700 hover:text-blue flex items-center justify-between group transition-colors px-2 py-1"
                                    >
                                        {link.name}
                                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                ))}
                            </div>

                            <div className="h-px bg-neutral-100 w-full my-2" />

                            <div className="flex flex-col gap-3">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold border-neutral-200 text-neutral-700">
                                        Login
                                    </Button>
                                </Link>

                                <Link href="/guest" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full h-14 bg-blue hover:bg-dark-blue text-white shadow-xl shadow-blue/20 rounded-2xl text-lg font-bold">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    </>
  )
}

export default Navbar;