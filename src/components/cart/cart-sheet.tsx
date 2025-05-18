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
import { useState } from "react";
import { ConfirmDialog } from "@/components/dialog/confirm-dialog";
import TicketCartItemDisplay from "./ticket-cart-display";
import { useServerCart } from "../provider/cart-provider";
import {
  CartItemFromServer,
  CartItemProcessed,
  updateCartItem,
} from "@/action/cart";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CartSheetProps {
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
}: CartSheetProps) {
  const { cartItems, refreshCart, removeCartItem, clearAllCartItems } =
    useServerCart();
  const router = useRouter();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleDecrease = async (item: CartItemFromServer) => {
    const onDecreaseAction =
      item.amount > 1
        ? updateCartItem({
            cartItemId: item.cartItemId,
            newAmount: item.amount - 1,
          })
        : removeCartItem(item.cartItemId);

    toast.promise(onDecreaseAction, {
      loading: "Decreasing item quantity...",
      success: "Item quantity decreased successfully",
      error: "Failed to decrease item quantity. Please try again.",
    });

    await onDecreaseAction;
    refreshCart();
  };

  const handleIncrease = async (item: CartItemFromServer) => {
    const onIncreaseAction = updateCartItem({
      cartItemId: item.cartItemId,
      newAmount: item.amount + 1,
    });

    toast.promise(onIncreaseAction, {
      loading: "Increasing item quantity...",
      success: "Item quantity increased successfully",
      error: "Failed to increase item quantity. Please try again.",
    });

    await onIncreaseAction;
    refreshCart();
  };

  const handleQuantityChange = async (
    item: CartItemFromServer,
    value: string
  ) => {
    let onUpdateAction: Promise<any>;

    // If the value is empty, set it to 0 (which will trigger removal)
    if (value === "") {
      onUpdateAction = removeCartItem(item.cartItemId);
    } else {
      const newQuantity = parseInt(value);

      // If parsing fails or quantity is invalid, show error and refresh
      if (isNaN(newQuantity) || newQuantity < 0) {
        toast.error("Please enter a valid quantity");
        refreshCart();
        return;
      }

      // If quantity is 0, remove the item
      if (newQuantity === 0) {
        onUpdateAction = removeCartItem(item.cartItemId);
      } else {
        // Otherwise update with the new quantity
        onUpdateAction = updateCartItem({
          cartItemId: item.cartItemId,
          newAmount: newQuantity,
        });
      }
    }

    toast.promise(onUpdateAction, {
      loading: "Updating item quantity...",
      success: "Item quantity updated successfully",
      error: "Failed to update item quantity. Please try again.",
    });

    await onUpdateAction;
    refreshCart();
  };

  const handleClearCart = async () => {
    const onClearAction = clearAllCartItems();

    toast.promise(onClearAction, {
      loading: "Clearing cart...",
      success: "Cart cleared successfully",
      error: "Failed to clear cart. Please try again.",
    });

    await onClearAction;
    refreshCart();
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.amount,
      0
    );
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
        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/60" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Add tickets to your cart to proceed with checkout
            </p>
          </div>
        ) : (
          <div className="space-y-2 px-2">
            {cartItems.map((item, index) => (
              <TicketCartItemDisplay
                key={item.cartItemId}
                item={item as CartItemProcessed}
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
                disabled={cartItems.length === 0}
                onClick={() => router.push("/payment")}
              >
                Checkout
              </Button>

              <Button
                variant="outline"
                className="text-base min-h-10 font-bold border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary"
                disabled={cartItems.length === 0}
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
                disabled={cartItems.length === 0}
                onClick={() => router.push("/payment")}
              >
                Checkout
              </Button>

              <Button
                variant="outline"
                className="text-base min-h-10 font-bold border-secondary text-secondary hover:bg-secondary/10 hover:text-secondary"
                disabled={cartItems.length === 0}
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
