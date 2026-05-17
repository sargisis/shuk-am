"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { TELEGRAM_URL } from "@/lib/constants";
import { ButtonLink } from "@/components/ui/Button";
import { SellerApplicationForm } from "./SellerApplicationForm";

export function SellPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="surface-card-elevated p-8 text-center sm:p-12">
        <span className="text-4xl" role="img" aria-hidden>
          🏪
        </span>
        <h1 className="mt-4 text-3xl font-bold text-ink">{t.sell.title}</h1>
        <p className="mt-3 text-ink-muted leading-relaxed">{t.sell.subtitle}</p>
        <ul className="mt-8 space-y-3 text-left">
          {t.sell.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 rounded-xl bg-cream px-4 py-3 text-sm text-ink"
            >
              <span className="mt-0.5 text-terracotta">✓</span>
              {benefit}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ButtonLink href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
            {t.sell.cta}
          </ButtonLink>
        </div>
        <SellerApplicationForm />
        <p className="mt-6 text-sm text-ink-muted">
          {t.sell.formNote}
          <br />
          <span className="font-medium text-terracotta">{t.sell.telegram}</span>
        </p>
      </div>
    </div>
  );
}
