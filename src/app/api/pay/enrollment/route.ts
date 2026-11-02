import { NextRequest, NextResponse } from "next/server";
import { CARD_PAYMENTS_ENABLED, createEnrollmentCheckout } from "@/lib/enrollmentPayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/pay/enrollment
 * Body: { enrollmentId: string; returnPath?: string }
 * Returns: { url } — Stripe Checkout (карта, Apple Pay, Google Pay).
 *
 * Цената се изчислява на сървъра от каталога, а платеното отключва
 * имейла от заявката — затова не е нужен вход.
 */
export async function POST(req: NextRequest) {
  if (!CARD_PAYMENTS_ENABLED()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const enrollmentId = String(body?.enrollmentId || "");
    const returnPath = String(body?.returnPath || "/profile");
    if (!/^[A-Za-z0-9_-]{6,80}$/.test(enrollmentId)) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }
    const url = await createEnrollmentCheckout(enrollmentId, returnPath);
    return NextResponse.json({ url });
  } catch (err) {
    const code = err instanceof Error ? err.message : String(err);
    const status = code === "enrollment_not_found" || code === "product_not_found" ? 404 : code === "already_paid" ? 409 : 500;
    if (status === 500) console.error("Enrollment checkout error:", err);
    return NextResponse.json({ error: status === 500 ? "stripe_failed" : code }, { status });
  }
}
