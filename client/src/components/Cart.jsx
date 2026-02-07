import {
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartOpen,
  syncCart,
  clearCartServer,
} from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { EmptyState } from "@/components/ui/empty-state";

export function Cart() {
  const dispatch = useDispatch();
  const { items: cart, isCartOpen } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = cart.reduce(
    (acc, item) =>
      acc + (item.discountPrice || item.originalPrice) * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (!token) {
      toast.error("Please login to complete your purchase");
      dispatch(setCartOpen(false));
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        books: cart.map((item) => ({
          book: item.id,
          quantity: item.quantity,
        })),
        totalAmount: cartTotal,
      };

      await ordersApi.create(orderData);

      toast.success("Order Placed!", {
        description:
          "Thank you for your purchase. We're processing your order now.",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        duration: 5000,
      });

      if (token) {
        await dispatch(clearCartServer());
      } else {
        dispatch(clearCart());
      }
      dispatch(setCartOpen(false));
    } catch (error) {
      toast.error("Checkout Failed", {
        description:
          error.message || "Something went wrong. Please try again later.",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={(open) => dispatch(setCartOpen(open))}
    >
      <SheetContent className="w-full sm:max-w-[380px] flex flex-col p-0 z-150 bg-landing-container border-l border-landing-border text-landing-text font-montserrat">
        <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
        <SheetDescription className="sr-only">
          Review and checkout items in your shopping cart
        </SheetDescription>
        <div className="p-4 border-b border-landing-border flex items-center justify-between pr-10">
          <div>
            <h2 className="text-lg font-montagu font-bold text-landing-title flex items-center gap-2">
              <ShoppingCart size={18} className="text-landing-primary" />
              Your Cart
            </h2>
            <p className="text-xs text-landing-text opacity-60 font-medium uppercase tracking-wider mt-1">
              {cart.length} {cart.length === 1 ? "Item" : "Items"} selected
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <EmptyState
                icon={ShoppingCart}
                title="Cart is empty"
                description="Looks like you haven't added any books to your cart yet."
                action={
                  <Button
                    onClick={() => dispatch(setCartOpen(false))}
                    className="rounded-full px-6 py-2 h-auto bg-landing-primary hover:bg-landing-primary/90 text-white font-bold text-sm"
                  >
                    Start Browsing
                  </Button>
                }
              />
            </div>
          ) : (
            <ScrollArea className="h-full px-4">
              <div className="py-6 space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 group">
                    <div className="w-16 aspect-2/3 bg-landing-container rounded-lg overflow-hidden border border-landing-border shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm text-landing-title leading-tight line-clamp-2">
                            {item.title}
                          </h4>
                          <span className="font-bold text-sm text-landing-title whitespace-nowrap">
                            $
                            {(
                              (item.discountPrice || item.originalPrice) *
                              item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-landing-primary font-medium mt-1">
                          $
                          {(item.discountPrice || item.originalPrice).toFixed(
                            2,
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-landing-container rounded-full p-0.5 border border-landing-border">
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-landing-border transition-colors text-landing-title disabled:opacity-30"
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: item.quantity - 1,
                                }),
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-landing-title">
                            {item.quantity}
                          </span>
                          <button
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-landing-border transition-colors text-landing-title disabled:opacity-30 disabled:cursor-not-allowed"
                            onClick={() => {
                              if (item.quantity < item.stock) {
                                dispatch(
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity + 1,
                                  }),
                                );
                              } else {
                                toast.error(
                                  `Only ${item.stock} items available in stock`,
                                );
                              }
                            }}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          className="p-1.5 text-landing-text hover:text-red-500 transition-colors opacity-40 hover:opacity-100"
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 bg-landing-container/30 border-t border-landing-border">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-landing-text opacity-60 font-medium text-sm">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-landing-text opacity-60 font-medium text-sm">
                <span>Shipping</span>
                <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider">
                  Free
                </span>
              </div>
              <Separator className="bg-landing-border" />
              <div className="flex justify-between items-center">
                <span className="text-base font-montagu font-bold text-landing-title">
                  Total
                </span>
                <span className="text-xl font-bold text-landing-primary">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-6 rounded-xl bg-landing-title text-white dark:text-landing-body hover:bg-landing-primary hover:text-white transition-all font-bold text-base shadow-sm disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span className="group-active:scale-95 transition-transform">
                    Checkout Now
                  </span>
                )}
              </Button>
              <button
                onClick={() => {
                  if (token) {
                    dispatch(clearCartServer());
                  } else {
                    dispatch(clearCart());
                  }
                }}
                className="w-full py-2 text-xs font-bold text-landing-text opacity-40 hover:opacity-100 transition-opacity uppercase tracking-widest"
              >
                Clear Shopping Cart
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
