"use client";

import { UserNavbar } from "@/components/common/user-navbar";
import Footer from "@/app/_components/common/footer";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <UserNavbar onCartClick={() => {}} />

      <main className="min-h-screen">{children}</main>

      <Footer />
    </div>
  );
}
