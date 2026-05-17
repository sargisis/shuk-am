import type { Order, OrderItem, OrderStatus, PaymentMethod } from "@/types";
import type { ResolvedCartLine } from "@/lib/payments/resolve-cart";
import { generateId, readJson, writeJson } from "./client";
import { STORAGE_KEYS } from "./keys";

export function getOrders(): Order[] {
  return readJson<Order[]>(STORAGE_KEYS.orders, []);
}

function saveOrders(orders: Order[]) {
  writeJson(STORAGE_KEYS.orders, orders);
}

export function createOrder(input: {
  buyerId: string;
  buyerEmail: string;
  buyerName: string;
  lines: ResolvedCartLine[];
  paymentMethod: PaymentMethod;
  status?: OrderStatus;
}): Order {
  const items: OrderItem[] = input.lines.map((line) => ({
    productId: line.product.id,
    quantity: line.quantity,
    priceAmd: line.product.price,
    name: line.product.name,
  }));

  const order: Order = {
    id: generateId("order"),
    buyerId: input.buyerId,
    buyerEmail: input.buyerEmail,
    buyerName: input.buyerName,
    items,
    totalAmd: input.lines.reduce((s, l) => s + l.lineTotalAmd, 0),
    status: input.status ?? "pending",
    paymentMethod: input.paymentMethod,
    createdAt: new Date().toISOString(),
    sellerIds: [...new Set(input.lines.map((l) => l.product.sellerId))],
  };

  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return;
  orders[idx] = { ...orders[idx], status };
  saveOrders(orders);
}

export function getOrdersForBuyer(buyerId: string) {
  return getOrders().filter((o) => o.buyerId === buyerId);
}

export function getOrdersForSeller(sellerId: string) {
  return getOrders().filter((o) => o.sellerIds.includes(sellerId));
}

export function getOrderById(orderId: string) {
  return getOrders().find((o) => o.id === orderId);
}
