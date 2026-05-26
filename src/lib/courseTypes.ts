/**
 * Types for the Digital Bookstore feature.
 *
 * Stored in Firestore at:
 *   /courses/{courseId}     — catalog (public read)
 *   /purchases/{purchaseId} — paid orders (admin-only read; clients see their
 *                              own access via /users/{email}.purchasedCourseIds)
 */

/**
 * Course delivery format:
 *   - 'pdf': PDF file uploaded to Firebase Storage, viewed in our protected
 *            viewer at /courses/[id]/viewer.
 *   - 'link': external URL (YouTube, custom learning platform, etc.) — the
 *            buyer is redirected to it from their portal.
 */
export type CourseType = "pdf" | "link";

export interface Course {
  id: string;
  title: string;
  /** Short tagline shown on the catalog card. */
  description: string;
  /** Optional long markdown-like description for the detail page. */
  longDescription?: string;
  /** Price in EUR. Stored as a number, e.g. 24.90. */
  priceEur: number;
  /** Optional cover image URL (public). */
  coverImageUrl?: string;
  /** Format of the course content. Missing on legacy docs → treat as 'pdf'. */
  type?: CourseType;
  /** Storage path of the PDF, e.g. "courses/<id>/file.pdf". Required when type='pdf'. */
  filePath?: string;
  /** Size in MB at upload time — informational, only for type='pdf'. */
  fileSizeMb?: number;
  /** External course URL. Required when type='link'. */
  externalUrl?: string;
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
  amountPaidEur: number;
  status: PurchaseStatus;
  paidAt?: string;
  createdAt: string;
}
