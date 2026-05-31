import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/subscription/test-pay
 * Body: { email: string }
 *
 * Secure server-side mock payment processing. Since firestore.rules prevents
 * non-admins from changing subscriptionStatus or expiresAt, this route performs
 * the update on the server using the Admin SDK after basic validations.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const db = adminDb();
    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json({ error: "user_not_found" }, { status: 404 });
    }

    const userData = userSnap.data();
    if (userData?.role !== "user") {
      return NextResponse.json({ error: "unauthorized_role" }, { status: 403 });
    }

    // Auto-calculate expiry date: exactly 1 year (365 days) from now
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    const expiresAt = oneYearFromNow.toISOString().split("T")[0]; // YYYY-MM-DD

    const updates = {
      subscriptionStatus: "approved",
      subscriptionPaidAt: new Date().toISOString(),
      expiresAt,
    };

    await userRef.update(updates);

    return NextResponse.json({ success: true, expiresAt });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Test pay API error:", err);
    return NextResponse.json(
      { error: "server_error", detail: errorMsg },
      { status: 500 }
    );
  }
}
