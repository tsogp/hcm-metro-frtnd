"use client";

import type React from "react";

import { useState } from "react";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FRONTEND_URL } from "@/utils/axiosClient";
import { topUpEWallet } from "@/action/payment";

const addFundsSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive({ message: "Amount must be positive" })
    .int({ message: "Amount must be a whole number" })
    .min(10000, { message: "Minimum amount is 10,000 VNĐ" })
    .max(10000000, { message: "Maximum amount is 10,000,000 VNĐ" }),
});

interface WalletBalanceProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export function AddFundsModal({
  isModalOpen,
  setIsModalOpen,
}: WalletBalanceProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setIsLoading] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const parsedAmount = Number.parseInt(amount, 10);
      const result = addFundsSchema.safeParse({ amount: parsedAmount });

      if (!result.success) {
        const errorMessage =
          result.error.errors[0]?.message || "Invalid amount";
        setError(errorMessage);
        return;
      }

      const onTopUp = await topUpEWallet({
        price: parsedAmount,
        successUrl: `${FRONTEND_URL}/profile?payment=success`,
        cancelUrl: `${FRONTEND_URL}/profile?payment=failure`,
      });
      setIsLoading(false);
      window.location.replace(onTopUp.redirectUrl);
    } catch (err) {
      setError("Please enter a valid number");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you want to add to your wallet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 pb-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (VNĐ)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/\./g, "");
                  setAmount(value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "." || e.key === ",") {
                    e.preventDefault();
                  }
                }}
                step="1"
                min="10000"
                max="10000000"
                className="col-span-3"
              />
                <div className="flex flex-col gap-2">

              <p className="text-xs text-muted-foreground">
                Min: 10,000 VNĐ | Max: 10,000,000 VNĐ
              </p>
              <p>{error && <p className="text-sm text-red-500">{error}</p>}</p>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Funds</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
