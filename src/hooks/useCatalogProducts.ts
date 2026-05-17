"use client";

import { useEffect, useState } from "react";
import { products as staticProducts } from "@/data/products";
import { getAllProducts } from "@/lib/products";
import type { Product } from "@/types";

export function useCatalogProducts() {
  const [products, setProducts] = useState<Product[]>(staticProducts);

  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  const refresh = () => setProducts(getAllProducts());

  return { products, refresh };
}
