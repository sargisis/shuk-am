"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CATEGORY_ICONS } from "@/lib/constants";
import type { Category } from "@/types";

const previewCategories: Category[] = ["food", "crafts", "clothing", "home"];

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-gold/30 bg-gradient-to-br from-terracotta via-terracotta-dark to-[#3d2018] px-6 py-14 text-white shadow-[var(--shadow-card)] sm:px-12 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l5 15h16l-13 9 5 15-13-10-13 10 5-15-13-9h16z' fill='%23fff' fill-opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-soft" />
            Shuk.am
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            {t.hero.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/88 sm:text-lg">
            {t.hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink
              href="/catalog"
              variant="secondary"
              className="!border-0 !bg-white !text-terracotta shadow-lg shadow-black/10 hover:!bg-cream"
            >
              {t.hero.ctaShop}
            </ButtonLink>
            <ButtonLink
              href="/sell"
              variant="outline"
              className="!border-white/50 !text-white hover:!bg-white/15"
            >
              {t.hero.ctaSell}
            </ButtonLink>
          </div>
        </div>

        <div className="hidden grid-cols-2 gap-3 sm:grid">
          {previewCategories.map((cat, i) => (
            <Link
              key={cat}
              href={`/catalog?category=${cat}`}
              className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg ${
                i === 0 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <span className="text-3xl transition-transform group-hover:scale-110">
                {CATEGORY_ICONS[cat]}
              </span>
              <span className="text-sm font-semibold">{t.categories[cat]}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
