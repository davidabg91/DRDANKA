import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { syncPaidAccess } from "@/lib/enrollmentPayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/pay/sync-access  (Authorization: Bearer <Firebase ID token>)
 * Довършва отключването на платеното с карта за влезлия потребител — за
 * плащания, минали преди профилът му да съществува. Безопасно е многократно.
 */
export async function POST(req: NextRequest) {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  let email: string;
  try {
    const decoded = await adminAuth().verifyIdToken(token);
    if (!decoded.email) throw new Error("no_email");
    email = decoded.email.toLowerCase();
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json({ added: await syncPaidAccess(email) });
  } catch (err) {
    console.error("sync-access failed:", err);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}
