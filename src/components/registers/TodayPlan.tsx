"use client";

/**
 * „Днешен план" — първото, което клиентът вижда в дневниците: колко задачи
 * остават за деня, подредени по момент от деня, с бързо потвърждение направо
 * от панела. Задачите от д-р Николова и изтеклите срокове са най-отгоре, а
 * седмичните/месечните проверки — в свит ред под деня.
 */

import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  AlertTriangle, Check, ChevronDown, ChevronRight, Clock, Info, Mail, Moon, Sun, Sunrise, Thermometer, Snowflake,
} from "lucide-react";
import { MOMENT_LABELS, type PlanMoment, type PlanTask, type QuickKind } from "./dayTasks";
import { normLabel, tempOutOfNorm, type TempUnit } from "./tempUnits";

export interface PlanNotice {
  level: "urgent" | "warn" | "info";
  text: string;
  registerId: string;
}

export interface PlanAdminTask {
  id: string;
  text: string;
  registerId: string;
}

export interface PlanTempUnit {
  unit: TempUnit;
  /** Вече измереното за деня: [измерване 1, измерване 2]. */
  measured: [string, string];
  /** Последната стойност от предишен ден — подсказка, не се записва сама. */
  last: string;
}

type IconType = ComponentType<{ className?: string }>;

interface TodayPlanProps {
  tasks: PlanTask[];
  adminTasks: PlanAdminTask[];
  notices: PlanNotice[];
  tempUnits: PlanTempUnit[];
  /** „днес" или „15.07". */
  dayLabel: string;
  /** „неделя, 2 ноември". */
  dateLong: string;
  isToday: boolean;
  isRestDay: boolean;
  /** Изрядни работни дни в месеца до избрания ден. */
  cleanDays: { clean: number; total: number };
  /** Описание на източника за бързото почистване — „по образеца", „като 31.10". */
  cleaningHint?: string;
  /** Отворен е дневник — панелът се свива до една лента. */
  compact: boolean;
  iconFor: (registerId: string) => IconType;
  onOpen: (registerId: string | null) => void;
  onQuick: (kind: Exclude<QuickKind, "temps">) => void;
  onSaveTemps: (values: Record<string, { temp: string; action?: string }>) => void;
  onAdminDone: (id: string) => void;
  /** Вечерен имейл, ако нещо липсва или наближава срок. */
  emailReminders?: boolean;
  onToggleEmailReminders?: (on: boolean) => void | Promise<void>;
}

const MOMENT_ICONS: Record<PlanMoment, IconType> = { before: Sunrise, during: Sun, after: Moon };

const QUICK_LABELS: Record<Exclude<QuickKind, "temps">, { button: string; hint: string }> = {
  staff: { button: "Всички са допуснати", hint: "Без оплаквания, чисто работно облекло" },
  prework: { button: "Всичко е изправно", hint: "Помещенията и съоръженията са в ред" },
  grid: { button: "Почистено е", hint: "Отметки за всички зони, оценка „Удовлетворителна“" },
  cleaning: { button: "Потвърди", hint: "" },
};

/** Приблизително време в минути — за да изглежда денят постижим. */
function estimateMinutes(tasks: PlanTask[], units: number): number {
  return tasks.reduce((sum, t) => {
    if (t.quick === "temps") return sum + Math.max(1, Math.ceil(units / 3));
    if (t.quick) return sum + 1;
    return sum + 2;
  }, 0);
}

function ProgressRing({ done, total, size = 76 }: { done: number; total: number; size?: number }) {
  const stroke = size > 50 ? 7 : 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = total === 0 ? 1 : done / total;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#C5A880"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 600ms cubic-bezier(.2,.8,.2,1)" }}
      />
      {size > 50 && (
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="#FAF6EE" fontSize="17" fontWeight="800">
          {done}/{total}
        </text>
      )}
    </svg>
  );
}

/** Щит с отметка — знакът за изряден ден. */
function ShieldCheckMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <path d="M24 4 7 10v12c0 10.5 7.2 19.4 17 22 9.8-2.6 17-11.5 17-22V10L24 4Z" fill="#C5A880" opacity=".18" />
      <path d="M24 4 7 10v12c0 10.5 7.2 19.4 17 22 9.8-2.6 17-11.5 17-22V10L24 4Z" stroke="#C5A880" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="m16 24 6 6 11-12" stroke="#FAF6EE" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="plan-draw" />
    </svg>
  );
}

