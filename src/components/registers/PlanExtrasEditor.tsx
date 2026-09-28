"use client";

/**
 * Админ панел за плана на обекта и ръчно избраните „допълнителни записи"
 * (пакет „Професионал" и VIP). Показва се над одита на дневниците.
 */

import { useMemo, useState } from "react";
import { Check, Layers, Loader2 } from "lucide-react";
import {
  STORE_REGISTER_IDS,
  HOT_POINT_REGISTERS,
  MEAT_REGISTERS,
  RegisterDef,
} from "@/data/storeRegisters";
import { PLANS, PLAN_BY_ID, PlanId, isExtraRegister, planHasExtras } from "@/lib/plans";

interface Props {
  plan: PlanId;
  /** true, ако планът не е записан в профила (стар клиент → VIP по подразбиране) */
  planIsDefault: boolean;
  extraRegisters?: string[];
  onSavePlan: (plan: PlanId) => void | Promise<unknown>;
  onSaveExtras: (ids: string[] | null) => void | Promise<unknown>;
}

const EXTRA_CANDIDATES: RegisterDef[] = [...HOT_POINT_REGISTERS, ...MEAT_REGISTERS].filter((r) =>
  isExtraRegister(r.id, STORE_REGISTER_IDS)
);

export default function PlanExtrasEditor({ plan, planIsDefault, extraRegisters, onSavePlan, onSaveExtras }: Props) {
  const configured = extraRegisters !== undefined;
  const [selected, setSelected] = useState<Set<string>>(
    new Set(extraRegisters ?? EXTRA_CANDIDATES.map((r) => r.id))
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const dirty = useMemo(() => {
    const base = new Set(extraRegisters ?? EXTRA_CANDIDATES.map((r) => r.id));
    if (!configured) return true;
    if (base.size !== selected.size) return true;
    for (const id of selected) if (!base.has(id)) return true;
    return false;
  }, [extraRegisters, configured, selected]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const save = async (ids: string[] | null) => {
    setSaving(true);
    try {
      await onSaveExtras(ids);
      setSavedAt(Date.now());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-green/10 bg-brand-light/40 p-5 space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-gold/15 text-brand-gold-dark rounded-lg">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-green">Абонаментен план на обекта</p>
            <p className="text-[11px] text-brand-dark/55">
              Планът определя кои дневници вижда клиентът.
              {planIsDefault && " Планът не е зададен — стар клиент, води се VIP."}
            </p>
          </div>
        </div>
        <select
          value={planIsDefault ? "" : plan}
          onChange={(e) => e.target.value && onSavePlan(e.target.value as PlanId)}
          className="text-xs border border-brand-green/20 rounded-lg px-3 py-2 bg-white font-bold text-brand-green focus:outline-none focus:border-brand-gold"
        >
          {planIsDefault && <option value="">— не е зададен (VIP) —</option>}
          {PLANS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.tierLabel}) · {p.priceEur} €
            </option>
          ))}
        </select>
      </div>

      {planHasExtras(plan) ? (
        <div className="space-y-3 border-t border-brand-green/10 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-brand-green">Допълнителни записи според дейността на обекта</p>
              <p className="text-[11px] text-brand-dark/55 leading-relaxed">
                {configured
                  ? "Клиентът вижда само отметнатите карти (освен основните и тези от „Оптимум“)."
                  : "Още не са настройвани — клиентът вижда всички карти, приложими за вида на обекта. Отметнете нужните и запишете."}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-brand-green/20 text-brand-green hover:bg-brand-green/5 cursor-pointer bg-white"
              >
                Изчисти
              </button>
              {configured && (
                <button
                  type="button"
                  onClick={() => save(null)}
                  disabled={saving}
                  className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-brand-green/20 text-brand-green hover:bg-brand-green/5 cursor-pointer bg-white disabled:opacity-50"
                  title="Връща поведението „всички приложими според вида на обекта“"
                >
                  По вида на обекта
                </button>
              )}
              <button
                type="button"
                onClick={() => save([...selected])}
                disabled={saving || !dirty}
                className="text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-lg bg-brand-green text-white hover:bg-brand-green/90 cursor-pointer border-0 disabled:opacity-40 inline-flex items-center gap-1.5"
              >
                {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                Запиши
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
            {EXTRA_CANDIDATES.map((r) => (
              <label
                key={r.id}
                className={`flex items-start gap-2 text-[11px] leading-snug px-2.5 py-2 rounded-lg border cursor-pointer transition-colors ${
                  selected.has(r.id) ? "bg-white border-brand-gold/50 text-brand-dark" : "bg-transparent border-brand-green/10 text-brand-dark/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(r.id)}
                  onChange={() => toggle(r.id)}
                  className="mt-0.5 accent-[#1B4332]"
                />
                <span>
                  <span className="font-mono text-brand-dark/40 mr-1">{r.num}.</span>
                  {r.shortTitle}
                </span>
              </label>
            ))}
          </div>
          {savedAt && !dirty && <p className="text-[10px] text-emerald-700 font-bold">Записано.</p>}
        </div>
      ) : (
        <p className="text-[11px] text-brand-dark/55 border-t border-brand-green/10 pt-3">
          Допълнителните записи се настройват ръчно в пакет „{PLAN_BY_ID.pro.name}“ и „{PLAN_BY_ID.vip.name}“.
        </p>
      )}
    </div>
  );
}
