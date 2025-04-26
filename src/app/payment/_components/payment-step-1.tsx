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
        <div className="grid gap-5">
            <FormField
                control={paymentForm.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-medium">Name on Card</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    {...field}
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleInputChange(e);
                                    }}
                                    placeholder="Enter name on card"
                                    className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={paymentForm.control}
                name="cardNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-medium">Card Number</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    {...field}
                                    type="text"
                                    value={formData.cardNumber}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleInputChange(e);
                                    }}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="pl-10 pr-24 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
                                    <div className="relative h-5 w-10">
                                        <Image 
                                            src="/images/visa.png" 
                                            alt="Visa" 
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="relative h-5 w-10">
                                        <Image 
                                            src="/images/mastercard.png" 
                                            alt="Mastercard" 
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={paymentForm.control}
                    name="expiryDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">Expiry Date</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input
                                        {...field}
                                        type="text"
                                        value={formData.expiryDate}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleInputChange(e);
                                        }}
                                        placeholder="MM/YY"
                                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={paymentForm.control}
                    name="cvv"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">CVV</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input
                                        {...field}
                                        type="password"
                                        value={formData.cvv}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleInputChange(e);
                                        }}
                                        placeholder="123"
                                        maxLength={3}
                                        className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
} 