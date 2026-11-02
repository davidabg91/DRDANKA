import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { CARD_PAYMENTS_ENABLED, grantPaidEnrollment } from "@/lib/enrollmentPayments";

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
    if (session.payment_status !== "paid") {
      return NextResponse.json({ paid: false, status: session.status });
    }
    const granted = await grantPaidEnrollment(session);
    return NextResponse.json({ paid: true, title: granted?.title ?? null, href: granted?.href ?? "/profile" });
  } catch (err) {
    console.error("Payment status error:", err);
    return NextResponse.json({ error: "status_failed" }, { status: 500 });
  }
}
