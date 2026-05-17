import { products as staticProducts } from "@/data/products";
import type { Category } from "@/types";

/** Server / SSG — static fallback */
export function getAllProductsStatic() {
  return staticProducts;
}

export function getProductIds() {
  return staticProducts.map((p) => p.id);
}

export function getProductByIdStatic(id: string) {
  return staticProducts.find((p) => p.id === id);
}

export function filterProductsStatic(options: {
  category?: Category | null;
  maxPrice?: number | null;
  district?: string | null;
}) {
  return staticProducts.filter((p) => {
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
