/**
 * Абонаментни планове „БАБХ Спокойствие" — дигитално водене на записи.
 *
 * Планът определя кои дневници вижда обектът (заедно с вида на обекта:
 * магазин / топла точка / месо) и кои допълнителни услуги получава.
 * Плащането е месечно, по банков път; админът потвърждава и удължава с 1 месец.
 */

export type PlanId = "basic" | "standard" | "pro" | "vip";

export interface PlanDef {
  id: PlanId;
  /** Търговско име */
  name: string;
  /** Поредно ниво в документа на собственика (Базов / Втори / Трети / ВИП) */
  tierLabel: string;
  tagline: string;
  priceEur: number;
  /** Дигитално водене на … (за показване) */
  records: string[];
  /** Услуги към пакета (за показване) */
  services: string[];
  featured?: boolean;
}

const BASE_RECORDS = [
  "Дневник за входящ контрол и списък на доставчиците",
  "Чек-лист за хигиена преди започване на работа",
  "Температурни дневници за хладилните съоръжения",
  "Лична хигиена на персонала — списък на персонала и личните здравни книжки",
  "Дневник за обучение на персонала",
  "Култура по безопасност на храните — въпросник и чек-лист",
  "Дневник за бракувана продукция",
];

/** Добавя се от „Оптимум" нагоре. */
const STANDARD_BASE_RECORDS = [
  "Дневник за хигиена на обекта — ежедневен, седмичен и месечен контрол, препарати",
  "Записи за ДДД обработки въз основа на документите от фирмата изпълнител",
  "Работно облекло, ремонти, оценка на доставчиците, остатъчни дезинфектанти",
];

const HOT_RECORDS = [
  "Дневник за температурна обработка в топла точка — скара, варене, печене във фурна",
  "Дневник за измерване на температурата на пържилната мазнина",
  "Дневник за отстраняване на пържилната мазнина",
  "Дневник за температурата в студена и топла витрина за готови храни",
  "Меню с отбелязани алергени",
];

const BASIC_SERVICES = [
  "Проверка на сроковете на личните здравни книжки и напомняне преди изтичането им",
];

const DEADLINE_SERVICES = [
  "Проверка на сроковете на личните здравни книжки и напомняне преди изтичането им",
  "Проследяване на срока на договора с фирмата за ДДД обработка",
  "Проследяване на сроковете на останалите договори, свързани с дейността и изискванията на БАБХ",
];

const PRO_SERVICES = [
  "Онлайн подготовка на обекта за проверка от БАБХ веднъж на четири месеца",
  "Директна връзка с д-р Николова за консултация по изискванията на БАБХ",
  "Една онлайн среща на живо в Zoom месечно за Вашия обект",
];

export const PLANS: PlanDef[] = [
  {
    id: "basic",
    name: "Старт",
    tierLabel: "Базов пакет",
    tagline: "Основните дневници по самоконтрол за всеки обект",
    priceEur: 19,
    records: BASE_RECORDS,
    services: BASIC_SERVICES,
  },
  {
    id: "standard",
    name: "Оптимум",
    tierLabel: "Втори пакет",
    tagline: "За обекти с топла точка — скара, фритюрник, фурна, витрини",
    priceEur: 29,
    records: [...BASE_RECORDS, ...STANDARD_BASE_RECORDS, ...HOT_RECORDS],
    services: DEADLINE_SERVICES,
  },
  {
    id: "pro",
    name: "Професионал",
    tierLabel: "Трети пакет",
    tagline: "Записи според дейността на обекта и лична подкрепа от д-р Николова",
    priceEur: 49,
    records: [...BASE_RECORDS, ...STANDARD_BASE_RECORDS, ...HOT_RECORDS, "Допълнителни записи според дейностите на конкретния обект"],
    services: [...PRO_SERVICES, ...DEADLINE_SERVICES],
    featured: true,
  },
  {
    id: "vip",
    name: "VIP Спокойствие",
    tierLabel: "ВИП пакет",
    tagline: "Всички приложими записи и ежемесечен контрол на документацията",
    priceEur: 88,
    records: [...BASE_RECORDS, ...STANDARD_BASE_RECORDS, ...HOT_RECORDS, "Всички допълнителни записи, необходими според дейностите на обекта"],
    services: [
      "Всичко от пакет „Професионал“",
      "Онлайн проверка на документацията и записите веднъж месечно",
      "Съдействие след проверка от БАБХ",
      ...PRO_SERVICES,
      ...DEADLINE_SERVICES,
    ],
  },
];

