"use client";

import { useState } from "react";

import CartTab from "@/app/payment/_components/tab/cart-tab";
import PaymentTab from "@/app/payment/_components/tab/payment-tab";

const passengerData = {
  firstName: "Nguyen",
  middleName: "Son",
  lastName: "Tung",
  phone: "0123 456 789",
  email: "tungnguyen@gmail.com",
};

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState(passengerData.email);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const handleProceedToPayment = () => {
    if (acceptedPolicies) {
      setCurrentStep(2);
    }
  };

  const handleBackToInfo = () => {
    setCurrentStep(1);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8 h-auto">
        {/* Left side - Cart Tab */}
        <div className="w-full lg:w-1/3">
          <CartTab />
        </div>

        {/* Right side - Payment Steps */}
        <div className="w-full lg:w-2/3">
          <PaymentTab
            currentStep={currentStep}
            passengerData={passengerData}
            email={email}
            setEmail={setEmail}
            acceptedPolicies={acceptedPolicies}
            setAcceptedPolicies={setAcceptedPolicies}
            handleProceedToPayment={handleProceedToPayment}
            handleBackToInfo={handleBackToInfo}
          />
        </div>
      </div>
    </div>
  );
}
