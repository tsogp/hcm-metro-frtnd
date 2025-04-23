"use client";

import { useState } from "react";
import { AppHeader } from "@/components/custom/app-header";
import Footer from "@/app/_components/footer";
import { CartSheet } from "@/components/cart/cart-sheet";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader onCartClick={() => setCartOpen(true)} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
