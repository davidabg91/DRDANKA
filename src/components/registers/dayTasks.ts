/**
 * „Днешен план" — ежедневните задължения за избрания ден (свършени и
 * несвършени), подредени по момент от деня, и бързото им попълване с едно
 * потвърждение от панела, без да се отваря целият месечен дневник.
 *
 * Бързите действия пишат точно същите данни, които пише и съответният
 * редактор (и фоновото авто-попълване) — печатът и календарът не различават
 * откъде е дошъл записът. Потребителят винаги потвърждава изрично: записът
 * удостоверява реална проверка.
 */

import type { HotAppliance, RegisterColumn, RegisterDef } from "@/data/storeRegisters";
import type { RegisterDocData } from "./registerPrint";
import { tempOutOfNorm, type TempUnit } from "./tempUnits";
import { fillHygieneDays, isHygieneDayFilled, weekKeyFor, type HygieneRoom } from "./weeklyHygiene";
import {
  applyCleaningTemplate,
  hasTemplate,
  isCleaningDayFilled,
  templateFromRow,
  type CleaningTemplate,
} from "./cleaningChecklist";

export type PlanMoment = "before" | "during" | "after";

export const MOMENT_LABELS: Record<PlanMoment, string> = {
  before: "Преди отваряне",
  during: "През деня",
  after: "След затваряне",
};

/** Кое бързо действие може да изпълни задачата направо от панела. */
export type QuickKind = "temps" | "staff" | "grid" | "cleaning" | "prework";

export interface PlanTask {
  key: string;
  registerId: string;
  moment: PlanMoment;
  /** Кратко име — „Температури", „Лична хигиена на персонала". */
  title: string;
  /** Състоянието с няколко думи — „2 от 4 съоръжения", „Липсва за: Иван". */
  detail: string;
  /** Пълното изречение — за подсказката в календара. */
  text: string;
  done: boolean;
  quick?: QuickKind;
}

type Employee = { name: string; role?: string };

const isRowFilled = (row?: Record<string, unknown>) =>
  !!row && Object.values(row).some((v) => String(v ?? "").trim() !== "");

const tempRowFilled = (row?: Record<string, string>) =>
  !!row && (String(row.t1 || "").trim() !== "" || String(row.t2 || "").trim() !== "");

export interface DayTasksInput {
  dateISO: string;
  docs: Record<string, RegisterDocData>;
  units: TempUnit[];
  employees: Employee[];
  restDays: number[];
  /** Дейностите/уредите, които може да се отбележат за деня. */
  dailyTriggers: HotAppliance[];
  /** Id на псевдо-документа с отбелязаните дейности по дни. */
  dailyUsageId: string;
  registerById: Record<string, RegisterDef>;
  /** Ключът на датата в записите на карта (обикновено „date"). */
  recordDateKey: (def: RegisterDef) => string | null | undefined;
  allowedIds: Set<string>;
  /** Има ли от какво да се попълни почистването (образец или предишен ден). */
  canQuickCleaning: boolean;
}

