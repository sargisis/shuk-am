import type { Product } from "@/types";
import { readJson, writeJson } from "./client";
import { STORAGE_KEYS } from "./keys";

export function getSellerProducts(): Product[] {
  return readJson<Product[]>(STORAGE_KEYS.sellerProducts, []);
}

export function saveSellerProduct(product: Product) {
  const all = getSellerProducts();
  const idx = all.findIndex((p) => p.id === product.id);
  if (idx >= 0) {
    all[idx] = product;
  } else {
    all.push(product);
  }
  writeJson(STORAGE_KEYS.sellerProducts, all);
}

export function deleteSellerProduct(productId: string, sellerId: string) {
  const all = getSellerProducts().filter(
    (p) => !(p.id === productId && p.sellerId === sellerId),
  );
  writeJson(STORAGE_KEYS.sellerProducts, all);
}

export function getProductsBySellerId(sellerId: string): Product[] {
  return getSellerProducts().filter((p) => p.sellerId === sellerId);
}
