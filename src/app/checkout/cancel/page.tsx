"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { ButtonLink } from "@/components/ui/Button";

export default function CheckoutCancelPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-ink">{t.checkout.cancelTitle}</h1>
      <p className="mt-3 text-ink-muted">{t.checkout.cancelText}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href="/cart">{t.checkout.backToCart}</ButtonLink>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border-2 border-gold/50 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-cream"
        >
          {t.checkout.backHome}
        </Link>
      </div>
    </div>
  );
}
