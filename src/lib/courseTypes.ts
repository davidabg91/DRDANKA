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
export type CourseType = "pdf" | "link" | "video" | "multi";

export interface CourseMaterialItem {
  id: string;
  title: string;
  type: "video" | "pdf" | "link";
  /** Storage path in Firebase Storage, e.g. "courses/<id>/items/<itemId>.mp4" or ".pdf". */
  filePath?: string;
  /** File size in MB. */
  fileSizeMb?: number;
  /** External URL for YouTube/Vimeo/Drive or custom links. */
  externalUrl?: string;
  /** Optional duration or subtitle, e.g. "15:20 мин". */
  duration?: string;
  order: number;
}

export interface Course {
  id: string;
  /** Human-readable URL slug (Cyrillic transliterated). Used in /courses/<slug>. */
  slug?: string;
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
  /** Storage path of the PDF, e.g. "courses/<id>/file.pdf". Legacy single-file support. */
  filePath?: string;
  /** Size in MB at upload time — informational, only for type='pdf'. */
  fileSizeMb?: number;
  /** External course URL. Required when type='link'. */
  externalUrl?: string;
  /** Multiple lessons / videos / PDF handbooks belonging to this course. */
  items?: CourseMaterialItem[];
  /** If false, hidden from the public catalog but existing buyers still keep access. */
  published: boolean;
  deleted?: boolean;
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

/**
 * Smart matcher between in-code materials/slugs/titles and Firestore courses.
 * Resolves by exact id, exact slug, exact title, or semantic Bulgarian topic aliases.
 */
export function findMatchingCourse<T extends { id?: string; slug?: string; title?: string }>(
  target: T | undefined | null,
  courses: Course[] | undefined | null
): Course | undefined {
  if (!target || !courses || courses.length === 0) return undefined;
  const tSlug = (target.slug || "").toLowerCase().trim();
  const tId = (target.id || "").toLowerCase().trim();
  const tTitle = (target.title || "").toLowerCase().trim();

  // 1. Direct slug or id match
  for (const c of courses) {
    const cSlug = (c.slug || "").toLowerCase().trim();
    const cId = (c.id || "").toLowerCase().trim();
    if (tSlug && (cSlug === tSlug || cId === tSlug)) return c;
    if (tId && (cId === tId || cSlug === tId)) return c;
  }

  // 2. Exact title match (case-insensitive)
  if (tTitle) {
    for (const c of courses) {
      const cTitle = (c.title || "").toLowerCase().trim();
      if (cTitle && cTitle === tTitle) return c;
    }
  }

  // 3. Smart semantic match for HACCP / ДХПП / ДПХП / разработване
  const isHaccp =
    tSlug.includes("haccp") ||
    tTitle.includes("дхпп") ||
    tTitle.includes("дпхп") ||
    tTitle.includes("разработване");
  if (isHaccp) {
    for (const c of courses) {
      const cSlug = (c.slug || "").toLowerCase().trim();
      const cTitle = (c.title || "").toLowerCase().trim();
      if (
        cSlug.includes("haccp") ||
        cSlug.includes("razrabotvane") ||
        cTitle.includes("дхпп") ||
        cTitle.includes("дпхп") ||
        cTitle.includes("разработване")
      ) {
        return c;
      }
    }
  }

  // 4. Smart semantic match for Registration (Регистрация на обект)
  const isRegistracia = tSlug.includes("registracia") || tTitle.includes("регистрация");
  if (isRegistracia) {
    for (const c of courses) {
      const cSlug = (c.slug || "").toLowerCase().trim();
      const cTitle = (c.title || "").toLowerCase().trim();
      if (cSlug.includes("registracia") || cTitle.includes("регистрация")) {
        return c;
      }
    }
  }

  // 5. Smart semantic match for Bible parts
  if (tTitle.includes("библия") || tSlug.includes("biblia")) {
    for (const c of courses) {
      const cSlug = (c.slug || "").toLowerCase().trim();
      const cTitle = (c.title || "").toLowerCase().trim();
      if (cTitle.includes("библия") || cSlug.includes("biblia")) {
        if ((tTitle.includes("част 1") || tSlug.includes("chast-1")) && (cTitle.includes("част 1") || cSlug.includes("chast-1"))) return c;
        if ((tTitle.includes("част 2") || tSlug.includes("chast-2")) && (cTitle.includes("част 2") || cSlug.includes("chast-2"))) return c;
        if ((tTitle.includes("част 3") || tSlug.includes("chast-3")) && (cTitle.includes("част 3") || cSlug.includes("chast-3"))) return c;
        if ((tTitle.includes("пакет") || tSlug.includes("paket")) && (cTitle.includes("пакет") || cSlug.includes("paket"))) return c;
      }
    }
  }

  return undefined;
}
