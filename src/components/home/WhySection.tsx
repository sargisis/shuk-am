"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLocale } from "@/components/providers/LocaleProvider";

const icons = ["🌾", "🤝", "📍"];

export function WhySection() {
  const { t } = useLocale();

  return (
    <section className="surface-card-elevated overflow-hidden p-6 sm:p-12">
      <SectionHeader title={t.why.title} align="center" />
      <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
        {t.why.items.map((item, i) => (
          <div
            key={item.title}
            className="rounded-2xl border border-gold/20 bg-cream/50 p-6 text-center transition-colors hover:border-terracotta/25 hover:bg-white"
          >
            <span
              className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-terracotta/15 to-gold/20 text-2xl"
              role="img"
              aria-hidden
            >
              {icons[i] ?? "✦"}
            </span>
            <h3 className="font-display text-lg font-semibold text-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
