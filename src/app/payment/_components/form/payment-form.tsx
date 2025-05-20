"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreditCard, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUserStore } from "@/store/user-store";
import { useCartStore } from "@/store/cart-store";
import { useServerCart } from "@/components/provider/cart-provider";
import {
  payForCheckoutWithEWallet,
  payForCheckoutWithStripe,
  payForCheckoutWithStripeGuest,
} from "@/action/payment";
import { FRONTEND_URL } from "@/utils/axiosClient";
import { toast } from "sonner";
import { ROUTES } from "@/config/routes";

const formSchema = z.object({
  paymentMethod: z.enum(["ewallet", "stripe"], {
    required_error: "Please select a payment method",
  }),
});

export default function PaymentPage({
  handleBackToInfo,
  email,
}: {
  handleBackToInfo: () => void;
  email: string;
}) {
  const router = useRouter();
  const { currentUser } = useUserStore();
  const { cartItems, getCartTotalPrice } = useServerCart();
  const { getTotalPrice, items: guestCartItems } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);

  const { refreshCart } = useServerCart();

  useEffect(() => {
    const fetchTotalPrice = async () => {
      if (currentUser) {
        try {
          const totalPrice = await getCartTotalPrice();
          setTotalPrice(totalPrice);
        } catch (error) {
          console.error("Failed to get total price:", error);
          setTotalPrice(0);
        }
      } else {
        // Use cart store's getTotalPrice for guest users
        const total = getTotalPrice();
        setTotalPrice(total);
      }
    };
    setIsLoading(true);
    fetchTotalPrice();
    setIsLoading(false);
  }, [getCartTotalPrice, getTotalPrice, currentUser]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "stripe",
    },
  });

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      if (values.paymentMethod === "ewallet") {
        if (!currentUser) {
          toast.error(
            "E-Wallet payment is only available for registered users"
          );
          setIsLoading(false);
          return;
        }
        toast.promise(payForCheckoutWithEWallet, {
          loading: "Processing the payment",
          success: async (res) => {
            await refreshCart();
            router.push(ROUTES.INVOICE.ROOT);
            return `Payment successful. Remaining balance: ${formatCurrency(
              res.remainingBalance
            )}`;
          },
          error: "Payment error. Please try again.",
        });
      } else if (values.paymentMethod === "stripe") {
        const onStripeLinkReceived = currentUser
          ? await payForCheckoutWithStripe({
              successUrl: `${FRONTEND_URL}/invoice?payment=success`,
              cancelUrl: `${FRONTEND_URL}/invoice?payment=failure`,
            })
          : await payForCheckoutWithStripeGuest({
              email,
              tickets: guestCartItems.map((item) => ({
                lineID: item.lineId,
                lineName: item.lineName,
                startStation: item.startStationId,
                endStation: item.endStationId,
                ticketType: item.ticketTypeName,
                amount: item.quantity,
              })),
              successUrl: `${FRONTEND_URL}/dashboard?payment=success`,
              cancelUrl: `${FRONTEND_URL}/dashboard?payment=failure`,
            });

        setIsLoading(false);
        window.location.replace(onStripeLinkReceived.redirectUrl);
      } else {
        toast.error("Invalid payment method");
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const insufficientBalance = (currentUser?.balance || 0) < totalPrice;
  const amountNeeded = totalPrice - (currentUser?.balance || 0);

  // // Temporarily disable e-wallet if balance is 0
  // const isEWalletDisabled = insufficientBalance || (currentUser?.balance || 0) === 0;

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
          <h2>Choose payment method</h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm mt-4"
        >
          Complete the payment with your E-Wallet or credit cart
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
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="mb-2">
                          Select Payment Method
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col gap-4"
                          >
                            {currentUser && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <label
                                      htmlFor="ewallet"
                                      className={cn(
                                        "relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
                                        field.value === "ewallet" 
                                          ? "border-primary bg-primary/5" 
                                          : "border-border hover:border-primary/50",
                                        // isEWalletDisabled && "opacity-70 cursor-not-allowed"
                                      )}
                                    >
                                      <RadioGroupItem
                                        value="ewallet"
                                        id="ewallet"
                                        // disabled={isEWalletDisabled}
                                        className="absolute right-4 top-4"
                                      />
                                      <div className="flex flex-row gap-4 items-center w-full">
                                        <div className={cn(
                                          "p-3 rounded-lg",
                                          field.value === "ewallet" 
                                            ? "bg-primary/10" 
                                            : "bg-muted"
                                        )}>
                                          <Wallet className="size-6 text-primary" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <span className="text-lg font-semibold">
                                            E-Wallet Payment
                                          </span>
                                          <p className="text-sm text-muted-foreground">
                                            Current Balance: {formatCurrency(currentUser.balance)}
                                          </p>
                                        </div>
                                      </div>
                                    </label>
                                  </TooltipTrigger>
                                  {insufficientBalance && (
                                    <TooltipContent>
                                      Insufficient balance. You need{" "}
                                      {formatCurrency(amountNeeded)} more.
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            )}

                            <label
                              htmlFor="stripe"
                              className={cn(
                                "relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
                                field.value === "stripe" 
                                  ? "border-primary bg-primary/5" 
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <RadioGroupItem 
                                value="stripe" 
                                id="stripe"
                                className="absolute right-4 top-4"
                              />
                              <div className="flex flex-row gap-4 items-center w-full">
                                <div className={cn(
                                  "p-3 rounded-lg",
                                  field.value === "stripe" 
                                    ? "bg-primary/10" 
                                    : "bg-muted"
                                )}>
                                  <CreditCard className="size-6 text-primary" />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-lg font-semibold">
                                    Credit Card Payment
                                  </span>
                                  <p className="text-sm text-muted-foreground">
                                    Pay securely via Stripe
                                  </p>
                                </div>
                              </div>
                            </label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Processing Payment...
                      </motion.div>
                    ) : (
                      "Proceed Payment"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>
        </>
      )}
    </motion.div>
  );
}
