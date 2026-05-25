/**
 * Types for the Digital Bookstore feature.
 *
 * Stored in Firestore at:
 *   /courses/{courseId}     — catalog (public read)
 *   /purchases/{purchaseId} — paid orders (admin-only read; clients see their
 *                              own access via /users/{email}.purchasedCourseIds)
 */

export interface Course {
  id: string;
  title: string;
  /** Short tagline shown on the catalog card. */
  description: string;
  /** Optional long markdown-like description for the detail page. */
  longDescription?: string;
  /** Price in Bulgarian leva (BGN). Stored as a number, e.g. 49.90. */
  priceBgn: number;
  /** Optional cover image URL (public). */
  coverImageUrl?: string;
  /** Storage path of the PDF, e.g. "courses/<id>/file.pdf". */
  filePath: string;
  /** Size in MB at upload time — informational. */
  fileSizeMb: number;
  /** If false, hidden from the public catalog but existing buyers still keep access. */
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PurchaseStatus = "pending" | "paid" | "refunded";

export interface Purchase {
  id: string;
  courseId: string;
  /** Always lowercased — same key used to read /users/{email}. */
  buyerEmail: string;
  /** Stripe Checkout Session id. Doubles as idempotency key. */
  stripeSessionId: string;
  amountPaidBgn: number;
  status: PurchaseStatus;
  paidAt?: string;
  createdAt: string;
}
