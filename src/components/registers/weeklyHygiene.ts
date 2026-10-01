/**
 * Чек-лист „Хигиена на обекта" (№34) — седмичен формат по документа на
 * собственика: за всяко помещение/съоръжение и всеки ден от седмицата се
 * вписват „Техническо състояние" и „Хигиена" ( „-" добър, „+" незадоволителен,
 * „П" почивен ден ), а за седмицата — корективни действия, резултат и подпис.
 *
 * Данните живеят в годишния документ на регистъра:
 *   rows[weekKey] = {
 *     "<date>|<itemKey>|t": "-" | "+" | "П",   // техническо състояние
 *     "<date>|<itemKey>|h": "-" | "+" | "П",   // хигиена
 *     "c|<itemKey>": коригиращи действия, "a|<itemKey>": резултат след тях,
 *     "s|<itemKey>": подпис, timeFrom, timeTo,
 *     __layout: JSON снимка на помещенията/оборудването за седмицата (за печат и история)
 *   }
 * weekKey = понеделникът на седмицата (ISO), отрязан до 1 януари — седмиците
 * не прескачат годината, за да остане цялата седмица в един документ.
 */

export interface HygieneRoom {
  room: string;
  items: string[];
}

export type HygieneMark = "" | "-" | "+" | "П";
export const HYGIENE_CYCLE: HygieneMark[] = ["", "-", "+", "П"];

export const HYGIENE_BASE_ITEMS = [
  "Под",
  "Стени",
  "Таван",
  "Врати",
  "Хладилни съоръжения",
  "Осветителни тела",
  "Мивка",
  "Рафтове",
];

/** Разпределение по подразбиране (по документа) + хладилниците/фризерите от профила в залата. */
export function defaultHygieneLayout(fridges: string[] = [], freezers: string[] = []): HygieneRoom[] {
  return [
    { room: "Зала за клиенти", items: [...HYGIENE_BASE_ITEMS, ...fridges, ...freezers] },
    { room: "Складово помещение", items: [...HYGIENE_BASE_ITEMS] },
    { room: "Санитарен възел", items: ["Под", "Стени", "Таван", "Врата", "Тоалетна чиния", "Мивка"] },
  ];
}

/** Ключ на реда (помещение + съоръжение) — без точки, за да е безопасен като ключ във Firestore. */
export function hygieneItemKey(room: string, item: string): string {
  return `${room}::${item}`.replace(/[.\/\[\]]/g, "_");
}

export const cellKey = (date: string, itemKey: string, part: "t" | "h") => `${date}|${itemKey}|${part}`;

const pad = (n: number) => String(n).padStart(2, "0");
const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

/** Ключ на седмицата, в която попада датата (понеделник, но не преди 1 януари). */
export function weekKeyFor(dateISO: string): string {
  const d = fromISO(dateISO);
  const back = (d.getDay() + 6) % 7; // пон=0 … нед=6
  const mon = new Date(d);
  mon.setDate(d.getDate() - back);
  if (mon.getFullYear() !== d.getFullYear()) return `${d.getFullYear()}-01-01`;
  return toISO(mon);
}

/** Дните (ISO) на седмицата с дадения ключ — до неделя, но не след 31 декември. */
export function weekDays(weekKey: string): string[] {
  const start = fromISO(weekKey);
  const out: string[] = [];
  const d = new Date(start);
  do {
    out.push(toISO(d));
    d.setDate(d.getDate() + 1);
  } while (d.getDay() !== 1 && d.getFullYear() === start.getFullYear());
  return out;
}

/** Седмиците, които засягат месеца (YYYY-MM), подредени. */
export function weeksForMonth(month: string): string[] {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  const keys: string[] = [];
  for (let day = 1; day <= last; day++) {
    const k = weekKeyFor(`${month}-${pad(day)}`);
    if (!keys.includes(k)) keys.push(k);
  }
  return keys;
}

export const WEEKDAY_SHORT = ["Н", "П", "В", "С", "Ч", "П", "С"];

export function weekdayLetter(dateISO: string): string {
  return WEEKDAY_SHORT[fromISO(dateISO).getDay()];
}

export function parseLayout(raw: unknown): HygieneRoom[] | null {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as HygieneRoom[]) : null;
  } catch {
    return null;
  }
}

/** Дали за датата има вписан поне един резултат (техническо или хигиена). */
export function isHygieneDayFilled(rows: Record<string, Record<string, string>> | undefined, dateISO: string): boolean {
  const row = rows?.[weekKeyFor(dateISO)];
  if (!row) return false;
  const prefix = `${dateISO}|`;
  return Object.keys(row).some((k) => k.startsWith(prefix) && String(row[k] || "").trim() !== "");
}

/**
 * Попълва „-" (добър) за всички съоръжения за дадените дни, без да пипа вече
 * вписаното; в почивните дни (restDays по Date.getDay()) вписва „П".
 */
export function fillHygieneDays(
  row: Record<string, string>,
  layout: HygieneRoom[],
  dates: string[],
  restDays: number[] = []
): Record<string, string> {
  const next = { ...row };
  dates.forEach((date) => {
    const mark = restDays.includes(fromISO(date).getDay()) ? "П" : "-";
    layout.forEach((r) =>
      r.items.forEach((item) => {
        const ik = hygieneItemKey(r.room, item);
        (["t", "h"] as const).forEach((part) => {
          const k = cellKey(date, ik, part);
          if (!next[k]) next[k] = mark;
        });
      })
    );
  });
  next.__layout = JSON.stringify(layout);
  return next;
}

/** Има ли попълнени отметки или корективни действия за даден обект през седмицата. */
export function isHygieneItemFilled(row: Record<string, string> | undefined, days: string[], itemKey: string): boolean {
  if (!row) return false;
  if (row[`c|${itemKey}`] || row[`a|${itemKey}`]) return true;
  return days.some((d) => row[cellKey(d, itemKey, "t")] || row[cellKey(d, itemKey, "h")]);
}

export function fmtDM(iso: string): string {
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
}