export const PLAN_BY_ID: Record<PlanId, PlanDef> = Object.fromEntries(
  PLANS.map((p) => [p.id, p])
) as Record<PlanId, PlanDef>;

export const PLAN_RANK: Record<PlanId, number> = { basic: 1, standard: 2, pro: 3, vip: 4 };

export function isPlanId(v: unknown): v is PlanId {
  return v === "basic" || v === "standard" || v === "pro" || v === "vip";
}

/** Пробният период от 14 дни дава достъп като план „Оптимум". */
export const TRIAL_PLAN: PlanId = "standard";

/** Стари клиенти без записан план се водят VIP (прехвърлят се на VIP за 1 месец). */
export const LEGACY_PLAN: PlanId = "vip";

/** Планът, по който реално работи профилът в момента. */
export function effectivePlan(user?: { plan?: string; subscriptionStatus?: string } | null): PlanId {
  if (!user) return TRIAL_PLAN;
  if (user.subscriptionStatus === "trial") return TRIAL_PLAN;
  return isPlanId(user.plan) ? user.plan : LEGACY_PLAN;
}

/** Чат / директна връзка с д-р Николова — само „Професионал" и VIP. */
export function planHasChat(plan: PlanId): boolean {
  return PLAN_RANK[plan] >= PLAN_RANK.pro;
}

/** Допълнителните записи, настройвани ръчно от д-р Николова — „Професионал" и VIP. */
export function planHasExtras(plan: PlanId): boolean {
  return PLAN_RANK[plan] >= PLAN_RANK.pro;
}

/* ------------------------------------------------------------------ */
/*  Кои дневници включва планът                                        */
/* ------------------------------------------------------------------ */

/** „Старт": само тези дневници (по решение на собственика). */
const BASIC_IDS = [
  "suppliers",
  "incoming",
  "prework-check",
  "temps",
  "staff-hygiene",
  "health-books",
  "training",
  "safety-survey",
  "safety-checklist",
  "waste",
];

/**
 * „Оптимум" добавя: останалия основен комплект (хигиена, препарати, работно
 * облекло, ремонти, ДДД, договори — чрез storeIds), помощните карти,
 * витрините, термичната обработка, мазнината и менюто с алергени.
 */
const STANDARD_EXTRA_IDS = [
  "disinfectant-residue",
  "supplier-eval",
  "hot-display",
  "grill-temp",
  "fry-depth",
  "duner",
  "baking",
  "cooked-meals",
  "alaminut",
  "fryer-oil-temp",
  "fryer-oil-destroy",
  "allergen-menu",
];

/**
 * Дали планът включва даден регистър.
 * @param storeIds  id-тата от основния комплект (STORE_REGISTER_IDS)
 * @param extraRegisters  ръчно избраните от админа допълнителни записи
 *   („Професионал"/VIP). `undefined` = още не са настройвани → всички приложими.
 */
export function planAllowsRegister(
  plan: PlanId,
  registerId: string,
  storeIds: Set<string>,
  extraRegisters?: string[]
): boolean {
  if (BASIC_IDS.includes(registerId)) return true;
  if (PLAN_RANK[plan] >= PLAN_RANK.standard && (storeIds.has(registerId) || STANDARD_EXTRA_IDS.includes(registerId))) return true;
  if (planHasExtras(plan)) return extraRegisters === undefined || extraRegisters.includes(registerId);
  return false;
}

/** Id-тата, които са „допълнителни записи" (извън Базов и Оптимум) — за админ настройката. */
export function isExtraRegister(registerId: string, storeIds: Set<string>): boolean {
  return !storeIds.has(registerId) && !BASIC_IDS.includes(registerId) && !STANDARD_EXTRA_IDS.includes(registerId);
}

/** Дата (YYYY-MM-DD) след `months` месеца от `from` (или от днес). */
export function addMonthsISO(months: number, from?: string): string {
  const d = from ? new Date(from + "T12:00:00") : new Date();
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  // 31 януари + 1 месец → последния ден на февруари, не 3 март
  if (d.getDate() < day) d.setDate(0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
