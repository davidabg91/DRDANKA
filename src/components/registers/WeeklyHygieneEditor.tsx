"use client";

/**
 * Редактор на чек-лист „Хигиена на обекта" (№34) — седмична таблица по
 * помещения и съоръжения. Помощните функции и моделът на данните са в
 * ./weeklyHygiene.ts.
 */

import { useEffect, useMemo, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCheck, ChevronLeft, ChevronRight, History, Plus, Settings, Wand2, X } from "lucide-react";
import type { RegisterDocData } from "./registerPrint";
import { PREWORK_ZONE_COLS, registerDocKey } from "@/data/storeRegisters";
import { getLocalDateISO } from "@/lib/dateUtils";
import {
  HygieneRoom,
  HYGIENE_CYCLE,
  HygieneMark,
  cellKey,
  defaultHygieneLayout,
  fillHygieneDays,
  fmtDM,
  hygieneItemKey,
  parseLayout,
  weekDays,
  weekKeyFor,
  weekdayLetter,
  weeksForMonth,
} from "./weeklyHygiene";

type Updater = (updater: (prev: RegisterDocData) => RegisterDocData) => void;

const inputCls =
  "w-full text-xs border border-brand-green/15 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold text-brand-dark disabled:bg-brand-light/60 disabled:text-brand-dark/60";

const markCls = (v: string) =>
  v === "-"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : v === "+"
      ? "bg-red-50 text-red-700 border-red-300 font-black"
      : v === "П"
        ? "bg-slate-100 text-slate-500 border-slate-200"
        : "bg-white text-brand-dark/30 border-brand-green/15";

