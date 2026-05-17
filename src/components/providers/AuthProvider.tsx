"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/db/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import type { User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: true; user: User } | { ok: false; error: string }>;
  register: (input: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone?: string;
    shopName?: string;
  }) => Promise<{ ok: true; user: User } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const current = await getCurrentUser();
    setUser(current);
  }, []);

  useEffect(() => {
    refresh().finally(() => setReady(true));

    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });

    return () => subscription.unsubscribe();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser(email, password);
    if (result.ok) setUser(result.user);
    return result;
  }, []);

  const register = useCallback(
    async (input: Parameters<AuthContextValue["register"]>[0]) => {
      const result = await registerUser(input);
      if (result.ok) setUser(result.user);
      return result;
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout, refresh }),
    [user, ready, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
