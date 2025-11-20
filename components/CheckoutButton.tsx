"use client";

import { createOrder } from "@/app/actions/create-order";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cart-store";
import { useRouter } from "next/navigation";

export function CheckoutButton() {
  const cartStore = useCartStore();
  const router = useRouter();
  return (
    <Button
      disabled={cartStore.items.length === 0}
      onClick={async () => {
        const response = await createOrder({
          items: cartStore.items.map((item) => ({
            quantity: item.quantity,
            productId: item.product.id,
          })),
          customerEmail: "test@test.com",
          customerWalletAddress: "0x1234567890123456789012345678901234567890",
        });

        cartStore.clearCart();

        router.push(`/order/${response.orderId}`);
      }}
    >
      Create Order
    </Button>
  );
}
