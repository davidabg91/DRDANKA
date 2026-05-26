/**
 * URL-safe slug from a Bulgarian (or Latin) string.
 *
 *   "Етикетиране на храни" → "etiketirane-na-hrani"
 *   "HACCP Обучение"        → "haccp-obuchenie"
 *
 * Transliterates Cyrillic, lowercases, replaces whitespace + non-alphanumerics
 * with single dashes, trims leading/trailing dashes.
 */
const BG_TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch",
  ш: "sh", щ: "sht", ъ: "a", ь: "y", ю: "yu", я: "ya",
};

export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .split("")
    .map((c) => BG_TRANSLIT[c] ?? c)
    .join("")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")  // strip combining accents (Latin diacritics)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Ensure the slug doesn't clash with an existing one. Appends -2, -3, … if needed.
 */
export function uniqueSlug(base: string, existing: ReadonlyArray<string>): string {
  const slug = base || "course";
  if (!existing.includes(slug)) return slug;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${slug}-${i}`;
    if (!existing.includes(candidate)) return candidate;
  }
  return `${slug}-${Date.now()}`;
}
