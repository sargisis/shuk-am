"use client";

import type { ReactNode } from "react";
import { PageTitle } from "@/components/layout/PageContainer";
import { useLocale } from "@/components/providers/LocaleProvider";

function InfoArticle({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="surface-card max-w-2xl p-8 sm:p-10">
      <PageTitle title={title} />
      <div className="prose prose-ink mt-2 text-ink-muted">{children}</div>
    </article>
  );
}

export function AboutPage() {
  const { t } = useLocale();
  return (
    <InfoArticle title={t.pages.aboutTitle}>
      <p className="leading-relaxed">{t.pages.aboutText}</p>
    </InfoArticle>
  );
}

export function DeliveryPage() {
  const { t } = useLocale();
  return (
    <InfoArticle title={t.pages.deliveryTitle}>
      <p className="leading-relaxed">{t.pages.deliveryText}</p>
    </InfoArticle>
  );
}

export function HowToOrderPage() {
  const { t } = useLocale();
  return (
    <InfoArticle title={t.pages.howToOrderTitle}>
      <ol className="list-decimal space-y-3 pl-5 leading-relaxed">
        {t.pages.howToOrderSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </InfoArticle>
  );
}