/** Всички ежедневни задължения за деня — и свършените, за прогреса. */
export function buildDayTasks(input: DayTasksInput): PlanTask[] {
  const { dateISO, docs, units, employees, restDays, dailyTriggers, dailyUsageId, registerById } = input;
  const dayNum = String(parseInt(dateISO.slice(8, 10), 10));
  const weekday = new Date(`${dateISO}T00:00:00`).getDay();
  const tasks: PlanTask[] = [];

  // Лична хигиена — преди започване на работа.
  if (employees.length > 0) {
    const checked = new Set(
      (docs["staff-hygiene"]?.entries || []).filter((e) => e.date === dateISO).map((e) => String(e.employee || ""))
    );
    const miss = employees.filter((e) => !checked.has(e.name));
    tasks.push({
      key: "staff-hygiene",
      registerId: "staff-hygiene",
      moment: "before",
      title: "Лична хигиена на персонала",
      detail: miss.length === 0
        ? `${employees.length} от ${employees.length} служители`
        : `Липсва за: ${miss.map((e) => e.name).join(", ")}`,
      text: `Контролната карта за лична хигиена липсва за: ${miss.map((e) => e.name).join(", ")} (попълва се преди започване на работа).`,
      done: miss.length === 0,
      quick: "staff",
    });
  }

  // Чек-лист „Хигиена на обекта" — преди започване на работа.
  const preworkDone = isHygieneDayFilled(docs["prework-check"]?.rows, dateISO);
  tasks.push({
    key: "prework-check",
    registerId: "prework-check",
    moment: "before",
    title: "Хигиена на обекта",
    detail: "Техническо състояние и хигиена",
    text: "Чек-листът „Хигиена на обекта“ (техническо състояние и хигиена) не е попълнен — попълва се преди започване на работа.",
    done: preworkDone,
    quick: "prework",
  });

  // Температури — поне едно измерване на всяко съоръжение.
  if (units.length > 0) {
    const tempDoc = docs["temps"] || {};
    const missing = units.filter((u) => !tempRowFilled(tempDoc.units?.[u.name]?.rows?.[dayNum]));
    tasks.push({
      key: "temps",
      registerId: "temps",
      moment: "before",
      title: "Температури",
      detail: missing.length === 0
        ? `${units.length} от ${units.length} съоръжения`
        : `${units.length - missing.length} от ${units.length} съоръжения`,
      text: `Температури: непопълнени ${missing.length} от ${units.length} съоръжения (${missing.map((u) => u.name).join(", ")}).`,
      done: missing.length === 0,
      quick: "temps",
    });
  }

  // Отбелязани дейности/уреди за деня → изискват своите карти.
  const used = docs[dailyUsageId]?.rows?.[dayNum] || {};
  const seen = new Set<string>();
  dailyTriggers.forEach((trig) => {
    if (used[trig.id] !== "1") return;
    trig.registers.forEach((regId) => {
      const def = registerById[regId];
      if (!def || seen.has(regId)) return;
      seen.add(regId);
      const dk = input.recordDateKey(def) || "date";
      const done = (docs[regId]?.entries || []).some((e) => e[dk] === dateISO);
      tasks.push({
        key: `trigger-${regId}`,
        registerId: regId,
        moment: "during",
        title: def.shortTitle,
        detail: `${trig.emoji} ${trig.label}`,
        text: `${trig.emoji} Отбелязахте „${trig.label}“ — попълнете картата „${def.shortTitle}“.`,
        done,
      });
    });
  });

  // Дневник за хигиена — след приключване на почистването.
  tasks.push({
    key: "hygiene-daily",
    registerId: "hygiene-daily",
    moment: "after",
    title: "Дневник за хигиена",
    detail: "Подове, плотове, санитарен възел, отпадъци",
    text: "Дневникът за хигиена на обекта не е попълнен (попълва се след приключване на почистването).",
    done: isRowFilled(docs["hygiene-daily"]?.rows?.[dayNum]),
    quick: "grid",
  });

  // Почистване и дезинфекция — всеки работен ден.
  if (!restDays.includes(weekday)) {
    tasks.push({
      key: "cleaning-checklist",
      registerId: "cleaning-checklist",
      moment: "after",
      title: "Почистване и дезинфекция",
      detail: "Препарат и изпълнител по помещения",
      text: "Чек-листът за почистване, измиване и дезинфекция не е попълнен (попълва се след почистването).",
      done: isCleaningDayFilled(docs["cleaning-checklist"]?.rows, dateISO),
      quick: input.canQuickCleaning ? "cleaning" : undefined,
    });
  }

  return tasks.filter((t) => input.allowedIds.has(t.registerId));
}

/* ------------------------------------------------------------------ */
/*  Бързо попълване на един ден                                         */
/* ------------------------------------------------------------------ */

/** Следващото свободно измерване на съоръжението за деня (1, 2 или нищо). */
export function nextTempSlot(row?: Record<string, string>): 1 | 2 | null {
  if (!String(row?.t1 || "").trim()) return 1;
  if (!String(row?.t2 || "").trim()) return 2;
  return null;
}

/** Последната измерена температура преди деня в месеца — за подсказка. */
export function lastTempBefore(doc: RegisterDocData | undefined, unitName: string, dayNum: number): string {
  const rows = doc?.units?.[unitName]?.rows || {};
  for (let d = dayNum - 1; d >= 1; d--) {
    const r = rows[String(d)];
    const v = String(r?.t2 || r?.t1 || "").trim();
    if (v) return v;
  }
  return "";
}

/**
 * Записва измерените температури в следващото свободно измерване на всяко
 * съоръжение (час = сега), със същия автоматичен резултат като редактора.
 */
