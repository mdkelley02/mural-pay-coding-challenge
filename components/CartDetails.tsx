"use client";

import { Button } from "@/components/ui/button";
import { formatUSDC } from "@/lib/utils";
import useCartStore from "@/store/cart-store";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

export default function CartDetails() {
  const cartStore = useCartStore();
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">Cart</span>
          <span className="text-sm text-muted-foreground">
            {cartStore.items.length} Items
          </span>
        </div>
        <Button
          variant="link"
          className="text-destructive"
          disabled={cartStore.items.length === 0}
          onClick={() => cartStore.clearCart(true)}
        >
          <TrashIcon className="size-4" />
          Remove All
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {cartStore.items.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-center text-sm text-muted-foreground">
              No items in cart
            </div>
            <Link href="/">
              <Button variant="outline">View Products</Button>
            </Link>
          </div>
        )}
        {cartStore.items.map((item) => (
          <div key={item.product.id} className="flex items-center gap-2">
            <img
              src={item.product.images[0].url}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-bold">{item.product.name}</span>
                <div className="text-sm flex items-center gap-2">
                  <span className="font-semibold">
                    {formatUSDC(item.product.priceUsdc)}
                  </span>
                  <span className="text-muted-foreground">Per Item</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => cartStore.updateQuantity(-1, item.product.id)}
                >
                  <MinusIcon className="size-4" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => cartStore.updateQuantity(1, item.product.id)}
                >
                  <PlusIcon className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
