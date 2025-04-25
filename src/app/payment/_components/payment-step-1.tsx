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
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleInputChange(e);
                                }}
                                placeholder="Enter name on card"
                            />
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
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
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
                            />
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
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    value={formData.expiryDate}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handleInputChange(e);
                                    }}
                                    placeholder="MM/YY"
                                />
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
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
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
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
} 