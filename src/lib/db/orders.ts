import { isSupabaseBackend } from "@/lib/supabase/ready";
import { createClient } from "@/lib/supabase/client";
import { mapOrder, type OrderItemRow, type OrderRow } from "@/lib/supabase/mappers";
import type { ResolvedCartLine } from "@/lib/payments/resolve-cart";
import * as localOrders from "@/lib/storage/orders";
import type { Order, OrderStatus, PaymentMethod } from "@/types";

async function fetchOrderItems(orderId: string): Promise<OrderItemRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  return (data ?? []) as OrderItemRow[];
}

export async function fetchOrdersForBuyer(buyerId: string): Promise<Order[]> {
  if (!(await isSupabaseBackend())) {
    return localOrders.getOrdersForBuyer(buyerId);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("buyer_id", buyerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const orders: Order[] = [];
  for (const row of data as OrderRow[]) {
    const items = await fetchOrderItems(row.id);
    orders.push(mapOrder(row, items));
  }
  return orders;
}

export async function fetchOrdersForSeller(sellerId: string): Promise<Order[]> {
  if (!(await isSupabaseBackend())) {
    return localOrders.getOrdersForSeller(sellerId);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .contains("seller_ids", [sellerId])
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const orders: Order[] = [];
  for (const row of data as OrderRow[]) {
    const items = await fetchOrderItems(row.id);
    orders.push(mapOrder(row, items));
  }
  return orders;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  if (!(await isSupabaseBackend())) {
    localOrders.updateOrderStatus(orderId, status);
    return;
  }

  const supabase = createClient();
  await supabase.from("orders").update({ status }).eq("id", orderId);
}

export async function createOrderLocal(input: {
  buyerId: string;
  buyerEmail: string;
  buyerName: string;
  lines: ResolvedCartLine[];
  paymentMethod: PaymentMethod;
  status?: OrderStatus;
}): Promise<Order> {
  return localOrders.createOrder(input);
}
