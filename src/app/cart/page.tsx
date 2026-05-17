import { CartView } from "@/components/cart/CartView";
import { CartPageHeader } from "@/components/cart/CartPageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { isStripeConfigured } from "@/lib/payments/config";

export default function CartPage() {
  return (
    <PageContainer>
      <CartPageHeader />
      <CartView stripeEnabled={isStripeConfigured()} />
    </PageContainer>
  );
}
