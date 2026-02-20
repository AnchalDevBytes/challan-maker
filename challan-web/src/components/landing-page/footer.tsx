"use client";
import { FileText, Twitter, Linkedin, Github, Heart, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();

    if(!email) return;

    console.log("Subscribing:", email);
    setEmail("");
  }

  return (
    <footer className="relative bg-white border-t border-neutral-100 pt-20 pb-6 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-[radial-gradient(circle_at_center,#BAE6FD_0%,transparent_70%)] opacity-20 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                <div className="col-span-1 md:col-span-4 space-y-6">
                    <Link href="#hero-section" className="flex items-center gap-2.5 group">
                        <div className="bg-blue p-2 rounded-xl transition-transform group-hover:scale-105">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-xl text-neutral-900 tracking-tight font-source-serif">
                            Challan Maker
                        </span>
                    </Link>
                    
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-sm font-figtree">
                        The modern standard for professional invoicing. Built for Indian freelancers, startups, and small businesses who value speed and design.
                    </p>

                    <div className="flex items-center gap-4">
                        <SocialIcon href="#" icon={<Twitter className="w-4 h-4" />} />
                        <SocialIcon href="#" icon={<Linkedin className="w-4 h-4" />} />
                        <SocialIcon href="#" icon={<Github className="w-4 h-4" />} />
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <h4 className="text-base font-medium text-neutral-600 uppercase tracking-wider mb-6"    >
                        Product
                    </h4>
                    <ul className="space-y-3 font-figtree">
                        <FooterLink href="#features">Features</FooterLink>
                        <FooterLink href="#pricing">Pricing</FooterLink>
                        <FooterLink href="/guest">Guest Mode</FooterLink>
                        <FooterLink href="#templates">Templates</FooterLink>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <h4 className="text-base font-medium text-neutral-600 uppercase tracking-wider mb-6">
                        Company
                    </h4>
                    <ul className="space-y-3 font-figtree">
                        <FooterLink href="/about">About Us</FooterLink>
                        <FooterLink href="/contact">Contact</FooterLink>
                        <FooterLink href="/privacy">Privacy Policy</FooterLink>
                        <FooterLink href="/terms">Terms of Service</FooterLink>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-4">
                    <h4 className="text-base font-medium text-neutral-600 uppercase tracking-wider mb-6">
                        Stay Professional
                    </h4>
                    <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-100 space-y-4">
                        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-widest leading-none">Join the community</p>
                        <p className="text-sm text-neutral-500 font-figtree">Get invoicing tips and business growth strategies delivered to your inbox.</p>
                        <form onSubmit={handleSubscribe} className="flex gap-2">
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com" 
                                className="bg-white border border-neutral-200 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                            <button type="submit" className="bg-blue text-white p-2 rounded-xl hover:bg-dark-blue transition-colors active:scale-95">
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-neutral-100 flex flex-col md:flex-row justify-center items-center gap-4">
                <div className="text-sm text-neutral-400 font-figtree">
                    © {currentYear} Challan Maker. All rights reserved.
                </div>
            </div>
        </div>
    </footer>
  );
};

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <li>
        <Link 
            href={href} 
            className="text-sm font-light text-neutral-500 hover:text-blue hover:translate-x-1 transition-all inline-block"
        >
            {children}
        </Link>
    </li>
);

const SocialIcon = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
    <a 
        href={href} 
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 hover:bg-blue-50 hover:text-blue transition-all border border-neutral-100"
    >
        {icon}
    </a>
);

export default Footer;