"use client";
import { Button } from "@/components/ui/button";
import { Product, ProductImage } from "@/lib/generated/prisma";
import useCartStore from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function ProductActions({
  product,
}: {
  product: Product & { images: ProductImage[] };
}) {
  const router = useRouter();
  const cartStore = useCartStore();

  const isProductInCart = cartStore.items.some(
    (item) => item.product.id === product.id
  );

  const handleBuyNow = useCallback(() => {
    if (!isProductInCart) {
      cartStore.addToCart(product);
    }
    router.push("/checkout");
  }, [cartStore, product, router, isProductInCart]);

  return (
    <>
      <Button onClick={handleBuyNow}>Buy Now</Button>
      <Button
        variant="outline"
        disabled={isProductInCart}
        onClick={() => cartStore.addToCart(product)}
      >
        {isProductInCart ? "Added to Cart" : "Add to Cart"}
      </Button>
    </>
  );
}
