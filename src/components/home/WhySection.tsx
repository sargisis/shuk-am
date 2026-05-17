"use client";

import { useLocale } from "@/components/providers/LocaleProvider";

export function WhySection() {
  const { t } = useLocale();

  return (
    <section className="rounded-3xl border border-gold/25 bg-white p-6 sm:p-10">
      <h2 className="mb-8 text-center text-2xl font-bold text-ink">
        {t.why.title}
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {t.why.items.map((item, i) => (
          <div key={item.title} className="text-center">
            <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10 text-lg font-bold text-terracotta">
              {i + 1}
            </span>
            <h3 className="font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
