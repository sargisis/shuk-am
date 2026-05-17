import type { PaymentProviderId } from "@/types/cart";

function isStripeSecretKey(key: string | undefined) {
  return Boolean(key?.startsWith("sk_") || key?.startsWith("rk_"));
}

export function isStripeConfigured() {
  return Boolean(
    isStripeSecretKey(process.env.STRIPE_SECRET_KEY) &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_"),
  );
}

export function getStripeCurrency() {
  return (process.env.STRIPE_CURRENCY ?? "usd").toLowerCase();
}

/** Demo: AMD → USD for Stripe test (set STRIPE_AMD_PER_USD=400). */
export function amdToStripeUnitAmount(amdPrice: number): number {
  const currency = getStripeCurrency();
  if (currency === "amd") {
    return Math.round(amdPrice);
  }
  const rate = Number(process.env.STRIPE_AMD_PER_USD ?? 400);
  const usd = amdPrice / rate;
  return Math.max(50, Math.round(usd * 100));
}

export function getEnabledProviders(): PaymentProviderId[] {
  const providers: PaymentProviderId[] = ["telegram"];
  if (isStripeConfigured()) {
    providers.unshift("stripe");
  }
  return providers;
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
