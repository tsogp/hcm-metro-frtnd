"use client";

import Link from "next/link";
import { Search, ShoppingCart, TrainFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserDropdownMenu } from "@/components/custom/user-dropdown-menu";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { useCartStore } from "@/store/cart-store";

interface AppHeaderProps {
  onCartClick: () => void;
}

export function AppHeader({ onCartClick }: AppHeaderProps) {
  const { items } = useCartStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-secondary text-white">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
        <AppSidebar />
        <div className="flex items-center gap-2 mr-4">
          <TrainFront className="h-8 w-8 text-white" />
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
            <ShoppingCart className="size-6" />
            <span className="absolute -top-0.5 -right-0.5 flex size-5 font-medium items-center justify-center rounded-full bg-accent text-xs text-white border-1">
              {items.length}
            </span>
          </Button>
          <UserDropdownMenu />
        </div>
      </div>
    </header>
  );
}
