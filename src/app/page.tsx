import HeroSection from "./_components/hero";
import StatSection from "./_components/stats";
import FeatureSection from "./_components/features";
import BenefitSection from "./_components/benefit";
import ContactSection from "./_components/contact";
import { Navbar } from "./_components/nav";
import Footer from "./_components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-y-auto">
      <Navbar />

      <main className="pt-20 md:pt-16">
        <HeroSection />
        <StatSection />
        <FeatureSection />
        <BenefitSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
