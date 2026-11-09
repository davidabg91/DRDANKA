import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { CARD_PAYMENTS_ENABLED } from "@/lib/enrollmentPayments";
import { createSubscriptionCheckout, setAutoRenew, syncSubscription } from "@/lib/subscriptionPayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/pay/subscription  (Authorization: Bearer <Firebase ID token>)
 * Body: { action: "checkout" | "sync" | "cancel" | "resume"; email?: string }
 *
 *   checkout — Stripe Checkout за автоматично месечно плащане → { url }
 *   sync     — след смяна на плана/обектите: сумата в Stripe = профила → { synced }
 *   cancel   — спира автоматичното таксуване от следващия месец
 *   resume   — пуска го отново
 *
 * Клиентът действа само за своя профил; админът може да подаде `email` за sync.
 */
export async function POST(req: NextRequest) {
  if (!CARD_PAYMENTS_ENABLED()) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  let caller: string;
  try {
    const decoded = await adminAuth().verifyIdToken(token);
    if (!decoded.email) throw new Error("no_email");
    caller = decoded.email.toLowerCase();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const action = String(body?.action || "");
  let email = caller;
  const target = String(body?.email || "").trim().toLowerCase();
  if (target && target !== caller) {
    const me = await adminDb().collection("users").doc(caller).get();
    if (action !== "sync" || me.data()?.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });
    email = target;
  }

  try {
    switch (action) {
      case "checkout":
        return NextResponse.json({ url: await createSubscriptionCheckout(email) });
      case "sync":
        return NextResponse.json({ synced: await syncSubscription(email) });
      case "cancel":
      case "resume":
        return NextResponse.json({ ok: await setAutoRenew(email, action === "resume") });
      default:
        return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }
  } catch (err) {
    const code = err instanceof Error ? err.message : String(err);
    if (code === "already_subscribed") return NextResponse.json({ error: code }, { status: 409 });
    if (code === "user_not_found") return NextResponse.json({ error: code }, { status: 404 });
    console.error("Subscription payment error:", err);
    return NextResponse.json({ error: "stripe_failed" }, { status: 500 });
  }
}
