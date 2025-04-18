import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Train,
  CreditCard,
  Smartphone,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Ticket,
  Wallet,
  Timer,
  Globe,
  Shield,
  BadgeCheck,
  Menu,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

      <main className="pt-16">
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
