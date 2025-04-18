"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Train, Menu, TrainFront } from "lucide-react";
import { scrollToElement } from "@/lib/utils";

export const navItems = [
  { label: "Features", href: "features" },
  { label: "Benefits", href: "benefits" },
  { label: "Contact", href: "contact" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <TrainFront className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl">HCMC Metro</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`#${item.href}`}
                onClick={(e) => scrollToElement(item.href)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Book Now
            </Button>
          </div>
          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
