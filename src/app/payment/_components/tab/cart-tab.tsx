import TicketCartItemDisplay from "@/components/cart/ticket-cart-display";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useServerCart } from "@/components/provider/cart-provider";

const PriceItem = ({ label, amount, isTotal = false }: { 
  label: string;
  amount: number;
  isTotal?: boolean;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex justify-between items-center ${isTotal ? 'py-3 mt-2 border-t-2 border-dashed' : 'py-2'}`}
  >
    <div className={`${isTotal ? 'text-2xl font-bold' : 'text-gray-600 font-medium'}`}>
      {label}
    </div>
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={`${isTotal ? 'text-3xl font-bold' : 'text-lg'}`}
    >
      {formatCurrency(amount)}
    </motion.div>
  </motion.div>
);

export default function CartTab() {
  const { cartItems, getCartTotalPrice } = useServerCart();
  const [mounted, setMounted] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    setMounted(true);
    const fetchTotalPrice = async () => {
      const totalPrice = await getCartTotalPrice();
      setTotalPrice(totalPrice);
      setTax(totalPrice * 0.08);
    };
    fetchTotalPrice();
  }, [getCartTotalPrice]);

  if (!mounted) {
    return null;
  }

  return (
    <Card className="backdrop-blur-sm bg-card/95">
      <CardHeader>
        <CardTitle>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 text-secondary text-lg font-bold"
          >
            <ShoppingCart className="h-5 w-5" />
            Your Current Cart
          </motion.div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <AnimatePresence>
          {cartItems.map((item, index) => (
            <motion.div
              key={item.cartItemId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <TicketCartItemDisplay
                item={item}
                handleDecrease={() => {}}
                handleIncrease={() => {}}
                handleQuantityChange={() => {}}
                editable={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 border-t-2 pt-4"
        >
          <PriceItem label="Subtotal" amount={totalPrice} />
          <PriceItem label="Tax (8%)" amount={tax} />
          <PriceItem label="Total" amount={totalPrice + tax} isTotal />
        </motion.div>
      </CardContent>
      <CardFooter>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-muted/50 p-3 rounded-md text-sm hover:bg-muted/70 transition-colors duration-300"
        >
          <h4 className="font-medium mb-1">Fare Information</h4>
          <p className="text-muted-foreground text-xs">
            This ticket is valid for 24 hours from the time of purchase. Refunds
            are available up to 2 hours before departure.
          </p>
        </motion.div>
      </CardFooter>
    </Card>
  );
}
