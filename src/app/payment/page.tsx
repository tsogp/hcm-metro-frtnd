"use client";

import { useEffect, useState } from "react";

import CartTab from "@/app/payment/_components/tab/cart-tab";
import PaymentTab from "@/app/payment/_components/tab/payment-tab";
import { useUserStore } from "@/store/user-store";

export default function PaymentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser, checkAuth } = useUserStore();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      await checkAuth();
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground">
              Please log in to continue with your payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8 h-auto">
        <div className="w-full lg:w-1/3">
          <CartTab />
        </div>

        <div className="w-full lg:w-2/3">
          <PaymentTab
            currentStep={currentStep}
            user={currentUser}
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
