"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { createOrder } from "@/lib/storage/orders";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { resolveCartItems, cartTotalAmd } from "@/lib/payments/resolve-cart";
import type { PaymentProviderId } from "@/types/cart";

export function CartView({ stripeEnabled }: { stripeEnabled: boolean }) {
  const { items, setQuantity, removeItem, clearCart, ready } = useCart();
  const { user } = useAuth();
  const { locale, t } = useLocale();
  const [loading, setLoading] = useState<PaymentProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-terracotta/30" />
      </div>
    );
  }

  const lines = resolveCartItems(items);
  const total = cartTotalAmd(lines);

  function saveOrder(method: PaymentProviderId, status: "pending" | "paid") {
    const order = createOrder({
      buyerId: user?.id ?? "guest",
      buyerEmail: user?.email ?? "guest@shuk.am",
      buyerName: user?.name ?? "Guest",
      lines,
      paymentMethod: method,
      status,
    });
    sessionStorage.setItem("shuk-last-order", order.id);
    return order.id;
  }

  async function checkout(provider: PaymentProviderId) {
    setLoading(provider);
    setError(null);
    try {
      saveOrder(provider, "pending");
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, items, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "stripe_not_configured") {
          setError(t.cart.stripeNotConfigured);
        } else {
          setError(data.message ?? "Checkout failed");
        }
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(null);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gold/40 bg-white py-20 text-center">
        <p className="text-lg text-ink-muted">{t.cart.empty}</p>
        <ButtonLink href="/catalog" className="mt-6">
          {t.cart.emptyCta}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <ul className="space-y-4 lg:col-span-2">
        {lines.map((line) => (
          <li
            key={line.product.id}
            className="flex gap-4 rounded-2xl border border-gold/25 bg-white p-4"
          >
            <Link
              href={`/product/${line.product.id}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-wheat"
            >
              <Image
                src={line.product.image}
                alt={line.product.name[locale]}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${line.product.id}`}
                className="font-semibold text-ink hover:text-terracotta"
              >
                {line.product.name[locale]}
              </Link>
              <p className="text-sm text-ink-muted">
                {formatPrice(line.product.price, locale)} ֏
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-ink-muted">{t.cart.quantity}</span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={line.quantity}
                    onChange={(e) =>
                      setQuantity(
                        line.product.id,
                        Number(e.target.value) || 1,
                      )
                    }
                    className="w-16 rounded-lg border border-gold/40 px-2 py-1"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(line.product.id)}
                  className="text-sm text-terracotta hover:underline"
                >
                  {t.cart.remove}
                </button>
              </div>
            </div>
            <p className="shrink-0 font-bold text-terracotta">
              {formatPrice(line.lineTotalAmd, locale)} ֏
            </p>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-ink-muted hover:text-ink"
          >
            {t.cart.clear}
          </button>
        </li>
      </ul>

      <aside className="h-fit rounded-2xl border border-gold/25 bg-white p-6">
        <p className="text-sm text-ink-muted">{t.cart.total}</p>
        <p className="text-3xl font-bold text-terracotta">
          {formatPrice(total, locale)} ֏
        </p>

        {stripeEnabled && (
          <p className="mt-3 text-xs text-ink-muted">{t.cart.stripeTestNote}</p>
        )}

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {stripeEnabled && (
            <Button
              type="button"
              disabled={loading !== null}
              onClick={() => checkout("stripe")}
              className="w-full"
            >
              {loading === "stripe" ? t.cart.processing : t.cart.payStripe}
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            disabled={loading !== null}
            onClick={() => checkout("telegram")}
            className="w-full"
          >
            {loading === "telegram" ? t.cart.processing : t.cart.payTelegram}
          </Button>
        </div>

        <Link
          href="/catalog"
          className="mt-4 block text-center text-sm text-terracotta hover:underline"
        >
          {t.cart.continueShopping}
        </Link>
      </aside>
    </div>
  );
}
