import { NextResponse } from "next/server";
import { TELEGRAM_URL } from "@/lib/constants";
import { buildTelegramOrderMessage } from "@/lib/payments/resolve-cart";
import { isSupabaseBackend } from "@/lib/supabase/ready";
import { createClient } from "@/lib/supabase/server";
import { mapProduct, type ProductRow } from "@/lib/supabase/mappers";
import { products as staticProducts } from "@/data/products";
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

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const productIds = items.map((i) => i.productId);
  const { data: productRows } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);

  const dbProducts = (productRows ?? []) as ProductRow[];
  const lines = items
    .map((item) => {
      const row =
        dbProducts.find((p) => p.id === item.productId) ??
        staticProducts.find((p) => p.id === item.productId);
      if (!row || item.quantity < 1) return null;
      const product =
        "seller_id" in row ? mapProduct(row as ProductRow) : row;
      return {
        product,
        quantity: item.quantity,
        lineTotalAmd: product.price * item.quantity,
      };
    })
    .filter(Boolean) as {
    product: (typeof staticProducts)[0];
    quantity: number;
    lineTotalAmd: number;
  }[];

  if (lines.length === 0) {
    return NextResponse.json({ error: "no_valid_products" }, { status: 400 });
  }

  const totalAmd = lines.reduce((s, l) => s + l.lineTotalAmd, 0);
  const sellerIds = [...new Set(lines.map((l) => l.product.sellerId))];

  let profileName = body.buyerName ?? "Guest";
  let profileEmail = body.buyerEmail ?? "guest@shuk.am";

  if (authUser) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", authUser.id)
      .maybeSingle();
    if (profile) {
      profileName = profile.full_name || profileName;
      profileEmail = profile.email || authUser.email || profileEmail;
    }
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      buyer_id: authUser?.id ?? null,
      buyer_email: profileEmail,
      buyer_name: profileName,
      total_amd: totalAmd,
      status: "pending",
      payment_method: "telegram",
      seller_ids: sellerIds,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("[api/orders]", orderError);
    return NextResponse.json({ error: "order_failed" }, { status: 500 });
  }

  const orderItems = lines.map((line) => ({
    order_id: order.id,
    product_id: line.product.id,
    quantity: line.quantity,
    price_amd: line.product.price,
    name_hy: line.product.name.hy,
    name_ru: line.product.name.ru,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("[api/orders items]", itemsError);
    return NextResponse.json({ error: "order_items_failed" }, { status: 500 });
  }

  const message = buildTelegramOrderMessage(lines, locale);
  const telegramUrl = `${TELEGRAM_URL}?text=${encodeURIComponent(message)}`;

  return NextResponse.json({
    orderId: order.id,
    telegramUrl,
  });
}
