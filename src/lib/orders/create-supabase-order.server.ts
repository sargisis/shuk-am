import { products as staticProducts } from "@/data/products";
import { mapProduct, type ProductRow } from "@/lib/supabase/mappers";
import { createClient } from "@/lib/supabase/server";
import type { ResolvedCartLine } from "@/lib/payments/resolve-cart";
import type { PaymentMethod } from "@/types";

export async function createSupabaseOrder(
  lines: ResolvedCartLine[],
  options: {
    paymentMethod: PaymentMethod;
    buyerName?: string;
    buyerEmail?: string;
    buyerPhone?: string;
  },
): Promise<{ orderId: string }> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const totalAmd = lines.reduce((s, l) => s + l.lineTotalAmd, 0);
  const sellerIds = [...new Set(lines.map((l) => l.product.sellerId))];

  let profileName = options.buyerName ?? "Guest";
  let profileEmail = options.buyerEmail ?? "guest@shuk.am";

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
      buyer_phone: options.buyerPhone?.trim() || null,
      total_amd: totalAmd,
      status: "pending",
      payment_method: options.paymentMethod,
      seller_ids: sellerIds,
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? "order_failed");
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
    throw new Error(itemsError.message);
  }

  return { orderId: order.id };
}

export async function resolveLinesFromCartItems(
  items: { productId: string; quantity: number }[],
) {
  const supabase = await createClient();
  const productIds = items.map((i) => i.productId);
  const { data: productRows } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);

  const dbProducts = (productRows ?? []) as ProductRow[];

  return items
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
    .filter(Boolean) as ResolvedCartLine[];
}
