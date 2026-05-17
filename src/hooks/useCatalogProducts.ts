"use client";

import { useCallback, useEffect, useState } from "react";
import { products as staticProducts } from "@/data/products";
import { fetchAllProducts } from "@/lib/db/products";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Product } from "@/types";

export function useCatalogProducts() {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(isSupabaseConfigured());

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await fetchAllProducts();
    setProducts(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, loading, refresh };
}
