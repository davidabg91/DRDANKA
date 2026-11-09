import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { CARD_PAYMENTS_ENABLED, grantPaidEnrollment } from "@/lib/enrollmentPayments";
import { applySubscriptionCheckout } from "@/lib/subscriptionPayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/pay/status?session_id=cs_...
 * Проверява плащането директно в Stripe и (ако е платено) отключва веднага —
 * без да чака webhook-а. Безопасно е да се вика многократно.
 */
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id") || "";
  if (!CARD_PAYMENTS_ENABLED()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    if (session.metadata?.kind === "subscription") {
      // Без плащане сега = първото таксуване е в края на вече платения месец.
      if (session.status !== "complete") return NextResponse.json({ paid: false, status: session.status });
      const granted = await applySubscriptionCheckout(session);
      if (!granted && session.payment_status === "paid") return NextResponse.json({ paid: false, status: "processing" });
      return NextResponse.json({
        paid: true,
        subscription: true,
        deferred: session.payment_status === "no_payment_required",
        title: granted?.title ?? null,
        href: "/profile",
        amountEur: (session.amount_total || 0) / 100,
      });
    }
    if (session.payment_status !== "paid") {
      return NextResponse.json({ paid: false, status: session.status });
    }
    const granted = await grantPaidEnrollment(session);
    return NextResponse.json({
      paid: true,
      title: granted?.title ?? null,
      href: granted?.href ?? "/profile",
      amountEur: (session.amount_total || 0) / 100,
    });
  } catch (err) {
    console.error("Payment status error:", err);
    return NextResponse.json({ error: "status_failed" }, { status: 500 });
  }
}