export default function WeeklyHygieneEditor({
  email,
  data,
  month,
  refDate,
  layout,
  fridges,
  freezers,
  restDays,
  readOnly,
  onUpdate,
  onSaveLayout,
  autoFillActive = false,
  onToggleAutoFill,
}: {
  email: string;
  data: RegisterDocData;
  month: string;
  /** Избраният ден в календара */
  refDate: string;
  /** Помещенията и оборудването на обекта (от профила) */
  layout?: HygieneRoom[];
  fridges: string[];
  freezers: string[];
  restDays: number[];
  readOnly: boolean;
  onUpdate: Updater;
  onSaveLayout?: (layout: HygieneRoom[]) => void | Promise<void>;
  autoFillActive?: boolean;
  onToggleAutoFill?: (checked: boolean) => void | Promise<void>;
}) {
  const today = getLocalDateISO(new Date());
  const currentLayout = useMemo(
    () => layout ?? defaultHygieneLayout(fridges, freezers),
    [layout, fridges, freezers]
  );

  const weeks = useMemo(() => weeksForMonth(month), [month]);
  const refWeek = weekKeyFor(refDate);
  const [picked, setPicked] = useState<string | null>(null);
  const week = picked && weeks.includes(picked) ? picked : weeks.includes(refWeek) ? refWeek : weeks[0];
  const weekIdx = weeks.indexOf(week);
  const days = weekDays(week);
  const row = (data.rows || {})[week] || {};

  // Минала седмица → показва се снимката на оборудването от тогава (история);
  // текущата и бъдещите — актуалното оборудване.
  const isPastWeek = days[days.length - 1] < weekKeyFor(today);
  const rooms: HygieneRoom[] = (isPastWeek || readOnly ? parseLayout(row.__layout) : null) ?? currentLayout;

  const updateRow = (fn: (r: Record<string, string>) => Record<string, string>) =>
    onUpdate((prev) => {
      const rows = { ...(prev.rows || {}) };
      const next = fn({ ...(rows[week] || {}) });
      if (!next.__layout) next.__layout = JSON.stringify(rooms);
      rows[week] = next;
      return { ...prev, rows };
    });

  const setCell = (k: string, v: string) => updateRow((r) => ({ ...r, [k]: v }));

  const cycle = (k: string) => {
    const cur = (row[k] || "") as HygieneMark;
    const idx = HYGIENE_CYCLE.indexOf(cur);
    setCell(k, HYGIENE_CYCLE[(idx + 1) % HYGIENE_CYCLE.length]);
  };

  const fillable = days.filter((d) => d <= today);
  const refInWeek = days.includes(refDate) && refDate <= today;

  const fillDates = (dates: string[]) => {
    if (dates.length === 0) return;
    updateRow((r) => fillHygieneDays(r, rooms, dates, restDays));
  };

  /* ------------------ Редакция на помещения и оборудване ------------------ */
  const [editLayout, setEditLayout] = useState(false);
  const [draft, setDraft] = useState<HygieneRoom[]>(currentLayout);
  const [newItem, setNewItem] = useState<Record<number, string>>({});
  const [newRoom, setNewRoom] = useState("");
  const [savingLayout, setSavingLayout] = useState(false);

  const openLayoutEditor = () => {
    setDraft(currentLayout.map((r) => ({ room: r.room, items: [...r.items] })));
    setEditLayout(true);
  };

  const saveLayout = async () => {
    const clean = draft
      .map((r) => ({ room: r.room.trim(), items: r.items.map((i) => i.trim()).filter(Boolean) }))
      .filter((r) => r.room);
    setSavingLayout(true);
    try {
      await onSaveLayout?.(clean);
      setEditLayout(false);
    } finally {
      setSavingLayout(false);
    }
  };

  const nDays = days.length;

  return (
    <div className="space-y-4">
      {/* Седмица + час */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => weekIdx > 0 && setPicked(weeks[weekIdx - 1])}
            disabled={weekIdx <= 0}
            className="p-2 rounded-lg border border-brand-green/15 bg-white text-brand-green disabled:opacity-30 cursor-pointer"
            aria-label="Предишна седмица"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-center min-w-[190px]">
            <p className="text-[9px] font-black uppercase tracking-wider text-brand-dark/45">Седмица</p>
            <p className="text-sm font-bold text-brand-green">
              от {fmtDM(days[0])} до {fmtDM(days[nDays - 1])}.{days[nDays - 1].slice(0, 4)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => weekIdx < weeks.length - 1 && setPicked(weeks[weekIdx + 1])}
            disabled={weekIdx >= weeks.length - 1}
            className="p-2 rounded-lg border border-brand-green/15 bg-white text-brand-green disabled:opacity-30 cursor-pointer"
            aria-label="Следваща седмица"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-brand-dark/60">
            Час от
            <input
              type="time"
              className={`${inputCls} w-[92px]`}
              value={row.timeFrom || ""}
              disabled={readOnly}
              onChange={(e) => setCell("timeFrom", e.target.value)}
            />
          </label>
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-brand-dark/60">
            до
            <input
              type="time"
              className={`${inputCls} w-[92px]`}
              value={row.timeTo || ""}
              disabled={readOnly}
              onChange={(e) => setCell("timeTo", e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Бързи действия */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2">
          {refInWeek && (
            <button
              type="button"
              onClick={() => fillDates([refDate])}
              className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-sm"
              title="Вписва „-“ (добър) за всички помещения и съоръжения за избрания ден; вече вписаното не се променя"
            >
              <CheckCheck className="h-3.5 w-3.5 text-brand-gold" /> Всичко е наред за {fmtDM(refDate)}
            </button>
          )}
          {fillable.length > 0 && (
            <button
              type="button"
              onClick={() => fillDates(fillable)}
              className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-sm"
              title="Попълва празните клетки до днес с „-“ (добър), а почивните дни — с „П“"
            >
              <Wand2 className="h-3.5 w-3.5 text-brand-green" /> Попълни седмицата до днес
            </button>
          )}
          {onToggleAutoFill && (
            <label className="flex items-center gap-2 text-[10px] uppercase font-black text-brand-green/80 cursor-pointer select-none bg-brand-light/50 border border-brand-green/10 rounded-xl px-3 py-2">
              <input
                type="checkbox"
                checked={autoFillActive}
                onChange={(e) => onToggleAutoFill(e.target.checked)}
                className="accent-[#1B4332]"
              />
              Попълвай автоматично всеки ден
            </label>
          )}
          <button
            type="button"
            onClick={openLayoutEditor}
            className="ml-auto bg-white hover:bg-brand-light text-brand-green text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-brand-green/20"
          >
            <Settings className="h-3.5 w-3.5" /> Помещения и оборудване
          </button>
        </div>
      )}

      {/* Редактор на помещенията */}
      {editLayout && !readOnly && (
        <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/5 p-4 space-y-4">
          <div>
            <p className="text-sm font-bold text-brand-green">Помещения и оборудване на обекта</p>
            <p className="text-[11px] text-brand-dark/60">
              Впишете Вашите помещения и оборудване (хладилници, фризери, витрини, машини…). Промяната важи от текущата седмица нататък — старите седмици пазят оборудването, с което са попълнени.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {draft.map((r, ri) => (
              <div key={ri} className="bg-white rounded-xl border border-brand-green/10 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    className={`${inputCls} font-bold`}
                    value={r.room}
                    onChange={(e) => setDraft(draft.map((x, j) => (j === ri ? { ...x, room: e.target.value } : x)))}
                  />
                  <button
                    type="button"
                    onClick={() => setDraft(draft.filter((_, j) => j !== ri))}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer border-0 bg-transparent"
                    title="Премахни помещението"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.items.map((it, ii) => (
                    <span key={ii} className="inline-flex items-center gap-1 text-[11px] bg-brand-light/60 border border-brand-green/10 rounded-full pl-2.5 pr-1 py-0.5">
                      {it}
                      <button
                        type="button"
                        onClick={() =>
                          setDraft(draft.map((x, j) => (j === ri ? { ...x, items: x.items.filter((_, k) => k !== ii) } : x)))
                        }
                        className="p-0.5 rounded-full hover:bg-red-100 text-brand-dark/40 hover:text-red-600 cursor-pointer border-0 bg-transparent"
                        aria-label={`Премахни ${it}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    className={inputCls}
                    placeholder="напр. Хладилна витрина №2"
                    value={newItem[ri] || ""}
                    onChange={(e) => setNewItem({ ...newItem, [ri]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      const v = (newItem[ri] || "").trim();
                      if (!v) return;
                      setDraft(draft.map((x, j) => (j === ri ? { ...x, items: [...x.items, v] } : x)));
                      setNewItem({ ...newItem, [ri]: "" });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = (newItem[ri] || "").trim();
                      if (!v) return;
                      setDraft(draft.map((x, j) => (j === ri ? { ...x, items: [...x.items, v] } : x)));
                      setNewItem({ ...newItem, [ri]: "" });
                    }}
                    className="shrink-0 bg-brand-gold text-brand-dark rounded-lg px-2.5 cursor-pointer border-0"
                    aria-label="Добави"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="bg-white/60 rounded-xl border border-dashed border-brand-green/20 p-3 flex flex-col justify-center gap-2">
              <p className="text-[11px] font-bold text-brand-green">Ново помещение</p>
              <div className="flex gap-1.5">
                <input
                  className={inputCls}
                  placeholder="напр. Кухня, Съблекалня"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    const v = newRoom.trim();
                    if (!v) return;
                    setDraft([...draft, { room: v, items: ["Под", "Стени", "Таван", "Врати", "Осветителни тела"] }]);
                    setNewRoom("");
                  }}
                  className="shrink-0 bg-brand-gold text-brand-dark rounded-lg px-2.5 cursor-pointer border-0"
                  aria-label="Добави помещение"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              type="button"
              onClick={() => setDraft(defaultHygieneLayout(fridges, freezers))}
              className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-brand-green/20 text-brand-green bg-white cursor-pointer"
            >
              По подразбиране
            </button>
            <button
              type="button"
              onClick={() => setEditLayout(false)}
              className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-brand-green/20 text-brand-green bg-white cursor-pointer"
            >
              Отказ
            </button>
            <button
              type="button"
              onClick={saveLayout}
              disabled={savingLayout}
              className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-brand-green text-white cursor-pointer border-0 disabled:opacity-50"
            >
              Запиши
            </button>
          </div>
        </div>
      )}

      {/* Таблица */}
      <div className="overflow-x-auto rounded-xl border border-brand-green/10">
        <table className="text-[11px] border-collapse min-w-full">
          <thead>
            <tr className="bg-brand-green text-white text-[9px] uppercase tracking-wider">
              <th rowSpan={2} className="p-2 text-left sticky left-0 bg-brand-green z-10 min-w-[150px]">Помещение</th>
              <th colSpan={nDays} className="p-1.5 border-l border-white/20">Техническо състояние</th>
              <th colSpan={nDays} className="p-1.5 border-l border-white/20">Хигиена на обекта</th>
              <th rowSpan={2} className="p-2 border-l border-white/20 min-w-[150px]">Корективни действия</th>
              <th rowSpan={2} className="p-2 border-l border-white/20 min-w-[120px]">Резултат след корективни д-я</th>
              <th rowSpan={2} className="p-2 border-l border-white/20 min-w-[90px]">Подпис</th>
            </tr>
            <tr className="bg-brand-green/90 text-white text-[10px]">
              {[0, 1].map((g) =>
                days.map((d, i) => (
                  <th
                    key={`${g}-${d}`}
                    className={`px-1 py-1 font-bold min-w-[30px] ${i === 0 ? "border-l border-white/20" : ""} ${d === refDate ? "bg-brand-gold text-brand-dark" : ""}`}
                  >
                    <span className="block leading-none">{d.slice(8, 10)}</span>
                    <span className="block text-[8px] opacity-70 leading-none mt-0.5">{weekdayLetter(d)}</span>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <RoomRows
                key={r.room}
                room={r}
                days={days}
                row={row}
                today={today}
                refDate={refDate}
                readOnly={readOnly}
                onCycle={cycle}
                onText={setCell}
              />
            ))}
          </tbody>
        </table>
      </div>

      <LegacyPreworkEntries email={email} month={month} />
    </div>
  );
}

function RoomRows({
  room,
  days,
  row,
  today,
  refDate,
  readOnly,
  onCycle,
  onText,
}: {
  room: HygieneRoom;
  days: string[];
  row: Record<string, string>;
  today: string;
  refDate: string;
  readOnly: boolean;
  onCycle: (k: string) => void;
  onText: (k: string, v: string) => void;
}) {
  return (
    <>
      <tr className="bg-brand-gold/10">
        <td colSpan={days.length * 2 + 4} className="px-2 py-1.5 font-black text-[10px] uppercase tracking-wider text-brand-green sticky left-0">
          {room.room}
        </td>
      </tr>
      {room.items.map((item) => {
        const ik = hygieneItemKey(room.room, item);
        return (
          <tr key={ik} className="border-t border-brand-green/5 hover:bg-brand-light/30">
            <td className="px-2 py-1 text-brand-dark/80 sticky left-0 bg-white z-[1] whitespace-nowrap">{item}</td>
            {(["t", "h"] as const).map((part) =>
              days.map((d, i) => {
                const k = cellKey(d, ik, part);
                const v = row[k] || "";
                const future = d > today;
                return (
                  <td key={k} className={`p-0.5 text-center ${i === 0 ? "border-l border-brand-green/10" : ""} ${d === refDate ? "bg-brand-gold/10" : ""}`}>
                    <button
                      type="button"
                      disabled={readOnly || future}
                      onClick={() => onCycle(k)}
                      className={`w-7 h-7 rounded-md border text-xs font-bold cursor-pointer disabled:cursor-default ${future ? "opacity-30" : ""} ${markCls(v)}`}
                      title="Кликнете: „-“ добър → „+“ незадоволителен → „П“ почивен ден → празно"
                    >
                      {v || "·"}
                    </button>
                  </td>
                );
              })
            )}
            {(["c", "a", "s"] as const).map((p) => (
              <td key={p} className="p-0.5 border-l border-brand-green/10">
                <input
                  className={`${inputCls} ${p === "s" ? "min-w-[80px]" : "min-w-[120px]"}`}
                  value={row[`${p}|${ik}`] || ""}
                  disabled={readOnly}
                  onChange={(e) => onText(`${p}|${ik}`, e.target.value)}
                />
              </td>
            ))}
          </tr>
        );
      })}
    </>
  );
}

/** Записите от стария (месечен) формат на чек-листа — само за преглед. */
function LegacyPreworkEntries({ email, month }: { email: string; month: string }) {
  const [entries, setEntries] = useState<Array<Record<string, string>> | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDoc(doc(db, "logs", registerDocKey(email, "prework-check", month)))
      .then((snap) => {
        if (cancelled) return;
        const list = (snap.exists() ? (snap.data().entries as Array<Record<string, string>>) : []) || [];
        setEntries(list.slice().sort((a, b) => String(a.date || "").localeCompare(String(b.date || ""))));
      })
      .catch(() => !cancelled && setEntries([]));
    return () => {
      cancelled = true;
    };
  }, [email, month]);

  if (!entries || entries.length === 0) return null;
  return (
    <details className="bg-brand-light/40 border border-brand-green/10 rounded-xl px-4 py-3">
      <summary className="text-[10px] font-black uppercase text-brand-green cursor-pointer flex items-center gap-1.5">
        <History className="h-3.5 w-3.5" /> Записи в стария формат за този месец ({entries.length})
      </summary>
      <div className="overflow-x-auto mt-3">
        <table className="text-[10px] border-collapse">
          <thead>
            <tr className="text-brand-green">
              <th className="p-1 text-left">Дата</th>
              {PREWORK_ZONE_COLS.map((c) => (
                <th key={c.key} className="p-1 whitespace-nowrap">{c.label}</th>
              ))}
              <th className="p-1">Резултат</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={i} className="border-t border-brand-green/5">
                <td className="p-1 whitespace-nowrap">{e.date}</td>
                {PREWORK_ZONE_COLS.map((c) => (
                  <td key={c.key} className="p-1 text-center">{e[c.key] || ""}</td>
                ))}
                <td className="p-1">{e.result || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
