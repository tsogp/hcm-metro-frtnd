"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/custom/user-nav";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { useCart } from "@/components/cart-provider";

interface AppHeaderProps {
  onCartClick: () => void;
}

export function AppHeader({ onCartClick }: AppHeaderProps) {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-secondary text-white">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
        <AppSidebar />
        <div className="flex items-center gap-2 mr-4">
          <div className="relative h-10 w-10 rounded-full bg-white px-5 py-1.5">
            <Image
              src="/images/HCMC_Metro_logo.png"
              alt="Metro Logo"
              fill
              className="object-contain scale-75"
            />
          </div>
          <Link href="/" className="font-bold text-xl">
            Ho Chi Minh Metro
          </Link>
        </div>
        <div className="relative hidden md:flex items-center w-full max-w-sm">
          <Search className="absolute left-2.5 h-4 w-4 text-secondary" />
          <Input
            type="search"
            placeholder="Search routes, stations..."
            className="pl-8 w-full bg-white text-secondary placeholder:text-secondary/60"
          />
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-secondary-foreground/10"
            onClick={onCartClick}
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                {totalItems}
              </span>
            )}
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
