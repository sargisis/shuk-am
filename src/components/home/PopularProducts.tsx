"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import Link from "next/link";

export function PopularProducts() {
  const { t } = useLocale();
  const { products, loading } = useCatalogProducts();
  const featured = products.filter((p) => p.featured);

  return (
    <section>
      <SectionHeader
        eyebrow="Shuk.am"
        title={t.popular.title}
        subtitle={t.popular.subtitle}
        action={
          <Link href="/catalog" className="link-arrow">
            {t.categories.viewAll}
            <span aria-hidden>→</span>
          </Link>
        }
      />
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl bg-wheat/80"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
