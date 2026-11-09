import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { grantAccess } from "@/lib/grantAccess";
import { grantPaidEnrollment } from "@/lib/enrollmentPayments";
import { applyPaidInvoice, notifyFailedInvoice, syncSubscriptionState } from "@/lib/subscriptionPayments";

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

  // Месечните абонаменти с карта: всяко платено/неуспешно таксуване и спиране.
  try {
    switch (event.type) {
      case "invoice.paid":
        await applyPaidInvoice(event.data.object as Stripe.Invoice);
        return NextResponse.json({ ok: true });
      case "invoice.payment_failed":
        await notifyFailedInvoice(event.data.object as Stripe.Invoice);
        return NextResponse.json({ ok: true });
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscriptionState(event.data.object as Stripe.Subscription);
        return NextResponse.json({ ok: true });
    }
  } catch (err) {
    console.error(`Subscription webhook ${event.type} failed:`, err);
    // 500 → Stripe опитва отново; обработката е идемпотентна.
    return NextResponse.json({ error: "subscription_failed" }, { status: 500 });
  }

  if (event.type !== "checkout.session.completed") {
    // Not an event we care about — ack so Stripe doesn't retry.
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Абонаментът се активира от `invoice.paid`, който Stripe праща отделно.
  if (session.metadata?.kind === "subscription") {
    return NextResponse.json({ ok: true });
  }

  // Заявки за наръчници, книги, обучения и live курсове (плащане с карта).
  if (session.metadata?.kind === "enrollment") {
    try {
      await grantPaidEnrollment(session);
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("grantPaidEnrollment failed in webhook:", err);
      // 500 → Stripe опитва отново; отключването е идемпотентно.
      return NextResponse.json({ error: "grant_failed", detail: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }
  }

  const courseId = session.metadata?.courseId;
  const buyerEmail = (session.customer_email || session.metadata?.buyerEmail || "").trim().toLowerCase();
  const amountPaidEur = (session.amount_total || 0) / 100;

  if (!courseId || !buyerEmail) {
    console.error("Webhook missing courseId/email on session", session.id);
    return NextResponse.json({ ok: true, ignored: "missing_metadata" });
  }

  try {
    await grantAccess({
      courseId,
      buyerEmail,
      stripeSessionId: session.id,
      amountPaidEur,
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("grantAccess failed in webhook:", err);
    // Return 500 so Stripe retries — eventual delivery is fine since it's idempotent.
    return NextResponse.json({ error: "grant_failed", detail: err?.message }, { status: 500 });
  }
}
