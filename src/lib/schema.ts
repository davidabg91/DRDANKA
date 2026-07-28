/**
 * JSON-LD structured data builders (Schema.org).
 *
 * Rendered as <script type="application/ld+json"> via <JsonLd />. Every value
 * must match visible page content — see siteConfig.ts for the source of truth.
 */
import {
  SITE_URL,
  SITE_NAME,
  AUTHOR,
  BUSINESS,
  AREAS_SERVED,
  absoluteUrl,
} from "./siteConfig";

/** Stable @id fragments so nodes can reference each other across the graph. */
const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Organization / ProfessionalService node describing the consultancy itself.
 * Uses ProfessionalService (a LocalBusiness subtype) so it can carry an
 * address + areaServed and be eligible for local rich results.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: BUSINESS.legalName,
    url: SITE_URL,
    email: AUTHOR.email,
    image: absoluteUrl(BUSINESS.ogImage),
    logo: absoluteUrl("/logo-icon.png"),
    description:
      "Консултации, внедряване и одит на системи за безопасност на храните (HACCP, ISO 22000, IFS, GMP, ДПХП) за хранителния бизнес в България.",
    founder: { "@id": PERSON_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    areaServed: AREAS_SERVED.map((name) => ({ "@type": "Place", name })),
    knowsAbout: [
      "HACCP",
      "ISO 22000",
      "IFS Food",
      "GMP",
      "ДПХП",
      "Безопасност на храните",
      "БАБХ регистрация",
      "Етикетиране на храни",
    ],
  };
}

/** Person node for Dr. Danka Nikolova — the E-E-A-T author entity. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    email: AUTHOR.email,
    url: `${SITE_URL}/about`,
    image: absoluteUrl("/danka-portrait.webp"),
    worksFor: { "@id": ORG_ID },
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Доктор по контрол на храните и ветеринарно-санитарна експертиза",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Лицензиран водещ одитор ISO 22000, IFS Food, ISO 9001",
      },
    ],
    knowsAbout: [
      "HACCP",
      "ISO 22000",
      "IFS Food",
      "Безопасност на храните",
      "Ветеринарно-санитарна експертиза",
    ],
  };
}

/** WebSite node — enables the sitelinks search box / name in results. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "bg-BG",
    publisher: { "@id": ORG_ID },
  };
}

/** BreadcrumbList for a page. `items` are ordered {name, path} from home down. */
export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Course node for live / recorded training offerings. */
export function courseSchema(input: {
  name: string;
  description: string;
  path: string;
  image?: string;
  priceEur?: number;
  mode: "online" | "onsite";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    inLanguage: "bg-BG",
    provider: { "@id": ORG_ID },
    ...(input.priceEur != null
      ? {
          offers: {
            "@type": "Offer",
            price: input.priceEur,
            priceCurrency: "EUR",
            category: "Paid",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: input.mode === "online" ? "Online" : "Onsite",
      courseWorkload: "PT4H",
    },
  };
}

/** BlogPosting / Article node for a blog post. */
export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    inLanguage: "bg-BG",
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    mainEntityOfPage: absoluteUrl(input.path),
  };
}

/** FAQPage node from question/answer pairs. */
export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: qa.answer },
    })),
  };
}
