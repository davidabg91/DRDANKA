"use client";

/**
 * Панел за администратора (д-р Николова): изпраща ръчна задача/напомняне
 * към конкретен обект, за избрана дата. Появява се в напомнянията на клиента.
 */

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  ADMIN_REMINDERS_ID,
  AdminReminder,
  registerDocKey,
  registersFor,
} from "@/data/storeRegisters";
import { Send, Trash2, Loader2, CheckCircle, Clock, Plus } from "lucide-react";

const todayISO = () => new Date().toISOString().split("T")[0];

export default function AdminReminderComposer({
  email,
  firmName,
}: {
  email: string;
  firmName: string;
}) {
  const [items, setItems] = useState<AdminReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [text, setText] = useState("");
  const [registerId, setRegisterId] = useState("");

  const key = registerDocKey(email, ADMIN_REMINDERS_ID, "all");
  const allRegisters = registersFor(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const snap = await getDoc(doc(db, "logs", key));
        if (cancelled) return;
        setItems(((snap.exists() ? snap.data().entries : []) || []) as AdminReminder[]);
      } catch (err) {
        console.error("Admin reminders load error", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  const persist = async (next: AdminReminder[]) => {
    setSaving(true);
    try {
      await setDoc(doc(db, "logs", key), { entries: next, updatedAt: new Date().toISOString() });
      setItems(next);
    } catch (err: any) {
      alert("Грешка при запис: " + (err?.message || err));
    } finally {
      setSaving(false);
    }
  };

  const addReminder = () => {
    if (!text.trim()) {
      alert("Въведете текст на задачата.");
      return;
    }
    const item: AdminReminder = {
      id: "adm_" + Date.now(),
      date: date || todayISO(),
      text: text.trim(),
      registerId: registerId || undefined,
      createdAt: new Date().toISOString(),
    };
    persist([...items, item]);
    setText("");
    setRegisterId("");
  };

  const removeReminder = (id: string) => {
    if (!confirm("Изтриване на тази задача?")) return;
    persist(items.filter((i) => i.id !== id));
  };

  const active = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);

  return (
    <div className="border border-brand-gold/30 bg-brand-gold/5 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-brand-gold/15 text-brand-gold rounded-xl">
          <Send className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-serif text-sm font-bold text-brand-green">Изпрати задача към обекта</h3>
          <p className="text-[10px] text-brand-dark/50">
            Ще се появи в „Напомняния“ на {firmName || "обекта"} от избраната дата, докато не я отбележат за изпълнена.
          </p>
        </div>
      </div>

      {/* Форма */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">За дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-xs border border-brand-green/15 rounded-lg px-2 py-2 bg-white focus:outline-none focus:border-brand-gold text-brand-dark"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">Задача / съобщение</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addReminder()}
            placeholder="напр. Обновете срока на договора с ДДД фирмата и попълнете новия ремонт"
            className="w-full text-xs border border-brand-green/15 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-brand-gold text-brand-dark"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">
            Свържи с карта (по избор) — кликването води клиента директно към нея
          </label>
          <select
            value={registerId}
            onChange={(e) => setRegisterId(e.target.value)}
            className="w-full text-xs border border-brand-green/15 rounded-lg px-2 py-2 bg-white focus:outline-none focus:border-brand-gold text-brand-dark"
          >
            <option value="">— без конкретна карта —</option>
            {allRegisters.map((r) => (
              <option key={r.id} value={r.id}>
                {r.num}. {r.shortTitle}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={addReminder}
          disabled={saving}
          className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] uppercase font-black px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border-0 shadow-md shadow-brand-green/15 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Изпрати задача
        </button>
      </div>

      {/* Списък */}
      {loading ? (
        <div className="flex items-center gap-2 text-brand-dark/40 text-xs py-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Зареждане…
        </div>
      ) : (
        <div className="space-y-2">
          {active.length === 0 && done.length === 0 && (
            <p className="text-[11px] text-brand-dark/40 italic">Няма изпратени задачи към този обект.</p>
          )}
          {active.map((i) => (
            <div key={i.id} className="flex items-center gap-3 bg-white border border-brand-green/10 rounded-xl px-3.5 py-2.5">
              <Clock className="h-4 w-4 text-brand-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-dark/85">{i.text}</p>
                <p className="text-[9px] text-brand-dark/45">
                  За дата {i.date}
                  {i.registerId ? ` · карта: ${allRegisters.find((r) => r.id === i.registerId)?.shortTitle || i.registerId}` : ""}
                </p>
              </div>
              <button
                onClick={() => removeReminder(i.id)}
                className="text-red-300 hover:text-red-500 cursor-pointer p-1 shrink-0"
                title="Изтрий"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {done.map((i) => (
            <div key={i.id} className="flex items-center gap-3 bg-green-50/60 border border-green-200 rounded-xl px-3.5 py-2.5 opacity-80">
              <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-dark/60 line-through">{i.text}</p>
                <p className="text-[9px] text-green-700 font-bold">
                  Изпълнено{i.doneAt ? ` на ${i.doneAt.split("T")[0]}` : ""}
                </p>
              </div>
              <button
                onClick={() => removeReminder(i.id)}
                className="text-brand-dark/25 hover:text-red-500 cursor-pointer p-1 shrink-0"
                title="Премахни от списъка"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
