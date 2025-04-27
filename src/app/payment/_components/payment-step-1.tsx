"use client";

import { Input } from "@/components/ui/input";
import { PaymentFormValues } from "@/types/payment";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CreditCard, Calendar, User, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface PaymentStep1Props {
    formData: PaymentFormValues;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    paymentForm: UseFormReturn<PaymentFormValues>;
}

export function PaymentStep1({
    formData,
    handleInputChange,
    paymentForm,
}: PaymentStep1Props) {
    return (
        <div className="space-y-2 md:space-y-3">
            <div className="grid grid-cols-1 gap-2 md:gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-[10px] md:text-xs lg:text-sm">Name on Card</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="h-7 md:h-8 lg:h-9 text-[10px] md:text-xs lg:text-sm"
                    />
                    {paymentForm.formState.errors.name && (
                        <p className="text-[8px] md:text-[10px] lg:text-xs text-red-500">{paymentForm.formState.errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="cardNumber" className="text-[10px] md:text-xs lg:text-sm">Card Number</Label>
                    <div className="relative">
                        <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="h-7 md:h-8 lg:h-9 pr-8 md:pr-10 text-[10px] md:text-xs lg:text-sm"
                            maxLength={19}
                        />
                        <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2">
                            <CreditCard className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                        </div>
                    </div>
                    {paymentForm.formState.errors.cardNumber && (
                        <p className="text-[8px] md:text-[10px] lg:text-xs text-red-500">{paymentForm.formState.errors.cardNumber.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 md:gap-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="expiryDate" className="text-[10px] md:text-xs lg:text-sm">Expiry Date</Label>
                        <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="h-7 md:h-8 lg:h-9 text-[10px] md:text-xs lg:text-sm"
                            maxLength={5}
                        />
                        {paymentForm.formState.errors.expiryDate && (
                            <p className="text-[8px] md:text-[10px] lg:text-xs text-red-500">{paymentForm.formState.errors.expiryDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="cvv" className="text-[10px] md:text-xs lg:text-sm">CVV</Label>
                        <div className="relative">
                            <Input
                                id="cvv"
                                name="cvv"
                                type="password"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="***"
                                className="h-7 md:h-8 lg:h-9 pr-8 md:pr-10 text-[10px] md:text-xs lg:text-sm"
                                maxLength={3}
                            />
                            <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2">
                                <Lock className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                            </div>
                        </div>
                        {paymentForm.formState.errors.cvv && (
                            <p className="text-[8px] md:text-[10px] lg:text-xs text-red-500">{paymentForm.formState.errors.cvv.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 