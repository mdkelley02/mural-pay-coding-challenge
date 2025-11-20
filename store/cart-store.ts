import { CartItem, Product } from "@/types/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartSate {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (amount: number, productId: string) => void;
  clearCart: () => void;
}

export default create<CartSate>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) => {
        const existingProduct = get().items.find(
          (item) => item.product.id === product.id
        );
        set({
          items: existingProduct
            ? get().items
            : [
                ...get().items,
                {
                  quantity: 1,
                  product: product,
                },
              ],
        });
        if (existingProduct) {
          toast.error("Product Already exists");
        } else {
          toast.success("Product Added successfully");
        }
      },
      removeFromCart: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
        toast.success("Item removed");
      },
      updateQuantity: (amount, productId) => {
        const item = get().items.find((item) => item.product.id === productId);
        if (!item) {
          return;
        }
        if (item.quantity === 1 && amount < 0) {
          get().removeFromCart(productId);
        } else {
          item.quantity = item.quantity + amount;
          set({
            items: [...get().items],
          });
        }
      },
      clearCart: () => {
        set({
          items: [],
        });
        toast.success("Cart cleared");
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
