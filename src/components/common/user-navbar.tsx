"use client";

import Link from "next/link";
import { ShoppingCart, TrainFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdownMenu } from "@/components/common/user-dropdown-menu";
import { UserSidebar } from "@/components/common/user-sidebar";
import { useServerCart } from "../provider/cart-provider";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { ROUTES } from "@/config/routes";
interface UserNavbarProps {
  onCartClick: () => void;
}

export function UserNavbar({ onCartClick }: UserNavbarProps) {
  const { currentUser } = useUserStore();
  const { cartItems } = useServerCart();
  const { items } = useCartStore();

  const cartItemQuantity = currentUser ? cartItems.length : items.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-secondary text-white">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
        <UserSidebar />
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 mr-4">
          <TrainFront className="h-8 w-8 text-white" />
          <span className="font-bold text-xl">Ho Chi Minh Metro</span>
        </Link>

        {/* Cart Sheet Section */}
        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:bg-secondary-foreground/10"
            onClick={onCartClick}
          >
            <ShoppingCart className="size-6" />
            {cartItemQuantity > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full size-5 bg-red-500 border-blue-100 border-1 text-xs text-blue-100font-bold flex items-center justify-center">
                {cartItemQuantity}
              </span>
            )}
          </Button>

          <UserDropdownMenu />
        </div>
      </div>
    </header>
  );
}
