export function formatPrice(amount: number, locale: "hy" | "ru" = "ru") {
  return new Intl.NumberFormat(locale === "hy" ? "hy-AM" : "ru-RU", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount);
}
