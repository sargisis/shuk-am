import { NextResponse } from "next/server";
import { TELEGRAM_URL } from "@/lib/constants";
import { isStripeConfigured } from "@/lib/payments/config";
import {
  buildTelegramOrderMessage,
  resolveCartItems,
} from "@/lib/payments/resolve-cart";
import { createStripeCheckoutSession } from "@/lib/payments/stripe.server";
import type { CartItem, PaymentProviderId } from "@/types/cart";
import type { Locale } from "@/types";

interface CheckoutBody {
  provider: PaymentProviderId;
  items: CartItem[];
  locale?: Locale;
}

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { provider, items, locale = "ru" } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const lines = resolveCartItems(items);
  if (lines.length === 0) {
    return NextResponse.json({ error: "No valid products" }, { status: 400 });
  }

  if (provider === "telegram") {
    const message = buildTelegramOrderMessage(lines, locale);
    const url = `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;
    return NextResponse.json({ url, provider: "telegram" });
  }

  if (provider === "stripe") {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error: "stripe_not_configured",
          message: "Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local",
        },
        { status: 503 },
      );
    }

    try {
      const url = await createStripeCheckoutSession(lines, locale);
      return NextResponse.json({ url, provider: "stripe" });
    } catch (err) {
      console.error("[checkout/stripe]", err);
      return NextResponse.json(
        { error: "stripe_session_failed" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
}
