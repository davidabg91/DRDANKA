import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "./firebaseAdmin";
import { Purchase } from "./courseTypes";

/**
 * Idempotent: creates a Purchase doc, adds courseId to the buyer's
 * purchasedCourseIds, and (if no Firebase Auth account exists for the email
 * yet) creates one with a random password + generates a password-reset link
 * the caller can email out.
 *
 * Safe to call from both the Stripe webhook AND the success-page verifier —
 * the stripeSessionId is used as the purchase doc id, so duplicate calls are
 * no-ops.
 */
export async function grantAccess(input: {
  courseId: string;
  buyerEmail: string;
  stripeSessionId: string;
  amountPaidEur: number;
}): Promise<{ purchaseId: string; alreadyGranted: boolean; signInLink?: string }> {
  const email = input.buyerEmail.trim().toLowerCase();
  const purchaseId = input.stripeSessionId;
  const db = adminDb();
  const purchaseRef = db.collection("purchases").doc(purchaseId);

  // Already processed? short-circuit.
  const existing = await purchaseRef.get();
  if (existing.exists && (existing.data() as any)?.status === "paid") {
    return { purchaseId, alreadyGranted: true };
  }

  // Verify course exists.
  const courseSnap = await db.collection("courses").doc(input.courseId).get();
  if (!courseSnap.exists) {
    throw new Error(`Course not found: ${input.courseId}`);
  }

  const now = new Date().toISOString();
  const purchase: Purchase = {
    id: purchaseId,
    courseId: input.courseId,
    buyerEmail: email,
    stripeSessionId: input.stripeSessionId,
    amountPaidEur: input.amountPaidEur,
    status: "paid",
    paidAt: now,
    createdAt: now,
  };
  await purchaseRef.set(purchase, { merge: true });

  // Ensure a Firebase Auth account exists for the buyer.
  let signInLink: string | undefined;
  try {
    await adminAuth().getUserByEmail(email);
    // existing account — no need to send a new password setup
  } catch {
    // Create new account with a random password.
    const tempPassword = "tmp-" + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12);
    try {
      await adminAuth().createUser({
        email,
        password: tempPassword,
        emailVerified: true,
      });
      signInLink = await adminAuth().generatePasswordResetLink(email);
    } catch (err: any) {
      console.error("Failed to create auth account for buyer:", err);
    }
  }

  // Add courseId to user's purchasedCourseIds (create user doc if missing).
  const userRef = db.collection("users").doc(email);
  const userSnap = await userRef.get();
  if (userSnap.exists) {
    await userRef.update({
      purchasedCourseIds: FieldValue.arrayUnion(input.courseId),
    });
  } else {
    // Minimal user doc — most business fields empty for bookstore-only buyers.
    await userRef.set({
      email,
      firmName: "",
      eik: "",
      contact: "",
      phone: "",
      niche: "",
      desc: "",
      address: "",
      manager: "",
      status: "approved",
      subscriptionStatus: "none",
      role: "user",
      assignedDocs: [],
      messages: [],
      purchasedCourseIds: [input.courseId],
    });
  }

  return { purchaseId, alreadyGranted: false, signInLink };
}