function StatusDot({ done, next }: { done: boolean; next: boolean }) {
  if (done) {
    return (
      <span className="plan-pop w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-green-600/30">
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    );
  }
  return (
    <span
      className={`w-7 h-7 rounded-full border-2 shrink-0 ${
        next ? "border-brand-gold bg-brand-gold/15 animate-pulse" : "border-brand-green/20 bg-white"
      }`}
    />
  );
}

function TempQuickForm({
  units,
  onSave,
  onOpen,
}: {
  units: PlanTempUnit[];
  onSave: TodayPlanProps["onSaveTemps"];
  onOpen: () => void;
}) {
  const [values, setValues] = useState<Record<string, { temp: string; action?: string }>>({});
  const [error, setError] = useState("");
  const open = units.filter((u) => !u.measured[0] || !u.measured[1]);

  const set = (name: string, patch: Partial<{ temp: string; action: string }>) => {
    setError("");
    setValues((v) => ({ ...v, [name]: { ...(v[name] || { temp: "" }), ...patch } }));
  };

  const save = () => {
    const entered = Object.entries(values).filter(([, v]) => v.temp.trim() !== "");
    if (entered.length === 0) {
      setError("Въведете поне една температура.");
      return;
    }
    const missingAction = entered.find(([name, v]) => {
      const u = units.find((x) => x.unit.name === name);
      return u && tempOutOfNorm(v.temp, u.unit.norm) && !String(v.action || "").trim();
    });
    if (missingAction) {
      setError(`„${missingAction[0]}“ е извън нормата — опишете предприетите мерки.`);
      return;
    }
    onSave(Object.fromEntries(entered));
    setValues({});
  };

  return (
    <div className="mt-3 space-y-2.5 plan-in">
      {units.map(({ unit, measured, last }) => {
        const slot = !measured[0] ? 1 : !measured[1] ? 2 : null;
        const v = values[unit.name]?.temp || "";
        const bad = v.trim() !== "" && tempOutOfNorm(v, unit.norm);
        const Icon = unit.type === "freezer" ? Snowflake : Thermometer;
        return (
          <div key={unit.name} className="rounded-2xl border border-brand-green/10 bg-brand-light/40 px-3 py-2.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="flex items-center gap-2 min-w-0 flex-1 basis-40">
                <Icon className="h-4 w-4 text-brand-green/60 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-brand-dark truncate">{unit.name}</p>
                  <p className="text-[10px] text-brand-dark/45">
                    Норма {normLabel(unit.norm)}
                    {measured[0] && ` · сутрин ${measured[0]}°C`}
                    {measured[1] && ` · вечер ${measured[1]}°C`}
                  </p>
                </div>
              </div>
              {slot ? (
                <div className="flex items-center gap-2">
                  {last && !v && (
                    <button
                      type="button"
                      onClick={() => set(unit.name, { temp: last })}
                      className="text-[10px] font-bold px-2 py-1 rounded-lg border border-dashed border-brand-green/25 text-brand-dark/50 hover:border-brand-gold hover:text-brand-green cursor-pointer"
                      title="Попълва последната измерена стойност — проверете термометъра"
                    >
                      последно {last}°
                    </button>
                  )}
                  <div className="relative">
                    <input
                      inputMode="decimal"
                      value={v}
                      onChange={(e) => set(unit.name, { temp: e.target.value })}
                      placeholder={slot === 1 ? "сутрин" : "вечер"}
                      aria-label={`Температура ${unit.name}, измерване ${slot}`}
                      className={`w-24 text-center text-base font-bold placeholder:text-[11px] placeholder:font-medium rounded-xl border px-3 py-2 pr-7 focus:outline-none focus:ring-2 ${
                        bad
                          ? "border-red-400 bg-red-50 text-red-700 focus:ring-red-300"
                          : "border-brand-green/15 bg-white text-brand-dark focus:ring-brand-gold/40 focus:border-brand-gold"
                      }`}
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-brand-dark/35 pointer-events-none">°C</span>
                  </div>
                </div>
              ) : (
                <span className="text-[10px] font-black uppercase text-green-700 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> И двете измервания
                </span>
              )}
            </div>
            {bad && (
              <input
                value={values[unit.name]?.action || ""}
                onChange={(e) => set(unit.name, { action: e.target.value })}
                placeholder="Извън нормата — какви мерки предприехте?"
                className="mt-2 w-full text-xs rounded-xl border border-red-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            )}
          </div>
        );
      })}
      {error && <p className="text-[11px] font-bold text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center gap-2">
        {open.length > 0 && (
          <button
            type="button"
            onClick={save}
            className="bg-brand-green hover:bg-brand-green/90 text-white font-black text-[11px] uppercase tracking-wide px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-brand-green/20 border-0"
          >
            <Check className="h-4 w-4" /> Запиши измерванията
          </button>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="text-[10px] font-black uppercase text-brand-dark/50 hover:text-brand-green px-3 py-2 cursor-pointer"
        >
          Целият дневник →
        </button>
      </div>
    </div>
  );
}

export default function TodayPlan(props: TodayPlanProps) {
  const {
    tasks, adminTasks, notices, tempUnits, dayLabel, dateLong, isToday, isRestDay, cleanDays,
    cleaningHint, compact, iconFor, onOpen, onQuick, onSaveTemps, onAdminDone,
    emailReminders = true, onToggleEmailReminders,
  } = props;
  // Превключвателят реагира веднага; записът в профила върви отзад.
  const [mailChoice, setMailOn] = useState<boolean | null>(null);
  const mailOn = mailChoice ?? emailReminders;
  const [tempsOpen, setTempsOpen] = useState(false);
  const [showPeriodic, setShowPeriodic] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  const doneCount = tasks.filter((t) => t.done).length;
  const pending = tasks.filter((t) => !t.done);
  const allDone = tasks.length > 0 && pending.length === 0;
  const next = pending[0];
  const urgent = notices.filter((n) => n.level === "urgent");
  const periodic = notices.filter((n) => n.level !== "urgent");
  const minutes = estimateMinutes(pending, tempUnits.length);

  // Лентата за телефон се показва само когато самият план не се вижда.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setPanelVisible(e.isIntersecting), { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [compact]);

  const scrollToPlan = () => {
    onOpen(null);
    requestAnimationFrame(() => rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const headline = allDone
    ? `Всичко за ${dayLabel} е готово`
    : pending.length === 1
      ? `Остава 1 задача за ${dayLabel}`
      : `Остават ${pending.length} задачи за ${dayLabel}`;

  const mobileBar = !panelVisible && pending.length > 0 && (
    <button
      type="button"
      onClick={scrollToPlan}
      className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-brand-green text-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl shadow-brand-green/40 cursor-pointer border border-brand-gold/30 plan-in"
    >
      <ProgressRing done={doneCount} total={tasks.length} size={30} />
      <span className="flex-1 text-left text-xs font-black">{headline}</span>
      <ChevronRight className="h-4 w-4 text-brand-gold" />
    </button>
  );

  /* ---------- Свит вид, докато е отворен дневник ---------- */
  if (compact) {
    return (
      <>
        <div
          ref={rootRef}
          className="rounded-2xl bg-brand-green text-white px-4 py-3 flex flex-wrap items-center gap-3 shadow-lg shadow-brand-green/20"
        >
          <ProgressRing done={doneCount} total={tasks.length} size={34} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black">{headline}</p>
            {next && <p className="text-[10px] text-white/60 truncate">Следваща: {next.title}</p>}
          </div>
          <button
            type="button"
            onClick={scrollToPlan}
            className="text-[10px] font-black uppercase px-3.5 py-2 rounded-xl bg-brand-gold text-brand-dark cursor-pointer border-0"
          >
            Към плана
          </button>
        </div>
        {mobileBar}
      </>
    );
  }

  const renderTask = (t: PlanTask) => {
    const Icon = iconFor(t.registerId);
    const isNext = !t.done && t === next;
    const quickKind = t.quick && t.quick !== "temps" ? t.quick : null;
    const hint = quickKind === "cleaning" ? cleaningHint || "" : quickKind ? QUICK_LABELS[quickKind].hint : "";
    return (
      <div
        key={t.key}
        className={`px-4 py-3.5 transition-colors ${
          t.done ? "bg-green-50/50" : isNext ? "bg-brand-gold/[0.07]" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <StatusDot done={t.done} next={isNext} />
          <div className={`p-2 rounded-xl shrink-0 ${t.done ? "bg-green-100 text-green-700" : "bg-brand-green/10 text-brand-green"}`}>
            <Icon className="h-4 w-4" />
          </div>
          <button type="button" onClick={() => onOpen(t.registerId)} className="flex-1 min-w-0 text-left cursor-pointer group">
            {isNext && (
              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-gold-dark">Следваща стъпка</span>
            )}
            <span
              className={`block text-sm font-bold leading-snug group-hover:text-brand-gold-dark transition-colors ${
                t.done ? "text-brand-dark/45 line-through decoration-green-600/40" : "text-brand-dark"
              }`}
            >
              {t.title}
            </span>
            <span className={`block text-[11px] leading-snug ${t.done ? "text-green-700/70" : "text-brand-dark/50"}`}>
              {t.done ? `Готово · ${t.detail}` : hint || t.detail}
            </span>
          </button>
          {!t.done && (
            <div className="flex items-center gap-1.5 shrink-0">
              {t.quick === "temps" ? (
                <button
                  type="button"
                  onClick={() => setTempsOpen((v) => !v)}
                  className="bg-brand-green hover:bg-brand-green/90 text-white font-black text-[10px] uppercase tracking-wide px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer border-0 shadow-sm"
                >
                  Измери <ChevronDown className={`h-3.5 w-3.5 transition-transform ${tempsOpen ? "rotate-180" : ""}`} />
                </button>
              ) : quickKind ? (
                <button
                  type="button"
                  onClick={() => onQuick(quickKind)}
                  className="bg-brand-green hover:bg-brand-green/90 text-white font-black text-[10px] uppercase tracking-wide px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer border-0 shadow-sm"
                  title={`${QUICK_LABELS[quickKind].button} — записва за ${dayLabel}. Ако има отклонение, отворете дневника.`}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{QUICK_LABELS[quickKind].button}</span>
                  <span className="sm:hidden">Потвърди</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpen(t.registerId)}
                  className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-[10px] uppercase tracking-wide px-3.5 py-2 rounded-xl flex items-center gap-1 cursor-pointer border-0 shadow-sm"
                >
                  Попълни <ChevronRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
        {t.quick === "temps" && tempsOpen && !t.done && (
          <TempQuickForm units={tempUnits} onSave={(v) => { onSaveTemps(v); }} onOpen={() => onOpen("temps")} />
        )}
      </div>
    );
  };

  const moments: PlanMoment[] = ["before", "during", "after"];

  return (
    <>
      <section
        ref={rootRef}
        data-tour="reminders"
        className="scroll-mt-24 rounded-3xl overflow-hidden border border-brand-green/15 shadow-2xl shadow-brand-green/10 bg-white"
      >
        {/* Заглавие с прогрес */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0A2A20] via-brand-green to-[#1A4A3A] text-white px-5 sm:px-7 py-6">
          <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand-gold/20 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-5">
            {allDone ? (
              <ShieldCheckMark className="h-[76px] w-[76px] shrink-0 plan-pop" />
            ) : (
              <ProgressRing done={doneCount} total={tasks.length} />
            )}
            <div className="flex-1 min-w-[200px] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
                Днешен план · {dateLong}
              </span>
              <h3 className="font-serif text-2xl sm:text-[28px] font-bold leading-tight">
                {!allDone ? headline : urgent.length > 0 ? "Днешните дневници са готови" : "Обектът е изряден"}
              </h3>
              <p className="text-xs text-white/65 flex flex-wrap items-center gap-x-3 gap-y-1">
                {allDone ? (
                  <span>
                    {urgent.length > 0
                      ? "Остава спешното по-долу."
                      : "Системата ще Ви напомни при следващото задължение."}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-brand-gold" /> около {minutes} мин
                  </span>
                )}
                {isRestDay && <span className="text-brand-gold-light">Почивен ден — попълването е по желание</span>}
              </p>
            </div>
            {cleanDays.total > 0 && (
              <div className="rounded-2xl bg-white/[0.08] border border-white/10 px-4 py-3 text-center">
                <p className="font-serif text-2xl font-bold text-brand-gold leading-none">
                  {cleanDays.clean}
                  <span className="text-sm text-white/50 font-sans">/{cleanDays.total}</span>
                </p>
                <p className="text-[9px] font-black uppercase tracking-wider text-white/55 mt-1">изрядни дни този месец</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Задачи от д-р Николова */}
          {adminTasks.map((a) => (
            <div key={a.id} className="plan-in rounded-2xl border border-brand-gold/50 bg-gradient-to-r from-brand-gold/15 to-brand-gold/5 p-4 flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/danka-avatar.webp" alt="д-р Данка Николова" className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-black uppercase tracking-widest text-brand-gold-dark">
                  Задача от д-р Николова
                </span>
                <p className="text-sm text-brand-dark leading-snug mt-0.5">{a.text}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => onAdminDone(a.id)}
                    className="text-[10px] font-black uppercase px-3.5 py-2 rounded-xl bg-brand-green text-white border-0 cursor-pointer flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" /> Готово
                  </button>
                  {a.registerId && (
                    <button
                      type="button"
                      onClick={() => onOpen(a.registerId)}
                      className="text-[10px] font-black uppercase px-3.5 py-2 rounded-xl bg-white border border-brand-green/15 hover:border-brand-gold text-brand-green cursor-pointer"
                    >
                      Отвори картата →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Спешно — изтекли срокове, неизпълнени карти на 3 дни */}
          {urgent.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50/80 divide-y divide-red-100 overflow-hidden">
              {urgent.map((n, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onOpen(n.registerId)}
                  className="w-full text-left flex items-start gap-2.5 px-4 py-3 text-xs text-red-800 hover:bg-red-100/60 cursor-pointer"
                >
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="flex-1 font-bold leading-snug">{n.text}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                </button>
              ))}
            </div>
          )}

          {/* Задачите за деня по момент */}
          {tasks.length === 0 ? (
            <p className="text-xs text-brand-dark/50 px-1">
              Няма ежедневни задължения за {dayLabel}. Добавете съоръжения и служители от „Оборудване и персонал“, за да
              се появят.
            </p>
          ) : (
            moments.map((m) => {
              const list = tasks.filter((t) => t.moment === m);
              if (list.length === 0) return null;
              const MIcon = MOMENT_ICONS[m];
              const left = list.filter((t) => !t.done).length;
              return (
                <div key={m} className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <MIcon className="h-4 w-4 text-brand-gold" />
                    <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-brand-dark/60">{MOMENT_LABELS[m]}</h4>
                    <div className="flex-1 h-px bg-brand-green/10" />
                    <span className={`text-[10px] font-black ${left === 0 ? "text-green-600" : "text-brand-dark/40"}`}>
                      {left === 0 ? "✓ готово" : `${list.length - left}/${list.length}`}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-brand-green/10 divide-y divide-brand-green/[0.07] overflow-hidden">
                    {list.map(renderTask)}
                  </div>
                </div>
              );
            })
          )}

          {/* Седмични, месечни и срокове */}
          {isToday && periodic.length > 0 && (
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPeriodic((v) => !v)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left cursor-pointer hover:bg-amber-50"
              >
                <Info className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="flex-1 text-xs font-black text-amber-900">
                  Тази седмица и срокове ({periodic.length})
                  {!showPeriodic && (
                    <span className="block font-medium text-[11px] text-amber-800/70 truncate">{periodic[0].text}</span>
                  )}
                </span>
                <ChevronDown className={`h-4 w-4 text-amber-600 transition-transform ${showPeriodic ? "rotate-180" : ""}`} />
              </button>
              {showPeriodic && (
                <div className="divide-y divide-amber-100 border-t border-amber-100">
                  {periodic.map((n, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onOpen(n.registerId)}
                      className={`w-full text-left flex items-start gap-2.5 px-4 py-2.5 text-[11px] leading-snug hover:bg-amber-50 cursor-pointer ${
                        n.level === "warn" ? "text-amber-900" : "text-brand-dark/65"
                      }`}
                    >
                      <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${n.level === "warn" ? "bg-amber-500" : "bg-brand-green/30"}`} />
                      <span className="flex-1">{n.text}</span>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Имейл напомняне вечер */}
          {onToggleEmailReminders && (
            <div className="flex items-center gap-3 rounded-2xl border border-brand-green/10 bg-brand-light/40 px-4 py-3">
              <Mail className="h-4 w-4 text-brand-green/60 shrink-0" />
              <p className="flex-1 text-[11px] leading-snug text-brand-dark/65">
                <span className="font-black text-brand-dark/80">Имейл напомняне вечер</span> — само ако нещо за деня липсва
                или наближава срок на ЛЗК или договор.
              </p>
              <button
                type="button"
                role="switch"
                aria-checked={mailOn}
                aria-label="Имейл напомняне вечер"
                onClick={() => {
                  const next = !mailOn;
                  setMailOn(next);
                  void onToggleEmailReminders(next);
                }}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer border-0 shrink-0 ${mailOn ? "bg-brand-green" : "bg-brand-dark/20"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${mailOn ? "translate-x-5" : ""}`}
                />
              </button>
            </div>
          )}
        </div>
      </section>
      {mobileBar}
    </>
  );
}
