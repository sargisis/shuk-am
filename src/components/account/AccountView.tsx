"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageTitle } from "@/components/layout/PageContainer";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatPrice } from "@/lib/format";
import { fetchOrdersForBuyer } from "@/lib/db/orders";
import type { Order } from "@/types";
import { ButtonLink } from "@/components/ui/Button";

export function AccountView() {
  const { user, ready } = useAuth();
  const { locale, t } = useLocale();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchOrdersForBuyer(user.id).then((list) => {
      if (!cancelled) setOrders(list);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!ready) return null;

  if (!user) {
    return (
      <div className="surface-card mx-auto max-w-md py-16 text-center">
        <p className="text-ink-muted">{t.auth.loginTitle}</p>
        <ButtonLink href="/login" className="mt-6">
          {t.nav.login}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageTitle title={t.account.title} />

      <section className="surface-card p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-ink">
          {t.account.profile}
        </h2>
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-cream/60 px-4 py-3">
            <dt className="text-ink-muted">{t.auth.name}</dt>
            <dd className="mt-1 font-medium text-ink">{user.name}</dd>
          </div>
          <div className="rounded-xl bg-cream/60 px-4 py-3">
            <dt className="text-ink-muted">{t.auth.email}</dt>
            <dd className="mt-1 font-medium text-ink">{user.email}</dd>
          </div>
          {user.phone && (
            <div className="rounded-xl bg-cream/60 px-4 py-3 sm:col-span-2">
              <dt className="text-ink-muted">{t.auth.phone}</dt>
              <dd className="mt-1 font-medium text-ink">{user.phone}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="surface-card p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-ink">
          {t.account.orders}
        </h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-ink-muted">{t.account.noOrders}</p>
        ) : (
          <ul className="mt-5 space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-gold/20 bg-cream/30 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="font-semibold text-ink">
                    {t.account.orderId} #{order.id.slice(-8)}
                  </span>
                  <span className="rounded-full bg-terracotta/10 px-3 py-0.5 text-xs font-semibold text-terracotta">
                    {t.orderStatus[order.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-muted">
                  {new Date(order.createdAt).toLocaleString(
                    locale === "hy" ? "hy-AM" : "ru-RU",
                  )}
                </p>
                <p className="mt-2 font-display text-xl font-semibold text-terracotta">
                  {formatPrice(order.totalAmd, locale)} ֏
                </p>
                <ul className="mt-3 space-y-1 border-t border-gold/15 pt-3 text-sm text-ink-muted">
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      {item.name[locale]} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        <Link href="/catalog" className="link-arrow mt-6 inline-flex">
          {t.cart.continueShopping}
          <span aria-hidden>→</span>
        </Link>
      </section>
    </div>
  );
}
