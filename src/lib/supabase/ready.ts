import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

let cached: boolean | null = null;
let pending: Promise<boolean> | null = null;

/** True when Supabase env is set and public schema tables exist. */
export async function isSupabaseSchemaReady(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  if (cached !== null) return cached;
  if (!pending) {
    pending = (async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("products").select("id").limit(1);
        cached = !error || error.code !== "PGRST205";
        return cached;
      } catch {
        cached = false;
        return false;
      } finally {
        pending = null;
      }
    })();
  }
  return pending;
}

export async function isSupabaseBackend(): Promise<boolean> {
  return isSupabaseConfigured() && (await isSupabaseSchemaReady());
}

export function resetSupabaseReadyCache() {
  cached = null;
  pending = null;
}
