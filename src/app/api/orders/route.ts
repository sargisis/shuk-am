import { NextResponse } from "next/server";
import { TELEGRAM_URL } from "@/lib/constants";
import { resolveCheckoutContact } from "@/lib/checkout/contact";
import {
  createSupabaseOrder,
  resolveLinesFromCartItems,
} from "@/lib/orders/create-supabase-order.server";
import { buildTelegramOrderMessage } from "@/lib/payments/resolve-cart";
import { isSupabaseBackend } from "@/lib/supabase/ready";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/types/cart";
import type { Locale } from "@/types";

interface Body {
  items: CartItem[];
  locale?: Locale;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
}

export async function POST(request: Request) {
  if (!(await isSupabaseBackend())) {
    return NextResponse.json(
      { error: "supabase_not_ready" },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { items, locale = "ru" } = body;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  let profileUser: { name: string; email: string; phone?: string } | null =
    null;
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

  const lines = await resolveLinesFromCartItems(items);
  if (lines.length === 0) {
    return NextResponse.json({ error: "no_valid_products" }, { status: 400 });
  }

  try {
    const { orderId } = await createSupabaseOrder(lines, {
      paymentMethod: "telegram",
      buyerName: resolved.contact.name,
      buyerEmail: resolved.contact.email,
      buyerPhone: resolved.contact.phone,
    });

    const message = buildTelegramOrderMessage(lines, locale, resolved.contact);
    const telegramUrl = `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({ orderId, telegramUrl });
  } catch (err) {
    console.error("[api/orders]", err);
    return NextResponse.json({ error: "order_failed" }, { status: 500 });
  }
}
