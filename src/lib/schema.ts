/**
 * JSON-LD structured data builders (Schema.org).
 *
 * Rendered as <script type="application/ld+json"> via <JsonLd />. Every value
 * must match visible page content — see siteConfig.ts for the source of truth.
 *
 * Answer engines lean on this graph far more than on prose: it is what lets a
 * model state "X provides Y in Z" with enough confidence to name the business.
 * Keep the nodes cross-linked by @id so Organization / Person / Service /
 * WebPage read as one entity rather than five unrelated fragments.
 */
import {
  SITE_URL,
  SITE_NAME,
  AUTHOR,
  BUSINESS,
  AREAS_SERVED,
  SAME_AS,
  SERVICE_CATALOG,
  absoluteUrl,
} from "./siteConfig";

/** Stable @id fragments so nodes can reference each other across the graph. */
const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Only emit sameAs when there is something real to point at. */
const sameAs = SAME_AS.length ? { sameAs: [...SAME_AS] } : {};

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
    alternateName: [
      "HACCP Спокойствие",
      "ХАСЕП Спокойствие",
      "Академия „Сигурен хранителен бизнес“",
    ],
    url: SITE_URL,
    email: AUTHOR.email,
    telephone: BUSINESS.phoneRaw,
    image: absoluteUrl(BUSINESS.ogImage),
    logo: absoluteUrl("/logo-icon.png"),
    description:
      "Разработка, внедряване и одит на HACCP (ХАСЕП) системи, системи за самоконтрол, ISO 22000, IFS Food, GMP и ДПХП за хранителния бизнес в България, плюс подготовка на документация за регистрация и проверки от БАБХ.",
    founder: { "@id": PERSON_ID },
    ...sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.addressLocality,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: BUSINESS.phoneRaw,
      email: AUTHOR.email,
      areaServed: "BG",
      availableLanguage: ["bg", "Bulgarian"],
    },
    areaServed: AREAS_SERVED.map((name) => ({ "@type": "Place", name })),
    knowsLanguage: "bg-BG",
    knowsAbout: [
      "HACCP",
      "ХАСЕП",
      "НАССР система",
      "ISO 22000",
      "IFS Food",
      "GMP",
      "ДПХП",
      "Система за самоконтрол",
      "Безопасност на храните",
      "БАБХ регистрация на обект",
      "Етикетиране на храни",
      "Алергени в храните",
      "Технологични карти",
    ],
    hasOfferCatalog: offerCatalogSchema(),
  };
}

/**
 * The sellable services as an OfferCatalog hanging off the Organization.
 * This is the machine-readable answer to "what do you actually do" — without
 * it a model has to infer the service list from marketing copy, which it
 * mostly declines to do.
 */
export function offerCatalogSchema() {
  return {
    "@type": "OfferCatalog",
    name: "Услуги по безопасност на храните",
    itemListElement: SERVICE_CATALOG.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        serviceType: service.serviceType,
        url: absoluteUrl(service.path),
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "България" },
      },
      ...("priceEur" in service && service.priceEur != null
        ? { price: service.priceEur, priceCurrency: "EUR" }
        : {}),
    })),
  };
}

/** Standalone Service node for a dedicated service landing page. */
export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  image?: string;
  priceEur?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    url: absoluteUrl(input.path),
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    provider: { "@id": ORG_ID },
    areaServed: AREAS_SERVED.map((name) => ({ "@type": "Place", name })),
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl(input.path),
      servicePhone: BUSINESS.phoneRaw,
      availableLanguage: ["bg", "Bulgarian"],
    },
    ...(input.priceEur != null
      ? {
          offers: {
            "@type": "Offer",
            price: input.priceEur,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(input.path),
          },
        }
      : {}),
  };
}

/** Person node for Dr. Danka Nikolova — the E-E-A-T author entity. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR.name,
    alternateName: "Данка Николова",
    jobTitle: AUTHOR.jobTitle,
    email: AUTHOR.email,
    telephone: AUTHOR.phoneRaw,
    url: `${SITE_URL}/about`,
    image: absoluteUrl("/danka-portrait.webp"),
    worksFor: { "@id": ORG_ID },
    ...sameAs,
    description: `Консултант по безопасност на храните с над ${AUTHOR.experienceYears} години опит в официалния контрол. Доктор по контрол на храните и ветеринарно-санитарна експертиза, лицензиран водещ одитор по ISO 22000, IFS Food и ISO 9001.`,
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory:
          "Доктор по контрол на храните и ветеринарно-санитарна експертиза",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory:
          "Лицензиран водещ одитор ISO 22000, IFS Food, ISO 9001",
      },
    ],
    knowsAbout: [
      "HACCP",
      "ХАСЕП",
      "ISO 22000",
      "IFS Food",
      "ДПХП",
      "Безопасност на храните",
      "Ветеринарно-санитарна експертиза",
      "БАБХ",
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

/**
 * WebPage node tying a page to the org + author. Cheap, and it is what lets a
 * model attribute a claim on the page to a named expert instead of "a website".
 */
export function webPageSchema(input: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "bg-BG",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    ...(input.type === "AboutPage" ? { mainEntity: { "@id": PERSON_ID } } : {}),
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

/** HowTo node — the step-by-step delivery process for a service. */
export function howToSchema(input: {
  name: string;
  description: string;
  totalTime?: string;
  steps: ReadonlyArray<{ name: string; text: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    inLanguage: "bg-BG",
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    step: input.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
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
export function faqSchema(
  items: ReadonlyArray<{ question: string; answer: string }>,
) {
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
