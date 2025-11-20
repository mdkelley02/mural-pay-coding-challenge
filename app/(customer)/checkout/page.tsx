import CartDetails from "@/components/CartDetails";
import { CheckoutButton } from "@/components/CheckoutButton";

export default async function CheckoutPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Checkout</div>
        <CheckoutButton />
      </div>
      <CartDetails />
    </div>
  );
}
