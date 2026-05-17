"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const { t } = useLocale();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await login(email, password);
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
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-gold/25 bg-white p-8"
    >
      <h1 className="text-2xl font-bold text-ink">{t.auth.loginTitle}</h1>
      <p className="text-sm text-ink-muted">{t.auth.demoNote}</p>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <label className="block">
        <span className="text-sm text-ink-muted">{t.auth.email}</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gold/40 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="text-sm text-ink-muted">{t.auth.password}</span>
        <input
          type="password"
          required
          minLength={4}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border border-gold/40 px-3 py-2"
        />
      </label>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? t.cart.processing : t.auth.submitLogin}
      </Button>
      <p className="text-center text-sm">
        <Link href="/register" className="text-terracotta hover:underline">
          {t.auth.noAccount}
        </Link>
      </p>
    </form>
  );
}
