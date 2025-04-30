"use client";

import { AppHeader } from "@/components/custom/app-header";
import Footer from "@/app/_components/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useCartStore } from "@/store/cart-store";

export default function MetroExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, openCart, closeCart } = useCartStore();

  return (
    <div>
      <AppHeader onCartClick={openCart} />
      <CartSheet open={isOpen} onOpenChange={(open) => open ? openCart() : closeCart()} />

      <main className="min-h-screen">{children}</main>

      <Footer />
    </div>
  );
} 