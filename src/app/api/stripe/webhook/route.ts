import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { grantPaidEnrollment, revokeRefundedEnrollment } from "@/lib/enrollmentPayments";
import { applyPaidInvoice, notifyFailedInvoice, syncSubscriptionState } from "@/lib/subscriptionPayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/webhook
 *
 * Stripe calls this endpoint after a payment finishes. We verify the signature
 * with STRIPE_WEBHOOK_SECRET, then unlock what was paid for. Every handler is
 * idempotent (keyed by the session / invoice id), so redeliveries are no-ops.
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

  // Месечните абонаменти (платено/неуспешно таксуване, спиране) и възстановени плащания.
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
      case "charge.refunded":
        // Изцяло възстановено плащане за пакет → достъпът се спира.
        await revokeRefundedEnrollment(event.data.object as Stripe.Charge);
        return NextResponse.json({ ok: true });
    }
  } catch (err) {
    console.error(`Stripe webhook ${event.type} failed:`, err);
    // 500 → Stripe опитва отново; обработката е идемпотентна.
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  // Плащане, което се потвърждава по-късно (напр. банково нареждане през Stripe),
  // идва като async_payment_succeeded — отключва се по същия начин.
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
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

  return NextResponse.json({ ok: true, ignored: "unknown_kind" });
}
