"use client";

import { PaymentFormValues } from "@/types/payment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentStep2Props {
    formData: PaymentFormValues;
}

export function PaymentStep2({ formData }: PaymentStep2Props) {
    return (
        <div className="grid gap-5">
            <Card>
                <CardHeader>
                    <CardTitle>Review Payment</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Name on Card</span>
                            <span className="font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Card Number</span>
                            <span className="font-medium">
                                **** **** **** {formData.cardNumber.slice(-4)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Expiry Date</span>
                            <span className="font-medium">{formData.expiryDate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-medium">$10.00</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 