import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { stripe } from "@/lib/stripe";
import { Course } from "@/lib/courseTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/checkout
 * Body: { courseId: string; buyerEmail: string }
 * Returns: { url: string } — Stripe Checkout Session URL for redirect.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const courseId = String(body?.courseId || "");
    const buyerEmail = String(body?.buyerEmail || "").trim().toLowerCase();

    if (!courseId || !buyerEmail || !/^[^@]+@[^@]+\.[^@]+$/.test(buyerEmail)) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const courseSnap = await adminDb().collection("courses").doc(courseId).get();
    if (!courseSnap.exists) {
      return NextResponse.json({ error: "course_not_found" }, { status: 404 });
    }
    const course = courseSnap.data() as Course;
    if (!course.published) {
      return NextResponse.json({ error: "course_unpublished" }, { status: 403 });
    }

    const origin = req.headers.get("origin") || req.nextUrl.origin;

    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(course.priceEur * 100),
            product_data: {
              name: course.title,
              description: course.description.slice(0, 250),
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId,
        buyerEmail,
      },
      success_url: `${origin}/courses/${courseId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/courses/${courseId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "stripe_failed", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}
