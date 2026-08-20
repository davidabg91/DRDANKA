import type { ReactNode } from "react";

/**
 * A "ready" material — pre-recorded or pre-written content the buyer
 * receives immediately after payment.
 *
 * Each material lives in its own .tsx file under src/data/library/ and can
 * provide a fully custom React component for its detail page — that's how
 * we keep every course visually distinct.
 */
export type LibraryMaterialType = "pdf" | "video";

export interface LibraryMaterial {
  /** URL slug. Used in /library/<slug>. */
  slug: string;
  /** Card title. */
  title: string;
  /** Short tagline shown on the catalog card. */
  tagline: string;
  /** Price in EUR. */
  priceEur: number;
  /** Original price before discount (optional) */
  originalPriceEur?: number;
  /** Delivery format. */
  type: LibraryMaterialType;
  /** Logical category for the UI separation (trainings vs documents). */
  category?: "training" | "document";
  /** External URL the buyer receives after payment (Google Drive PDF, Vimeo, etc.). */
  contentUrl: string;
  /**
   * Optional direct download link (e.g. Google Drive) delivered to the buyer
   * AFTER payment, shown only inside the protected profile. Use this for PDF
   * products that are hosted externally instead of Firebase Storage. Never
   * rendered on the public sales page.
   */
  downloadUrl?: string;
  /** Optional post-purchase bonus file, delivered alongside downloadUrl. */
  bonus?: {
    title: string;
    url: string;
  };
  /** Catalog card visuals. */
  card: {
    /** Path to cover image in /public, or an absolute URL. */
    cover?: string;
    /** Optional 'Хит' / 'Ново' / 'Бестселър' label. */
    badge?: string;
    /** Accent color slot — gold or green dominates. */
    accent?: "gold" | "green";
  };
  /** Custom React component for the /library/<slug> detail page. */
  page: () => ReactNode;
  /** Optional: meta description for SEO. */
  metaDescription?: string;
  /**
   * Optional: <title> override, when the product's display name is not what a
   * buyer would search for. Falls back to `title`. Use it when the marketing
   * name omits the subject — a card can rely on its cover image and tagline for
   * context, a search result cannot.
   */
  seoTitle?: string;
}
