"use client";

import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { submitApplication } from "@/lib/db/applications";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types";

export function SellerApplicationForm() {
  const { t } = useLocale();
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<Category>("crafts");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitApplication({ name, email, phone, category, message });
    setDone(true);
  }

  if (done) {
    return (
      <p className="mt-8 rounded-xl bg-terracotta/10 px-4 py-3 text-center text-sm font-medium text-terracotta">
        {t.sell.formSuccess}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-3 rounded-2xl border border-gold/25 bg-cream p-6 text-left"
    >
      <h2 className="font-semibold text-ink">{t.sell.formTitle}</h2>
      <input
        required
        placeholder={t.auth.name}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-xl border border-gold/40 px-3 py-2 text-sm"
      />
      <input
        type="email"
        required
        placeholder={t.auth.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-xl border border-gold/40 px-3 py-2 text-sm"
      />
      <input
        required
        placeholder={t.auth.phone}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-xl border border-gold/40 px-3 py-2 text-sm"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        className="w-full rounded-xl border border-gold/40 px-3 py-2 text-sm"
      >
        {(["food", "crafts", "clothing", "home"] as Category[]).map((c) => (
          <option key={c} value={c}>
            {t.categoryLabels[c]}
          </option>
        ))}
      </select>
      <textarea
        placeholder={t.sell.message}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded-xl border border-gold/40 px-3 py-2 text-sm"
        rows={3}
      />
      <Button type="submit" className="w-full">
        {t.sell.formSubmit}
      </Button>
    </form>
  );
}
