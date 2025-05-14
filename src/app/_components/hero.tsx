import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function HeroSection() {
  return (
    <section className="w-full min-h-[95vh] flex items-center overflow-hidden pb-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <Badge className="rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
              Welcome to HCMC Metro
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              A Modern Transit for a Modern City
            </h1>
            <p className="text-sm text-muted-foreground md:text-lg max-w-[600px]">
              Experience the future of urban transportation with our metro
              booking system. Fast, reliable, and eco-friendly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary bg-primary hover:bg-background text-base text-primary-foreground hover:text-primary font-bold p-4"
                asChild
              >
                <Link href="/auth/login">Start Your Journey</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base font-bold p-4"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/login-hero.png"
              alt="Ho Chi Minh City Metro Train"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
