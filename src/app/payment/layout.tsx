"use client";

import { AppHeader } from "@/components/common/app-header";
import Footer from "@/app/_components/common/footer";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AppHeader onCartClick={() => {}} />

      <main className="min-h-screen">{children}</main>

      <Footer />
    </div>
  );
}
