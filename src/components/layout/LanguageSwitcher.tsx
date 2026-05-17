"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/types";

const options: { code: Locale; label: string }[] = [
  { code: "hy", label: "Հայ" },
  { code: "ru", label: "Рус" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex rounded-lg border border-gold/40 bg-white/80 p-0.5 text-xs font-semibold">
      {options.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`rounded-md px-2.5 py-1 transition-colors ${
            locale === code
              ? "bg-terracotta text-white"
              : "text-ink-muted hover:text-ink"
          }`}
          aria-pressed={locale === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
