"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
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
  const { user, ready: authReady, logout } = useAuth();
  const { count, ready: cartReady } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-gold/25 bg-surface/80 shadow-[0_1px_0_rgba(212,165,116,0.2)] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta to-terracotta-dark text-lg font-bold text-white shadow-md shadow-terracotta/25 transition-transform group-hover:scale-[1.02]">
            Շ
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Shuk<span className="text-terracotta">.am</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-2xl border border-gold/25 bg-cream/60 p-1 sm:flex">
          {links.map(({ href, key }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-white text-terracotta shadow-sm"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {t.nav[key]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {authReady && user && (
            <>
              <Link
                href={user.role === "seller" ? "/seller/dashboard" : "/account"}
                className="hidden text-sm font-medium text-ink-muted transition-colors hover:text-terracotta sm:inline"
              >
                {user.role === "seller" ? t.nav.dashboard : t.nav.account}
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="hidden text-sm text-ink-muted transition-colors hover:text-ink sm:inline"
              >
                {t.nav.logout}
              </button>
            </>
          )}
          {authReady && !user && (
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-terracotta hover:underline sm:inline"
            >
              {t.nav.login}
            </Link>
          )}
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-xl bg-terracotta px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-terracotta/20 transition-all hover:bg-terracotta-dark hover:shadow-lg sm:px-4"
          >
            {t.nav.cart}
            {cartReady && count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-terracotta">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="flex border-t border-gold/20 bg-cream/40 sm:hidden">
        {links.map(({ href, key }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 py-3 text-center text-xs font-semibold transition-colors ${
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
