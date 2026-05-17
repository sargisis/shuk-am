"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
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
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <span className="text-5xl" role="img" aria-hidden>
        ✓
      </span>
      <h1 className="mt-4 text-2xl font-bold text-ink">
        {t.checkout.successTitle}
      </h1>
      <p className="mt-3 text-ink-muted">{t.checkout.successText}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href="/account">{t.nav.account}</ButtonLink>
        <ButtonLink href="/catalog" variant="outline">
          {t.checkout.backHome}
        </ButtonLink>
      </div>
    </div>
  );
}
