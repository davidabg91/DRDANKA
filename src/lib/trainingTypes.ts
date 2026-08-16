/**
 * Types for Specialized Trainings (online courses with certificate).
 *
 * Stored in Firestore at:
 *   /trainings/{trainingId}     — catalog (public read)
 *   /enrollments/{enrollmentId} — paid enrollments (public create, admin read)
 */

export type TrainingType = "video" | "zoom";

export interface Training {
  id: string;
  /** Human-readable URL slug (Cyrillic transliterated). Used in /trainings/<slug>. */
  slug?: string;
  title: string;
  /** Short tagline / hero description shown on the catalog card. */
  shortDesc: string;
  /** Optional long description (paragraphs) for the detail page. */
  longDescription?: string;
  /** Up to ~5 short feature bullets. */
  bullets: string[];
  /** Price in EUR. */
  priceEur: number;
  /**
   * Delivery format:
   *   - 'video': pre-recorded; buyer receives videoUrl after payment.
   *   - 'zoom':  live session; admin contacts buyer to schedule.
   */
  type: TrainingType;
  /** Required when type='video'. The URL the buyer can use to watch (e.g. YouTube, Vimeo, private). */
  videoUrl?: string;
  /** Optional cover image URL (Firebase Storage). Public — anyone browsing the catalog can see it. */
  coverImageUrl?: string;
  /** When true, certificate is issued by Dr. Danka after the trainee passes
   *  all assigned tests in the Client Portal. */
  hasCertificate: boolean;
  /** Hide from public catalog without losing existing enrollments. */
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  trainingId: string;
  trainingTitle: string;
  /** Legacy delivery hint. 'library' marks a request that came from the digital
   *  bookstore rather than the /trainings catalog. Prefer packageKind below. */
  trainingType?: TrainingType | "library" | "consultation";
  /** Which catalog the purchased package belongs to. */
  packageKind?: "library" | "training" | "consultation";
  /** Content format the buyer will read/watch once unlocked. */
  contentType?: "pdf" | "video";
  /** Selected meeting date and time for consultations. */
  date?: string;
  time?: string;
  duration?: string;
  note?: string;
  /** For video trainings — denormalized URL captured at enrollment time so the
   *  buyer keeps access even if admin later removes the URL from the training. */
  videoUrl?: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  priceEur: number;
  /**
   * Purchase lifecycle:
   *   - 'awaiting_payment' — buyer registered & requested access; funds not yet in.
   *   - 'access_granted'   — admin confirmed the bank transfer and unlocked the
   *                          package (added trainingId to purchasedCourseIds).
   *   Legacy values ('pending'/'paid'/'contacted'/'completed'/'refunded') are
   *   kept for older docs and the zoom "mark contacted" flow.
   */
  status: "awaiting_payment" | "access_granted" | "pending" | "paid" | "contacted" | "completed" | "refunded" | "confirmed" | "cancelled";
  paidAt?: string;
  /** Timestamp when admin confirmed payment and unlocked the package. */
  accessGrantedAt?: string;
  createdAt: string;
  /** Admin can flag that they've already contacted the buyer (for zoom courses). */
  contactedAt?: string;
}
