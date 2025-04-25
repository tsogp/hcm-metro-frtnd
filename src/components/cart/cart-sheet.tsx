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
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { TicketCartItem, useCartStore } from "@/store/cart-store";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { useState } from "react";
import { ConfirmDialog } from "../custom/confirm-dialog";

interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartProps) {
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
      removeItem(item.id);
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
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearDialog(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col border-l-secondary">
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
            <ul className="space-y-2 p-2">
              {items.map((item: TicketCartItem) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border p-4 transition-colors border-secondary/20 hover:bg-secondary/5 hover:border-secondary"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">
                        {item.startStation} → {item.endStation}
                      </p>
                      <Badge
                        variant="outline"
                        className="border-primary text-secondary"
                      >
                        {item.type.name}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="font-bold text-secondary group-hover:text-secondary/80 text-lg">
                        {item.name}
                      </h4>

                      <p className="font-bold text-secondary group-hover:text-secondary/80">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">
                      <span className="font-bold">Expiry: </span>
                      {item.type.expiryInterval}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-secondary hover:bg-secondary/10 hover:text-secondary/80"
                        onClick={() => handleDecrease(item)}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="h-4 w-4" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item, e.target.value)
                        }
                        className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-secondary hover:bg-secondary/10 hover:text-secondary/80"
                        onClick={() => handleIncrease(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-bold text-2xl group-hover:text-secondary/80">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <SheetFooter className="flex-col gap-4 mt-auto">
          <div className="flex items-center justify-between border-t-2 pt-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-bold text-secondary">
              {formatCurrency(getTotalPrice())}
            </span>
          </div>

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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
