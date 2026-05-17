"use client";

import { PageTitle } from "@/components/layout/PageContainer";
import { useLocale } from "@/components/providers/LocaleProvider";

export function CartPageHeader() {
  const { t } = useLocale();
  return <PageTitle title={t.cart.title} />;
}
