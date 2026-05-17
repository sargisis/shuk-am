"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

export function AboutPage() {
  const { t } = useLocale();
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold text-ink">{t.pages.aboutTitle}</h1>
      <p className="leading-relaxed text-ink-muted">{t.pages.aboutText}</p>
    </article>
  );
}

export function DeliveryPage() {
  const { t } = useLocale();
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold text-ink">{t.pages.deliveryTitle}</h1>
      <p className="leading-relaxed text-ink-muted">{t.pages.deliveryText}</p>
    </article>
  );
}

export function HowToOrderPage() {
  const { t } = useLocale();
  return (
    <article className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold text-ink">{t.pages.howToOrderTitle}</h1>
      <ol className="list-decimal space-y-2 pl-5 text-ink-muted">
        {t.pages.howToOrderSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </article>
  );
}
