"use client";

/**
 * Редактор на „помещения → обекти/оборудване" — общ за чек-листите по
 * хигиена (№34 „Хигиена на обекта" и „Почистване, измиване и дезинфекция").
 */

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { HygieneRoom } from "./weeklyHygiene";

const inputCls =
  "w-full text-xs border border-brand-green/15 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold text-brand-dark";

export default function RoomLayoutEditor({
  initial,
  defaults,
  title,
  hint,
  itemPlaceholder,
  newRoomItems,
  onSave,
  onCancel,
}: {
  initial: HygieneRoom[];
  defaults: HygieneRoom[];
  title: string;
  hint: string;
  itemPlaceholder: string;
  /** Обектите, с които започва ново помещение */
  newRoomItems: string[];
  onSave: (layout: HygieneRoom[]) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<HygieneRoom[]>(() => initial.map((r) => ({ room: r.room, items: [...r.items] })));
  const [newItem, setNewItem] = useState<Record<number, string>>({});
  const [newRoom, setNewRoom] = useState("");
  const [saving, setSaving] = useState(false);

  const addItem = (ri: number) => {
    const v = (newItem[ri] || "").trim();
    if (!v) return;
    setDraft(draft.map((x, j) => (j === ri ? { ...x, items: [...x.items, v] } : x)));
    setNewItem({ ...newItem, [ri]: "" });
  };

  const addRoom = () => {
    const v = newRoom.trim();
    if (!v) return;
    setDraft([...draft, { room: v, items: [...newRoomItems] }]);
    setNewRoom("");
  };

  const save = async () => {
    const clean = draft
      .map((r) => ({ room: r.room.trim(), items: r.items.map((i) => i.trim()).filter(Boolean) }))
      .filter((r) => r.room);
    setSaving(true);
    try {
      await onSave(clean);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/5 p-4 space-y-4">
      <div>
        <p className="text-sm font-bold text-brand-green">{title}</p>
        <p className="text-[11px] text-brand-dark/60">{hint}</p>
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
                placeholder={itemPlaceholder}
                value={newItem[ri] || ""}
                onChange={(e) => setNewItem({ ...newItem, [ri]: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addItem(ri)}
              />
              <button
                type="button"
                onClick={() => addItem(ri)}
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
              onKeyDown={(e) => e.key === "Enter" && addRoom()}
            />
            <button
              type="button"
              onClick={addRoom}
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
          onClick={() => setDraft(defaults.map((r) => ({ room: r.room, items: [...r.items] })))}
          className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-brand-green/20 text-brand-green bg-white cursor-pointer"
        >
          По подразбиране
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg border border-brand-green/20 text-brand-green bg-white cursor-pointer"
        >
          Отказ
        </button>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-brand-green text-white cursor-pointer border-0 disabled:opacity-50"
        >
          Запиши
        </button>
      </div>
    </div>
  );
}
