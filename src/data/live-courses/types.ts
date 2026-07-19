import type { ComponentType, ReactNode, SVGProps } from "react";

/**
 * A live course — held over Zoom / Google Meet when a group forms.
 *
 * Buyer enters the /enrollments queue; Dr. Danka contacts them with the
 * scheduled date once enough people have signed up.
 *
 * Each course is hardcoded under src/data/live-courses/ and may provide
 * a custom React component for its detail page.
 */
export type LiveCoursePlatform = "zoom" | "google-meet";

export interface LiveCourse {
  /** URL slug. Used in /live/<slug>. */
  slug: string;
  title: string;
  /** Short tagline shown on the catalog card. */
  tagline: string;
  /** Price in EUR — charged when group is confirmed. */
  priceEur: number;
  /** Original price before promo (shown crossed out if present) */
  originalPriceEur?: number;
  /** Live platform. */
  platform: LiveCoursePlatform;
  /** Issues an official certificate after portal tests are passed. */
  hasCertificate: boolean;
  /** Catalog card visuals. */
  card: {
    cover?: string;
    badge?: string;
    accent?: "gold" | "green";
    /** Икона за карти без корица — рендира се в информационния панел вместо снимка. */
    icon?: ComponentType<SVGProps<SVGSVGElement>>;
  };
  /** Estimated session count + duration (e.g. "3 сесии × 90 мин."). */
  format?: string;
  /** Group size (e.g. "8–14 участници"). */
  groupSize?: string;
  /** Optional next-batch info shown on detail page. */
  nextBatch?: string;
  /** 2–4 кратки акцента, показани директно на картата в каталога (за курсове без корица). */
  highlights?: string[];
  /** Custom React component for the /live/<slug> detail page. */
  page: () => ReactNode;
  metaDescription?: string;
}
