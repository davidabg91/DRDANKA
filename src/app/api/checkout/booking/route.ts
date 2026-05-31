import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/checkout/booking
 * Body: { packageName: string; priceEur: number; buyerEmail: string; returnUrl: string }
 * Returns: { url: string } — Stripe Checkout Session URL for redirect.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const packageName = String(body?.packageName || "");
    const priceEur = Number(body?.priceEur || 0);
    const buyerEmail = String(body?.buyerEmail || "").trim().toLowerCase();
    const returnUrl = String(body?.returnUrl || "");

    if (!packageName || priceEur <= 0 || !buyerEmail || !returnUrl || !/^[^@]+@[^@]+\.[^@]+$/.test(buyerEmail)) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      // Ако липсва Stripe ключ, връщаме примерен (мокап) URL за успех,
      // за да може потребителят да тества потока.
      return NextResponse.json({ 
        mockStripe: true,
        url: `${returnUrl}?session_id=mock_session_${Date.now()}` 
      });
    }

    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(priceEur * 100),
            product_data: {
              name: packageName,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "booking",
        packageName,
        buyerEmail,
      },
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Booking checkout error:", err);
    return NextResponse.json(
      { error: "stripe_failed", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
