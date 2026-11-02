"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, MapPin, Settings } from "lucide-react";
import { BUSINESS_CATEGORIES, getSectorForNiche } from "@/data/businessCategories";
import { MAIN_SITE_ID, type SiteView } from "@/lib/sites";
import { EXTRA_SITE_DISCOUNT, PLAN_BY_ID, extraSitePriceEur, formatEur, planFeeEur, type PlanId } from "@/lib/plans";

export interface SiteFormData {
  name: string;
  niche: string;
  address: string;
  manager: string;
}

/** „1 хладилник" / „3 хладилника". */
const count1 = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

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
  onOpenEquipment,
  signatureMode,
  hasSignature,
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
  /** Отваря „Оборудване и персонал" на избрания обект (в дневниците). */
  onOpenEquipment?: () => void;
  /** Подписът е общ за фирмата — за обобщението под обекта. */
  signatureMode?: "draw" | "manual";
  hasSignature?: boolean;
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

  const active = sites.find((s) => s.id === activeId) ?? sites[0];
  // Същите стойности по подразбиране като дневниците за нов обект.
  const fridges = active?.customFridges ?? ["Хладилна витрина №1"];
  const freezers = active?.customFreezers ?? ["Фризер №1"];
  const storages = active?.customStorages ?? [];
  const employees = active?.customEmployees ?? [];
  const appliances = active?.hasHotPoint ? (active.hotAppliances?.length ?? 0) : 0;
  const summary: { label: string; missing?: boolean }[] = [
    { label: count1(fridges.length, "хладилник", "хладилника"), missing: fridges.length === 0 },
    { label: count1(freezers.length, "фризер", "фризера") },
    ...(storages.length ? [{ label: count1(storages.length, "склад", "склада") }] : []),
    { label: count1(employees.length, "служител", "служители"), missing: employees.length === 0 },
    ...(active?.hasHotPoint ? [{ label: appliances ? `Топла точка · ${count1(appliances, "уред", "уреда")}` : "Топла точка · всички уреди" }] : []),
    ...(signatureMode ? [{ label: signatureMode === "draw" && hasSignature ? "Електронен подпис" : "Подпис на ръка" }] : []),
  ];
  const needsSetup = employees.length === 0;

  return (
    <div className="relative bg-white border border-brand-gold/35 rounded-3xl mb-5 shadow-lg shadow-brand-green/5 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-gold/70 via-brand-gold to-brand-gold/40" />
      <div className="p-4 sm:p-6 space-y-4">
        {/* Заглавие + превключване между обекти */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-brand-gold/15 text-brand-gold-dark shrink-0">
              <SiteIcon className="h-5 w-5" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold-dark">
              {count > 1 ? `Обекти на фирмата (${count})` : "Вашият обект"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => open({ mode: "add" })}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-brand-green/15 text-brand-green text-[10px] font-black uppercase tracking-wider hover:border-brand-gold hover:bg-brand-light/60 transition-colors shrink-0 cursor-pointer"
            title="Още един обект на същата фирма (кафене, склад, втори магазин…) със свои дневници"
          >
            <Plus className="h-3.5 w-3.5" /> Добави обект
          </button>
        </div>

        {count > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="tablist" aria-label="Обекти">
            {sites.map((s) => {
              const isActive = s.id === activeId;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelect(s.id)}
                  className={`shrink-0 text-left px-3.5 py-2 rounded-xl border transition-colors max-w-[220px] cursor-pointer ${
                    isActive
                      ? "bg-brand-green border-brand-green text-white shadow-md"
                      : "bg-brand-light/50 border-brand-green/15 text-brand-green hover:border-brand-gold/60"
                  }`}
                >
                  <span className="block text-xs font-bold truncate">{s.name}</span>
                  <span className={`block text-[10px] truncate ${isActive ? "text-white/70" : "text-brand-dark/50"}`}>{s.niche || "—"}</span>
                </button>
              );
            })}
          </div>
        )}

        {active && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Избраният обект */}
            <div className="lg:col-span-2 min-w-0 space-y-1.5">
              <h2 className="font-serif text-2xl font-bold text-brand-green leading-tight break-words">{active.name}</h2>
              <p className="text-xs text-brand-dark/60 leading-snug">
                {active.niche || "Вид на дейността не е избран"}
                {active.address ? ` · ${active.address}` : ""}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => open({ mode: "edit", site: active })}
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-brand-dark/50 hover:text-brand-green cursor-pointer"
                >
                  <Pencil className="h-3 w-3" /> Име и адрес
                </button>
                {active.id !== MAIN_SITE_ID && (
                  <button
                    type="button"
                    onClick={() => remove(active)}
                    disabled={busy}
                    className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-brand-dark/40 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" /> Премахни
                  </button>
                )}
              </div>
            </div>

            {/* Оборудване и персонал */}
            {onOpenEquipment && (
              <div
                className={`lg:col-span-3 rounded-2xl border p-4 space-y-3 ${
                  needsSetup ? "border-brand-gold/60 bg-brand-gold/10" : "border-brand-green/10 bg-brand-light/50"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 basis-56">
                    <p className="text-sm font-black text-brand-green">Оборудване и персонал</p>
                    <p className="text-[11px] text-brand-dark/60 leading-snug mt-0.5">
                      Хладилниците, фризерите и служителите от тук се появяват сами във всички дневници — температури,
                      лична хигиена, здравни книжки. Въвеждат се веднъж и се сменят само при промяна.
                    </p>
                  </div>
                  <button
                    type="button"
                    data-tour="equipment"
                    onClick={onOpenEquipment}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green/90 text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-brand-green/20 cursor-pointer shrink-0"
                  >
                    <Settings className="h-4 w-4" /> {needsSetup ? "Настрой сега" : "Промени"}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {summary.map((it) => (
                    <span
                      key={it.label}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        it.missing
                          ? "bg-white border-brand-gold/60 text-brand-gold-dark"
                          : "bg-white border-brand-green/10 text-brand-dark/65"
                      }`}
                    >
                      {it.label}
                    </span>
                  ))}
                </div>
                {needsSetup && (
                  <p className="text-[11px] font-bold text-brand-gold-dark leading-snug">
                    Добавете служителите си — без тях картата за лична хигиена и здравните книжки остават празни.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {count > 1 && (
          <p className="text-[11px] text-brand-dark/55 border-t border-brand-green/5 pt-3">
            Всеки обект има свои дневници, оборудване и персонал. Месечна такса за {count} обекта по план „{PLAN_BY_ID[plan].name}“:{" "}
            <strong className="text-brand-green">{formatEur(planFeeEur(plan, count))}</strong>
          </p>
        )}
      </div>

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
