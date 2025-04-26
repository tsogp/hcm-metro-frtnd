"use client";

import { PaymentForm } from "./_components/payment-form";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useState } from "react";
import { AppHeader } from "@/components/custom/app-header";
import { TrainFront } from "lucide-react";
import Link from "next/link";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { UserDropdownMenu } from "@/components/custom/user-dropdown-menu";

export default function PaymentPage() {
    const [cartOpen, setCartOpen] = useState(true);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-secondary text-white">
                <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
                    <AppSidebar />
                    <div className="flex items-center gap-2 mr-4">
                        <TrainFront className="h-8 w-8 text-white" />
                        <Link href="/" className="font-bold text-xl">
                            Ho Chi Minh Metro
                        </Link>
                    </div>
                    <div className="ml-auto">
                        <UserDropdownMenu />
                    </div>
                </div>
            </header>
            
            <div className="flex-1 flex flex-col md:flex-row">
                <div className="order-2 md:order-1 bg-muted/30 md:w-[400px]">
                    <CartSheet open={cartOpen} onOpenChange={setCartOpen} staticPanel={true} />
                </div>
                <div className="order-1 md:order-2 flex-1 p-8 bg-white shadow-sm">
                    <div className="max-w-md mx-auto">
                        <PaymentForm />
                    </div>
                </div>
            </div>
        </div>
    );
} 