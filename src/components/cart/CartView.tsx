"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { resolveCheckoutContact } from "@/lib/checkout/contact";
import { createOrderLocal } from "@/lib/db/orders";
import { useSupabaseBackend } from "@/hooks/useSupabaseBackend";
import { Button, ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { resolveCartItems, cartTotalAmd } from "@/lib/payments/resolve-cart";
import type { PaymentProviderId } from "@/types/cart";

function mapCartError(code: string, t: { errors: Record<string, string> }) {
  return t.errors[code] ?? code;
}

export function CartView({ stripeEnabled }: { stripeEnabled: boolean }) {
  const { items, setQuantity, removeItem, clearCart, ready } = useCart();
  const { user } = useAuth();
  const { locale, t } = useLocale();
  const [loading, setLoading] = useState<PaymentProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const { active: useSupabase } = useSupabaseBackend();
  const showStripe = stripeEnabled;

  useEffect(() => {
    if (!user) return;
    setName((n) => n || user.name);
    setEmail((e) => e || user.email);
    setPhone((p) => p || user.phone || "");
  }, [user]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-terracotta/20 ring-4 ring-terracotta/10" />
      </div>
    );
  }

  const lines = resolveCartItems(items);
  const total = cartTotalAmd(lines);

  function getPayload() {
    return resolveCheckoutContact({ name, email, phone }, user);
  }

  async function checkoutTelegram() {
    setLoading("telegram");
    setError(null);
    const payload = getPayload();
    if ("error" in payload) {
      setError(mapCartError(payload.error, t));
      setLoading(null);
      return;
    }
    const contact = payload.contact;
    try {
      if (useSupabase) {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            locale,
            buyerName: contact.name,
            buyerEmail: contact.email,
            buyerPhone: contact.phone,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(mapCartError(data.error ?? "order_failed", t));
          return;
        }
        if (data.orderId) {
          sessionStorage.setItem("shuk-last-order", data.orderId);
        }
        if (data.telegramUrl) {
          window.location.href = data.telegramUrl;
        }
        return;
      }

      const order = await createOrderLocal({
        buyerId: user?.id ?? "guest",
        buyerEmail: contact.email,
        buyerName: contact.name,
        buyerPhone: contact.phone,
        lines,
        paymentMethod: "telegram",
        status: "pending",
      });
      sessionStorage.setItem("shuk-last-order", order.id);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "telegram",
          items,
          locale,
          buyerName: contact.name,
          buyerEmail: contact.email,
          buyerPhone: contact.phone,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError(t.errors.order_failed);
    } finally {
      setLoading(null);
    }
  }

  async function checkoutStripe() {
    setLoading("stripe");
    setError(null);
    const payload = getPayload();
    if ("error" in payload) {
      setError(mapCartError(payload.error, t));
      setLoading(null);
      return;
    }
    const contact = payload.contact;
    try {
      if (!useSupabase) {
        const order = await createOrderLocal({
          buyerId: user?.id ?? "guest",
          buyerEmail: contact.email,
          buyerName: contact.name,
          buyerPhone: contact.phone,
          lines,
          paymentMethod: "stripe",
          status: "pending",
        });
        sessionStorage.setItem("shuk-last-order", order.id);
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "stripe",
          items,
          locale,
          buyerName: contact.name,
          buyerEmail: contact.email,
          buyerPhone: contact.phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "stripe_not_configured") {
          setError(t.cart.stripeNotConfigured);
        } else {
          setError(mapCartError(data.error ?? "order_failed", t));
        }
        return;
      }
      if (data.orderId) {
        sessionStorage.setItem("shuk-last-order", data.orderId);
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError(t.errors.order_failed);
    } finally {
      setLoading(null);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="surface-card flex flex-col items-center py-20 text-center">
        <span className="text-5xl" role="img" aria-hidden>
          🧺
        </span>
        <p className="mt-4 text-lg text-ink-muted">{t.cart.empty}</p>
        <ButtonLink href="/catalog" className="mt-6">
          {t.cart.emptyCta}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
      <ul className="space-y-4">
        {lines.map((line) => (
          <li
            key={line.product.id}
            className="surface-card flex gap-4 p-4 sm:p-5"
          >
            <Link
              href={`/product/${line.product.id}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-wheat sm:h-28 sm:w-28"
            >
              <Image
                src={line.product.image}
                alt={line.product.name[locale]}
                fill
                className="object-cover"
                sizes="112px"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${line.product.id}`}
                className="font-semibold text-ink hover:text-terracotta"
              >
                {line.product.name[locale]}
              </Link>
              <p className="mt-1 text-sm text-ink-muted">
                {formatPrice(line.product.price, locale)} ֏
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
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
                    className="input-field w-16 py-1.5 text-center"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(line.product.id)}
                  className="text-sm font-medium text-terracotta hover:underline"
                >
                  {t.cart.remove}
                </button>
              </div>
            </div>
            <p className="shrink-0 font-display text-lg font-semibold text-terracotta">
              {formatPrice(line.lineTotalAmd, locale)} ֏
            </p>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-ink-muted transition-colors hover:text-ink"
          >
            {t.cart.clear}
          </button>
        </li>
      </ul>

      <aside className="h-fit space-y-4">
        <div className="surface-card-elevated p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            {t.cart.contactTitle}
          </h2>
          <p className="mt-1 text-sm text-ink-muted">{t.cart.contactHint}</p>
          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-xs font-medium text-ink-muted">
                {t.auth.name}
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field mt-1"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-ink-muted">
                {t.auth.email}
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-ink-muted">
                {t.auth.phone}
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field mt-1"
                placeholder="+374"
              />
            </label>
          </div>
        </div>

        <div className="surface-card-elevated p-6">
          <p className="text-sm font-medium text-ink-muted">{t.cart.total}</p>
          <p className="font-display text-4xl font-semibold text-terracotta">
            {formatPrice(total, locale)}{" "}
            <span className="text-lg font-sans font-normal text-ink-muted">֏</span>
          </p>

          {showStripe && (
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              {t.cart.stripeTestNote}
            </p>
          )}

          {error && (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-100">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {showStripe && (
              <Button
                type="button"
                disabled={loading !== null}
                onClick={checkoutStripe}
                className="w-full"
              >
                {loading === "stripe" ? t.cart.processing : t.cart.payStripe}
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              disabled={loading !== null}
              onClick={checkoutTelegram}
              className="w-full"
            >
              {loading === "telegram" ? t.cart.processing : t.cart.payTelegram}
            </Button>
          </div>

          <Link
            href="/catalog"
            className="link-arrow mt-5 block text-center"
          >
            {t.cart.continueShopping}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
