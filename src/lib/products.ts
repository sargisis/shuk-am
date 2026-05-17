import { products as staticProducts } from "@/data/products";
import { getSellerProducts } from "@/lib/storage/seller-products";
import type { Category, Product } from "@/types";

function mergeProducts(): Product[] {
  const custom = getSellerProducts();
  const staticIds = new Set(staticProducts.map((p) => p.id));
  const merged = [...staticProducts, ...custom.filter((p) => !staticIds.has(p.id))];
  return merged;
}

/** Server / SSG: static catalog only */
export function getAllProductsStatic() {
  return staticProducts;
}

/** Client-aware list — call from client components after mount */
export function getAllProducts(): Product[] {
  if (typeof window === "undefined") return staticProducts;
  return mergeProducts();
}

export function getFeaturedProducts() {
  return getAllProducts().filter((p) => p.featured);
}

export function getProductById(id: string) {
  return getAllProducts().find((p) => p.id === id) ??
    staticProducts.find((p) => p.id === id);
}

export function getProductsBySellerId(sellerId: string) {
  return getAllProducts().filter((p) => p.sellerId === sellerId);
}

export function filterProducts(options: {
  category?: Category | null;
  maxPrice?: number | null;
  district?: string | null;
}) {
  return getAllProducts().filter((p) => {
    if (options.category && p.category !== options.category) return false;
    if (options.maxPrice != null && p.price > options.maxPrice) return false;
    if (
      options.district &&
      !p.district.toLowerCase().includes(options.district.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}

export function getProductIds() {
  return staticProducts.map((p) => p.id);
}
