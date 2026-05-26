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
import { collection, doc, onSnapshot, query, setDoc, deleteDoc } from "firebase/firestore";

export interface PriceOverride {
  priceEur: number;
  updatedAt: string;
}

/**
 * Live map of slug → priceEur. Returns the override price for any slug
 * the admin has changed; everything else stays on the code default.
 */
export function usePriceOverrides() {
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "priceOverrides")),
      (snap) => {
        const map: Record<string, number> = {};
        snap.forEach((d) => {
          const data = d.data() as PriceOverride;
          if (typeof data.priceEur === "number") map[d.id] = data.priceEur;
        });
        setOverrides(map);
        setLoading(false);
      },
      (error) => {
        // Non-admin clients can read overrides (public), so this should rarely fail.
        console.error("Error fetching price overrides:", error);
        setLoading(false);
      }
    );
    return unsub;
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
