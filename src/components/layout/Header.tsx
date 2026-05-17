"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

const links = [
  { href: "/", key: "home" as const },
  { href: "/catalog", key: "catalog" as const },
  { href: "/sell", key: "sell" as const },
];

export function Header() {
  const pathname = usePathname();
  const { t } = useLocale();
  const { count, ready } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-gold/30 bg-cream/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta text-lg text-white">
            Շ
          </span>
          <span className="text-xl font-bold tracking-tight text-ink">
            Shuk<span className="text-terracotta">.am</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map(({ href, key }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-terracotta/10 text-terracotta"
                    : "text-ink-muted hover:bg-ink/5 hover:text-ink"
                }`}
              >
                {t.nav[key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Link
            href="/cart"
            className="relative rounded-xl border border-gold/40 bg-white px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-terracotta/40 sm:px-4"
          >
            {t.nav.cart}
            {ready && count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-xs text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="flex border-t border-gold/20 sm:hidden">
        {links.map(({ href, key }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 py-2.5 text-center text-xs font-medium ${
                active ? "text-terracotta" : "text-ink-muted"
              }`}
            >
              {t.nav[key]}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
