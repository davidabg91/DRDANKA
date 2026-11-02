import { NextResponse } from "next/server";
import { CARD_PAYMENTS_ENABLED } from "@/lib/enrollmentPayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/pay/config — дали плащането с карта е включено (има Stripe ключ). */
export async function GET() {
  return NextResponse.json({ cardPayments: CARD_PAYMENTS_ENABLED() });
}
