import { NextResponse } from "next/server";
import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/payments/config";
import { createAdminClient, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature", err);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (orderId && isSupabaseAdminConfigured()) {
      const admin = createAdminClient();
      const { error } = await admin
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);

      if (error) {
        console.error("[stripe/webhook] update order", orderId, error);
        return NextResponse.json({ error: "order_update_failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
