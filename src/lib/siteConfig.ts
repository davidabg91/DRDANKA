/**
 * Central SEO / site metadata configuration.
 *
 * Single source of truth for the production URL, brand name, author identity
 * and NAP (Name / Address / Phone) data reused by:
 *   - the root <metadata> in app/layout.tsx
 *   - app/sitemap.ts and app/robots.ts (both need ABSOLUTE URLs)
 *   - the JSON-LD structured data injected site-wide
 *
 * Keep every fact here truthful — structured data that contradicts the visible
 * page can be flagged as spam by Google.
 */

/** Canonical production origin. No trailing slash. */
export const SITE_URL = "https://haccpspokoystvie.bg";

/** Brand / site name used in openGraph.siteName and Organization schema. */
export const SITE_NAME = "HACCP Спокойствие — Д-р Данка Николова";

/** Short brand used inside <title> suffixes. */
export const BRAND = "Д-р Данка Николова";

export const AUTHOR = {
  name: "Д-р Данка Николова",
  jobTitle: "Консултант по безопасност на храните",
  email: "d.nikolova.haccp@gmail.com",
  /** Years of experience — surfaced across the site copy. */
  experienceYears: 27,
} as const;

export const BUSINESS = {
  legalName: "HACCP Спокойствие",
  streetAddress: "ул. „Данаил Попов“ 12, ет. 2",
  addressLocality: "Плевен",
  addressCountry: "BG",
  postalCode: "5800",
  /** Default social share image (absolute path resolved via metadataBase). */
  ogImage: "/share-logo.jpg",
} as const;

/** Areas served — used in LocalBusiness / ProfessionalService schema. */
export const AREAS_SERVED = [
  "България",
  "София",
  "Пловдив",
  "Варна",
  "Бургас",
  "Русе",
  "Стара Загора",
  "Плевен",
  "Благоевград",
] as const;

/** Resolve a site-relative path to an absolute URL for sitemap/schema use. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString().replace(/\/$/, "") || SITE_URL;
}
