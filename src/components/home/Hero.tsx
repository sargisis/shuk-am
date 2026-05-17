"use client";

import { ButtonLink } from "@/components/ui/Button";
import { useLocale } from "@/components/providers/LocaleProvider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-terracotta via-terracotta-dark to-ink px-6 py-16 text-white sm:px-12 sm:py-20">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 left-1/4 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="relative max-w-2xl">
        <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
          shuk.am
        </p>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {t.hero.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
          {t.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink
            href="/catalog"
            variant="secondary"
            className="!bg-white !text-terracotta hover:!bg-cream"
          >
            {t.hero.ctaShop}
          </ButtonLink>
          <ButtonLink
            href="/sell"
            variant="outline"
            className="!border-white/60 !text-white hover:!bg-white/10"
          >
            {t.hero.ctaSell}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
