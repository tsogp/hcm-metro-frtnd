"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar, CreditCard, Link, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createCheckoutSession } from "../action";
import Image from "next/image";

const formSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^[0-9\s]+$/, "Card number must contain only digits"),
  cardExpiry: z
    .string()
    .regex(
      /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
      "Expiry date must be in MM/YY format"
    ),
  cardCvc: z
    .string()
    .min(3, "CVC must be at least 3 digits")
    .max(4, "CVC must be at most 4 digits")
    .regex(/^[0-9]+$/, "CVC must contain only digits"),
});

export default function PaymentPage({
  handleBackToInfo,
  handleProceedToPayment,
  email,
  onSubmit,
}: {
  handleBackToInfo: () => void;
  handleProceedToPayment: () => void;
  email: string;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      onSubmit(values);
    } finally {
      setIsLoading(false);
    }
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }

    return value;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="size-8" />
          <h2>Payment Details</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Enter your card details to complete your purchase.
        </p>
      </div>

      <div className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="4242 4242 4242 4242"
                        {...field}
                        onChange={(e) => {
                          field.onChange(formatCardNumber(e.target.value));
                        }}
                        maxLength={19}
                      />
                      <Image
                        src="/svg/visa.svg"
                        alt="visa"
                        width={30}
                        height={30}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="MM/YY"
                        {...field}
                        onChange={(e) => {
                          field.onChange(formatExpiryDate(e.target.value));
                        }}
                        maxLength={5}
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-5" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardCvc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVC</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="123" {...field} maxLength={4} />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-5" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between text-sm text-muted-foreground">
              <p>Your card details are secure</p>
              <div className="flex items-center gap-2">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 32 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="21" rx="3" fill="#E8E8E8" />
                  <path d="M11.5 7H20.5V14H11.5V7Z" fill="#FF5F00" />
                  <path
                    d="M12 10.5C12 9.1 12.6 7.8 13.7 7C12.8 6.3 11.7 6 10.5 6C7.5 6 5 8 5 10.5C5 13 7.5 15 10.5 15C11.7 15 12.8 14.7 13.7 14C12.6 13.2 12 11.9 12 10.5Z"
                    fill="#EB001B"
                  />
                  <path
                    d="M27 10.5C27 13 24.5 15 21.5 15C20.3 15 19.2 14.7 18.3 14C19.4 13.2 20 11.9 20 10.5C20 9.1 19.4 7.8 18.3 7C19.2 6.3 20.3 6 21.5 6C24.5 6 27 8 27 10.5Z"
                    fill="#F79E1B"
                  />
                </svg>
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 32 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="32" height="21" rx="3" fill="#E8E8E8" />
                  <path
                    d="M13.3 9.2L12.6 12.5H13.8L14.5 9.2H13.3Z"
                    fill="#00579F"
                  />
                  <path
                    d="M18.7 9.3C18.3 9.1 17.7 9 17 9C15.5 9 14.5 9.8 14.5 10.9C14.5 11.8 15.2 12.2 15.8 12.5C16.3 12.8 16.5 13 16.5 13.2C16.5 13.6 16 13.7 15.6 13.7C15 13.7 14.6 13.6 14.1 13.4L13.9 13.3L13.7 14.3C14.1 14.5 14.8 14.6 15.5 14.6C17.1 14.6 18.1 13.8 18.1 12.6C18.1 11.9 17.7 11.4 16.9 11C16.4 10.7 16.1 10.6 16.1 10.3C16.1 10.1 16.3 9.9 16.8 9.9C17.2 9.9 17.6 10 17.8 10.1L18 10.2L18.2 9.3H18.7Z"
                    fill="#00579F"
                  />
                  <path
                    d="M21.1 9.2H20.2C19.9 9.2 19.7 9.3 19.6 9.6L18 14.5H19.6L19.8 13.8H21.3L21.5 14.5H23L21.1 9.2ZM20.1 12.8C20.2 12.5 20.7 11.2 20.7 11.2C20.7 11.2 20.8 10.9 20.9 10.7L21 11.1C21 11.1 21.3 12.5 21.3 12.8H20.1Z"
                    fill="#00579F"
                  />
                  <path
                    d="M10.5 9.2L9 12.9L8.9 12.3C8.6 11.4 7.8 10.5 6.9 10L8.3 14.5H9.9L12.2 9.2H10.5Z"
                    fill="#00579F"
                  />
                  <path
                    d="M7.7 9.2H5.3L5.2 9.4C7 9.9 8.2 11 8.7 12.3L8.2 9.6C8.1 9.3 7.9 9.2 7.7 9.2Z"
                    fill="#FAA61A"
                  />
                </svg>
              </div>
            </div>

            <div className="flex md:flex-row flex-col-reverse gap-2">
              <Button
                variant="outline"
                className="w-full md:flex-1 hover:text-foreground hover:bg-secondary/10"
                onClick={handleBackToInfo}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:flex-1"
              >
                {isLoading ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
