import { sellers as staticSellers } from "@/data/sellers";
import { isSupabaseBackend } from "@/lib/supabase/ready";
import { createClient } from "@/lib/supabase/client";
import { mapSeller, type SellerRow } from "@/lib/supabase/mappers";
import { getCustomSellers } from "@/lib/storage/custom-sellers";
import type { Seller } from "@/types";

export async function fetchAllSellers(): Promise<Seller[]> {
  if (!(await isSupabaseBackend())) {
    const custom =
      typeof window !== "undefined" ? getCustomSellers() : [];
    const ids = new Set(staticSellers.map((s) => s.id));
    return [...staticSellers, ...custom.filter((s) => !ids.has(s.id))];
  }

  const supabase = createClient();
  const { data, error } = await supabase.from("sellers").select("*");

  if (error || !data?.length) {
    return staticSellers;
  }

  return (data as SellerRow[]).map(mapSeller);
}

export async function fetchSellerBySlug(
  slug: string,
): Promise<Seller | undefined> {
  const all = await fetchAllSellers();
  return all.find((s) => s.slug === slug || s.id === slug);
}

export async function fetchSellerById(
  id: string,
): Promise<Seller | undefined> {
  const all = await fetchAllSellers();
  return all.find((s) => s.id === id);
}
