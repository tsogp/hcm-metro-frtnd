"use client";

import { useEffect, useState } from "react";

import CartTab from "@/app/payment/_components/tab/cart-tab";
import PaymentTab from "@/app/payment/_components/tab/payment-tab";
import { UserData, useUserStore } from "@/store/user-store";

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const { currentUser, checkAuth } = useUserStore();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const initializeUser = async () => {
      await checkAuth();
    };
    initializeUser();
  }, [checkAuth]);

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.passengerEmail);
    }
  }, [currentUser]);

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
            user={currentUser as UserData}
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
