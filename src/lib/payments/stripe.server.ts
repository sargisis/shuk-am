import Stripe from "stripe";
import {
  amdToStripeUnitAmount,
  getSiteUrl,
  getStripeCurrency,
  isStripeConfigured,
} from "./config";
import type { ResolvedCartLine } from "./resolve-cart";
import type { Locale } from "@/types";

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return stripeClient;
}

export async function createStripeCheckoutSession(
  lines: ResolvedCartLine[],
  locale: Locale,
  orderId?: string,
): Promise<string> {
  const stripe = getStripe();
  const siteUrl = getSiteUrl();
  const currency = getStripeCurrency();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: locale === "hy" ? "auto" : "ru",
    line_items: lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency,
        unit_amount: amdToStripeUnitAmount(line.product.price),
        product_data: {
          name: line.product.name[locale],
          description: line.product.description[locale],
          images: [line.product.image],
        },
      },
    })),
    metadata: {
      source: "shuk-am",
      order_id: orderId ?? "",
      product_ids: lines.map((l) => l.product.id).join(","),
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  return session.url;
}
