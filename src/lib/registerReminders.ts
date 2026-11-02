/**
 * Какво липсва в дневниците на един обект — общото между „Днешен план" в
 * профила и вечерния имейл с напомняне (`/api/cron/register-reminders`).
 *
 * Модулът е чист (без React и без Firebase): получава профила на обекта и
 * вече заредените документи и връща задачите/сроковете. Така сайтът и
 * имейлът винаги казват едно и също.
 */

import {
  DAILY_ACTIVITIES,
  HOT_APPLIANCES,
  MEAT_ACTIVITIES,
  REGISTER_BY_ID,
  STORE_REGISTER_IDS,
  defaultHotPointForSector,
  isMeatShopNiche,
  periodFor,
  recordDateKey,
  registersFor,
  registersForMeat,
  type HotAppliance,
  type RegisterDef,
} from "@/data/storeRegisters";
import { getSectorForNiche } from "@/data/businessCategories";
import { planAllowsRegister, planHasExtras, type PlanId } from "@/lib/plans";
import type { SiteView } from "@/lib/sites";
import type { RegisterDocData } from "@/components/registers/registerPrint";
import { buildDayTasks, type PlanTask } from "@/components/registers/dayTasks";
import { DEFAULT_TEMP_NORMS, isValidNorm, normsByName, type TempUnit, type TempUnitType } from "@/components/registers/tempUnits";

/** Псевдо-документ с отбелязаните дейности/уреди по дни (вж. RegistersTab). */
export const DAILY_USAGE_ID = "daily-usage";

/** Регистрите, които планът включва (+ ръчно добавените от д-р Николова). */
export function filterByPlan(defs: RegisterDef[], plan: PlanId, extraRegisters?: string[]): RegisterDef[] {
  let all = defs;
  if (extraRegisters && planHasExtras(plan)) {
    const have = new Set(defs.map((d) => d.id));
    const added = extraRegisters
      .filter((id) => !have.has(id))
      .map((id) => REGISTER_BY_ID[id])
      .filter(Boolean);
    all = [...defs, ...added];
  }
  return all.filter((d) => planAllowsRegister(plan, d.id, STORE_REGISTER_IDS, extraRegisters));
}

export function activeRegistersFor(opts: {
  plan: PlanId;
  meat: boolean;
  hotPoint: boolean;
  extraRegisters?: string[];
}): RegisterDef[] {
  return filterByPlan(
    opts.meat ? registersForMeat(opts.hotPoint) : registersFor(opts.hotPoint),
    opts.plan,
    opts.extraRegisters
  );
}

/** Дейности (винаги) + месо + притежаваните уреди (при топла точка), само с картите от плана. */
export function dailyTriggersFor(opts: {
  meat: boolean;
  hotPoint: boolean;
  hotAppliances: string[];
  allowedIds: Set<string>;
}): HotAppliance[] {
  const owned = opts.hotAppliances.length > 0
    ? HOT_APPLIANCES.filter((a) => opts.hotAppliances.includes(a.id))
    : HOT_APPLIANCES;
  return [...DAILY_ACTIVITIES, ...(opts.meat ? MEAT_ACTIVITIES : []), ...(opts.hotPoint ? owned : [])]
    .map((t) => ({ ...t, registers: t.registers.filter((r) => opts.allowedIds.has(r)) }))
    .filter((t) => t.registers.length > 0);
}

export function tempUnitsFor(site: Pick<SiteView, "customFridges" | "customFreezers" | "customStorages" | "unitNorms">): TempUnit[] {
  const byName = normsByName(site.unitNorms);
  const make = (name: string, type: TempUnitType): TempUnit => {
    const custom = byName[name];
    return { name, type, norm: custom && isValidNorm(custom) ? custom : DEFAULT_TEMP_NORMS[type] };
  };
  // Същите стойности по подразбиране като профила за нов обект.
  return [
    ...(site.customFridges ?? ["Хладилна витрина №1"]).map((n) => make(n, "fridge")),
    ...(site.customFreezers ?? ["Фризер №1"]).map((n) => make(n, "freezer")),
    ...(site.customStorages ?? []).map((n) => make(n, "storage")),
  ];
}

/** Всичко, което трябва за пресмятане на задачите на един обект. */
export interface SiteContext {
  site: SiteView;
  meat: boolean;
  hotPoint: boolean;
  allowedIds: Set<string>;
  activeRegisters: RegisterDef[];
  units: TempUnit[];
  employees: { name: string; role?: string }[];
  restDays: number[];
  dailyTriggers: HotAppliance[];
}

