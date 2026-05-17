import { products } from "@/data/products";
import type { Category } from "@/types";

export function getAllProducts() {
  return products;
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function filterProducts(options: {
  category?: Category | null;
  maxPrice?: number | null;
  district?: string | null;
}) {
  return products.filter((p) => {
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
  return products.map((p) => p.id);
}
