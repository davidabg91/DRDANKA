/**
 * Registry and helpers for bundle / multi-item packages in the digital bookstore.
 *
 * When a user purchases or is granted access to a bundle slug, all of its
 * constituent sub-materials are automatically unlocked in their account.
 */

export const BUNDLE_ITEMS_MAP: Record<string, string[]> = {
  "prakticheska-biblia-paket-vsichki-chasti": [
    "prakticheska-biblia-chast-1",
    "prakticheska-biblia-chast-2",
    "prakticheska-biblia-chast-3",
  ],
};

/**
 * Returns true if the given slug is a known bundle package.
 */
export function isBundle(slug: string): boolean {
  return slug in BUNDLE_ITEMS_MAP;
}

/**
 * Given an identifier or title (slug, trainingId, course title),
 * returns the list of sub-slugs that belong to this bundle, or empty array if not a bundle.
 */
export function resolveBundleIds(idOrTitle?: string | null): string[] {
  if (!idOrTitle) return [];
  const trimmed = idOrTitle.trim();
  if (BUNDLE_ITEMS_MAP[trimmed]) {
    return BUNDLE_ITEMS_MAP[trimmed];
  }

  const lower = trimmed.toLowerCase();
  if (
    lower === "prakticheska-biblia-paket-vsichki-chasti" ||
    (lower.includes("практическа библия") &&
      (lower.includes("пакет") || lower.includes("всички части") || lower.includes("част i") || lower.includes("всички 3 части")))
  ) {
    return [
      "prakticheska-biblia-chast-1",
      "prakticheska-biblia-chast-2",
      "prakticheska-biblia-chast-3",
    ];
  }

  return [];
}

/**
 * Expands an array of course/material IDs by resolving any bundles contained within it.
 * Preserves all original IDs and appends all bundle sub-items.
 */
export function expandWithBundleItems(ids: string[]): string[] {
 const result = new Set<string>();
 for (const id of ids) {
 if (!id) continue;
 result.add(id);
 const subSlugs = resolveBundleIds(id);
 for (const sub of subSlugs) {
 result.add(sub);
 }
 }
 return Array.from(result);
}
