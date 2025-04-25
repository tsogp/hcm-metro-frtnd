"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PaymentStep1 } from "./payment-step-1";
import { PaymentStep2 } from "./payment-step-2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";

const paymentSchema = z.object({
    cardNumber: z.string().min(16, "Card number must be 16 digits"),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date"),
    cvv: z.string().min(3, "CVV must be 3 digits"),
    name: z.string().min(1, "Name is required"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export function PaymentForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState<PaymentFormValues>({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        name: "",
    });

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
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Payment Details</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    {currentStep === 1 ? "Enter your card details" : "Review your payment"}
                </p>
            </div>

            {currentStep === 1 ? (
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
                                className="flex-1"
                            >
                                Next
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <Form {...paymentForm}>
                    <form onSubmit={paymentForm.handleSubmit(handleSubmit)}>
                        <PaymentStep2 formData={formData} />
                        <div className="flex gap-2 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCurrentStep(1)}
                                className="flex-1"
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isLoading}
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
                                    "Pay Now"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 pt-2">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className={`h-2 w-10 rounded-full ${i <= currentStep ? "bg-primary" : "bg-muted"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
} 