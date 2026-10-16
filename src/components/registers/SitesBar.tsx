"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, MapPin } from "lucide-react";
import { BUSINESS_CATEGORIES, getSectorForNiche } from "@/data/businessCategories";
import { MAIN_SITE_ID, type SiteView } from "@/lib/sites";
import { EXTRA_SITE_DISCOUNT, PLAN_BY_ID, extraSitePriceEur, formatEur, planFeeEur, type PlanId } from "@/lib/plans";

export interface SiteFormData {
  name: string;
  niche: string;
  address: string;
  manager: string;
}

/** Малка икона „сграда с навес" за обект. */
function SiteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 9.5 5 4h14l2 5.5" />
      <path d="M3 9.5c0 1.4 1.1 2.5 2.5 2.5S8 10.9 8 9.5c0 1.4 1.1 2.5 2.5 2.5h3c1.4 0 2.5-1.1 2.5-2.5 0 1.4 1.1 2.5 2.5 2.5S21 10.9 21 9.5" />
      <path d="M5 12v8h14v-8" />
      <path d="M10 20v-4.5h4V20" />
    </svg>
  );
}

export default function SitesBar({
  sites,
  activeId,
  plan,
  defaultNiche,
  onSelect,
  onAdd,
  onEdit,
  onRemove,
}: {
  sites: SiteView[];
  activeId: string;
  plan: PlanId;
  /** Видът на основния обект — начална стойност за нов обект. */
  defaultNiche: string;
  onSelect: (id: string) => void;
  onAdd: (data: SiteFormData) => Promise<boolean>;
  onEdit: (id: string, data: SiteFormData) => Promise<boolean>;
  onRemove: (id: string) => Promise<boolean>;
}) {
  const [modal, setModal] = useState<{ mode: "add" } | { mode: "edit"; site: SiteView } | null>(null);
  const [form, setForm] = useState<SiteFormData>({ name: "", niche: defaultNiche, address: "", manager: "" });
  const [sector, setSector] = useState(getSectorForNiche(defaultNiche));
  const [busy, setBusy] = useState(false);

  const count = sites.length;
  const extraPrice = extraSitePriceEur(plan);

  const open = (m: { mode: "add" } | { mode: "edit"; site: SiteView }) => {
    const base = m.mode === "edit"
      ? { name: m.site.name, niche: m.site.niche || defaultNiche, address: m.site.address || "", manager: m.site.manager || "" }
      : { name: "", niche: defaultNiche, address: "", manager: "" };
    setForm(base);
    setSector(getSectorForNiche(base.niche));
    setModal(m);
  };

  const submit = async () => {
    if (!modal) return;
    if (!form.name.trim()) {
      alert("Моля, въведете име на обекта (напр. „Кафене Център“).");
      return;
    }
    setBusy(true);
    const data = { ...form, name: form.name.trim(), address: form.address.trim(), manager: form.manager.trim() };
    const ok = modal.mode === "add" ? await onAdd(data) : await onEdit(modal.site.id, data);
    setBusy(false);
    if (ok) setModal(null);
  };

  const remove = async (site: SiteView) => {
    if (!confirm(`Да премахнем ли обект „${site.name}“?\n\nТой изчезва от списъка и месечната такса намалява. Записите в дневниците му се пазят и д-р Николова може да ги възстанови при нужда.`)) return;
    setBusy(true);
    await onRemove(site.id);
    setBusy(false);
  };

  const isMainEdit = modal?.mode === "edit" && modal.site.id === MAIN_SITE_ID;
  const inputCls = "w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white";
  const labelCls = "text-[10px] font-bold uppercase tracking-wider text-brand-dark/60";

  return (
    <div className="bg-white border border-brand-green/10 rounded-2xl p-3 sm:p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <SiteIcon className="h-5 w-5 text-brand-gold shrink-0" />
          <p className="text-xs font-bold text-brand-green uppercase tracking-wider truncate">
            {count > 1 ? `Обекти на фирмата (${count})` : "Вашият обект"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => open({ mode: "add" })}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-green text-white text-[11px] font-bold uppercase tracking-wider hover:bg-brand-green/90 transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" /> Добави обект
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {sites.map((s) => {
          const active = s.id === activeId;
          return (
            <div
              key={s.id}
              className={`group shrink-0 flex items-center rounded-xl border transition-colors ${active ? "bg-brand-green border-brand-green text-white" : "bg-brand-light/50 border-brand-green/15 text-brand-green hover:border-brand-gold/60"}`}
            >
              <button type="button" onClick={() => onSelect(s.id)} className="text-left pl-3 pr-2 py-2 max-w-[220px]" aria-pressed={active}>
                <span className="block text-xs font-bold truncate">{s.name}</span>
                <span className={`block text-[10px] truncate ${active ? "text-white/70" : "text-brand-dark/50"}`}>{s.niche || "—"}</span>
              </button>
              {active && (
                <div className="flex items-center pr-1.5">
                  <button type="button" onClick={() => open({ mode: "edit", site: s })} className="p-1.5 rounded-lg hover:bg-white/15" title="Редактирай обекта" aria-label={`Редактирай ${s.name}`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  {s.id !== MAIN_SITE_ID && (
                    <button type="button" onClick={() => remove(s)} disabled={busy} className="p-1.5 rounded-lg hover:bg-white/15" title="Премахни обекта" aria-label={`Премахни ${s.name}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <p className="text-[11px] text-brand-dark/55 mt-2">
          Всеки обект има свои дневници, оборудване и персонал. Месечна такса за {count} обекта по план „{PLAN_BY_ID[plan].name}“:{" "}
          <strong className="text-brand-green">{formatEur(planFeeEur(plan, count))}</strong>
        </p>
      )}

      {modal && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => !busy && setModal(null)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={modal.mode === "add" ? "Нов обект" : "Редакция на обект"}>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-brand-green">{modal.mode === "add" ? "Нов обект" : "Редакция на обект"}</h3>
              <button type="button" onClick={() => setModal(null)} className="p-1 text-brand-dark/40 hover:text-brand-dark" aria-label="Затвори"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-1">
              <label className={labelCls}>Име на обекта *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="напр. Кафене Център, Кухня майка" className={inputCls} autoFocus />
            </div>

            {isMainEdit ? (
              <p className="text-[11px] text-brand-dark/55 bg-brand-light/60 rounded-xl px-3 py-2">
                Видът на дейността, адресът и управителят на основния обект се сменят от „Данни за фирмата“.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className={labelCls}>Сектор</label>
                    <select value={sector} onChange={(e) => { setSector(e.target.value); setForm({ ...form, niche: BUSINESS_CATEGORIES[e.target.value][0] }); }} className={inputCls}>
                      {Object.keys(BUSINESS_CATEGORIES).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Вид на обекта</label>
                    <select value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} className={inputCls}>
                      {BUSINESS_CATEGORIES[sector]?.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <p className="text-[10px] text-brand-dark/50">Според вида системата подбира дневниците за обекта.</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Адрес на обекта</label>
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="гр. Плевен, ул. …" className={inputCls} />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Отговорник / управител на обекта</label>
                  <input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} placeholder="Ако е различен от управителя на фирмата" className={inputCls} />
                </div>
              </>
            )}

            {modal.mode === "add" && (
              <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl px-3.5 py-3 text-xs text-brand-dark/80 space-y-1">
                <p>
                  Всеки следващ обект е с <strong>{Math.round(EXTRA_SITE_DISCOUNT * 100)}% отстъпка</strong>:{" "}
                  <strong>{formatEur(extraPrice)}/месец</strong> по план „{PLAN_BY_ID[plan].name}“.
                </p>
                <p>
                  Нова месечна такса: <strong className="text-brand-green">{formatEur(planFeeEur(plan, count + 1))}</strong> за {count + 1} обекта.
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setModal(null)} disabled={busy} className="flex-1 px-4 py-2.5 rounded-xl border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-wider">Отказ</button>
              <button type="button" onClick={submit} disabled={busy} className="flex-1 px-4 py-2.5 rounded-xl bg-brand-green text-white text-xs font-bold uppercase tracking-wider disabled:opacity-60 inline-flex items-center justify-center gap-1.5">
                {modal.mode === "add" ? <><MapPin className="h-3.5 w-3.5" /> Добави</> : "Запази"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
