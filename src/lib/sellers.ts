import { sellers as staticSellers } from "@/data/sellers";
import { getCustomSellers } from "@/lib/storage/custom-sellers";
import type { Seller } from "@/types";

function allSellers(): Seller[] {
  const custom = typeof window !== "undefined" ? getCustomSellers() : [];
  const ids = new Set(staticSellers.map((s) => s.id));
  return [...staticSellers, ...custom.filter((s) => !ids.has(s.id))];
}

export function getAllSellers() {
  return allSellers();
}

export function getSellerBySlug(slug: string) {
  return allSellers().find((s) => s.slug === slug || s.id === slug);
}

export function getSellerById(id: string) {
  return allSellers().find((s) => s.id === id);
}

export function getSellerDisplayName(seller: Seller, locale: "hy" | "ru") {
  return seller.name[locale];
}
