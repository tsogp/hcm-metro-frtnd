"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  onProceed: () => void;
}
export default function PassengerInfoForm({
  passengerData,
  email,
  setEmail,
  acceptedPolicies,
  setAcceptedPolicies,
  onProceed,
}: PassengerInfoFormProps) {
  const fullName = `${passengerData.firstName} ${passengerData.middleName} ${passengerData.lastName}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Passenger Information</h2>
        <p className="text-muted-foreground text-sm">
          Please verify your information and provide an email for your invoice.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={fullName} disabled className="bg-muted/50" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={passengerData.phone}
            disabled
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email for Invoice</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
          <p className="text-sm text-muted-foreground">
            Your invoice will be sent to this email. You can change it if you're
            purchasing for someone else.
          </p>
        </div>

        <div className="flex items-start space-x-2 pt-4">
          <Checkbox
            id="terms"
            checked={acceptedPolicies}
            onCheckedChange={(checked) =>
              setAcceptedPolicies(checked as boolean)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept Terms and Conditions
            </label>
            <p className="text-sm text-muted-foreground">
              I agree to the terms of service, privacy policy, and fare rules.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center w-full mt-6 gap-2">
        <Button
          variant="outline"
          className="flex-1 hover:text-foreground hover:bg-secondary/10"
          asChild
        >
          <Link href="/dashboard">Cancel</Link>
        </Button>
        <Button
          className="flex-1"
          onClick={onProceed}
          disabled={!acceptedPolicies || !email}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
