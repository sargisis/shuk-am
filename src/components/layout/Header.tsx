"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
            href="/catalog"
            className="hidden rounded-xl bg-terracotta px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-terracotta-dark sm:inline-flex"
          >
            {t.nav.order}
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
