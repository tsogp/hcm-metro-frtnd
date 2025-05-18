"use client";

import { CartSheet } from "@/components/cart/cart-sheet";
import { UserNavbar } from "@/components/common/user-navbar";

import React, { useState } from "react";
import Footer from "../_components/common/footer";

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <UserNavbar onCartClick={() => setCartOpen(true)} />

      <main className="min-h-screen flex-1">{children}</main>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

      <Footer />
    </div>
  );
}
