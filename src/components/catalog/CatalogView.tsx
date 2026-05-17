"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import type { Category } from "@/types";

const categories: (Category | "")[] = ["", "food", "crafts", "clothing", "home"];

export function CatalogView() {
  const searchParams = useSearchParams();
  const { t } = useLocale();

  const initialCategory = (searchParams.get("category") as Category) || "";
  const [category, setCategory] = useState<Category | "">(
    categories.includes(initialCategory) ? initialCategory : "",
  );
  const [maxPrice, setMaxPrice] = useState("");
  const [district, setDistrict] = useState("");

  const { products } = useCatalogProducts();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (
        district &&
        !p.district.toLowerCase().includes(district.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [products, category, maxPrice, district]);

  const reset = () => {
    setCategory("");
    setMaxPrice("");
    setDistrict("");
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="lg:w-64 lg:shrink-0">
        <div className="surface-card sticky top-24 p-5">
          <h2 className="mb-4 font-semibold text-ink">{t.catalog.filters}</h2>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-medium text-ink-muted">
              {t.catalog.allCategories}
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "")}
              className="input-field text-sm"
            >
              <option value="">{t.catalog.allCategories}</option>
              {(["food", "crafts", "clothing", "home"] as Category[]).map(
                (cat) => (
                  <option key={cat} value={cat}>
                    {t.categoryLabels[cat]}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-medium text-ink-muted">
              {t.catalog.maxPrice}
            </span>
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="50000"
              className="input-field text-sm"
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-xs font-medium text-ink-muted">
              {t.catalog.district}
            </span>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder={t.catalog.districtPlaceholder}
              className="input-field text-sm"
            />
          </label>

          <button
            type="button"
            onClick={reset}
            className="w-full rounded-xl border border-gold/40 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-cream"
          >
            {t.catalog.reset}
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <p className="mb-4 text-sm text-ink-muted">
          {filtered.length} {t.catalog.results}
        </p>
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gold/40 bg-white py-16 text-center text-ink-muted">
            {t.catalog.empty}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
