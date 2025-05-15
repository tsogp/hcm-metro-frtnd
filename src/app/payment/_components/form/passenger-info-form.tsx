"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Info, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PassengerInfoFormProps {
  passengerData: {
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  email: string;
  setEmail: (email: string) => void;
  acceptedPolicies: boolean;
  setAcceptedPolicies: (accepted: boolean) => void;
  handleProceedToPayment: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PassengerInfoForm({
  passengerData,
  email,
  setEmail,
  acceptedPolicies,
  setAcceptedPolicies,
  handleProceedToPayment,
}: PassengerInfoFormProps) {
  const fullName = `${passengerData.firstName} ${passengerData.middleName} ${passengerData.lastName}`;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <div className="text-2xl font-bold flex items-center gap-2">
          <User className="size-7" />
          <h2>Passenger Information</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Please verify your information and provide an email for your invoice.
        </p>
      </motion.div>

      <div className="space-y-4">
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative group">
            <Input
              id="name"
              value={fullName}
              disabled
              className={cn(
                "bg-muted/50",
                "transition-all duration-300",
                "group-hover:bg-muted/70"
              )}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <User className="size-5 text-muted-foreground" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative group">
            <Input
              id="phone"
              value={passengerData.phone}
              disabled
              className={cn(
                "bg-muted/50",
                "transition-all duration-300",
                "group-hover:bg-muted/70"
              )}
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="email">Email for Invoice</Label>
          <div className="relative group">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className={cn(
                "transition-all duration-300",
                "focus:ring-2 focus:ring-primary/20",
                "group-hover:border-primary/50"
              )}
            />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground flex items-center gap-2"
          >
            <Info className="size-4" />
            Your invoice will be sent to this email. You can change it if you're
            purchasing for someone else.
          </motion.p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-start space-x-2 mt-6"
        >
          <Checkbox
            id="terms"
            checked={acceptedPolicies}
            onCheckedChange={(checked) => setAcceptedPolicies(checked as boolean)}
            className="mt-1"
          />
          <div className="grid gap-1.5 leading-none">
            <motion.label
              htmlFor="terms"
              className="text-sm font-medium leading-none cursor-pointer hover:text-primary transition-colors duration-200"
            >
              Accept Terms and Conditions
            </motion.label>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-muted-foreground"
            >
              I agree to the terms of service, privacy policy, and fare rules.
            </motion.p>
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={itemVariants}
        className="flex md:flex-row flex-col-reverse items-center w-full mt-6 gap-2"
      >
        <Button
          variant="outline"
          className={cn(
            "w-full md:flex-1",
            "hover:text-foreground hover:bg-secondary/10",
            "transition-all duration-300"
          )}
          asChild
        >
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
        <Button
          className={cn(
            "w-full md:flex-1",
            "transition-all duration-300",
            "hover:shadow-lg hover:shadow-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          onClick={handleProceedToPayment}
          disabled={!acceptedPolicies || !email}
        >
          <motion.span
            animate={
              !acceptedPolicies || !email
                ? { opacity: [0.5, 1, 0.5] }
                : { opacity: 1 }
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Proceed to Payment
          </motion.span>
        </Button>
      </motion.div>
    </motion.div>
  );
}
