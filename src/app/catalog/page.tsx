"use client";

import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { useLocale } from "@/components/providers/LocaleProvider";

function CatalogHeader() {
  const { t } = useLocale();
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-ink">{t.catalog.title}</h1>
      <p className="mt-1 text-ink-muted">{t.catalog.subtitle}</p>
    </div>
  );
}

function CatalogFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-pulse rounded-full bg-terracotta/30" />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <CatalogHeader />
      <Suspense fallback={<CatalogFallback />}>
        <CatalogView />
      </Suspense>
    </div>
  );
}
