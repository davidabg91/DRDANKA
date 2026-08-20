/**
 * Client testimonials.
 *
 * Extracted from /about, where all four were hand-written as near-identical
 * blocks of markup. They live here so more than one page can show them without
 * the copies drifting apart — the audit's finding was not that the site lacks
 * proof, but that its proof sits on the one page buyers reach last.
 *
 * `timeAgo` is a literal string, exactly as it was on /about. It does not
 * update itself, so "Преди 1 седмица" ages badly — worth replacing with a real
 * date field, but that is a content decision, not a refactor.
 */
export interface Testimonial {
  /** Short id so pages can pick specific quotes rather than slicing an array. */
  id: string;
  /** Pull-quote headline, already wrapped in quotation marks on render. */
  headline: string;
  /** Body paragraphs, in order. */
  body: string[];
  author: string;
  /** Monogram shown in the avatar circle. */
  initials: string;
  role: string;
  timeAgo: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "pekarna-registraciya",
    headline:
      "Бяхме притеснени дали изобщо ще успеем да регистрираме пекарната си за закуски и козунаци",
    body: [
      "Много време се лутахме и не знаехме как да подредим нещата правилно… Месеци наред обикаляхме между различни институции, без да получим ясна посока.",
      "С помощта на д-р Николова най-накрая получихме яснота. Подредихме всичко, направихме нужните стъпки и подготвихме обекта както трябва.",
    ],
    author: "Северина М.",
    initials: "СМ",
    role: "Собственик на Пекарна за закуски",
    timeAgo: "Преди 3 седмици",
  },
  {
    id: "mandra-naredba-26",
    headline:
      "След срещата с д-р Николова осъзнах, че нещата не са толкова сложни, колкото изглеждат",
    body: [
      "Преди това идеята ни да регистрираме мини мандра по Наредба №26 за директни доставки звучеше почти невъзможна.",
      "С нейна помощ получихме яснота какво точно се изисква и как да го приложим на практика.",
    ],
    author: "Виктория Р.",
    initials: "ВР",
    role: "Собственик на мини мандра",
    timeAgo: "Преди 1 месец",
  },
  {
    id: "meso-vurnat-proekt",
    headline:
      "Проектът ми за производство на месни заготовки беше върнат три пъти от БАБХ",
    body: [
      "Всеки път правех корекции, но без ясна посока. В един момент вече бях напълно объркан и не знаех какво да променя.",
      "След срещата с д-р Николова всичко се изясни – получих конкретни насоки, разбрах изискванията, направихме нужните корекции и процесът тръгна напред.",
    ],
    author: "Крум Т.",
    initials: "КТ",
    role: "Собственик на цех за месо",
    timeAgo: "Преди 2 месеца",
  },
  {
    id: "zavedenie-purvi-stupki",
    headline:
      "Професионалист като нея би ми спестил много нерви и пари, защото във бизнеса всяка грешка се заплаща!",
    body: [
      "Щастлива съм, че срещнах Д-р Николова. Откривам заведение и нейните съвети и консултации ми бяха изключително ценни! Подкрепена в точния момент! Имах много въпроси, на които получих бърз професионален отговор!",
      "Изключително важно и решаващо за първите стъпки в бизнеса е да бъдеш правилно консултиран и да тръгнеш в правилната посока!",
      "Не се колебайте да се консултирате с Д-р Николова, тя е верният партньор до вас!",
    ],
    author: "Албена Колева",
    initials: "АК",
    role: "Собственик на заведение",
    timeAgo: "Преди 1 седмица",
  },
];

/** Pick specific testimonials by id, preserving the order requested. */
export function pickTestimonials(...ids: string[]): Testimonial[] {
  return ids
    .map((id) => TESTIMONIALS.find((t) => t.id === id))
    .filter((t): t is Testimonial => t != null);
}
