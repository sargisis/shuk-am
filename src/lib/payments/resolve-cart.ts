import { products } from "@/data/products";
import { getProductByIdStatic } from "@/lib/products";
import type { CartItem } from "@/types/cart";
import type { Locale, Product } from "@/types";

export interface ResolvedCartLine {
  product: Product;
  quantity: number;
  lineTotalAmd: number;
}

export function resolveCartItems(items: CartItem[]): ResolvedCartLine[] {
  const lines: ResolvedCartLine[] = [];

  for (const item of items) {
    if (!item.productId || item.quantity < 1 || item.quantity > 99) continue;
    const product =
      getProductByIdStatic(item.productId) ??
      products.find((p) => p.id === item.productId);
    if (!product) continue;
    lines.push({
      product,
      quantity: item.quantity,
      lineTotalAmd: product.price * item.quantity,
    });
  }

  return lines;
}

export function cartTotalAmd(lines: ResolvedCartLine[]) {
  return lines.reduce((sum, line) => sum + line.lineTotalAmd, 0);
}

export interface OrderContact {
  name: string;
  email: string;
  phone?: string;
}

export function buildTelegramOrderMessage(
  lines: ResolvedCartLine[],
  locale: Locale,
  contact?: OrderContact,
): string {
  const header =
    locale === "hy" ? "Պատվեր Shuk.am" : "Заказ Shuk.am";
  const contactBlock = contact
    ? locale === "hy"
      ? `\n👤 ${contact.name}\n✉ ${contact.email}${contact.phone ? `\n📞 ${contact.phone}` : ""}\n`
      : `\n👤 ${contact.name}\n✉ ${contact.email}${contact.phone ? `\n📞 ${contact.phone}` : ""}\n`
    : "";
  const body = lines
    .map((line) => {
      const name = line.product.name[locale];
      return `• ${name} × ${line.quantity} — ${line.lineTotalAmd} ֏`;
    })
    .join("\n");
  const total = cartTotalAmd(lines);
  const footer =
    locale === "hy"
      ? `\nԸնդամենը: ${total} ֏`
      : `\nИтого: ${total} ֏`;
  return `${header}${contactBlock}\n${body}${footer}`;
}
