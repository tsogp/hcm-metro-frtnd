"use client";

import { TrainFront } from "lucide-react";
import { PaymentForm } from "./_components/payment-form";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useState } from "react";

export default function PaymentPage() {
    const [cartOpen, setCartOpen] = useState(false);

    return (
        <div className="grid min-h-svh lg:grid-cols-[4fr_3fr]">
            <div className="relative hidden lg:block">
                <CartSheet open={true} onOpenChange={setCartOpen} isStatic={true} />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md text-primary-foreground">
                            <TrainFront className="w-8 h-8 text-primary" />
                        </div>
                        HCMC Metro Line - PAWA
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-sm">
                        <PaymentForm />
                    </div>
                </div>
            </div>
        </div>
    );
} 