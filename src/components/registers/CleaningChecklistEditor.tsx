"use client";

/**
 * Редактор на чек-лист за почистване, измиване и дезинфекция (№48) —
 * дневна таблица по помещения. Модел и помощни функции: ./cleaningChecklist.ts.
 */

import { useMemo, useState } from "react";
import { BookmarkCheck, ChevronLeft, ChevronRight, Copy, Settings, Wand2 } from "lucide-react";
import type { RegisterDocData } from "./registerPrint";
import { getLocalDateISO } from "@/lib/dateUtils";
import RoomLayoutEditor from "./RoomLayoutEditor";
import SignatureCell from "./SignatureCell";
import { HygieneRoom, fmtDM, hygieneItemKey, parseLayout } from "./weeklyHygiene";
import {
  CleaningTemplate,
  applyCleaningTemplate,
  cleaningKey,
  defaultCleaningLayout,
  hasTemplate,
  isCleaningDayFilled,
  templateFromRow,
} from "./cleaningChecklist";

type Updater = (updater: (prev: RegisterDocData) => RegisterDocData) => void;

const inputCls =
  "w-full text-xs border border-brand-green/15 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold text-brand-dark disabled:bg-brand-light/60 disabled:text-brand-dark/60";

const WEEKDAYS = ["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота"];
const weekdayOf = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
};

