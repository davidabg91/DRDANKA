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

/** Canonical production origin. No trailing slash. Must match the canonical
 *  host used in app/layout.tsx (www) so sitemap, robots and JSON-LD list the
 *  canonical URLs directly instead of ones that 308-redirect to www. */
export const SITE_URL = "https://www.haccpspokoystvie.bg";

/** Brand / site name used in openGraph.siteName and Organization schema. */
export const SITE_NAME = "HACCP Спокойствие — Д-р Данка Николова";

/** Short brand used inside <title> suffixes. */
export const BRAND = "Д-р Данка Николова";

export const AUTHOR = {
  name: "Д-р Данка Николова",
  jobTitle: "Консултант по безопасност на храните",
  email: "d.nikolova.haccp@gmail.com",
  phone: "0887 902 198",
  phoneRaw: "+359887902198",
  phoneTel: "tel:0887902198",
  /** Years of experience — surfaced across the site copy. */
  experienceYears: 27,
} as const;

export const BUSINESS = {
  legalName: "HACCP Спокойствие",
  streetAddress: "ул. „Данаил Попов“ 12, ет. 2",
  addressLocality: "Плевен",
  addressCountry: "BG",
  postalCode: "5800",
  phone: "0887 902 198",
  phoneRaw: "+359887902198",
  phoneTel: "tel:0887902198",
  /** Default social share image (absolute path resolved via metadataBase). */
  ogImage: "/og-image.jpg",
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

/**
 * Profiles that prove this is the same real-world entity across the web.
 *
 * This is the single biggest lever for being *recommended* by answer engines
 * (ChatGPT, Perplexity, Gemini/AI Overviews): they resolve "who is this" by
 * cross-referencing an entity's own site with independent profiles. A site with
 * no `sameAs` edges stays an isolated node and loses to competitors that have
 * a Google Business Profile + directory listings, even when its content is
 * better.
 *
 * Add every profile that genuinely belongs to the business — Google Business
 * Profile ("Виж в Google Maps" share link), Facebook, LinkedIn, YouTube,
 * industry directories. Only real, live URLs: a broken or wrong `sameAs` is
 * worse than none.
 */
export const SAME_AS: readonly string[] = [
  // "https://www.facebook.com/...",
  // "https://www.linkedin.com/in/...",
  // "https://www.google.com/maps/place/...",
  // "https://www.youtube.com/@...",
];

/**
 * The consultancy's sellable services, in the wording clients actually search
 * for. Feeds the OfferCatalog + Service JSON-LD nodes, and doubles as the
 * source list for the /haccp-sistema page and llms.txt.
 *
 * `name` deliberately carries the Bulgarian transliterations (ХАСЕП / ХАСАП)
 * alongside the Latin acronym — Bulgarian buyers type all three, and an answer
 * engine matching "разработка на ХАСЕП система" needs to find that string.
 */
export const SERVICE_CATALOG = [
  {
    name: "Разработка и внедряване на HACCP (ХАСЕП) система",
    description:
      "Пълен анализ на опасностите и критичните контролни точки (ККТ), разработване на индивидуална HACCP/ХАСЕП система и системa за самоконтрол за обекта, внедряване на място и подготовка на цялата документация за проверка от БАБХ съгласно Закона за храните и Регламент (ЕО) № 852/2004.",
    path: "/haccp-sistema",
    serviceType: "Разработка и внедряване на HACCP система",
  },
  {
    name: "Внедряване на ISO 22000 и IFS Food",
    description:
      "Предварителен одит на готовността, изграждане на документалната система по ISO 22000 / IFS Food, вътрешни одити, обучение на екипа и съдействие при сертификационния одит.",
    path: "/services",
    serviceType: "Внедряване на ISO 22000 и IFS Food",
  },
  {
    name: "ДПХП и GMP процедури (добри хигиенни и производствени практики)",
    description:
      "Програми за почистване и дезинфекция, ДДД план, контрол на вредителите, лична хигиена, работно облекло, входящ контрол и проследимост, технологично разпределение на площите.",
    path: "/services",
    serviceType: "ДПХП / GMP процедури",
  },
  {
    name: "Технологични карти и рецептури",
    description:
      "Изготвяне на задължителните технологични карти за ястия и продукти с описание на процеса, физико-химични показатели, алергени и срокове на трайност съгласно Регламент (ЕС) № 1169/2011.",
    path: "/services",
    serviceType: "Технологични карти и рецептури",
  },
  {
    name: "Документация за регистрация на нов обект в БАБХ",
    description:
      "Целият пакет за регистрация на нов хранителен обект: уведомление по чл. 26 от Закона за храните, папки със системите за самоконтрол, хигиенни и дезинфекционни планове и съдействие при първоначалния оглед.",
    path: "/services",
    serviceType: "Регистрация на обект в БАБХ",
  },
  {
    name: "Одит и актуализация на съществуваща HACCP (ХАСЕП) система",
    description:
      "Независим преглед на внедрена система, отстраняване на предписания от БАБХ, актуализация при промяна в менюто, технологията или нормативната уредба, абонаментна поддръжка.",
    path: "/services",
    serviceType: "Одит и актуализация на HACCP система",
  },
  {
    name: "Изготвяне на меню с алергени",
    description:
      "Анализ на рецептите и съставяне на легални обозначения, писмена легенда към менюто и информационна папка за 14-те основни алергена, плюс обучение срещу кръстосано замърсяване.",
    path: "/services",
    serviceType: "Меню с алергени",
  },
  {
    name: "Проверка преди проверката — одит на обекта на място",
    description:
      "Независим одит на обекта преди инспекция от БАБХ: внедрена HACCP и ДПХП система, сграден фонд и работни потоци, задължителни дневници, етикетиране и проследимост. Включва писмен доклад с несъответствия и план с коригиращи действия.",
    path: "/services#proverka-predi-proverkata",
    serviceType: "Предварителен одит преди проверка от БАБХ",
    priceEur: 600,
  },
] as const;