export function quickFillTemps(
  prev: RegisterDocData,
  units: TempUnit[],
  dayNum: string,
  values: Record<string, { temp: string; action?: string }>,
  nowHHMM: string
): RegisterDocData {
  const prevUnits = prev.units || {};
  const nextUnits = { ...prevUnits };
  units.forEach((unit) => {
    const v = values[unit.name];
    const temp = String(v?.temp || "").trim();
    if (!temp) return;
    const u = prevUnits[unit.name] || { type: unit.type, rows: {} };
    const row: Record<string, string> = { ...(u.rows?.[dayNum] || {}) };
    const slot = nextTempSlot(row);
    if (!slot) return;
    row[`t${slot}`] = temp;
    row[`t${slot}h`] = nowHHMM;
    const bad = tempOutOfNorm(row.t1 || "", unit.norm) || tempOutOfNorm(row.t2 || "", unit.norm);
    row.result = bad ? "Несъответствие" : "Норма";
    if (v?.action?.trim()) row.action = row.action ? `${row.action}; ${v.action.trim()}` : v.action.trim();
    if (!row.sign) row.sign = "✓";
    nextUnits[unit.name] = { type: unit.type, norm: unit.norm, rows: { ...(u.rows || {}), [dayNum]: row } };
  });
  return { ...prev, units: nextUnits };
}

/** Лична хигиена: допуснати до работа всички служители без запис за деня. */
export function quickFillStaff(prev: RegisterDocData, employees: Employee[], dateISO: string): RegisterDocData {
  const entries = prev.entries || [];
  const checked = new Set(entries.filter((e) => e.date === dateISO).map((e) => String(e.employee || "")));
  const added = employees
    .filter((e) => !checked.has(e.name))
    .map((e) => ({
      date: dateISO,
      employee: e.name,
      hygiene: "✓",
      health: "✓",
      result: "Допуснат до работа",
      sign: "✓",
    }));
  return added.length ? { ...prev, entries: [...entries, ...added] } : prev;
}

/** Дневен ред от тип grid-days: отметки, оценка „Удовлетворителна", дата. */
export function quickFillGridDay(
  prev: RegisterDocData,
  columns: RegisterColumn[],
  dayNum: string,
  dateISO: string
): RegisterDocData {
  const row = { ...((prev.rows || {})[dayNum] || {}) };
  columns.forEach((c) => {
    if (c.type === "check" && !row[c.key]) row[c.key] = "✓";
    if (c.key === "grade" && !row[c.key]) row[c.key] = "Удовлетворителна";
    if (c.type === "date" && !row[c.key]) row[c.key] = dateISO;
  });
  return { ...prev, rows: { ...(prev.rows || {}), [dayNum]: row } };
}

/** Чек-лист „Хигиена на обекта" за деня: всичко в изправност („-"). */
export function quickFillPrework(
  prev: RegisterDocData,
  dateISO: string,
  layout: HygieneRoom[],
  restDays: number[]
): RegisterDocData {
  const rows = { ...(prev.rows || {}) };
  const wk = weekKeyFor(dateISO);
  rows[wk] = fillHygieneDays(rows[wk] || {}, layout, [dateISO], restDays);
  return { ...prev, rows };
}

/**
 * Откъде да се попълни почистването: образецът на обекта, а ако няма —
 * последният попълнен ден преди датата („като вчера").
 */
export function cleaningSource(
  doc: RegisterDocData | undefined,
  dateISO: string,
  layout: HygieneRoom[],
  template?: CleaningTemplate | null
): { template: CleaningTemplate; from: "template" | string } | null {
  if (hasTemplate(template)) return { template, from: "template" };
  const rows = doc?.rows || {};
  const prevDay = Object.keys(rows)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d < dateISO && isCleaningDayFilled(rows, d))
    .sort()
    .pop();
  if (!prevDay) return null;
  const t = templateFromRow(rows[prevDay], layout);
  return hasTemplate(t) ? { template: t, from: prevDay } : null;
}

export function quickFillCleaning(
  prev: RegisterDocData,
  dateISO: string,
  layout: HygieneRoom[],
  template: CleaningTemplate
): RegisterDocData {
  const rows = { ...(prev.rows || {}) };
  rows[dateISO] = applyCleaningTemplate(rows[dateISO] || {}, layout, template);
  return { ...prev, rows };
}
