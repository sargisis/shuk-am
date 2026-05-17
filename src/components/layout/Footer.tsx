"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TELEGRAM_URL } from "@/lib/constants";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gold/30 bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-2xl font-bold">
              Shuk<span className="text-gold">.am</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-cream/70">
              {t.footer.tagline}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-1">
            <Link
              href="/catalog"
              className="text-cream/80 hover:text-gold transition-colors"
            >
              {t.nav.catalog}
            </Link>
            <Link
              href="/how-to-order"
              className="text-cream/80 hover:text-gold transition-colors"
            >
              {t.nav.howToOrder}
            </Link>
            <Link
              href="/delivery"
              className="text-cream/80 hover:text-gold transition-colors"
            >
              {t.nav.delivery}
            </Link>
            <Link
              href="/about"
              className="text-cream/80 hover:text-gold transition-colors"
            >
              {t.nav.about}
            </Link>
            <Link
              href="/sell"
              className="text-cream/80 hover:text-gold transition-colors"
            >
              {t.nav.sell}
            </Link>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/80 hover:text-gold transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>
        <p className="mt-8 border-t border-cream/10 pt-6 text-center text-xs text-cream/50">
          © {year} Shuk.am. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
