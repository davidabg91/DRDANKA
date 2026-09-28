/**
 * Чек-лист за почистване, измиване и дезинфекция (№48) — по документа на
 * собственика „Chek_list_pochistvane_izmivane_dezinfekcia.docx".
 *
 * За всеки ден и всеки обект (под, стени, витрини…) по помещения се вписват:
 * използван препарат, кой е извършил почистването и подпис.
 *
 * Данните живеят в месечния документ на регистъра:
 *   rows[<дата ISO>] = {
 *     "<itemKey>|agent": препарат, "<itemKey>|by": извършил, "<itemKey>|sign": подпис,
 *     __layout: JSON снимка на помещенията за деня (за печат и история)
 *   }
 * Образецът за автоматично попълване (препарат/извършил/подпис по обект) се
 * пази в профила на обекта (`cleaningTemplate`), за да важи и за следващите месеци.
 */

import { HygieneRoom, hygieneItemKey } from "./weeklyHygiene";

export type CleaningField = "agent" | "by" | "sign";
export const CLEANING_FIELDS: CleaningField[] = ["agent", "by", "sign"];

export type CleaningTemplate = Record<string, Partial<Record<CleaningField, string>>>;

export function defaultCleaningLayout(): HygieneRoom[] {
  return [
    {
      room: "Търговска зала",
      items: ["Под", "Стени", "Таван", "Хладилни витрини", "Стелажи, щендери", "Рафтове", "Хладилни съоръжения", "Работни плотове"],
    },
    { room: "Складово помещение", items: ["Под", "Стени", "Стелажи/рафтове", "Хладилни съоръжения"] },
    { room: "Санитарен възел", items: ["Тоалетна", "Преддверие", "Кошове за смет"] },
  ];
}

export const cleaningKey = (itemKey: string, f: CleaningField) => `${itemKey}|${f}`;

/** Дали за деня е вписан поне един препарат или изпълнител. */
export function isCleaningDayFilled(rows: Record<string, Record<string, string>> | undefined, dateISO: string): boolean {
  const row = rows?.[dateISO];
  if (!row) return false;
  return Object.keys(row).some(
    (k) => (k.endsWith("|agent") || k.endsWith("|by")) && String(row[k] || "").trim() !== ""
  );
}

/** Образец от попълнен ден — само обектите с вписано нещо. */
export function templateFromRow(row: Record<string, string>, layout: HygieneRoom[]): CleaningTemplate {
  const t: CleaningTemplate = {};
  layout.forEach((r) =>
    r.items.forEach((item) => {
      const ik = hygieneItemKey(r.room, item);
      const entry: Partial<Record<CleaningField, string>> = {};
      CLEANING_FIELDS.forEach((f) => {
        const v = String(row[cleaningKey(ik, f)] || "").trim();
        if (v) entry[f] = v;
      });
      if (Object.keys(entry).length > 0) t[ik] = entry;
    })
  );
  return t;
}

/** Попълва празните клетки на деня по образеца (вписаното не се пипа). */
export function applyCleaningTemplate(
  row: Record<string, string>,
  layout: HygieneRoom[],
  template: CleaningTemplate
): Record<string, string> {
  const next = { ...row };
  layout.forEach((r) =>
    r.items.forEach((item) => {
      const ik = hygieneItemKey(r.room, item);
      const t = template[ik];
      if (!t) return;
      CLEANING_FIELDS.forEach((f) => {
        const k = cleaningKey(ik, f);
        if (!next[k] && t[f]) next[k] = t[f] as string;
      });
    })
  );
  next.__layout = JSON.stringify(layout);
  return next;
}

export function hasTemplate(t?: CleaningTemplate | null): t is CleaningTemplate {
  return !!t && Object.keys(t).length > 0;
}
