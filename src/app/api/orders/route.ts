import { NextResponse } from "next/server";
import { TELEGRAM_URL } from "@/lib/constants";
import {
  createSupabaseOrder,
  resolveLinesFromCartItems,
} from "@/lib/orders/create-supabase-order.server";
import { buildTelegramOrderMessage } from "@/lib/payments/resolve-cart";
import { isSupabaseBackend } from "@/lib/supabase/ready";
import type { CartItem } from "@/types/cart";
import type { Locale } from "@/types";

interface Body {
  items: CartItem[];
  locale?: Locale;
  buyerName?: string;
  buyerEmail?: string;
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

  const lines = await resolveLinesFromCartItems(items);
  if (lines.length === 0) {
    return NextResponse.json({ error: "no_valid_products" }, { status: 400 });
  }

  try {
    const { orderId } = await createSupabaseOrder(lines, {
      paymentMethod: "telegram",
      buyerName: body.buyerName,
      buyerEmail: body.buyerEmail,
    });

    const message = buildTelegramOrderMessage(lines, locale);
    const telegramUrl = `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;

    return NextResponse.json({ orderId, telegramUrl });
  } catch (err) {
    console.error("[api/orders]", err);
    return NextResponse.json({ error: "order_failed" }, { status: 500 });
  }
}
