import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { grantAccess } from "@/lib/grantAccess";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/checkout/verify
 * Body: { sessionId: string }
 *
 * Belt-and-suspenders companion to the Stripe webhook. The success page calls
 * this on load so the buyer gets immediate confirmation even if Stripe's
 * webhook delivery is still in flight. grantAccess is idempotent.
 */
export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ error: "missing_session_id" }, { status: 400 });
    }

    const session = await stripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { paid: false, status: session.payment_status },
        { status: 200 }
      );
    }

    const courseId = session.metadata?.courseId;
    const buyerEmail = (session.customer_email || session.metadata?.buyerEmail || "").trim().toLowerCase();
    if (!courseId || !buyerEmail) {
      return NextResponse.json({ error: "missing_metadata" }, { status: 500 });
    }

    const result = await grantAccess({
      courseId,
      buyerEmail,
      stripeSessionId: session.id,
      amountPaidEur: (session.amount_total || 0) / 100,
    });

    return NextResponse.json({
      paid: true,
      buyerEmail,
      courseId,
      alreadyGranted: result.alreadyGranted,
    });
  } catch (err: any) {
    console.error("Verify error:", err);
    return NextResponse.json(
      { error: "verify_failed", detail: err?.message },
      { status: 500 }
    );
  }
}
