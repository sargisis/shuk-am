"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";

export function PopularProducts() {
  const { t } = useLocale();
  const { products } = useCatalogProducts();
  const featured = products.filter((p) => p.featured);

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ink">{t.popular.title}</h2>
        <p className="mt-1 text-ink-muted">{t.popular.subtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
