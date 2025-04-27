"use client";

import { PaymentFormValues } from "@/types/payment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Calendar, User, Lock, Shield, ChevronDown, Eye, Info, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface PaymentStep2Props {
    formData: PaymentFormValues;
}

export function PaymentStep2({ formData }: PaymentStep2Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-2 md:space-y-3">
            <div className="p-2 md:p-3 border rounded-md bg-muted/30">
                <h3 className="text-xs md:text-sm font-medium mb-1.5 md:mb-2">Review Payment Details</h3>
                <div className="space-y-1.5 md:space-y-2">
                    <div className="flex justify-between">
                        <span className="text-xs md:text-sm text-muted-foreground">Name on Card</span>
                        <span className="text-xs md:text-sm font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs md:text-sm text-muted-foreground">Card Number</span>
                        <span className="text-xs md:text-sm font-medium">•••• •••• •••• {formData.cardNumber.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs md:text-sm text-muted-foreground">Expiry Date</span>
                        <span className="text-xs md:text-sm font-medium">{formData.expiryDate}</span>
                    </div>
                </div>
            </div>

            <Collapsible className="space-y-1.5 md:space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs md:text-sm font-medium">Additional Information</h3>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 md:h-7 px-1 md:px-1.5">
                            <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="space-y-1.5 md:space-y-2">
                    <div className="p-2 md:p-3 border rounded-md bg-muted/30">
                        <div className="flex items-center gap-1.5 mb-1 md:mb-1.5">
                            <Info className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                            <span className="text-xs md:text-sm font-medium">Payment Processing</span>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            Your payment will be processed securely. You will receive a confirmation email once the transaction is complete.
                        </p>
                    </div>
                    <div className="p-2 md:p-3 border rounded-md bg-muted/30">
                        <div className="flex items-center gap-1.5 mb-1 md:mb-1.5">
                            <Receipt className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                            <span className="text-xs md:text-sm font-medium">Receipt</span>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                            A receipt will be sent to your email address. You can also download it from your account dashboard.
                        </p>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
} 