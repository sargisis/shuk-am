"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { PageContainer } from "@/components/layout/PageContainer";
import { ButtonLink } from "@/components/ui/Button";

export default function CheckoutCancelPage() {
  const { t } = useLocale();

  return (
    <PageContainer narrow className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <div className="surface-card-elevated max-w-md p-10">
        <span
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-wheat text-3xl"
          aria-hidden
        >
          ←
        </span>
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
          {t.checkout.cancelTitle}
        </h1>
        <p className="mt-3 leading-relaxed text-ink-muted">
          {t.checkout.cancelText}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/cart">{t.checkout.backToCart}</ButtonLink>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border-2 border-gold/45 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cream"
          >
            {t.checkout.backHome}
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
