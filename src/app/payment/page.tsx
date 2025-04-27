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
        <div className="h-screen flex flex-col overflow-hidden">
            <header className="sticky top-0 z-50 w-full border-b bg-secondary text-white">
                <div className="flex h-12 md:h-16 items-center px-3 md:px-4 sm:px-6 lg:px-8 max-w-full mx-auto">
                    <AppSidebar />
                    <div className="flex items-center gap-1.5 md:gap-2 mr-3 md:mr-4">
                        <TrainFront className="h-6 w-6 md:h-8 md:w-8 text-white" />
                        <Link href="/" className="font-bold text-lg md:text-xl">
                            Ho Chi Minh Metro
                        </Link>
                    </div>
                    <div className="ml-auto">
                        <UserDropdownMenu />
                    </div>
                </div>
            </header>
            
            <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
                <div className="order-2 md:order-1 bg-muted/30 w-full md:w-[30%] lg:w-[25%] xl:w-[20%] h-full overflow-hidden hidden md:block">
                    <CartSheet open={cartOpen} onOpenChange={setCartOpen} staticPanel={true} hideActions={true} />
                </div>
                <div className="order-1 md:order-2 flex-1 p-2 md:p-4 lg:p-6 bg-gradient-to-br from-white to-blue-50 shadow-sm relative overflow-hidden h-full">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    <div className="relative z-10 w-full h-full flex flex-col">
                        <div className="text-center mb-1 md:mb-2 lg:mb-4">
                            <div className="inline-flex items-center justify-center p-1 md:p-1.5 lg:p-2 bg-primary/10 rounded-full mb-1 md:mb-2 lg:mb-4">
                                <Lock className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-primary" />
                            </div>
                            <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-0.5 md:mb-1 lg:mb-2">Payment Details</h1>
                            <p className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">Complete your purchase securely</p>
                        </div>
                        <div className="flex-1 flex items-center justify-center overflow-hidden">
                            <div className="bg-white rounded-xl shadow-sm border border-border/50 p-2 md:p-3 lg:p-4 xl:p-6 transition-all duration-300 hover:shadow-md w-full max-w-2xl overflow-auto max-h-full">
                                <PaymentForm />
                            </div>
                        </div>
                        <div className="mt-1 md:mt-2 lg:mt-4 text-center text-[10px] md:text-xs lg:text-sm text-muted-foreground">
                            <div className="flex items-center justify-center gap-0.5 md:gap-1 mb-0.5 md:mb-1 lg:mb-2">
                                <Lock className="h-2 w-2 md:h-3 md:w-3" />
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