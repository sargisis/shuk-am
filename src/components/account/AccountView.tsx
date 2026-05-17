"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-ink-muted">{t.auth.loginTitle}</p>
        <ButtonLink href="/login" className="mt-4">
          {t.nav.login}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold text-ink">{t.account.title}</h1>

      <section className="rounded-2xl border border-gold/25 bg-white p-6">
        <h2 className="font-semibold text-ink">{t.account.profile}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-ink-muted">{t.auth.name}:</dt>
            <dd>{user.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-muted">{t.auth.email}:</dt>
            <dd>{user.email}</dd>
          </div>
          {user.phone && (
            <div className="flex gap-2">
              <dt className="text-ink-muted">{t.auth.phone}:</dt>
              <dd>{user.phone}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="rounded-2xl border border-gold/25 bg-white p-6">
        <h2 className="font-semibold text-ink">{t.account.orders}</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-ink-muted">{t.account.noOrders}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-xl border border-gold/20 p-4 text-sm"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium">
                    {t.account.orderId} #{order.id.slice(-8)}
                  </span>
                  <span className="text-terracotta">
                    {t.orderStatus[order.status]}
                  </span>
                </div>
                <p className="mt-1 text-ink-muted">
                  {new Date(order.createdAt).toLocaleString(
                    locale === "hy" ? "hy-AM" : "ru-RU",
                  )}
                </p>
                <p className="mt-2 font-bold">
                  {formatPrice(order.totalAmd, locale)} ֏
                </p>
                <ul className="mt-2 text-ink-muted">
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
        <Link
          href="/catalog"
          className="mt-4 inline-block text-sm text-terracotta hover:underline"
        >
          {t.cart.continueShopping}
        </Link>
      </section>
    </div>
  );
}
