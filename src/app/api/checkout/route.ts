import { NextResponse } from "next/server";
import { TELEGRAM_URL } from "@/lib/constants";
import { resolveCheckoutContact } from "@/lib/checkout/contact";
import {
  createSupabaseOrder,
  resolveLinesFromCartItems,
} from "@/lib/orders/create-supabase-order.server";
import { isStripeConfigured } from "@/lib/payments/config";
import {
  buildTelegramOrderMessage,
  resolveCartItems,
} from "@/lib/payments/resolve-cart";
import { createStripeCheckoutSession } from "@/lib/payments/stripe.server";
import { isSupabaseBackend } from "@/lib/supabase/ready";
import { createClient } from "@/lib/supabase/server";
import type { CartItem, PaymentProviderId } from "@/types/cart";
import type { Locale } from "@/types";

interface CheckoutBody {
  provider: PaymentProviderId;
  items: CartItem[];
  locale?: Locale;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
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
    const resolved = resolveCheckoutContact({
      name: body.buyerName,
      email: body.buyerEmail,
      phone: body.buyerPhone,
    });
    const contact = "error" in resolved ? undefined : resolved.contact;
    const message = buildTelegramOrderMessage(lines, locale, contact);
    const url = `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;
    return NextResponse.json({ url, provider: "telegram" });
  }

  if (provider === "stripe") {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error: "stripe_not_configured",
          message:
            "Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local",
        },
        { status: 503 },
      );
    }

    try {
      let orderId: string | undefined;

      if (await isSupabaseBackend()) {
        const supabase = await createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        let profileUser: {
          name: string;
          email: string;
          phone?: string;
        } | null = null;
        if (authUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, email, phone")
            .eq("id", authUser.id)
            .maybeSingle();
          if (profile) {
            profileUser = {
              name: profile.full_name,
              email: profile.email,
              phone: profile.phone ?? undefined,
            };
          }
        }

        const resolved = resolveCheckoutContact(
          {
            name: body.buyerName,
            email: body.buyerEmail,
            phone: body.buyerPhone,
          },
          profileUser,
        );
        if ("error" in resolved) {
          return NextResponse.json({ error: resolved.error }, { status: 400 });
        }

        const dbLines = await resolveLinesFromCartItems(items);
        if (dbLines.length === 0) {
          return NextResponse.json(
            { error: "No valid products" },
            { status: 400 },
          );
        }
        const order = await createSupabaseOrder(dbLines, {
          paymentMethod: "stripe",
          buyerName: resolved.contact.name,
          buyerEmail: resolved.contact.email,
          buyerPhone: resolved.contact.phone,
        });
        orderId = order.orderId;
      }

      const url = await createStripeCheckoutSession(lines, locale, orderId);
      return NextResponse.json({ url, provider: "stripe", orderId });
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
