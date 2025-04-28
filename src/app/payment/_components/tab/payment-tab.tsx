import React from "react";
import PassengerInfoForm from "../form/passenger-info-form";
import { Card } from "@/components/ui/card";
import PaymentPage from "../form/payment-form";
import { Check } from "lucide-react";

function PaymentTab({
  currentStep,
  passengerData,
  email,
  setEmail,
  acceptedPolicies,
  setAcceptedPolicies,
  handleProceedToPayment,
  handleBackToInfo,
}: {
  currentStep: number;
  passengerData: any;
  email: string;
  setEmail: (email: string) => void;
  acceptedPolicies: boolean;
  setAcceptedPolicies: (accepted: boolean) => void;
  handleProceedToPayment: () => void;
  handleBackToInfo: () => void;
}) {
  const handlePaymentSubmit = async (cardDetails: any) => {
    console.log({
      email,
      cardDetails,
      passengerData,
    });
    // Here you can add your payment processing logic
    // For example:
    // try {
    //   const redirectUrl = await createCheckoutSession({
    //     amount: 2000,
    //     currency: "usd",
    //     successUrl: `${window.location.origin}/payment/success`,
    //     cancelUrl: `${window.location.origin}/payment/cancel`,
    //   });
    //   if (redirectUrl) {
    //     router.push(redirectUrl);
    //   }
    // } catch (error) {
    //   console.error("Payment error:", error);
    // }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-center px-4 pb-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
              {currentStep === 1 ? (
                "1"
              ) : (
                <Check className="size-6 text-bold mt-1" />
              )}
            </div>
            <span
              className={`absolute top-11 left-1/2 -translate-x-1/2 font-bold text-secondary ${
                currentStep === 1 ? "text-2sm" : "text-sm"
              }`}
            >
              Confirming
            </span>
          </div>
          <div className="h-1 w-full mx-1 bg-muted">
            <div
              className={`h-full bg-primary ${
                currentStep === 2 ? "w-full" : "w-0"
              }`}
            ></div>
          </div>
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span
              className={`absolute top-11 left-1/2 -translate-x-1/2 text-muted-foreground ${
                currentStep === 2
                  ? "font-bold text-secondary text-2sm"
                  : "text-sm"
              }`}
            >
              Processing
            </span>
          </div>
        </div>
      </div>

      {currentStep === 1 ? (
        <PassengerInfoForm
          passengerData={passengerData}
          email={email}
          setEmail={setEmail}
          acceptedPolicies={acceptedPolicies}
          setAcceptedPolicies={setAcceptedPolicies}
          handleProceedToPayment={handleProceedToPayment}
        />
      ) : (
        <PaymentPage
          handleBackToInfo={handleBackToInfo}
          handleProceedToPayment={handleProceedToPayment}
          email={email}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </Card>
  );
}

export default PaymentTab;
