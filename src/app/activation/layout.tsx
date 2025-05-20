"use client";

import React from "react";
import { UserNavbar } from "@/components/common/user-navbar";
import Footer from "@/app/_components/common/footer";
import { useState } from "react";
import { CartSheet } from "@/components/cart/cart-sheet";

const ActivationLayout = ({ children }: { children: React.ReactNode }) => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <UserNavbar onCartClick={() => setCartOpen(true)} />

      <main className="min-h-screen container mx-auto py-12 flex flex-col items-center">
        {children}
      </main>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />

      <Footer />
    </div>
  );
};

export default ActivationLayout;
