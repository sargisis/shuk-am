import type { Category } from "@/types";

export const TELEGRAM_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "https://t.me/shuk_am";

export const CATEGORY_ICONS: Record<Category, string> = {
  food: "🍯",
  crafts: "🏺",
  clothing: "🧶",
  home: "🏠",
};

export const CATEGORY_STYLES: Record<
  Category,
  { gradient: string; ring: string }
> = {
  food: {
    gradient: "from-amber-50 via-orange-50 to-amber-100/80",
    ring: "ring-amber-200/60",
  },
  crafts: {
    gradient: "from-stone-50 via-amber-50/50 to-orange-50",
    ring: "ring-stone-200/60",
  },
  clothing: {
    gradient: "from-rose-50 via-orange-50/40 to-cream",
    ring: "ring-rose-200/50",
  },
  home: {
    gradient: "from-emerald-50/80 via-cream to-amber-50/60",
    ring: "ring-emerald-200/40",
  },
};

export const PRICE_STEPS = [5000, 10000, 20000, 50000] as const;
