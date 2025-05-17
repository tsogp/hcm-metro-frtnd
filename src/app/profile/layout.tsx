"use client";

import { useState } from "react";
import { AppHeader } from "@/components/common/user-navbar";
import Footer from "@/app/_components/common/footer";
import { CartSheet } from "@/components/cart/cart-sheet";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader onCartClick={() => setCartOpen(true)} />

      <main className="flex-1 flex flex-col">{children}</main>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

      <Footer />
    </div>
  );
}
