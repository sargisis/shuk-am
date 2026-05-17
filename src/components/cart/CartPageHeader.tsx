"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

export function CartPageHeader() {
  const { t } = useLocale();
  return (
    <h1 className="mb-8 text-3xl font-bold text-ink">{t.cart.title}</h1>
  );
}
