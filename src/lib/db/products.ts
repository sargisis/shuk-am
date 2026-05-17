import { products as staticProducts } from "@/data/products";
import { isSupabaseBackend } from "@/lib/supabase/ready";
import { createClient } from "@/lib/supabase/client";
import { mapProduct, productToRow, type ProductRow } from "@/lib/supabase/mappers";
import { getSellerProducts, saveSellerProduct, deleteSellerProduct } from "@/lib/storage/seller-products";
import type { Product } from "@/types";

function mergeLocal(): Product[] {
  const custom = getSellerProducts();
  const ids = new Set(staticProducts.map((p) => p.id));
  return [...staticProducts, ...custom.filter((p) => !ids.has(p.id))];
}

export async function fetchAllProducts(): Promise<Product[]> {
  if (!(await isSupabaseBackend())) {
    return typeof window !== "undefined" ? mergeLocal() : staticProducts;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchAllProducts]", error);
    return mergeLocal();
  }

  return (data as ProductRow[]).map(mapProduct);
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  if (!(await isSupabaseBackend())) {
    return mergeLocal().find((p) => p.id === id) ?? staticProducts.find((p) => p.id === id);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return staticProducts.find((p) => p.id === id);
  }

  return mapProduct(data as ProductRow);
}

export async function fetchProductsBySellerId(
  sellerId: string,
): Promise<Product[]> {
  const all = await fetchAllProducts();
  return all.filter((p) => p.sellerId === sellerId);
}

export async function upsertProduct(product: Product): Promise<void> {
  if (!(await isSupabaseBackend())) {
    saveSellerProduct(product);
    return;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("products")
    .upsert(productToRow(product));

  if (error) throw error;
}

export async function removeProduct(
  productId: string,
  sellerId: string,
): Promise<void> {
  if (!(await isSupabaseBackend())) {
    deleteSellerProduct(productId, sellerId);
    return;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("seller_id", sellerId);

  if (error) throw error;
}

export function getStaticProductIds() {
  return staticProducts.map((p) => p.id);
}
