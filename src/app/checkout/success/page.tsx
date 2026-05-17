"use client";

import { useEffect } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { PageContainer } from "@/components/layout/PageContainer";
import { updateOrderStatus } from "@/lib/db/orders";
import { ButtonLink } from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
  const { t } = useLocale();
  const { clearCart } = useCart();

  useEffect(() => {
    const orderId = sessionStorage.getItem("shuk-last-order");
    if (orderId) {
      void updateOrderStatus(orderId, "paid");
      sessionStorage.removeItem("shuk-last-order");
    }
    clearCart();
  }, [clearCart]);

  return (
    <PageContainer narrow className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="surface-card-elevated max-w-md p-10">
        <span
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700"
          aria-hidden
        >
          ✓
        </span>
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
          {t.checkout.successTitle}
        </h1>
        <p className="mt-3 leading-relaxed text-ink-muted">
          {t.checkout.successText}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/account">{t.nav.account}</ButtonLink>
          <ButtonLink href="/catalog" variant="outline">
            {t.checkout.backHome}
          </ButtonLink>
        </div>
      </div>
    </PageContainer>
  );
}
