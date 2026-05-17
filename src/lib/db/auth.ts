import { isSupabaseBackend } from "@/lib/supabase/ready";
import { createClient } from "@/lib/supabase/client";
import { mapProfileToUser, type ProfileRow } from "@/lib/supabase/mappers";
import * as localAuth from "@/lib/storage/auth";
import type { User, UserRole } from "@/types";

async function fetchUserFromSupabase(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (!profile) return null;

  let sellerId: string | null = null;
  if ((profile as ProfileRow).role === "seller") {
    const { data: seller } = await supabase
      .from("sellers")
      .select("id")
      .eq("owner_id", authUser.id)
      .maybeSingle();
    sellerId = seller?.id ?? null;
  }

  return mapProfileToUser(profile as ProfileRow, sellerId);
}

export async function getCurrentUser(): Promise<User | null> {
  if (!(await isSupabaseBackend())) {
    return localAuth.getCurrentUser();
  }
  return fetchUserFromSupabase();
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  if (!(await isSupabaseBackend())) {
    return localAuth.loginUser(email, password);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    return { ok: false, error: "invalid_login" };
  }

  const user = await fetchUserFromSupabase();
  if (!user) {
    return { ok: false, error: "invalid_login" };
  }

  return { ok: true, user };
}

function slugify(text: string) {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 20);
  return base || `shop-${Date.now().toString(36)}`;
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  shopName?: string;
}): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  if (!(await isSupabaseBackend())) {
    return localAuth.registerUser(input);
  }

  const email = input.email.trim().toLowerCase();
  if (!email || input.password.length < 6) {
    return { ok: false, error: "invalid_credentials" };
  }

  const sellerSlug =
    input.role === "seller"
      ? slugify(input.shopName || input.name) +
        "-" +
        Math.random().toString(36).slice(2, 8)
      : undefined;

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: input.name.trim(),
        role: input.role,
        phone: input.phone?.trim(),
        shop_name: input.shopName?.trim() || input.name.trim(),
        seller_slug: sellerSlug,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("registered")) {
      return { ok: false, error: "email_exists" };
    }
    return { ok: false, error: "invalid_credentials" };
  }

  if (data.user && !data.session) {
    return { ok: false, error: "confirm_email" };
  }

  const user = await fetchUserFromSupabase();
  if (!user) {
    return { ok: false, error: "invalid_credentials" };
  }

  return { ok: true, user };
}

export async function logoutUser(): Promise<void> {
  if (!(await isSupabaseBackend())) {
    localAuth.logoutUser();
    return;
  }
  const supabase = createClient();
  await supabase.auth.signOut();
}
