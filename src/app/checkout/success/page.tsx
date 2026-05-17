"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ButtonLink } from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
  const { t } = useLocale();

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
        <ButtonLink href="/catalog">{t.checkout.backHome}</ButtonLink>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center rounded-xl border-2 border-terracotta px-5 py-2.5 text-sm font-semibold text-terracotta hover:bg-terracotta/5"
        >
          {t.checkout.backToCart}
        </Link>
      </div>
    </div>
  );
}
