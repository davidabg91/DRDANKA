/**
 * Съоръжения в температурните чек-листове (№3) и техните норми.
 *
 * Три вида с норма по подразбиране — хладилни (0…+4°C), фризери (≤ −18°C) и
 * складови помещения (0…+25°C). Потребителят може да зададе собствена
 * минимална/максимална граница за всяко съоръжение (`unitNorms` в профила,
 * по име на съоръжението). Нормата се записва и в документа на месеца, за да
 * печатът показва режима, който е важал тогава.
 */

export type TempUnitType = "fridge" | "freezer" | "storage";

export interface TempNorm {
  min?: number;
  max?: number;
}

/** Собствена норма за съоръжение — пази се като масив, за да се презаписва изцяло. */
export interface TempNormEntry extends TempNorm {
  name: string;
}

export function normsByName(entries?: TempNormEntry[]): Record<string, TempNorm> {
  const out: Record<string, TempNorm> = {};
  for (const e of entries ?? []) {
    const n: TempNorm = {};
    if (typeof e.min === "number") n.min = e.min;
    if (typeof e.max === "number") n.max = e.max;
    out[e.name] = n;
  }
  return out;
}

export interface TempUnit {
  name: string;
  type: TempUnitType;
  norm: TempNorm;
}

export const DEFAULT_TEMP_NORMS: Record<TempUnitType, TempNorm> = {
  fridge: { min: 0, max: 4 },
  freezer: { max: -18 },
  storage: { min: 0, max: 25 },
};

export const TEMP_UNIT_LABELS: Record<TempUnitType, string> = {
  fridge: "Хладилни уреди и студени витрини",
  freezer: "Фризери",
  storage: "Складови помещения",
};

const fmt = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toString().replace(".", ",")}°C`;

/** „от 0 до +4°C", „≤ −18°C", „≥ +2°C". */
export function normLabel(norm: TempNorm): string {
  const { min, max } = norm;
  if (min !== undefined && max !== undefined) return `от ${fmt(min).replace("°C", "")} до ${fmt(max)}`;
  if (max !== undefined) return `≤ ${fmt(max)}`;
  if (min !== undefined) return `≥ ${fmt(min)}`;
  return "без зададена норма";
}

export function parseTemp(val: string): number {
  return parseFloat(String(val).replace(",", ".").replace("−", "-"));
}

export function tempOutOfNorm(val: string, norm: TempNorm): boolean {
  const n = parseTemp(val);
  if (Number.isNaN(n)) return false;
  if (norm.min !== undefined && n < norm.min) return true;
  if (norm.max !== undefined && n > norm.max) return true;
  return false;
}

/** Нормата от записа в документа; за стари записи — по вида на съоръжението. */
export function storedNorm(u: { type?: string; norm?: TempNorm }): TempNorm {
  if (u.norm && (u.norm.min !== undefined || u.norm.max !== undefined)) return u.norm;
  const type = (u.type === "freezer" || u.type === "storage" ? u.type : "fridge") as TempUnitType;
  return DEFAULT_TEMP_NORMS[type];
}

/** Нормата е валидна: поне една граница, и минимумът е под максимума. */
export function isValidNorm(norm: TempNorm): boolean {
  if (norm.min === undefined && norm.max === undefined) return false;
  if (norm.min !== undefined && norm.max !== undefined && norm.min >= norm.max) return false;
  return true;
}

/**
 * Стойност в нормата за автоматичното попълване (функция, която клиентът
 * включва сам). Държи се във вътрешността на интервала, далеч от границите.
 */
export function sampleTempInNorm(norm: TempNorm): string {
  const { min, max } = norm;
  let lo: number;
  let hi: number;
  if (min !== undefined && max !== undefined) {
    lo = min + (max - min) * 0.3;
    hi = min + (max - min) * 0.9;
  } else if (max !== undefined) {
    lo = max - 3.3;
    hi = max - 0.5;
  } else {
    lo = (min ?? 0) + 0.5;
    hi = (min ?? 0) + 3;
  }
  return (lo + Math.random() * (hi - lo)).toFixed(1);
}
