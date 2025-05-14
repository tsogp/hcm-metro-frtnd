import HeroSection from "./_components/hero";
import StatSection from "./_components/stats";
import FeatureSection from "./_components/features";
import BenefitSection from "./_components/benefit";
import ContactSection from "./_components/contact";
import { Navbar } from "./_components/common/nav";
import Footer from "./_components/common/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col">
        <div className="pt-20 md:pt-16">
          <HeroSection />
          <StatSection />
          <FeatureSection />
          <BenefitSection />
          <ContactSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
