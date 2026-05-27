/**
 * Registry of all "ready" materials (PDFs, recorded videos) sold on the site.
 *
 * To add a new material:
 *   1. Create src/data/library/<slug>.tsx exporting a LibraryMaterial.
 *   2. Import it here and append to LIBRARY_MATERIALS.
 *
 * The order in this array determines the order in the /library catalog
 * (top-left first).
 */
import type { LibraryMaterial } from "./types";
import { etiketiraneNaHrani } from "./etiketirane-na-hrani";
import { videoEtiketirane } from "./video-etiketirane";
import { mesoIMesniProdukti } from "./meso-i-mesni-produkti";
import { etiketiraneKontrolZashtita } from "./etiketirane-kontrol-zashtita";

export const LIBRARY_MATERIALS: ReadonlyArray<LibraryMaterial> = [
  etiketiraneNaHrani,
  videoEtiketirane,
  mesoIMesniProdukti,
  etiketiraneKontrolZashtita,
];

/** Convenience lookup by slug. Returns undefined if not found. */
export function findLibraryMaterial(slug: string): LibraryMaterial | undefined {
  return LIBRARY_MATERIALS.find((m) => m.slug === slug);
}

export type { LibraryMaterial, LibraryMaterialType } from "./types";
