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
} from "@/lib/storage/auth";
import type { User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => ReturnType<typeof loginUser>;
  register: (input: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone?: string;
    shopName?: string;
  }) => ReturnType<typeof registerUser>;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  const login = useCallback(
    (email: string, password: string) => {
      const result = loginUser(email, password);
      if (result.ok) setUser(result.user);
      return result;
    },
    [],
  );

  const register = useCallback(
    (input: Parameters<AuthContextValue["register"]>[0]) => {
      const result = registerUser(input);
      if (result.ok) setUser(result.user);
      return result;
    },
    [],
  );

  const logout = useCallback(() => {
    logoutUser();
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