export function siteContext(
  site: SiteView,
  opts: { plan: PlanId; extraRegisters?: string[]; fallbackNiche?: string }
): SiteContext {
  const niche = site.niche || opts.fallbackNiche || "";
  const meat = isMeatShopNiche(niche);
  const hotPoint = site.hasHotPoint ?? defaultHotPointForSector(getSectorForNiche(niche));
  const activeRegisters = activeRegistersFor({ plan: opts.plan, meat, hotPoint, extraRegisters: opts.extraRegisters });
  const allowedIds = new Set(activeRegisters.map((d) => d.id));
  return {
    site,
    meat,
    hotPoint,
    allowedIds,
    activeRegisters,
    units: tempUnitsFor(site),
    employees: site.customEmployees ?? [],
    restDays: site.restDays ?? [],
    dailyTriggers: dailyTriggersFor({ meat, hotPoint, hotAppliances: site.hotAppliances ?? [], allowedIds }),
  };
}

/** Документите (id + период), нужни за задачите на деня и сроковете. */
export function docsNeeded(ctx: SiteContext, month: string): { id: string; period: string }[] {
  const ids = new Set<string>(["temps", "staff-hygiene", "prework-check", "hygiene-daily", "cleaning-checklist", "health-books", "contracts"]);
  ctx.dailyTriggers.forEach((t) => t.registers.forEach((r) => ids.add(r)));
  const list: { id: string; period: string }[] = [];
  ids.forEach((id) => {
    const def = REGISTER_BY_ID[id];
    if (def && ctx.allowedIds.has(id)) list.push({ id, period: periodFor(def, month) });
  });
  list.push({ id: DAILY_USAGE_ID, period: month });
  return list;
}

/** Несвършените ежедневни задачи за деня (празно в почивен ден). */
export function pendingTasks(ctx: SiteContext, docs: Record<string, RegisterDocData>, dateISO: string): PlanTask[] {
  const weekday = new Date(`${dateISO}T00:00:00`).getDay();
  if (ctx.restDays.includes(weekday)) return [];
  return buildDayTasks({
    dateISO,
    docs,
    units: ctx.units,
    employees: ctx.employees,
    restDays: ctx.restDays,
    dailyTriggers: ctx.dailyTriggers,
    dailyUsageId: DAILY_USAGE_ID,
    registerById: REGISTER_BY_ID,
    recordDateKey,
    allowedIds: ctx.allowedIds,
    canQuickCleaning: false,
  }).filter((t) => !t.done);
}

/* ------------------------------------------------------------------ */
/*  Срокове: лични здравни книжки и договори                            */
/* ------------------------------------------------------------------ */

/** Праговете, при които се праща напомняне за срок (дни преди изтичане). */
export const DEADLINE_STEPS = [30, 7, 1] as const;

export interface Deadline {
  kind: "health-book" | "contract";
  registerId: "health-books" | "contracts";
  /** „ЛЗК на Иван Петров" / „Договор за ДДД с Дезинфект ООД". */
  label: string;
  validUntil: string;
  daysLeft: number;
  /** "expired" | "1" | "7" | "30" — по него се пази, че вече е пратено. */
  step: string;
  /** Уникален ключ на срока и прага — за да не се праща два пъти. */
  key: string;
}

export function daysBetween(fromISO: string, toISO: string): number {
  const a = Date.UTC(+fromISO.slice(0, 4), +fromISO.slice(5, 7) - 1, +fromISO.slice(8, 10));
  const b = Date.UTC(+toISO.slice(0, 4), +toISO.slice(5, 7) - 1, +toISO.slice(8, 10));
  return Math.round((b - a) / 86400000);
}

function stepFor(daysLeft: number): string | null {
  if (daysLeft < 0) return "expired";
  for (const s of [...DEADLINE_STEPS].reverse()) if (daysLeft <= s) return String(s);
  return null;
}

/** Сроковете, които са в прозорец за напомняне днес (най-малкият достигнат праг). */
export function dueDeadlines(siteId: string, docs: Record<string, RegisterDocData>, todayISO: string): Deadline[] {
  const out: Deadline[] = [];
  const add = (kind: Deadline["kind"], registerId: Deadline["registerId"], label: string, validUntil: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(validUntil)) return;
    const daysLeft = daysBetween(todayISO, validUntil);
    const step = stepFor(daysLeft);
    if (!step) return;
    out.push({ kind, registerId, label, validUntil, daysLeft, step, key: `${siteId}|${registerId}|${label}|${validUntil}|${step}` });
  };
  (docs["health-books"]?.entries || []).forEach((e) =>
    add("health-book", "health-books", `ЛЗК на ${String(e.employee || "служител").trim()}`, String(e.validUntil || ""))
  );
  (docs["contracts"]?.entries || []).forEach((e) => {
    const what = `${String(e.kind || "Договор").trim()}${e.firm ? ` с ${String(e.firm).trim()}` : ""}`;
    add("contract", "contracts", what, String(e.validUntil || ""));
  });
  return out;
}

/** Днешната дата в България (YYYY-MM-DD), независимо от часовата зона на сървъра. */
export function sofiaDateISO(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Sofia", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}
