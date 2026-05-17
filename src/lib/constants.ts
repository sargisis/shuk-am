import type { Category } from "@/types";

export const TELEGRAM_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "https://t.me/shuk_am";

export const CATEGORY_ICONS: Record<Category, string> = {
  food: "🍯",
  crafts: "🏺",
  clothing: "🧶",
  home: "🏠",
};

export const PRICE_STEPS = [5000, 10000, 20000, 50000] as const;
