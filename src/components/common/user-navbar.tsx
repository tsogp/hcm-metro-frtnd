"use client";

import Link from "next/link";
import { ShoppingCart, TrainFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdownMenu } from "@/components/common/user-dropdown-menu";
import { AppSidebar } from "@/components/common/user-sidebar";
import { useServerCart } from "../provider/cart-provider";

interface AppHeaderProps {
  onCartClick: () => void;
}

export function AppHeader({ onCartClick }: AppHeaderProps) {
  const { cartItems } = useServerCart();
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

        {/* Cart Sheet Section */}
        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-secondary-foreground/10"
            onClick={onCartClick}
          >
            <ShoppingCart className="size-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full size-5 bg-red-500 border-blue-100 border-1 text-xs text-blue-100font-bold flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Button>

          <UserDropdownMenu />
        </div>
      </div>
    </header>
  );
}
