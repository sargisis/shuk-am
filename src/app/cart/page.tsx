import { CartView } from "@/components/cart/CartView";
import { CartPageHeader } from "@/components/cart/CartPageHeader";
import { isStripeConfigured } from "@/lib/payments/config";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <CartPageHeader />
      <CartView stripeEnabled={isStripeConfigured()} />
    </div>
  );
}
