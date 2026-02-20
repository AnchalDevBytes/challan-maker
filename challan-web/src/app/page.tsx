import FAQ from "@/components/landing-page/faq";
import Features from "@/components/landing-page/features";
import Footer from "@/components/landing-page/footer";
import HeroSection from "@/components/landing-page/hero-section";
import Navbar from "@/components/landing-page/navbar";
import Pricing from "@/components/landing-page/pricing";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-figtree text-neutral-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <HeroSection />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;
