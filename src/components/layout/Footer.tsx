"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TELEGRAM_URL } from "@/lib/constants";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-gold/20 bg-gradient-to-b from-ink to-[#140a06] text-cream">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-3xl font-semibold tracking-tight">
              Shuk<span className="text-gold">.am</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream/65">
              {t.footer.tagline}
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-1">
            <Link
              href="/catalog"
              className="text-cream/75 transition-colors hover:text-gold"
            >
              {t.nav.catalog}
            </Link>
            <Link
              href="/how-to-order"
              className="text-cream/75 transition-colors hover:text-gold"
            >
              {t.nav.howToOrder}
            </Link>
            <Link
              href="/delivery"
              className="text-cream/75 transition-colors hover:text-gold"
            >
              {t.nav.delivery}
            </Link>
            <Link
              href="/about"
              className="text-cream/75 transition-colors hover:text-gold"
            >
              {t.nav.about}
            </Link>
            <Link
              href="/sell"
              className="text-cream/75 transition-colors hover:text-gold"
            >
              {t.nav.sell}
            </Link>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/75 transition-colors hover:text-gold"
            >
              Telegram
            </a>
          </nav>
        </div>
        <p className="mt-12 border-t border-cream/10 pt-8 text-center text-xs text-cream/45">
          © {year} Shuk.am. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
