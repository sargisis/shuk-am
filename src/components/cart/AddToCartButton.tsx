"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useLocale } from "@/components/providers/LocaleProvider";

export function AddToCartButton({
  productId,
  className = "",
  variant = "primary",
}: {
  productId: string;
  className?: string;
  variant?: "primary" | "compact";
}) {
  const { addItem } = useCart();
  const { t } = useLocale();
  const [added, setAdded] = useState(false);

  const base =
    variant === "compact"
      ? "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
      : "rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors";

  return (
    <button
      type="button"
      className={`${base} ${
        added
          ? "bg-ink/10 text-ink"
          : "bg-wheat text-ink hover:bg-gold/50 border border-gold/40"
      } ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(productId);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
    >
      {added ? "✓" : t.product.addToCart}
    </button>
  );
}
