import TicketCartItemDisplay from "@/components/cart/ticket-cart-display";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function CartTab() {
  const { items, getTotalPrice } = useCartStore();
  const tax = getTotalPrice() * 0.08;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2 text-secondary text-lg font-bold">
            <ShoppingCart className="h-5 w-5" />
            Your Current Cart
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <TicketCartItemDisplay
            key={item.id}
            item={item}
            handleDecrease={() => {}}
            handleIncrease={() => {}}
            handleQuantityChange={() => {}}
          />
        ))}

        <div className="mt-6 border-t-2 pt-4">
          <div className="flex justify-between items-center pb-2">
            <div className="text-gray-700 font-bold text-xl">Subtotal</div>
            <div className="text-2xl font-medium">
              {formatCurrency(getTotalPrice())}
            </div>
          </div>
          <div className="flex justify-between items-center py-2 text-gray-600 font-medium">
            <div>Tax (8%)</div>
            <div className="text-lg">{formatCurrency(tax)}</div>
          </div>
          <div className="flex justify-between items-center py-3 mt-2 border-t-2 border-dashed">
            <div className="text-2xl font-bold">Total</div>
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(getTotalPrice() + tax)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="bg-muted/50 p-3 rounded-md text-sm">
          <h4 className="font-medium mb-1">Fare Information</h4>
          <p className="text-muted-foreground text-xs">
            This ticket is valid for 24 hours from the time of purchase. Refunds
            are available up to 2 hours before departure.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
