/**
 * Bulgarian ЕИК / БУЛСТАТ validation (9 or 13 digits, with check digits).
 *
 * Used to stop made-up numbers at registration — the free trial is limited to
 * one per ЕИК (see `trialClaims` in firestore.rules).
 */

export function normalizeEik(raw: string): string {
  return raw.replace(/\D/g, "");
}

function checkDigit(digits: number[], weights: number[], fallback: number[]): number {
  let sum = digits.reduce((s, d, i) => s + d * weights[i], 0) % 11;
  if (sum === 10) {
    sum = digits.reduce((s, d, i) => s + d * fallback[i], 0) % 11;
    if (sum === 10) sum = 0;
  }
  return sum;
}

export function isValidEik(raw: string): boolean {
  const eik = normalizeEik(raw);
  if (eik.length !== 9 && eik.length !== 13) return false;
  const d = eik.split("").map(Number);

  const ninth = checkDigit(d.slice(0, 8), [1, 2, 3, 4, 5, 6, 7, 8], [3, 4, 5, 6, 7, 8, 9, 10]);
  if (ninth !== d[8]) return false;
  if (eik.length === 9) return true;

  const thirteenth = checkDigit(d.slice(8, 12), [2, 7, 3, 5], [4, 9, 5, 7]);
  return thirteenth === d[12];
}
