import TicketCartItemDisplay from "@/components/cart/ticket-cart-display";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useServerCart } from "@/components/provider/cart-provider";
import { useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { CartItemFromServer } from "@/action/cart";

const PriceItem = ({
  label,
  amount,
  isTotal = false,
}: {
  label: string;
  amount: number;
  isTotal?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex justify-between items-center ${
      isTotal ? "py-3 mt-2 border-t-2 border-dashed" : "py-2"
    }`}
  >
    <div
      className={`${
        isTotal ? "text-2xl font-bold" : "text-gray-600 font-medium"
      }`}
    >
      {label}
    </div>
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={`${isTotal ? "text-3xl font-bold" : "text-lg"}`}
    >
      {formatCurrency(amount)}
    </motion.div>
  </motion.div>
);

export default function CartTab() {
  const { cartItems: serverCartItems, getCartTotalPrice } = useServerCart();
  const { items: guestCartItems } = useCartStore();
  const { currentUser } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const cartItems = currentUser ? serverCartItems : guestCartItems;

  useEffect(() => {
    setMounted(true);
    const fetchTotalPrice = async () => {
      if (currentUser) {
        try {
          const totalPrice = await getCartTotalPrice();
          setTotalPrice(totalPrice);
        } catch (error) {
          console.error("Failed to get total price:", error);
          const total = serverCartItems.reduce(
            (sum, item) => sum + item.price * item.amount,
            0
          );
          setTotalPrice(total);
        }
      } else {
        const total = guestCartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotalPrice(total);
      }
    };
    fetchTotalPrice();
  }, [getCartTotalPrice, currentUser, guestCartItems, serverCartItems]);

  useEffect(() => {
    if (!currentUser) {
      const total = guestCartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setTotalPrice(total);
    }
  }, [guestCartItems, currentUser]);

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
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <motion.div
                key={
                  currentUser
                    ? (item as CartItemFromServer).cartItemId
                    : item.ticketTypeName
                }
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
            ))
          ) : (
            <div className="flex items-center h-full">
              <p className="text-muted-foreground text-xl">No items in cart</p>
            </div>
          )}
        </AnimatePresence>

        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 border-t-2 pt-4"
          >
            <PriceItem label="Subtotal" amount={totalPrice} />
            <PriceItem label="Tax (0%)" amount={0} />

            <PriceItem label="Total" amount={totalPrice} isTotal />
          </motion.div>
        )}
      </CardContent>
      <CardFooter>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-muted/50 p-3 rounded-md text-sm hover:bg-muted/70 transition-colors duration-300"
        >
          <h4 className="font-medium mb-1 text-lgddunw">Fare Information</h4>
          <p className="text-muted-foreground text-xs">
            <span className="font-semibold text-foreground">
              One-way tickets are activated at the time of purchase
            </span>{" "}
            and valid for 24 hours. Other ticket types have specific validity
            periods after activation.
          </p>
          {!currentUser && totalPrice < 15 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-destructive mt-2 font-medium"
            >
              Note: For purchases under {formatCurrency(15)}, you need to create
              an account and use E-Wallet payment.
            </motion.p>
          )}
          {!currentUser && totalPrice >= 15 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-destructive mt-2 font-medium"
            >
              Note: To use Stripe payment, you need to create an account.
            </motion.p>
          )}
          {currentUser && totalPrice < 15 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-destructive mt-2 font-medium"
            >
              Note: For purchases under {formatCurrency(15)}, please use
              E-Wallet payment.
            </motion.p>
          )}
        </motion.div>
      </CardFooter>
    </Card>
  );
}
