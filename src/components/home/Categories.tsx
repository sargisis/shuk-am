"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CATEGORY_ICONS, CATEGORY_STYLES } from "@/lib/constants";
import type { Category } from "@/types";

const categories: Category[] = ["food", "crafts", "clothing", "home"];

export function Categories() {
  const { t } = useLocale();

  return (
    <section>
      <SectionHeader
        eyebrow="Shuk.am"
        title={t.categories.title}
        action={
          <Link href="/catalog" className="link-arrow">
            {t.categories.viewAll}
            <span aria-hidden>→</span>
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((cat) => {
          const style = CATEGORY_STYLES[cat];
          return (
            <Link
              key={cat}
              href={`/catalog?category=${cat}`}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 text-center ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] ${style.gradient} ${style.ring}`}
            >
              <span
                className="relative z-10 text-4xl transition-transform duration-300 group-hover:scale-110"
                role="img"
                aria-hidden
              >
                {CATEGORY_ICONS[cat]}
              </span>
              <span className="relative z-10 mt-3 block font-semibold text-ink">
                {t.categories[cat]}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
