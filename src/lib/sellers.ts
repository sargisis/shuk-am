import { sellers as staticSellers } from "@/data/sellers";
import type { Seller } from "@/types";

export function getAllSellersStatic() {
  return staticSellers;
}

export function getSellerBySlugStatic(slug: string) {
  return staticSellers.find((s) => s.slug === slug || s.id === slug);
}

export function getSellerDisplayName(seller: Seller, locale: "hy" | "ru") {
  return seller.name[locale];
}
