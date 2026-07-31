/**
 * Admin-controlled price overrides for code-curated catalog items.
 *
 * Catalog metadata (title, description, layout) lives in src/data/, but
 * the price is a moving target — admin should be able to bump or discount
 * a course without a code deploy.
 *
 * Stored at /priceOverrides/{slug} as:
 *   { priceEur: number, updatedAt: string }
 *
 * If no override exists for a slug, the code-defined price is used as-is.
 */
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, doc, getDocs, query, setDoc, deleteDoc } from "firebase/firestore";

export interface PriceOverride {
  priceEur: number;
  updatedAt: string;
}

/**
 * Map of slug → priceEur. Returns the override price for any slug the admin
 * has changed; everything else stays on the code default.
 *
 * This is a ONE-TIME fetch (getDocs), not a realtime listener. Prices change
 * rarely and public catalog pages don't need live sync — a persistent
 * onSnapshot WebChannel here opened a streaming Firestore connection on every
 * public page, which Google's crawler abandons (ERR_TIMED_OUT in the console)
 * and which costs extra reads. Admin price edits now surface on next page load
 * instead of instantly for other viewers — an acceptable trade for a catalog.
 */
export function usePriceOverrides() {
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getDocs(query(collection(db, "priceOverrides")))
      .then((snap) => {
        if (cancelled) return;
        const map: Record<string, number> = {};
        snap.forEach((d) => {
          const data = d.data() as PriceOverride;
          if (typeof data.priceEur === "number") map[d.id] = data.priceEur;
        });
        setOverrides(map);
        setLoading(false);
      })
      .catch((error) => {
        // Non-admin clients can read overrides (public), so this should rarely fail.
        if (cancelled) return;
        console.error("Error fetching price overrides:", error);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { overrides, loading };
}

/**
 * Admin sets the override for a slug. Pass undefined / null to clear.
 */
export async function setPriceOverride(slug: string, priceEur: number | null): Promise<void> {
  const ref = doc(db, "priceOverrides", slug);
  if (priceEur === null || priceEur === undefined) {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, { priceEur, updatedAt: new Date().toISOString() }, { merge: true });
  }
}

/** Helper: resolve final price using overrides ?? fallback code price. */
export function resolvePrice(slug: string, overrides: Record<string, number>, fallback: number): number {
  return overrides[slug] ?? fallback;
}
