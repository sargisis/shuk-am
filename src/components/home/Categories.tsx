"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CATEGORY_ICONS } from "@/lib/constants";
import type { Category } from "@/types";

const categories: Category[] = ["food", "crafts", "clothing", "home"];

export function Categories() {
  const { t } = useLocale();

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-ink">{t.categories.title}</h2>
        <Link
          href="/catalog"
          className="text-sm font-semibold text-terracotta hover:underline"
        >
          {t.categories.viewAll} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/catalog?category=${cat}`}
            className="flex flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-white p-5 text-center transition-all hover:border-terracotta/40 hover:shadow-md"
          >
            <span className="text-3xl" role="img" aria-hidden>
              {CATEGORY_ICONS[cat]}
            </span>
            <span className="font-semibold text-ink">
              {t.categories[cat]}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
