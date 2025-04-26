"use client";

import { PaymentFormValues } from "@/types/payment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Calendar, User, Lock, Shield, ChevronDown, Eye } from "lucide-react";
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
        <div className="grid gap-4">
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="space-y-2"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">Review Payment</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <CollapsibleTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer group">
                                <span className={cn(
                                    "text-sm text-muted-foreground transition-colors",
                                    "group-hover:text-primary"
                                )}>
                                    {isOpen ? "Click to hide details" : "Click to view details"}
                                </span>
                                <div className="flex items-center">
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    <ChevronDown className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        isOpen ? "rotate-180" : ""
                                    )} />
                                </div>
                            </div>
                        </CollapsibleTrigger>
                    </div>
                </div>
                <CollapsibleContent className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1.5 rounded-full">
                                <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-muted-foreground text-sm">Name on Card</span>
                        </div>
                        <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1.5 rounded-full">
                                <CreditCard className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-muted-foreground text-sm">Card Number</span>
                        </div>
                        <span className="font-medium">
                            **** **** **** {formData.cardNumber.slice(-4)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-1.5 rounded-full">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-muted-foreground text-sm">Expiry Date</span>
                        </div>
                        <span className="font-medium">{formData.expiryDate}</span>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
} 