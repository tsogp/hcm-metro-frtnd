import React from "react";
import PassengerInfoForm from "../form/passenger-info-form";
import { Card } from "@/components/ui/card";
import PaymentPage from "../form/payment-form";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserData } from "@/store/user-store";

function PaymentTab({
  currentStep,
  user,
  email,
  setEmail,
  acceptedPolicies,
  setAcceptedPolicies,
  handleProceedToPayment,
  handleBackToInfo,
}: {
  currentStep: number;
  user: UserData;
  email: string;
  setEmail: (email: string) => void;
  acceptedPolicies: boolean;
  setAcceptedPolicies: (accepted: boolean) => void;
  handleProceedToPayment: () => void;
  handleBackToInfo: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex items-center px-4 pb-2">
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground"
            >
              {currentStep === 1 ? (
                "1"
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Check className="size-6 text-bold mt-1" />
                </motion.div>
              )}
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`absolute top-11 left-1/2 -translate-x-1/2 font-bold text-secondary ${
                currentStep === 1 ? "text-2sm" : "text-sm"
              }`}
            >
              Confirming
            </motion.span>
          </div>
          <div className="h-1 w-full mx-1 bg-muted relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: currentStep === 2 ? "100%" : "0%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full bg-primary"
            />
          </div>
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep === 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`absolute top-11 left-1/2 -translate-x-1/2 text-muted-foreground ${
                currentStep === 2
                  ? "font-bold text-secondary text-2sm"
                  : "text-sm"
              }`}
            >
              Processing
            </motion.span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: currentStep === 1 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: currentStep === 1 ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 ? (
            <PassengerInfoForm
              user={user}
              email={email}
              setEmail={setEmail}
              acceptedPolicies={acceptedPolicies}
              setAcceptedPolicies={setAcceptedPolicies}
              handleProceedToPayment={handleProceedToPayment}
            />
          ) : (
            <PaymentPage
              handleBackToInfo={handleBackToInfo}
              email={email}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

export default PaymentTab;
