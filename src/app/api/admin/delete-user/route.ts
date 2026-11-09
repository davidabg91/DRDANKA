import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Същите администратори като `isAdmin()` във firestore.rules. */
const ADMIN_EMAILS = ["d.nikolova.haccp@gmail.com", "davida1991@gmail.com", "davidabg91@gmail.com"];

/**
 * POST /api/admin/delete-user  (Authorization: Bearer <Firebase ID token на админ>)
 * Body: { email: string }
 *
 * Изтрива клиента изцяло: профила (`users/{email}`), входа му (Firebase Auth)
 * и автоматичното месечно плащане в Stripe. Само профилът не стига — останал
 * вход без профил не може да се регистрира наново, а покупките му няма къде
 * да се запишат. Заявките и плащанията остават за отчетността.
 */
export async function POST(req: NextRequest) {
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

  const db = adminDb();
  const isAdmin = ADMIN_EMAILS.includes(caller) || (await db.collection("users").doc(caller).get()).data()?.role === "admin";
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "missing_email" }, { status: 400 });
  if (email === caller || ADMIN_EMAILS.includes(email)) return NextResponse.json({ error: "cannot_delete_admin" }, { status: 400 });

  try {
    const userRef = db.collection("users").doc(email);
    const subscriptionId = (await userRef.get()).data()?.stripeSubscriptionId as string | undefined;
    if (subscriptionId && process.env.STRIPE_SECRET_KEY) {
      // Иначе картата на изтрития клиент продължава да се таксува всеки месец.
      await stripe().subscriptions.cancel(subscriptionId).catch((err) => {
        if (err?.code !== "resource_missing") throw err;
      });
    }
    await userRef.delete();
    const account = await adminAuth().getUserByEmail(email).catch(() => null);
    if (account) await adminAuth().deleteUser(account.uid);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("delete-user failed:", err);
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }
}
