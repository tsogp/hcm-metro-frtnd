"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import type { CartItem } from "@/store/cart-store";

interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Cart({ open, onOpenChange }: CartProps) {
  const { items, addItem, removeItem } = useCartStore();

  const totalPrice = items.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col border-l-secondary">
        <SheetHeader className="px-4">
          <SheetTitle className="flex items-center gap-2 text-secondary">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/60" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add tickets to your cart to proceed with checkout
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item: CartItem) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-secondary">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-secondary text-secondary hover:bg-secondary/10"
                      onClick={() => {
                        if (item.quantity > 1) {
                          addItem({
                            ...item,
                            quantity: -1,
                          });
                        } else {
                          removeItem(item.id);
                        }
                      }}
                    >
                      {item.quantity === 1 ? (
                        <Trash2 className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="w-4 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-secondary text-secondary hover:bg-secondary/10"
                      onClick={() => {
                        addItem({
                          ...item,
                          quantity: 1,
                        });
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <SheetFooter className="flex-col gap-4 px-4 mt-auto">
          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-medium">Total</span>
            <span className="font-bold text-secondary">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SheetClose asChild>
              <Button
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10"
              >
                Continue Shopping
              </Button>
            </SheetClose>
            <Button
              className="bg-accent hover:bg-accent/90 text-white"
              disabled={items.length === 0}
            >
              Checkout
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
