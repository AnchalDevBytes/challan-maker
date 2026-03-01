"use client";
import {
  FileText,
  Twitter,
  Linkedin,
  Github,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log("Subscribing:", email);
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative bg-white border-t border-neutral-100 pt-20 pb-8 overflow-hidden">
      {/* Subtle top-edge glow — replaced the heavy blue blob with an extremely faint neutral vignette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand column */}
          <div className="col-span-1 md:col-span-4 space-y-6">
            <Link
              href="#hero-section"
              className="flex items-center gap-2.5 group"
            >
              <div className="bg-blue p-2 rounded-xl transition-transform group-hover:scale-105 border border-blue-400/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-xl text-neutral-900 tracking-tight font-source-serif">
                Challan Maker
              </span>
            </Link>

            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm font-figtree">
              The modern standard for professional invoicing. Built for Indian
              freelancers, startups, and small businesses who value speed and
              design.
            </p>

            <div className="flex items-center gap-3">
              <SocialIcon
                href="#"
                icon={<Twitter className="w-4 h-4" />}
                label="Twitter"
              />
              <SocialIcon
                href="#"
                icon={<Linkedin className="w-4 h-4" />}
                label="LinkedIn"
              />
              <SocialIcon
                href="#"
                icon={<Github className="w-4 h-4" />}
                label="GitHub"
              />
            </div>
          </div>

          {/* Product links */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-6">
              Product
            </p>
            <ul className="space-y-3 font-figtree">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="/guest">Guest Mode</FooterLink>
              <FooterLink href="#templates">Templates</FooterLink>
            </ul>
          </div>

          {/* Company links */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-6">
              Company
            </p>
            <ul className="space-y-3 font-figtree">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>

          {/* Newsletter card */}
          <div className="col-span-1 md:col-span-4">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-6">
              Stay Professional
            </p>
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-4">
              <div>
                <p className="text-sm font-semibold text-neutral-800 mb-1">
                  Join the community
                </p>
                <p className="text-sm text-neutral-500 font-figtree leading-relaxed">
                  Invoicing tips and business growth strategies delivered to
                  your inbox.
                </p>
              </div>

              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue/40 transition-all placeholder:text-neutral-400"
                  />
                  <button
                    type="submit"
                    className="bg-blue text-white p-2.5 rounded-xl hover:bg-dark-blue transition-colors active:scale-95 shrink-0"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 border border-blue/10">
                  <span className="text-sm font-semibold text-blue">
                    ✓ You&apos;re on the list!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-400 font-figtree">
            © {currentYear} Challan Maker. All rights reserved.
          </p>
          <p className="text-xs text-neutral-300 font-figtree tracking-wide uppercase">
            Made with care in India
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <Link
      href={href}
      className="text-sm text-neutral-500 hover:text-blue transition-colors inline-block font-light"
    >
      {children}
    </Link>
  </li>
);

const SocialIcon = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <a
    href={href}
    aria-label={label}
    className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 hover:bg-blue/5 hover:text-blue transition-all border border-neutral-100"
  >
    {icon}
  </a>
);

export default Footer;
