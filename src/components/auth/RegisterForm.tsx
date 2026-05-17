"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/Button";
import type { UserRole } from "@/types";

export function RegisterForm() {
  const { t } = useLocale();
  const { register } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("buyer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await register({
      email,
      password,
      name,
      role,
      phone,
      shopName: role === "seller" ? shopName : undefined,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(t.errors[result.error] ?? result.error);
      return;
    }
    router.push(
      result.user.role === "seller" ? "/seller/dashboard" : "/account",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface-card-elevated mx-auto max-w-md space-y-4 p-8 sm:p-10"
    >
      <h1 className="text-2xl font-bold text-ink">{t.auth.registerTitle}</h1>
      <p className="text-sm text-ink-muted">{t.auth.demoNote}</p>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        {(["buyer", "seller"] as UserRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold ${
              role === r
                ? "bg-terracotta text-white"
                : "border border-gold/40 text-ink-muted"
            }`}
          >
            {r === "buyer" ? t.auth.roleBuyer : t.auth.roleSeller}
          </button>
        ))}
      </div>
      <label className="block">
        <span className="text-sm text-ink-muted">{t.auth.name}</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field mt-1"
        />
      </label>
      <label className="block">
        <span className="text-sm text-ink-muted">{t.auth.email}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mt-1"
        />
      </label>
      <label className="block">
        <span className="text-sm text-ink-muted">{t.auth.password}</span>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mt-1"
        />
      </label>
      <label className="block">
        <span className="text-sm text-ink-muted">{t.auth.phone}</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field mt-1"
        />
      </label>
      {role === "seller" && (
        <label className="block">
          <span className="text-sm text-ink-muted">{t.auth.shopName}</span>
          <input
            required
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="input-field mt-1"
          />
        </label>
      )}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? t.cart.processing : t.auth.submitRegister}
      </Button>
      <p className="text-center text-sm">
        <Link href="/login" className="text-terracotta hover:underline">
          {t.auth.hasAccount}
        </Link>
      </p>
    </form>
  );
}
