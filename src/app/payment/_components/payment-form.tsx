                    "use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PaymentStep1 } from "./payment-step-1";
import { PaymentStep2 } from "./payment-step-2";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, CreditCard, Lock, ArrowRight, Wallet, Info, Receipt, Clock, HelpCircle, Shield, AlertCircle, Save, Timer, Gift, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Currency conversion rates (in a real app, these would come from an API)
const CURRENCY_RATES = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 151.37,
    VND: 24500,
};

const CURRENCY_SYMBOLS = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    VND: "₫",
};

const paymentSchema = z.object({
    cardNumber: z.string().min(16, "Card number must be 16 digits"),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date"),
    cvv: z.string().min(3, "CVV must be 3 digits"),
    name: z.string().min(1, "Name is required"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function PaymentForm() {
    const router = useRouter();
    const { items, getTotalPrice } = useCartStore();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "ewallet">("card");
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [emailReceipt, setEmailReceipt] = useState(true);
    const [saveCard, setSaveCard] = useState(false);
    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [promoCode, setPromoCode] = useState("");
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [formData, setFormData] = useState<PaymentFormValues>({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        name: "",
    });

    // Calculate fees and totals with currency conversion
    const subtotal = getTotalPrice();
    const serviceFee = subtotal * 0.05;
    const totalBeforeDiscount = subtotal + serviceFee;
    const total = totalBeforeDiscount - discount;

    // Convert amount to selected currency
    const convertAmount = (amount: number) => {
        return amount * CURRENCY_RATES[selectedCurrency as keyof typeof CURRENCY_RATES];
    };

    // Format currency with symbol
    const formatAmount = (amount: number) => {
        const converted = convertAmount(amount);
        const symbol = CURRENCY_SYMBOLS[selectedCurrency as keyof typeof CURRENCY_SYMBOLS];
        return `${symbol}${converted.toFixed(2)}`;
    };

    // Handle promo code application
    const handleApplyPromo = async () => {
        if (!promoCode) return;
        
        setIsApplyingPromo(true);
        try {
            // Simulate API call to validate promo code
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Example promo code logic (in real app, this would come from backend)
            if (promoCode.toUpperCase() === "WELCOME10") {
                setDiscount(totalBeforeDiscount * 0.1); // 10% discount
                toast.success("Promo code applied successfully!");
            } else {
                toast.error("Invalid promo code");
            }
        } catch (error) {
            toast.error("Failed to apply promo code");
        } finally {
            setIsApplyingPromo(false);
        }
    };

    // Countdown timer effect
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            toast.error("Payment session expired. Please try again.");
            router.push("/dashboard");
        }
    }, [timeLeft, router]);

    // Format time left
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const paymentForm = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        defaultValues: formData,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNextStep = async () => {
        const result = await paymentForm.trigger();
        if (result) {
            setCurrentStep(2);
        }
    };

    const handleSubmit = async (data: PaymentFormValues) => {
        if (!acceptTerms) {
            toast.error("Please accept the terms and conditions");
            return;
        }
        
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success state
            setIsSuccess(true);
            toast.success("Payment Successfully", {
                position: "top-center",
                duration: 2000,
                className: "text-center",
            });

            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (error) {
            setIsLoading(false);
            toast.error("Payment failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Session Timer */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Payment Session</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{formatTime(timeLeft)}</span>
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
            </div>

            {/* Payment Summary */}
            <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Payment Summary</h3>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger className="w-[120px] h-8">
                            <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                            <SelectItem value="VND">VND (₫)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatAmount(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Service Fee (5%)</span>
                        <span>{formatAmount(serviceFee)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>-{formatAmount(discount)}</span>
                        </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-primary">{formatAmount(total)}</span>
                    </div>
                </div>
            </Card>

            {/* Promo Code Input */}
            <div className="flex gap-2">
                <div className="flex-1">
                    <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="h-10"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo || !promoCode}
                    className="w-[120px]"
                >
                    {isApplyingPromo ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Applying...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Apply
                        </div>
                    )}
                </Button>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-medium">Select Payment Method</h3>
                <RadioGroup 
                    defaultValue="card" 
                    className="grid grid-cols-2 gap-4"
                    onValueChange={(value) => setPaymentMethod(value as "card" | "ewallet")}
                >
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                            <CreditCard className="h-4 w-4" />
                            <span>Credit Card</span>
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="ewallet" id="ewallet" />
                        <Label htmlFor="ewallet" className="flex items-center gap-2 cursor-pointer">
                            <Wallet className="h-4 w-4" />
                            <span>E-Wallet</span>
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {paymentMethod === "card" ? (
                currentStep === 1 ? (
                    <Form {...paymentForm}>
                        <form>
                            <PaymentStep1
                                formData={formData}
                                handleInputChange={handleInputChange}
                                paymentForm={paymentForm}
                            />
                            <div className="flex gap-2 mt-6">
                                <Button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white transition-all duration-300"
                                >
                                    <span>Continue</span>
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </Form>
                ) : (
                    <Form {...paymentForm}>
                        <form onSubmit={paymentForm.handleSubmit(handleSubmit)}>
                            <PaymentStep2 formData={formData} />
                            
                            <div className="mt-6 space-y-4">
                                <div className="flex items-start space-x-2">
                                    <Checkbox 
                                        id="saveCard" 
                                        checked={saveCard}
                                        onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="saveCard"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Save card for future payments
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            Securely store your card details for faster checkout next time.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <Checkbox 
                                        id="terms" 
                                        checked={acceptTerms}
                                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="terms"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Accept terms and conditions
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            By proceeding, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <Checkbox 
                                        id="receipt" 
                                        checked={emailReceipt}
                                        onCheckedChange={(checked) => setEmailReceipt(checked as boolean)}
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="receipt"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Email receipt
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive a confirmation email with your ticket details.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentStep(1)}
                                    className="flex-1 border-primary/20 hover:bg-primary/5 transition-all duration-300"
                                    disabled={isLoading}
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white transition-all duration-300"
                                    disabled={isLoading || !acceptTerms}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Processing...
                                        </div>
                                    ) : isSuccess ? (
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4" />
                                            Success
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Pay Now</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
            ) : (
                <div className="space-y-4">
                    <div className="p-4 border rounded-md bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-primary" />
                                <span className="font-medium">E-Wallet Balance</span>
                            </div>
                            <span className="text-lg font-bold">{formatAmount(50)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Your tickets will be purchased using your E-Wallet balance.</p>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                        <Checkbox 
                            id="terms-ewallet" 
                            checked={acceptTerms}
                            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms-ewallet"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Accept terms and conditions
                            </label>
                            <p className="text-sm text-muted-foreground">
                                By proceeding, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                        <Checkbox 
                            id="receipt-ewallet" 
                            checked={emailReceipt}
                            onCheckedChange={(checked) => setEmailReceipt(checked as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="receipt-ewallet"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Email receipt
                            </label>
                            <p className="text-sm text-muted-foreground">
                                Receive a confirmation email with your ticket details.
                            </p>
                        </div>
                    </div>
                    
                    <Button
                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white transition-all duration-300"
                        onClick={() => {
                            if (!acceptTerms) {
                                toast.error("Please accept the terms and conditions");
                                return;
                            }
                            
                            setIsLoading(true);
                            // Simulate API call
                            setTimeout(() => {
                                setIsSuccess(true);
                                toast.success("Payment Successful", {
                                    position: "top-center",
                                    duration: 2000,
                                    className: "text-center",
                                });
                                // Wait for animation
                                setTimeout(() => {
                                    router.push("/dashboard");
                                }, 1000);
                            }, 1500);
                        }}
                        disabled={isLoading || !acceptTerms}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Processing...
                            </div>
                        ) : isSuccess ? (
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                Success
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Pay with E-Wallet</span>
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        )}
                    </Button>
                </div>
            )}

            {/* Progress Indicator */}
            {paymentMethod === "card" && (
                <div className="flex justify-center gap-2">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all duration-300",
                                i === currentStep
                                    ? "bg-primary"
                                    : i < currentStep
                                    ? "bg-primary/50"
                                    : "bg-muted"
                            )}
                        />
                    ))}
                </div>
            )}
            
            {/* Security Badges */}
            <div className="mt-4 pt-4 border-t">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-xs text-muted-foreground">SSL Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs text-muted-foreground">PCI Compliant</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                            <span className="text-xs text-muted-foreground">Fraud Protection</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Help & Support */}
            <div className="mt-2">
                <div className="flex items-center justify-between">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                                    <HelpCircle className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Need help?</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Contact our support team for assistance</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Payment issues?</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View our payment troubleshooting guide</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
} 