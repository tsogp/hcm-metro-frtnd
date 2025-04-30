"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar, CreditCard, Link, Lock, Info } from "lucide-react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import Confetti from "react-confetti";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

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

// Update card preview component with 3D tilt
const CardPreview = ({ cardNumber, cardExpiry, cardType, isLoading, hasError, isSuccess }: { 
  cardNumber: string;
  cardExpiry: string;
  cardType: string;
  isLoading?: boolean;
  hasError?: boolean;
  isSuccess?: boolean;
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 200);
    y.set(yPct * 200);
  };

  const handleMouseLeave = () => {
    animate(x, 0, { duration: 0.5 });
    animate(y, 0, { duration: 0.5 });
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isLoading ? 0.98 : isSuccess ? 1.02 : isHovered ? 1.01 : 1,
        boxShadow: hasError ? "0 0 0 2px rgba(239, 68, 68, 0.5)" : isSuccess ? "0 0 0 2px rgba(34, 197, 94, 0.5)" : isHovered ? "0 8px 24px rgba(0,0,0,0.1)" : "none"
      }}
      transition={{ 
        duration: 0.5,
        boxShadow: { duration: 0.2 }
      }}
      className={cn(
        "relative w-full h-48 rounded-xl bg-gradient-to-br from-primary/80 to-primary p-6 text-primary-foreground mb-8 overflow-hidden perspective-1000",
        "transition-all duration-300",
        isLoading && "opacity-80",
        hasError && "ring-2 ring-destructive/50",
        isSuccess && "ring-2 ring-green-500/50",
        "hover:shadow-lg hover:shadow-primary/20"
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
      
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm opacity-70">Card Number</p>
            <motion.p 
              className="font-mono text-xl tracking-wider"
              animate={{ 
                opacity: cardNumber ? 1 : 0.5,
                scale: cardNumber ? 1 : 0.98
              }}
            >
              {cardNumber || "•••• •••• •••• ••••"}
            </motion.p>
          </div>
          {cardType && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 rounded-lg bg-white/10 p-2 backdrop-blur-sm"
            >
              <Image
                src={`/svg/${cardType}.svg`}
                alt={cardType}
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </motion.div>
          )}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm opacity-70">Expiry Date</p>
            <motion.p 
              className="font-mono"
              animate={{ 
                opacity: cardExpiry ? 1 : 0.5,
                scale: cardExpiry ? 1 : 0.98
              }}
            >
              {cardExpiry || "MM/YY"}
            </motion.p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-70">CVC</p>
            <p className="font-mono">•••</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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
  const [cardType, setCardType] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessMessage) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showSuccessMessage]);

  // Separate effect for navigation
  useEffect(() => {
    if (countdown === 0) {
      router.push('/dashboard');
    }
  }, [countdown, router]);

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setHasError(false);
    setIsSuccess(false);
    setShowSuccessMessage(false);
    setCountdown(5);
    setErrorMessage("");

    try {
      await onSubmit(values);
      setIsSuccess(true);
      setTimeout(() => {
        setShowSuccessMessage(true);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }, 1000);
    } catch (error) {
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Payment failed. Please try again.");
      // Add shake animation to form
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.classList.add('animate-shake');
        setTimeout(() => {
          formElement.classList.remove('animate-shake');
        }, 500);
      }
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

  // Detect card type based on card number
  const detectCardType = (number: string) => {
    const num = number.replace(/\s/g, "");
    if (/^4/.test(num)) return "visa";
    if (/^5[1-5]/.test(num)) return "mastercard";
    if (/^3[47]/.test(num)) return "amex";
    return "";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative space-y-6"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/50 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05),transparent)] -z-10" />
      
      <div>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold flex items-center gap-2"
        >
          <CreditCard className="size-8" />
          <h2>Metro Ticket Payment</h2>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm"
        >
          Complete your metro ticket purchase securely
        </motion.p>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <CardPreview 
            cardNumber={form.watch("cardNumber")}
            cardExpiry={form.watch("cardExpiry")}
            cardType={cardType}
            isLoading={isLoading}
            hasError={hasError}
            isSuccess={isSuccess}
          />

          <div className="space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Card Number</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Enter your 16-digit card number</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              placeholder="4242 4242 4242 4242"
                              {...field}
                              onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                field.onChange(formatted);
                                setCardType(detectCardType(formatted));
                              }}
                              maxLength={19}
                              className={cn(
                                "transition-all duration-300",
                                "focus:ring-2 focus:ring-primary/20",
                                "group-hover:border-primary/50",
                                "pr-12",
                                form.formState.errors.cardNumber && "border-destructive"
                              )}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <Image
                                src={`/svg/${cardType || 'visa'}.svg`}
                                alt={cardType || 'visa'}
                                width={30}
                                height={30}
                                className="text-muted-foreground"
                              />
                            </motion.div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={cn(
                    "grid gap-4",
                    form.formState.errors.cardExpiry || form.formState.errors.cardCvc
                      ? "grid-cols-1"
                      : "grid-cols-1 md:grid-cols-2"
                  )}
                >
                  <FormField
                    control={form.control}
                    name="cardExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Expiry Date</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Enter expiry date in MM/YY format</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormControl>
                          <div className="relative group">
                            <Input
                              placeholder="MM/YY"
                              {...field}
                              onChange={(e) => {
                                field.onChange(formatExpiryDate(e.target.value));
                              }}
                              maxLength={5}
                              className={cn(
                                "transition-all duration-300",
                                "focus:ring-2 focus:ring-primary/20",
                                "group-hover:border-primary/50",
                                "pr-12",
                                form.formState.errors.cardExpiry && "border-destructive"
                              )}
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
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
                        <div className="flex items-center gap-2">
                          <FormLabel>CVC</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>3 or 4 digit security code on the back of your card</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormControl>
                          <div className="relative group">
                            <Input 
                              placeholder="123" 
                              {...field} 
                              maxLength={4}
                              className={cn(
                                "transition-all duration-300",
                                "focus:ring-2 focus:ring-primary/20",
                                "group-hover:border-primary/50",
                                "pr-12",
                                form.formState.errors.cardCvc && "border-destructive"
                              )}
                            />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg h-12"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <p>Your payment is secure and encrypted</p>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-col md:flex-row gap-2 mt-6"
                >
                  <Button
                    variant="outline"
                    className="w-full md:flex-1 hover:text-foreground hover:bg-secondary/10 transition-all duration-300"
                    onClick={handleBackToInfo}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "w-full md:flex-1 transition-all duration-300",
                      "hover:shadow-lg hover:shadow-primary/20",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center gap-2"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Processing Payment...
                      </motion.div>
                    ) : (
                      "Purchase Metro Ticket"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>
        </>
      )}

      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50"
        >
          <Confetti
            width={typeof window !== 'undefined' ? window.innerWidth : 0}
            height={typeof window !== 'undefined' ? window.innerHeight : 0}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        </motion.div>
      )}

      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 z-50 flex items-center justify-end pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8, x: 20 }}
            animate={{ scale: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm pointer-events-auto"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <div>
                <h3 className="font-semibold text-sm">Metro Ticket Purchased!</h3>
                <p className="text-muted-foreground text-xs">
                  Your metro ticket has been successfully purchased.
                  <br />
                  Redirecting to your tickets in {countdown}...
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
