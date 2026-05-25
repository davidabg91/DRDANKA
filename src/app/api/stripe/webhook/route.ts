import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { grantAccess } from "@/lib/grantAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/webhook
 *
 * Stripe calls this endpoint after a payment finishes. We verify the signature
 * with STRIPE_WEBHOOK_SECRET, then grant access. Idempotent — grantAccess uses
 * the session id as the purchase doc id, so duplicate deliveries are no-ops.
 */
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const raw = await req.text(); // raw body needed for signature verify
    event = stripe().webhooks.constructEvent(raw, sig, STRIPE_WEBHOOK_SECRET());
  } catch (err: any) {
    console.error("Stripe webhook verify failed:", err.message);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Not an event we care about — ack so Stripe doesn't retry.
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const courseId = session.metadata?.courseId;
  const buyerEmail = (session.customer_email || session.metadata?.buyerEmail || "").trim().toLowerCase();
  const amountPaidBgn = (session.amount_total || 0) / 100;

  if (!courseId || !buyerEmail) {
    console.error("Webhook missing courseId/email on session", session.id);
    return NextResponse.json({ ok: true, ignored: "missing_metadata" });
  }

  try {
    await grantAccess({
      courseId,
      buyerEmail,
      stripeSessionId: session.id,
      amountPaidBgn,
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("grantAccess failed in webhook:", err);
    // Return 500 so Stripe retries — eventual delivery is fine since it's idempotent.
    return NextResponse.json({ error: "grant_failed", detail: err?.message }, { status: 500 });
  }
}
