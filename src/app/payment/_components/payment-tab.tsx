import React from "react";
import PassengerInfoForm from "./passenger-info-form";
import { Card } from "@/components/ui/card";
import { PaymentForm } from "./form/payment-form";

function PaymentTab({
  currentStep,
  passengerData,
  email,
  setEmail,
  acceptedPolicies,
  setAcceptedPolicies,
  handleProceedToPayment,
}: {
  currentStep: number;
  passengerData: any;
  email: string;
  setEmail: (email: string) => void;
  acceptedPolicies: boolean;
  setAcceptedPolicies: (accepted: boolean) => void;
  handleProceedToPayment: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-center px-4 pb-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
              1
            </div>
            <span className="absolute top-11 left-1/2 -translate-x-1/2 text-muted-foreground text-sm font-bold">
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
              className={`absolute top-11 left-1/2 -translate-x-1/2 text-muted-foreground text-sm ${
                currentStep === 2 ? "font-bold" : ""
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
          onProceed={handleProceedToPayment}
        />
      ) : (
        <PaymentForm />
      )}
    </Card>
  );
}

export default PaymentTab;
