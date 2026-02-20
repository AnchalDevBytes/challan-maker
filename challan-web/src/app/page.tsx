import FAQ from "@/components/landing-page/faq";
import Features from "@/components/landing-page/features";
import Footer from "@/components/landing-page/footer";
import HeroSection from "@/components/landing-page/hero-section";
import Navbar from "@/components/landing-page/navbar";
import Pricing from "@/components/landing-page/pricing";
import { cn } from "@/lib/utils";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-figtree text-neutral-900 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 z-1",
            "bg-size-[24px_24px]",
            "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)]",
            // "mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          )}
        />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(circle_at_center,#BAE6FD_0%,transparent_70%)] opacity-20 z-2 pointer-events-none blur-3xl" />

        <Navbar />
        <HeroSection />
      </div>

      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;
