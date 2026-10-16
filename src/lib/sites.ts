/**
 * Обекти на една фирма (ресторант, кухня майка, кафене…).
 *
 * Основният обект са полетата в самия профил (вид дейност, адрес, оборудване,
 * персонал, авто-попълване) — така старите профили работят без миграция.
 * Всеки следващ обект е запис в `DankaUser.sites` със същите полета, а
 * дневниците му се пазят под отделни ключове (`registerDocKey(..., siteId)`).
 * Фирмата, ЕИК, планът, подписът и плащането са общи за всички обекти.
 */

import type { HygieneRoom } from "@/components/registers/weeklyHygiene";
import type { CleaningTemplate } from "@/components/registers/cleaningChecklist";
import type { TempNormEntry } from "@/components/registers/tempUnits";

export const MAIN_SITE_ID = "main";

/** Полетата, които са различни за всеки обект. */
export interface SiteFields {
  niche?: string;
  address?: string;
  manager?: string;
  customFridges?: string[];
  customFreezers?: string[];
  customStorages?: string[];
  unitNorms?: TempNormEntry[];
  customEmployees?: { name: string; role: string }[];
  hasHotPoint?: boolean;
  hotAppliances?: string[];
  restDays?: number[];
  hygieneLayout?: HygieneRoom[];
  cleaningLayout?: HygieneRoom[];
  cleaningTemplate?: CleaningTemplate;
  autoDuner?: boolean;
  autoPrework?: boolean;
  autoTemps?: boolean;
  autoStaffHygiene?: boolean;
  autoCleaning?: boolean;
  autoFryerOil?: boolean;
  autoBaking?: boolean;
  autoCookedMeals?: boolean;
  autoResidue?: boolean;
  autoHygieneWeekly?: boolean;
  autoHygieneMonthly?: boolean;
  autoCleaningChecklist?: boolean;
}

export const SITE_FIELD_KEYS: (keyof SiteFields)[] = [
  "niche", "address", "manager",
  "customFridges", "customFreezers", "customStorages", "unitNorms", "customEmployees",
  "hasHotPoint", "hotAppliances", "restDays",
  "hygieneLayout", "cleaningLayout", "cleaningTemplate",
  "autoDuner", "autoPrework", "autoTemps", "autoStaffHygiene", "autoCleaning",
  "autoFryerOil", "autoBaking", "autoCookedMeals", "autoResidue",
  "autoHygieneWeekly", "autoHygieneMonthly", "autoCleaningChecklist",
];

export interface ExtraSite extends SiteFields {
  id: string;
  name: string;
  createdAt: string;
}

/** Обектът такъв, какъвто го виждат дневниците. */
export interface SiteView extends SiteFields {
  id: string;
  name: string;
}

interface SiteOwner extends SiteFields {
  siteName?: string;
  sites?: ExtraSite[];
}

export const DEFAULT_MAIN_SITE_NAME = "Основен обект";

/** Всички обекти на фирмата — основният винаги е първи. */
export function sitesOf(user?: SiteOwner | null): SiteView[] {
  if (!user) return [];
  const main: SiteView = { id: MAIN_SITE_ID, name: user.siteName?.trim() || DEFAULT_MAIN_SITE_NAME };
  for (const k of SITE_FIELD_KEYS) (main as any)[k] = user[k];
  return [main, ...(user.sites ?? []).map((s) => ({ ...s }))];
}

export function siteCountOf(user?: SiteOwner | null): number {
  return 1 + (user?.sites?.length ?? 0);
}

export function newSiteId(): string {
  return `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

/**
 * Превръща промяна по обект в промяна по профила: за основния обект полетата
 * отиват направо в профила, за останалите — в съответния запис от `sites`.
 * Полета извън SiteFields (подпис и т.н.) винаги са общи и отиват в профила.
 */
export function siteProfilePatch<T extends Record<string, unknown>>(
  user: SiteOwner,
  siteId: string,
  patch: T,
): Record<string, unknown> {
  if (siteId === MAIN_SITE_ID) return patch;
  const sitePart: Record<string, unknown> = {};
  const shared: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if ((SITE_FIELD_KEYS as string[]).includes(k)) sitePart[k] = v;
    else shared[k] = v;
  }
  if (Object.keys(sitePart).length === 0) return shared;
  const sites = (user.sites ?? []).map((s) => (s.id === siteId ? { ...s, ...sitePart } : s));
  return { ...shared, sites: withoutUndefined(sites) };
}

/** Firestore отказва `undefined` вътре в масиви — махаме празните полета. */
export function withoutUndefined<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}
