/**
 * Admin-controlled delivery-type overrides for code-curated library materials.
 *
 * The catalog (src/data/library/) hard-codes each material's `type` ("pdf" |
 * "video"). This lets the admin re-mark a material's type without a code deploy
 * — e.g. switch a PDF product to a video one after uploading an mp4.
 *
 * Stored at /typeOverrides/{slug} as: { type: "pdf" | "video", updatedAt }.
 * Missing override → the code-defined type is used as-is.
 *
 * Mirrors src/lib/priceOverrides.ts (one-time getDocs fetch, public read).
 */
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, doc, getDocs, query, setDoc, deleteDoc } from "firebase/firestore";

export type MaterialType = "pdf" | "video";

export interface TypeOverride {
  type: MaterialType;
  updatedAt: string;
}

export function useTypeOverrides() {
  const [overrides, setOverrides] = useState<Record<string, MaterialType>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getDocs(query(collection(db, "typeOverrides")))
      .then((snap) => {
        if (cancelled) return;
        const map: Record<string, MaterialType> = {};
        snap.forEach((d) => {
          const data = d.data() as TypeOverride;
          if (data.type === "pdf" || data.type === "video") map[d.id] = data.type;
        });
        setOverrides(map);
        setLoading(false);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Error fetching type overrides:", error);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { overrides, loading };
}

/** Admin sets the type override for a slug. Pass null to clear (back to code). */
export async function setTypeOverride(slug: string, type: MaterialType | null): Promise<void> {
  const ref = doc(db, "typeOverrides", slug);
  if (type === null || type === undefined) {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, { type, updatedAt: new Date().toISOString() }, { merge: true });
  }
}

/** Resolve the effective type: override ?? code-defined fallback. */
export function resolveType(
  slug: string,
  overrides: Record<string, MaterialType>,
  fallback: MaterialType,
): MaterialType {
  return overrides[slug] ?? fallback;
}
