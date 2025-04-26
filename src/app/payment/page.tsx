"use client";

import { PaymentForm } from "./_components/payment-form";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useState } from "react";
import { TrainFront, Lock } from "lucide-react";
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
                    <CartSheet open={cartOpen} onOpenChange={setCartOpen} staticPanel={true} hideActions={true} />
                </div>
                <div className="order-1 md:order-2 flex-1 p-8 bg-gradient-to-br from-white to-blue-50 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative z-10 w-full max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
                                <Lock className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">Payment Details</h1>
                            <p className="text-muted-foreground">Complete your purchase securely</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-border/50 p-6 transition-all duration-300 hover:shadow-md">
                            <PaymentForm />
                        </div>
                        <div className="mt-6 text-center text-xs text-muted-foreground">
                            <div className="flex items-center justify-center gap-1 mb-2">
                                <Lock className="h-3 w-3" />
                                <span>Secure payment powered by Stripe</span>
                            </div>
                            <p>Your payment information is encrypted and secure</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 