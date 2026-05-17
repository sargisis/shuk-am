"use client";

import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageContainer, PageTitle } from "@/components/layout/PageContainer";
import { useLocale } from "@/components/providers/LocaleProvider";

function CatalogHeader() {
  const { t } = useLocale();
  return <PageTitle title={t.catalog.title} subtitle={t.catalog.subtitle} />;
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
    <PageContainer>
      <CatalogHeader />
      <Suspense fallback={<CatalogFallback />}>
        <CatalogView />
      </Suspense>
    </PageContainer>
  );
}
