"use client";

import { createOrder } from "@/app/actions/create-order";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CheckoutButton() {
  const cartStore = useCartStore();
  const router = useRouter();
  return (
    <Button
      disabled={cartStore.items.length === 0}
      onClick={async () => {
        try {
          const response = await createOrder({
            items: cartStore.items.map((item) => ({
              quantity: item.quantity,
              productId: item.product.id,
            })),
          });
          cartStore.clearCart();
          router.push(`/order/${response.orderId}`);
        } catch (error) {
          toast.error(`${error}`);
        }
      }}
    >
      Create Order
    </Button>
  );
}