export default function CleaningChecklistEditor({
  data,
  month,
  refDate,
  layout,
  template,
  employees,
  agentOptions,
  restDays,
  readOnly,
  onUpdate,
  onSaveLayout,
  onSaveTemplate,
  autoFillActive = false,
  onToggleAutoFill,
}: {
  data: RegisterDocData;
  month: string;
  refDate: string;
  layout?: HygieneRoom[];
  template?: CleaningTemplate;
  employees: string[];
  /** Препаратите от „Списък на препаратите" (ако обектът го води) */
  agentOptions: string[];
  restDays: number[];
  readOnly: boolean;
  onUpdate: Updater;
  onSaveLayout?: (layout: HygieneRoom[]) => void | Promise<void>;
  onSaveTemplate?: (t: CleaningTemplate) => void | Promise<void>;
  autoFillActive?: boolean;
  onToggleAutoFill?: (checked: boolean) => void | Promise<void>;
}) {
  const today = getLocalDateISO(new Date());
  const currentLayout = useMemo(() => layout ?? defaultCleaningLayout(), [layout]);
  const rows = data.rows || {};

  // Дните на месеца до днес (бъдещите не се попълват).
  const monthDays = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const n = new Date(y, m, 0).getDate();
    return Array.from({ length: n }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`).filter((d) => d <= today);
  }, [month, today]);

  const [picked, setPicked] = useState<string | null>(null);
  const date =
    picked && monthDays.includes(picked)
      ? picked
      : monthDays.includes(refDate)
        ? refDate
        : monthDays[monthDays.length - 1] ?? `${month}-01`;
  const dayIdx = monthDays.indexOf(date);
  const row = rows[date] || {};
  const isPast = date < today;
  const rooms: HygieneRoom[] = (isPast || readOnly ? parseLayout(row.__layout) : null) ?? currentLayout;
  const isRest = restDays.includes(weekdayOf(date));

  const [editLayout, setEditLayout] = useState(false);
  const [notice, setNotice] = useState("");

  const updateDay = (d: string, fn: (r: Record<string, string>) => Record<string, string>) =>
    onUpdate((prev) => {
      const all = { ...(prev.rows || {}) };
      const next = fn({ ...(all[d] || {}) });
      if (!next.__layout) next.__layout = JSON.stringify(rooms);
      all[d] = next;
      return { ...prev, rows: all };
    });

  const setCell = (k: string, v: string) => updateDay(date, (r) => ({ ...r, [k]: v }));

  const prevFilled = [...monthDays].reverse().find((d) => d < date && isCleaningDayFilled(rows, d));

  const copyPrevious = () => {
    if (!prevFilled) return;
    const t = templateFromRow(rows[prevFilled], currentLayout);
    updateDay(date, (r) => applyCleaningTemplate(r, currentLayout, t));
  };

  const fillToToday = () => {
    if (!hasTemplate(template)) return;
    const targets = monthDays.filter((d) => !isCleaningDayFilled(rows, d) && !restDays.includes(weekdayOf(d)));
    if (targets.length === 0) {
      setNotice("Всички работни дни до днес вече са попълнени.");
      return;
    }
    onUpdate((prev) => {
      const all = { ...(prev.rows || {}) };
      targets.forEach((d) => {
        all[d] = applyCleaningTemplate(all[d] || {}, currentLayout, template);
      });
      return { ...prev, rows: all };
    });
    setNotice(`Попълнени ${targets.length} дни по образеца.`);
  };

  const saveAsTemplate = async () => {
    const t = templateFromRow(row, rooms);
    if (!hasTemplate(t)) {
      setNotice("Първо попълнете поне един обект за този ден.");
      return false;
    }
    await onSaveTemplate?.(t);
    setNotice("Денят е запомнен като образец за автоматичното попълване.");
    return true;
  };

  const toggleAuto = async (checked: boolean) => {
    if (checked && !hasTemplate(template)) {
      // Без образец няма какво да се попълва — вземаме текущия ден.
      const ok = await saveAsTemplate();
      if (!ok) {
        setNotice("За автоматично попълване първо попълнете един ден (препарат и кой е почистил) — той става образец.");
        return;
      }
    }
    await onToggleAutoFill?.(checked);
  };

  const agentListId = "cleaning-agents-list";
  const staffListId = "cleaning-staff-list";

  return (
    <div className="space-y-4">
      <datalist id={agentListId}>
        {agentOptions.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>
      <datalist id={staffListId}>
        {employees.map((e) => (
          <option key={e} value={e} />
        ))}
      </datalist>

      {/* Ден */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dayIdx > 0 && setPicked(monthDays[dayIdx - 1])}
            disabled={dayIdx <= 0}
            className="p-2 rounded-lg border border-brand-green/15 bg-white text-brand-green disabled:opacity-30 cursor-pointer"
            aria-label="Предишен ден"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-center min-w-[170px]">
            <p className="text-[9px] font-black uppercase tracking-wider text-brand-dark/45">Дата</p>
            <p className="text-sm font-bold text-brand-green">
              {fmtDM(date)}.{date.slice(0, 4)} <span className="text-brand-dark/50 font-medium">· {WEEKDAYS[weekdayOf(date)]}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => dayIdx < monthDays.length - 1 && setPicked(monthDays[dayIdx + 1])}
            disabled={dayIdx >= monthDays.length - 1}
            className="p-2 rounded-lg border border-brand-green/15 bg-white text-brand-green disabled:opacity-30 cursor-pointer"
            aria-label="Следващ ден"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        {isRest && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
            Почивен ден
          </span>
        )}
      </div>

      {/* Действия */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2">
          {prevFilled && (
            <button
              type="button"
              onClick={copyPrevious}
              className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-sm"
              title={`Копира препаратите и изпълнителите от ${fmtDM(prevFilled)} в празните клетки`}
            >
              <Copy className="h-3.5 w-3.5 text-brand-gold" /> Като {fmtDM(prevFilled)}
            </button>
          )}
          <button
            type="button"
            onClick={saveAsTemplate}
            className="bg-white hover:bg-brand-light text-brand-green text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-brand-green/20"
            title="Запомня попълнения ден като образец за автоматичното попълване"
          >
            <BookmarkCheck className="h-3.5 w-3.5" /> Запомни като образец
          </button>
          {hasTemplate(template) && (
            <button
              type="button"
              onClick={fillToToday}
              className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-sm"
              title="Попълва празните работни дни до днес по образеца"
            >
              <Wand2 className="h-3.5 w-3.5 text-brand-green" /> Попълни до днес по образеца
            </button>
          )}
          {onToggleAutoFill && (
            <label className="flex items-center gap-2 text-[10px] uppercase font-black text-brand-green/80 cursor-pointer select-none bg-brand-light/50 border border-brand-green/10 rounded-xl px-3 py-2">
              <input
                type="checkbox"
                checked={autoFillActive}
                onChange={(e) => toggleAuto(e.target.checked)}
                className="accent-[#1B4332]"
              />
              Попълвай автоматично всеки ден
            </label>
          )}
          <button
            type="button"
            onClick={() => setEditLayout(true)}
            className="ml-auto bg-white hover:bg-brand-light text-brand-green text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-brand-green/20"
          >
            <Settings className="h-3.5 w-3.5" /> Помещения и обекти
          </button>
        </div>
      )}
      {notice && !readOnly && <p className="text-[11px] font-bold text-brand-green">{notice}</p>}

      {editLayout && !readOnly && (
        <RoomLayoutEditor
          initial={currentLayout}
          defaults={defaultCleaningLayout()}
          title="Помещения и обекти за почистване"
          hint="Впишете помещенията и обектите, които почиствате, измивате и дезинфекцирате. Промяната важи от днес нататък — миналите дни пазят списъка, с който са попълнени."
          itemPlaceholder="напр. Витрина за колбаси"
          newRoomItems={["Под", "Стени"]}
          onSave={async (l) => {
            await onSaveLayout?.(l);
            setEditLayout(false);
          }}
          onCancel={() => setEditLayout(false)}
        />
      )}

      {/* Таблица */}
      <div className="overflow-x-auto rounded-xl border border-brand-green/10">
        <table className="text-[11px] border-collapse min-w-full">
          <thead>
            <tr className="bg-brand-green text-white text-[9px] uppercase tracking-wider">
              <th className="p-2 text-left min-w-[170px]">Обект за почистване, измиване и дезинфекция</th>
              <th className="p-2 text-left min-w-[180px]">Използван препарат</th>
              <th className="p-2 text-left min-w-[160px]">Извършил — име</th>
              <th className="p-2 text-left min-w-[100px]">Подпис</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <RoomBlock key={r.room} room={r} row={row} readOnly={readOnly} onSet={setCell} agentListId={agentListId} staffListId={staffListId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoomBlock({
  room,
  row,
  readOnly,
  onSet,
  agentListId,
  staffListId,
}: {
  room: HygieneRoom;
  row: Record<string, string>;
  readOnly: boolean;
  onSet: (k: string, v: string) => void;
  agentListId: string;
  staffListId: string;
}) {
  return (
    <>
      <tr className="bg-brand-gold/10">
        <td colSpan={4} className="px-2 py-1.5 font-black text-[10px] uppercase tracking-wider text-brand-green">
          {room.room}
        </td>
      </tr>
      {room.items.map((item) => {
        const ik = hygieneItemKey(room.room, item);
        return (
          <tr key={ik} className="border-t border-brand-green/5 hover:bg-brand-light/30">
            <td className="px-2 py-1 text-brand-dark/80">{item}</td>
            <td className="p-0.5">
              <input
                className={inputCls}
                list={agentListId}
                value={row[cleaningKey(ik, "agent")] || ""}
                disabled={readOnly}
                onChange={(e) => onSet(cleaningKey(ik, "agent"), e.target.value)}
              />
            </td>
            <td className="p-0.5">
              <input
                className={inputCls}
                list={staffListId}
                value={row[cleaningKey(ik, "by")] || ""}
                disabled={readOnly}
                onChange={(e) => onSet(cleaningKey(ik, "by"), e.target.value)}
              />
            </td>
            <td className="p-0.5">
              <SignatureCell
                value={row[cleaningKey(ik, "sign")] || ""}
                readOnly={readOnly}
                filled={!!(row[cleaningKey(ik, "agent")] || row[cleaningKey(ik, "by")])}
                onChange={(v) => onSet(cleaningKey(ik, "sign"), v)}
              />
            </td>
          </tr>
        );
      })}
    </>
  );
}
