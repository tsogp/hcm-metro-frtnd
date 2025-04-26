"use client";

import { useState } from "react";
import { AppHeader } from "@/components/custom/app-header";
import Footer from "@/app/_components/footer";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useCartStore } from "@/store/cart-store";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, openCart, closeCart } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader onCartClick={openCart} />
      
      <main className="flex-1 flex flex-col">{children}</main>
      <CartSheet open={isOpen} onOpenChange={(open) => open ? openCart() : closeCart()} />

      <Footer />
    </div>
  );
}
