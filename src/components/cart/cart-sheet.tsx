"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { formatCurrency } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { TicketCartItem, useCartStore } from "@/store/cart-store";
import { useState } from "react";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import { useRouter } from "next/navigation";
import TicketCartItemDisplay from "./ticket-cart-display";

interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isStatic?: boolean;
  staticPanel?: boolean;
  hideActions?: boolean;
}

export function CartSheet({
  open,
  onOpenChange,
  isStatic = false,
  staticPanel = false,
  hideActions = false,
}: CartProps) {
  const router = useRouter();
  const {
    items,
    addItem,
    removeItem,
    getTotalPrice,
    updateQuantity,
    clearCart,
  } = useCartStore();

  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleDecrease = (item: TicketCartItem) => {
    if (item.quantity > 1) {
      addItem({
        ...item,
        quantity: -1,
      });
    } else {
      removeItem(item.ticketTypeName);
    }
  };

  const handleIncrease = (item: TicketCartItem) => {
    addItem({
      ...item,
      quantity: 1,
    });
  };

  const handleQuantityChange = (item: TicketCartItem, value: string) => {
    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      updateQuantity(item.ticketTypeName, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearDialog(false);
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push("/payment");
    }
  };

  const cartContent = (
    <>
      {staticPanel ? (
        <div className="px-4 py-6">
          <div className="flex items-center gap-2 text-secondary text-lg font-bold mb-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </div>
          <p className="text-sm text-muted-foreground">
            Please check details of tickets carefully before proceeding to
            payment
          </p>
        </div>
      ) : (
        <SheetHeader className="px-4">
          <SheetTitle className="flex items-center gap-2 text-secondary text-lg font-bold">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </SheetTitle>
          <SheetDescription>
            Please check details of tickets carefully before proceeding to
            payment
          </SheetDescription>
        </SheetHeader>
      )}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/60" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Add tickets to your cart to proceed with checkout
            </p>
          </div>
        ) : (
          <div className="space-y-2 px-2">
            {items.map((item: TicketCartItem) => (
              <TicketCartItemDisplay
                key={item.ticketTypeName}
                item={item}
                handleDecrease={handleDecrease}
                handleIncrease={handleIncrease}
                handleQuantityChange={handleQuantityChange}
                editable={true}
              />
            ))}
          </div>
        )}
      </div>
      {staticPanel ? (
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center justify-between pb-4 mb-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-secondary">
              {formatCurrency(getTotalPrice())}
            </span>
          </div>

          {!hideActions && (
            <div className="grid grid-cols-1 gap-2">
              <ConfirmDialog
                open={showClearDialog}
                onOpenChange={setShowClearDialog}
                title="Clear Confirmation"
                description="Are you sure you want to clear your cart? This action cannot be undone."
                confirmText="Clear"
                onConfirm={handleClearCart}
              />
              <Button
                className="text-base min-h-10 font-bold bg-accent hover:bg-accent/80 text-white"
                disabled={items.length === 0}
                onClick={handleCheckout}
              >
                Checkout
              </Button>

              <Button
                variant="outline"
                className="text-base min-h-10 font-bold border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary"
                disabled={items.length === 0}
                onClick={() => setShowClearDialog(true)}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      ) : (
        <SheetFooter className="flex-col gap-4 mt-auto">
          <div className="flex items-center justify-between border-t-2 pt-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-secondary">
              {formatCurrency(getTotalPrice())}
            </span>
          </div>

          {!hideActions && (
            <div className="grid grid-cols-1 gap-2">
              <ConfirmDialog
                open={showClearDialog}
                onOpenChange={setShowClearDialog}
                title="Clear Confirmation"
                description="Are you sure you want to clear your cart? This action cannot be undone."
                confirmText="Clear"
                onConfirm={handleClearCart}
              />
              <Button
                className="text-base min-h-10 font-bold bg-accent hover:bg-accent/80 text-white"
                disabled={items.length === 0}
                onClick={handleCheckout}
              >
                Checkout
              </Button>

              <Button
                variant="outline"
                className="text-base min-h-10 font-bold border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary"
                disabled={items.length === 0}
                onClick={() => setShowClearDialog(true)}
              >
                Clear
              </Button>
            </div>
          )}
        </SheetFooter>
      )}
    </>
  );

  if (staticPanel) {
    return (
      <div className="flex flex-col h-full bg-background">{cartContent}</div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={`flex flex-col ${
          isStatic ? "w-full border-r-0" : "border-l-secondary"
        }`}
        side={isStatic ? "left" : "right"}
      >
        {cartContent}
      </SheetContent>
    </Sheet>
  );
}
