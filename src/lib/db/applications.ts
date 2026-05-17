import { isSupabaseBackend } from "@/lib/supabase/ready";
import { createClient } from "@/lib/supabase/client";
import * as localApps from "@/lib/storage/applications";
import type { Category } from "@/types";

export async function submitApplication(input: {
  name: string;
  email: string;
  phone: string;
  category: Category;
  message: string;
}) {
  if (!(await isSupabaseBackend())) {
    return localApps.submitApplication(input);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("seller_applications")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}
