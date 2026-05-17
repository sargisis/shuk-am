import type { LocalizedString, Seller, User, UserRole } from "@/types";
import { saveCustomSeller } from "./custom-sellers";
import { generateId, readJson, writeJson } from "./client";
import { STORAGE_KEYS } from "./keys";

export interface Session {
  userId: string;
}

export function getUsers(): User[] {
  return readJson<User[]>(STORAGE_KEYS.users, []);
}

function saveUsers(users: User[]) {
  writeJson(STORAGE_KEYS.users, users);
}

export function getSession(): Session | null {
  return readJson<Session | null>(STORAGE_KEYS.session, null);
}

export function setSession(session: Session | null) {
  if (session) {
    writeJson(STORAGE_KEYS.session, session);
  } else if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.session);
  }
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  return getUsers().find((u) => u.id === session.userId) ?? null;
}

function slugify(text: string) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "shop"
  );
}

export function registerUser(input: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  shopName?: string;
}): { ok: true; user: User } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password || input.password.length < 4) {
    return { ok: false, error: "invalid_credentials" };
  }

  const users = getUsers();
  if (users.some((u) => u.email === email)) {
    return { ok: false, error: "email_exists" };
  }

  const sellerId =
    input.role === "seller"
      ? slugify(input.shopName || input.name) +
        "-" +
        Math.random().toString(36).slice(2, 8)
      : undefined;

  const user: User = {
    id: generateId("user"),
    email,
    name: input.name.trim(),
    role: input.role,
    phone: input.phone?.trim(),
    sellerId,
    createdAt: new Date().toISOString(),
  };

  if (input.role === "seller" && sellerId) {
    const shopLabel = input.shopName?.trim() || input.name.trim();
    const name: LocalizedString = { hy: shopLabel, ru: shopLabel };
    const seller: Seller = {
      id: sellerId,
      slug: sellerId,
      name,
      bio: {
        hy: "Տեղական արտադրող Shuk.am-ում",
        ru: "Местный продавец на Shuk.am",
      },
      district: "Երևան",
      image: `https://picsum.photos/seed/${sellerId}/400/400`,
    };
    saveCustomSeller(seller);
  }

  users.push(user);
  saveUsers(users);
  setSession({ userId: user.id });
  return { ok: true, user };
}

export function loginUser(
  email: string,
  password: string,
): { ok: true; user: User } | { ok: false; error: string } {
  const normalized = email.trim().toLowerCase();
  const user = getUsers().find((u) => u.email === normalized);
  if (!user || password.length < 4) {
    return { ok: false, error: "invalid_login" };
  }
  setSession({ userId: user.id });
  return { ok: true, user };
}

export function logoutUser() {
  setSession(null);
}
