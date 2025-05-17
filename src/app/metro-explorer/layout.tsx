"use client";

import { AppHeader } from "@/components/common/user-navbar";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useCartStore } from "@/store/cart-store";
import Footer from "../_components/common/footer";

export default function MetroExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, openCart, closeCart } = useCartStore();

  return (
    <div>
      <AppHeader onCartClick={openCart} />
      <CartSheet
        open={isOpen}
        onOpenChange={(open) => (open ? openCart() : closeCart())}
      />

      <main className="min-h-screen">{children}</main>

      <Footer />
    </div>
  );
}
