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
  title: string;
  /** Short tagline / hero description shown on the catalog card. */
  shortDesc: string;
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
  trainingType?: TrainingType;
  /** For video trainings — denormalized URL captured at enrollment time so the
   *  buyer keeps access even if admin later removes the URL from the training. */
  videoUrl?: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  priceEur: number;
  /** 'paid' immediately after a successful (test or Stripe) payment. */
  status: "pending" | "paid" | "contacted" | "completed" | "refunded";
  paidAt?: string;
  createdAt: string;
  /** Admin can flag that they've already contacted the buyer (for zoom courses). */
  contactedAt?: string;
}
