"use client";

/**
 * Дневници по самоконтрол — МАГАЗИН ЗА ТЪРГОВИЯ С ХРАНИ БЕЗ ТОПЛА ТОЧКА.
 *
 * Пълен електронен еквивалент на хартиените дневници: попълване с
 * автоматични улеснения (дата/час, падащи списъци, бързо отбелязване),
 * автоматичен запис, напомняния за непопълнени дневници и печат —
 * на отделен дневник или на всички попълнени наведнъж.
 */

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  STORE_REGISTERS,
  REGISTER_BY_ID,
  registersFor,
  RegisterDef,
  RegisterColumn,
  CHECK_CYCLE,
  registerDocKey,
  periodFor,
  TRAINING_TOPICS,
  TRAINING_RESULTS,
  SAFETY_CULTURE_SURVEY,
  SAFETY_CULTURE_CHECKLIST,
  SURVEY_SCALE_LABELS,
  CLEANING_SCOPE,
  SAMPLE_ALLERGEN_MENU,
  SurveyGroup,
  HOT_APPLIANCES,
  HOT_APPLIANCE_BY_ID,
  DAILY_ACTIVITIES,
  TRIGGER_BY_ID,
  REGISTER_APPLIANCE,
  recordDateKey,
  visibleRegistersFor,
  ADMIN_REMINDERS_ID,
  AdminReminder,
} from "@/data/storeRegisters";
import {
  buildRegisterSection,
  buildPrintDocument,
  printHtml,
  monthLabelBg,
  PrintFirmInfo,
  RegisterDocData,
} from "./registerPrint";
import RegistersTour, { TourStep } from "./RegistersTour";
import SignaturePad from "./SignaturePad";
import {
  Bell,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileCheck,
  FileText,
  Info,
  Loader2,
  Plus,
  Printer,
  Settings,
  Snowflake,
  Thermometer,
  Trash2,
  Users,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  X,
  Flame,
  Utensils,
  Droplets,
  Soup,
  ChefHat,
  Star,
  CalendarDays,
  HelpCircle,
  PenLine,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Типове и помощни                                                   */
/* ------------------------------------------------------------------ */

export interface Employee {
  name: string;
  role: string;
}

interface DynamicOptions {
  suppliers: string[];
  cleaningAgents: string[];
  employees: string[];
}

type Updater = (updater: (prev: RegisterDocData) => RegisterDocData) => void;

const todayISO = () => new Date().toISOString().split("T")[0];
const currentMonth = () => todayISO().slice(0, 7);
const nowTime = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const daysInMonth = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m, 0).getDate();
};

const ROMAN_WEEKS = ["I", "II", "III", "IV", "V"];

const isRowFilled = (row?: Record<string, any>) =>
  !!row && Object.values(row).some((v) => String(v ?? "").trim() !== "");

const REGISTER_ICONS: Record<string, any> = {
  suppliers: Users,
  incoming: FileCheck,
  temps: Thermometer,
  "cleaning-agents": Sparkles,
  "hygiene-daily": ClipboardList,
  "hygiene-weekly": ClipboardList,
  "hygiene-monthly": ClipboardList,
  "staff-hygiene": Users,
  "health-books": FileText,
  workwear: FileText,
  waste: Trash2,
  repairs: Settings,
  training: GraduationCap,
  "safety-survey": FileText,
  "safety-checklist": ClipboardList,
  // Топла точка
  "fryer-oil-temp": Flame,
  "fryer-oil-destroy": Droplets,
  "grill-temp": Flame,
  "fry-depth": Flame,
  duner: Flame,
  baking: ChefHat,
  "cooked-meals": Utensils,
  alaminut: Utensils,
  desserts: Star,
  "hot-display": Thermometer,
  "grill-batch": Utensils,
  "flour-sift": ChefHat,
  "soups-production": Soup,
  "soups-cooling": Soup,
  "princess-batch": ChefHat,
  "sauces-batch": Droplets,
  "meals-batch": Utensils,
  "starters-batch": Utensils,
  "prework-check": ClipboardList,
  "disinfectant-residue": Droplets,
  "supplier-eval": Star,
  "allergen-menu": FileText,
};

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Ежедневно",
  weekly: "Седмично",
  monthly: "Месечно",
  quarterly: "На 3 месеца",
  yearly: "Годишно",
  delivery: "При доставка",
  event: "При събитие",
  permanent: "Постоянен списък",
  "3days": "На 3 дни",
};

const inputCls =
  "w-full text-xs border border-brand-green/15 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold text-brand-dark disabled:bg-brand-light/60 disabled:text-brand-dark/60";

/** Стъпките на обиколката при първо влизане в дневниците. */
const TOUR_STEPS: TourStep[] = [
  {
    target: "header",
    emoji: "👋",
    title: "Добре дошли във Вашите електронни дневници!",
    text: "Това е цялата Ви папка по самоконтрол — на едно място, винаги попълнена и готова за проверка. Ще Ви разведем за минута какво да въвеждате и какво да следите.",
  },
  {
    target: "equipment",
    emoji: "⚙️",
    title: "Стъпка 1: Настройте обекта си",
    text: "Започнете оттук! Въведете хладилниците, фризерите и служителите си — а ако имате топла точка, отбележете и уредите (скара, фритюрник…). Системата ги използва автоматично във всички дневници.",
  },
  {
    target: "calendar",
    emoji: "📅",
    title: "Календарът Ви пази",
    text: "Всеки ден свети зелено (всичко е попълнено) или червено (има пропуски). Кликнете върху ден, за да видите какво липсва и да го попълните — дори със задна дата.",
  },
  {
    target: "usage",
    emoji: "🔥",
    title: "Кажете какво използвахте днес",
    text: "Отбележете с едно докосване кои уреди от топлата точка са работили днес. Системата сама ще Ви напомни кои контролни карти трябва да попълните за тях.",
  },
  {
    target: "reminders",
    emoji: "🔔",
    title: "Напомнянията — Вашият дневен списък",
    text: "Тук виждате какво чака попълване днес: температури, хигиена, преглед на персонала… Кликнете върху напомняне и отивате направо в съответния дневник.",
  },
  {
    target: "cards",
    emoji: "📋",
    title: "Дневниците — по една карта за всеки",
    text: "Кликнете върху карта, за да я попълните. Има бързи бутони („✓ за днес“, „Час сега“), падащи списъци и автоматичен запис — нищо не се губи. Статусът на всяка карта показва какво е свършено.",
  },
  {
    target: "print",
    emoji: "🖨️",
    title: "При проверка: печат с един бутон",
    text: "БАБХ на вратата? Този бутон отпечатва всички попълнени дневници за месеца в официален вид А4 — с данните на фирмата, легенди и места за подпис. Успех!",
  },
];

/* Норми за температурните съоръжения */
const tempNorm = (type: "fridge" | "freezer") =>
  type === "freezer" ? { max: -18 } : { min: 0, max: 4 };

const tempOutOfNorm = (val: string, type: "fridge" | "freezer") => {
  const n = parseFloat(String(val).replace(",", "."));
  if (isNaN(n)) return false;
  const norm = tempNorm(type);
  if (norm.min !== undefined && n < norm.min) return true;
  if (norm.max !== undefined && n > norm.max) return true;
  return false;
};

/* ------------------------------------------------------------------ */
/*  Клетки                                                             */
/* ------------------------------------------------------------------ */

function CheckCellBtn({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly: boolean;
}) {
  const next = () => {
    const idx = CHECK_CYCLE.indexOf((value || "") as any);
    onChange(CHECK_CYCLE[(idx + 1) % CHECK_CYCLE.length]);
  };
  const tone =
    value === "✓"
      ? "bg-green-100 text-green-700 border-green-300"
      : value === "✗"
        ? "bg-red-100 text-red-700 border-red-300"
        : value === "НП"
          ? "bg-gray-100 text-gray-500 border-gray-300"
          : "bg-white text-brand-dark/30 border-brand-green/15 hover:border-brand-gold";
  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={next}
      title="Кликнете за смяна: празно → ✓ → ✗ → НП"
      className={`w-9 h-8 rounded-lg border font-bold text-xs transition-colors cursor-pointer disabled:cursor-default ${tone}`}
    >
      {value || "—"}
    </button>
  );
}

function CellInput({
  col,
  value,
  onChange,
  readOnly,
  dynamicOptions,
}: {
  col: RegisterColumn;
  value: string;
  onChange: (v: string) => void;
  readOnly: boolean;
  dynamicOptions: DynamicOptions;
}) {
  if (col.type === "check") return <CheckCellBtn value={value} onChange={onChange} readOnly={readOnly} />;
  if (col.type === "select") {
    const opts = col.options || (col.optionsFrom ? dynamicOptions[col.optionsFrom] : []) || [];
    return (
      <div className="min-w-[120px]">
        <select className={inputCls} value={value} disabled={readOnly} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {opts.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          {value && !opts.includes(value) && <option value={value}>{value}</option>}
        </select>
        {col.optionsFrom && opts.length === 0 && (
          <span className="text-[8px] text-brand-dark/40 block mt-0.5">
            {col.optionsFrom === "suppliers"
              ? "Първо добавете доставчици в списък №1"
              : col.optionsFrom === "cleaningAgents"
                ? "Първо добавете препарати в списък №4"
                : "Добавете служители от „Оборудване и персонал“"}
          </span>
        )}
      </div>
    );
  }
  const typeAttr = col.type === "date" ? "date" : col.type === "time" ? "time" : "text";
  // Валидация по норма за температурни клетки (напр. ≥75°C, ≤170°C, 0–4°C)
  let outOfNorm = false;
  if (col.type === "temp" && col.norm && String(value).trim() !== "") {
    const n = parseFloat(String(value).replace(",", "."));
    if (!isNaN(n)) {
      if (col.norm.min !== undefined && n < col.norm.min) outOfNorm = true;
      if (col.norm.max !== undefined && n > col.norm.max) outOfNorm = true;
    }
  }
  return (
    <input
      type={typeAttr}
      className={`${inputCls} ${col.narrow ? "min-w-[76px]" : "min-w-[110px]"} ${outOfNorm ? "!border-red-400 !bg-red-50 text-red-700 font-bold" : ""}`}
      value={value}
      placeholder={col.type === "temp" ? "°C" : col.placeholder || ""}
      disabled={readOnly}
      title={outOfNorm ? "Стойността е извън нормата! Впишете корективни действия." : undefined}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Помощна функция за свиване на снимки за ИИ сканиране             */
/* ------------------------------------------------------------------ */
const compressImage = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1200;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve({
          base64: canvas.toDataURL("image/jpeg", 0.8),
          mimeType: "image/jpeg",
        });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

/* ------------------------------------------------------------------ */
/*  Редактор: динамични редове                                          */
/* ------------------------------------------------------------------ */

function RowsEditor({
  def,
  data,
  onUpdate,
  readOnly,
  employees,
  dynamicOptions,
  refDate,
  dayLbl,
}: {
  def: RegisterDef;
  data: RegisterDocData;
  onUpdate: Updater;
  readOnly: boolean;
  employees: Employee[];
  dynamicOptions: DynamicOptions;
  /** ISO дата на избрания от календара ден — новите записи се създават за нея */
  refDate: string;
  dayLbl: string;
}) {
  const cols = def.columns || [];
  const entries = data.entries || [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const addRow = () => {
    const blank: Record<string, string> = {};
    cols.forEach((c) => {
      blank[c.key] = "";
      if (c.type === "date" && (c.key === "date" || c.key === "from")) blank[c.key] = refDate;
    });
    onUpdate((prev) => ({ ...prev, entries: [...(prev.entries || []), blank] }));
  };

  const handleScanClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError(null);

    try {
      // 1. Compress image to avoid Vercel payload limit issues
      const { base64, mimeType } = await compressImage(file);

      // 2. Call local scan-receipt API route
      const response = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64, mimeType }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Възникна системна грешка при обработка на снимката.");
      }

      if (!result.items || result.items.length === 0) {
        throw new Error("ИИ не намери продукти за входящ контрол в този документ.");
      }

      // 3. Map extracted items to table schema and update entries
      const newEntries = result.items.map((item: any) => {
        const row: Record<string, string> = {};
        cols.forEach((c) => {
          row[c.key] = "";
        });

        // Set properties based on register column keys
        row.date = result.date || refDate;
        row.supplier = result.supplier || "";
        row.food = item.foodName || "";
        row.batch = item.batch || "";
        row.expiry = item.expiryDate || "";
        row.qty = item.quantity || "";
        row.docRef = result.documentNumber || "";
        row.temp = "";
        row.sign = "";

        return row;
      });

      onUpdate((prev) => ({
        ...prev,
        entries: [...(prev.entries || []), ...newEntries],
      }));
    } catch (err: any) {
      console.error("AI Scan Error:", err);
      setScanError(err.message || "Грешка при сканиране. Моля, опитайте пак.");
    } finally {
      setIsScanning(false);
    }
  };

  const updateCell = (idx: number, key: string, v: string) =>
    onUpdate((prev) => {
      const list = [...(prev.entries || [])];
      list[idx] = { ...list[idx], [key]: v };
      return { ...prev, entries: list };
    });

  const removeRow = (idx: number) => {
    if (!confirm("Изтриване на този запис?")) return;
    onUpdate((prev) => {
      const list = [...(prev.entries || [])];
      list.splice(idx, 1);
      return { ...prev, entries: list };
    });
  };

  const quickAllStaff = () => {
    const existing = new Set(entries.filter((e) => e.date === refDate).map((e) => String(e.employee)));
    const missing = employees.filter((e) => !existing.has(e.name));
    if (missing.length === 0) {
      alert(`Всички служители вече са отбелязани за ${dayLbl}.`);
      return;
    }
    onUpdate((prev) => ({
      ...prev,
      entries: [
        ...(prev.entries || []),
        ...missing.map((e) => ({
          date: refDate,
          employee: e.name,
          hygiene: "(–) Добра",
          wounds: "(–) Няма",
          health: "(–) Клинично здрав",
          actions: "",
          result: "Допуснат до работа",
          sign: "",
        })),
      ],
    }));
  };

  return (
    <div className="space-y-3">
      {!readOnly && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={addRow}
              disabled={isScanning}
              className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-md shadow-brand-green/15 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" /> Добави запис
            </button>
            {def.id === "incoming" && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={handleScanClick}
                  disabled={isScanning}
                  className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-md shadow-brand-gold/15 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Снимай касов бон или фактура и ИИ автоматично ще попълни списъка с продукти"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Обработва се...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5 text-brand-green" /> Сканирай документ (ИИ)
                    </>
                  )}
                </button>
              </>
            )}
            {def.id === "staff-hygiene" && employees.length > 0 && (
              <button
                onClick={quickAllStaff}
                disabled={isScanning}
                className="bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-green text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-brand-gold/30 transition-colors disabled:opacity-50"
                title="Добавя ред за всеки служител с отметки „всичко наред“ — коригирайте само отклоненията"
              >
                <Sparkles className="h-3.5 w-3.5" /> Всички служители {dayLbl} — наред
              </button>
            )}
            {def.id === "allergen-menu" && entries.length === 0 && (
              <button
                onClick={() =>
                  onUpdate((prev) => ({
                    ...prev,
                    entries: [...(prev.entries || []), ...SAMPLE_ALLERGEN_MENU.map((r) => ({ ...r }))],
                  }))
                }
                disabled={isScanning}
                className="bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-green text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-brand-gold/30 transition-colors disabled:opacity-50"
                title="Зарежда 31-те примерни продукта от документа — после ги коригирайте според Вашето меню"
              >
                <Sparkles className="h-3.5 w-3.5" /> Зареди примерно меню (31 продукта)
              </button>
            )}
          </div>

          {scanError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[10px] rounded-xl px-4 py-2 flex items-center justify-between animate-fadeIn">
              <span>{scanError}</span>
              <button onClick={() => setScanError(null)} className="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer border-0 bg-transparent flex items-center">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-brand-green/10">
        <table className="w-full text-xs border-collapse bg-white">
          <thead>
            <tr className="bg-brand-green/5 text-[9px] font-bold text-brand-green uppercase">
              <th className="p-2 border-b border-brand-green/10 w-8">№</th>
              {cols.map((c) => (
                <th key={c.key} className="p-2 border-b border-brand-green/10 text-left">
                  {c.label}
                </th>
              ))}
              {!readOnly && <th className="p-2 border-b border-brand-green/10 w-8"></th>}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={cols.length + 2} className="p-6 text-center text-brand-dark/40 italic">
                  Няма записи. {readOnly ? "" : "Натиснете „Добави запис“."}
                </td>
              </tr>
            ) : (
              entries.map((row, idx) => (
                <tr key={idx} className="border-b border-brand-green/5 hover:bg-brand-light/20 align-top">
                  <td className="p-2 text-center font-bold text-brand-dark/50">{idx + 1}</td>
                  {cols.map((c) => (
                    <td key={c.key} className="p-1.5">
                      <CellInput
                        col={c}
                        value={row[c.key] || ""}
                        onChange={(v) => updateCell(idx, c.key, v)}
                        readOnly={readOnly}
                        dynamicOptions={dynamicOptions}
                      />
                    </td>
                  ))}
                  {!readOnly && (
                    <td className="p-1.5 text-center">
                      <button
                        onClick={() => removeRow(idx)}
                        className="text-red-300 hover:text-red-500 cursor-pointer p-1"
                        title="Изтрий реда"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Редактор: месечна мрежа (дни / седмици)                             */
/* ------------------------------------------------------------------ */

function GridEditor({
  def,
  data,
  month,
  rowKeys,
  rowHeader,
  onUpdate,
  readOnly,
  dynamicOptions,
  selectedDay,
  selectedDate,
  dayLbl,
  canTick,
}: {
  def: RegisterDef;
  data: RegisterDocData;
  month: string;
  rowKeys: string[];
  rowHeader: string;
  onUpdate: Updater;
  readOnly: boolean;
  dynamicOptions: DynamicOptions;
  /** Ден от месеца (напр. "17") — избран от календара */
  selectedDay: string;
  /** ISO дата на избрания ден */
  selectedDate: string;
  /** Етикет: „днес" или „15.07" */
  dayLbl: string;
  /** Може ли да се отбелязва бързо за избрания ден (не е бъдещ) */
  canTick: boolean;
}) {
  const cols = def.columns || [];
  const rows = data.rows || {};

  const updateCell = (rk: string, key: string, v: string) =>
    onUpdate((prev) => ({
      ...prev,
      rows: { ...(prev.rows || {}), [rk]: { ...((prev.rows || {})[rk] || {}), [key]: v } },
    }));

  const quickTickSelected = () => {
    const rk =
      def.kind === "grid-days"
        ? selectedDay
        : ROMAN_WEEKS[Math.min(4, Math.floor((parseInt(selectedDay, 10) - 1) / 7))];
    onUpdate((prev) => {
      const row = { ...((prev.rows || {})[rk] || {}) };
      cols.forEach((c) => {
        if (c.type === "check" && !row[c.key]) row[c.key] = "✓";
        if (c.key === "grade" && !row[c.key]) row[c.key] = "Удовлетворителна";
        if (c.type === "date" && !row[c.key]) row[c.key] = selectedDate;
      });
      return { ...prev, rows: { ...(prev.rows || {}), [rk]: row } };
    });
  };

  return (
    <div className="space-y-3">
      {!readOnly && canTick && (
        <button
          onClick={quickTickSelected}
          className="bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-green text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border border-brand-gold/30 transition-colors"
          title="Поставя ✓ на всички дейности — после коригирайте, ако нещо не е извършено"
        >
          <Check className="h-3.5 w-3.5" />
          {def.kind === "grid-days" ? `Отбележи ✓ за ${dayLbl}` : "Отбележи ✓ за тази седмица"}
        </button>
      )}
      <div className="overflow-x-auto rounded-xl border border-brand-green/10 max-h-[560px] overflow-y-auto">
        <table className="w-full text-xs border-collapse bg-white">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="bg-brand-green/5 text-[9px] font-bold text-brand-green uppercase">
              <th className="p-2 border-b border-brand-green/10 w-12">{rowHeader}</th>
              {cols.map((c) => (
                <th key={c.key} className="p-2 border-b border-brand-green/10 text-left">
                  <span className="whitespace-normal block leading-tight max-w-[110px]">{c.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((rk) => {
              const row = rows[rk] || {};
              const isSelected = def.kind === "grid-days" && rk === selectedDay;
              return (
                <tr
                  key={rk}
                  className={`border-b border-brand-green/5 align-top ${isSelected ? "bg-brand-gold/10" : "hover:bg-brand-light/20"}`}
                >
                  <td className="p-2 text-center font-bold text-brand-dark/60">
                    {rk}
                    {isSelected && <span className="block text-[8px] text-brand-gold font-black">{dayLbl}</span>}
                  </td>
                  {cols.map((c) => (
                    <td key={c.key} className="p-1.5">
                      <CellInput
                        col={c}
                        value={row[c.key] || ""}
                        onChange={(v) => updateCell(rk, c.key, v)}
                        readOnly={readOnly}
                        dynamicOptions={dynamicOptions}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Редактор: температурни чек-листове                                  */
/* ------------------------------------------------------------------ */

function TempEditor({
  data,
  month,
  units,
  activeUnit,
  setActiveUnit,
  onUpdate,
  readOnly,
  selectedDay,
  dayLbl,
  selIsToday,
  canMark,
}: {
  data: RegisterDocData;
  month: string;
  units: { name: string; type: "fridge" | "freezer" }[];
  activeUnit: string;
  setActiveUnit: (n: string) => void;
  onUpdate: Updater;
  readOnly: boolean;
  /** Ден от месеца (напр. "17"), избран от календара */
  selectedDay: string;
  dayLbl: string;
  selIsToday: boolean;
  /** Избраният ден не е в бъдещето */
  canMark: boolean;
}) {
  const unit = units.find((u) => u.name === activeUnit) || units[0];

  if (units.length === 0) {
    return (
      <div className="text-center py-10 space-y-3 border border-dashed border-brand-green/15 rounded-xl">
        <Thermometer className="h-8 w-8 text-brand-dark/20 mx-auto" />
        <p className="text-xs text-brand-dark/50">
          Няма добавени хладилни съоръжения.{" "}
          {!readOnly && "Добавете ги от бутона „Оборудване и персонал“ горе."}
        </p>
      </div>
    );
  }
  if (!unit) return null;

  const rows = data.units?.[unit.name]?.rows || {};
  const normLabel = unit.type === "freezer" ? "≤ −18°C" : "0 до +4°C";

  const updateCell = (day: string, key: string, v: string) =>
    onUpdate((prev) => {
      const prevUnits = prev.units || {};
      const u = prevUnits[unit.name] || { type: unit.type, rows: {} };
      const newRow: Record<string, string> = { ...(u.rows[day] || {}), [key]: v };
      // Автоматичен резултат според нормата
      const t1bad = tempOutOfNorm(newRow.t1 || "", unit.type);
      const t2bad = tempOutOfNorm(newRow.t2 || "", unit.type);
      if ((newRow.t1 || "").trim() !== "" || (newRow.t2 || "").trim() !== "") {
        newRow.result = t1bad || t2bad ? "Несъответствие" : "Норма";
      }
      return {
        ...prev,
        units: { ...prevUnits, [unit.name]: { type: unit.type, rows: { ...u.rows, [day]: newRow } } },
      };
    });

  const days = Array.from({ length: daysInMonth(month) }, (_, i) => String(i + 1));

  return (
    <div className="space-y-3">
      {/* Избор на съоръжение */}
      <div className="flex flex-wrap gap-2">
        {units.map((u) => {
          const r = data.units?.[u.name]?.rows?.[selectedDay];
          const filledOnDay = canMark && r && ((r.t1 || "").trim() !== "" || (r.t2 || "").trim() !== "");
          return (
            <button
              key={u.name}
              onClick={() => setActiveUnit(u.name)}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide border transition-colors cursor-pointer flex items-center gap-1.5 ${
                u.name === unit.name
                  ? "bg-brand-green text-white border-brand-green"
                  : "bg-white text-brand-dark/60 border-brand-green/15 hover:border-brand-gold"
              }`}
            >
              {u.type === "freezer" ? <Snowflake className="h-3 w-3" /> : <Thermometer className="h-3 w-3" />}
              {u.name}
              {canMark && <span className={`w-1.5 h-1.5 rounded-full ${filledOnDay ? "bg-green-400" : "bg-red-400"}`} />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-brand-light/40 border border-brand-green/10 rounded-xl px-4 py-2.5">
        <span className="text-[11px] font-bold text-brand-green">
          {unit.name} — норма: {normLabel}
        </span>
        {!readOnly && selIsToday && (
          <div className="flex gap-2">
            <button
              onClick={() => updateCell(selectedDay, "t1h", nowTime())}
              className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg bg-white border border-brand-green/15 hover:border-brand-gold text-brand-dark/70 cursor-pointer flex items-center gap-1"
              title="Записва текущия час в Измерване 1 за днес"
            >
              <Clock className="h-3 w-3" /> Час сега — Измерване 1
            </button>
            <button
              onClick={() => updateCell(selectedDay, "t2h", nowTime())}
              className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg bg-white border border-brand-green/15 hover:border-brand-gold text-brand-dark/70 cursor-pointer flex items-center gap-1"
            >
              <Clock className="h-3 w-3" /> Час сега — Измерване 2
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-brand-green/10 max-h-[520px] overflow-y-auto">
        <table className="w-full text-xs border-collapse bg-white">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="bg-brand-green/5 text-[9px] font-bold text-brand-green uppercase">
              <th className="p-2 border-b border-brand-green/10 w-10">Дата</th>
              <th className="p-2 border-b border-brand-green/10">Час 1</th>
              <th className="p-2 border-b border-brand-green/10">t°C 1</th>
              <th className="p-2 border-b border-brand-green/10">Час 2</th>
              <th className="p-2 border-b border-brand-green/10">t°C 2</th>
              <th className="p-2 border-b border-brand-green/10">Корективни мерки</th>
              <th className="p-2 border-b border-brand-green/10 w-24">Резултат</th>
              <th className="p-2 border-b border-brand-green/10 w-20">Подпис</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => {
              const row = rows[d] || {};
              const isSelected = d === selectedDay;
              const t1bad = tempOutOfNorm(row.t1 || "", unit.type);
              const t2bad = tempOutOfNorm(row.t2 || "", unit.type);
              return (
                <tr key={d} className={`border-b border-brand-green/5 ${isSelected ? "bg-brand-gold/10" : "hover:bg-brand-light/20"}`}>
                  <td className="p-1.5 text-center font-bold text-brand-dark/60">
                    {d}
                    {isSelected && <span className="block text-[8px] text-brand-gold font-black">{dayLbl}</span>}
                  </td>
                  <td className="p-1">
                    <input type="time" className={`${inputCls} min-w-[80px]`} value={row.t1h || ""} disabled={readOnly} onChange={(e) => updateCell(d, "t1h", e.target.value)} />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      className={`${inputCls} min-w-[58px] text-center ${t1bad ? "!border-red-400 !bg-red-50 text-red-700 font-bold" : ""}`}
                      value={row.t1 || ""}
                      placeholder="°C"
                      disabled={readOnly}
                      onChange={(e) => updateCell(d, "t1", e.target.value)}
                    />
                  </td>
                  <td className="p-1">
                    <input type="time" className={`${inputCls} min-w-[80px]`} value={row.t2h || ""} disabled={readOnly} onChange={(e) => updateCell(d, "t2h", e.target.value)} />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      className={`${inputCls} min-w-[58px] text-center ${t2bad ? "!border-red-400 !bg-red-50 text-red-700 font-bold" : ""}`}
                      value={row.t2 || ""}
                      placeholder="°C"
                      disabled={readOnly}
                      onChange={(e) => updateCell(d, "t2", e.target.value)}
                    />
                  </td>
                  <td className="p-1">
                    <input
                      type="text"
                      className={`${inputCls} min-w-[130px]`}
                      value={row.action || ""}
                      placeholder={t1bad || t2bad ? "Опишете предприетите мерки!" : ""}
                      disabled={readOnly}
                      onChange={(e) => updateCell(d, "action", e.target.value)}
                    />
                  </td>
                  <td className="p-1 text-center">
                    {row.result ? (
                      <span
                        className={`inline-block px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                          row.result === "Норма" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {row.result}
                      </span>
                    ) : (
                      <span className="text-brand-dark/25">—</span>
                    )}
                  </td>
                  <td className="p-1">
                    <input type="text" className={`${inputCls} min-w-[64px]`} value={row.sign || ""} disabled={readOnly} onChange={(e) => updateCell(d, "sign", e.target.value)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Редактор: обучения                                                  */
/* ------------------------------------------------------------------ */

function TrainingEditor({
  data,
  month,
  onUpdate,
  readOnly,
  employees,
  firm,
}: {
  data: RegisterDocData;
  month: string;
  onUpdate: Updater;
  readOnly: boolean;
  employees: Employee[];
  firm: PrintFirmInfo;
}) {
  const entries = data.entries || [];
  const [draft, setDraft] = useState<any>(null);

  const startDraft = () =>
    setDraft({
      number: String(entries.length + 1),
      date: todayISO(),
      place: firm.address || "",
      topic: TRAINING_TOPICS[0],
      lecturer: firm.manager || "",
      attendees: employees.map((e) => e.name),
      result: "Много добро",
      notes: "",
    });

  const saveDraft = () => {
    if (!draft.topic || !draft.date) {
      alert("Моля, попълнете дата и тема на обучението.");
      return;
    }
    onUpdate((prev) => ({ ...prev, entries: [...(prev.entries || []), draft] }));
    setDraft(null);
  };

  const removeEntry = (idx: number) => {
    if (!confirm("Изтриване на този протокол за обучение?")) return;
    onUpdate((prev) => {
      const list = [...(prev.entries || [])];
      list.splice(idx, 1);
      return { ...prev, entries: list };
    });
  };

  return (
    <div className="space-y-4">
      <details className="bg-brand-light/40 border border-brand-green/10 rounded-xl px-4 py-3">
        <summary className="text-[11px] font-black uppercase text-brand-green cursor-pointer">
          План за обучение — 11 теми (кликнете за преглед)
        </summary>
        <ul className="mt-2 space-y-1 text-[11px] text-brand-dark/70 list-disc pl-5">
          {TRAINING_TOPICS.map((t) => {
            const done = entries.some((e) => e.topic === t);
            return (
              <li key={t} className={done ? "text-green-700" : ""}>
                {t} {done && <span className="font-bold">✓ проведено</span>}
              </li>
            );
          })}
        </ul>
      </details>

      {!readOnly && !draft && (
        <button
          onClick={startDraft}
          className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-md shadow-brand-green/15"
        >
          <Plus className="h-3.5 w-3.5" /> Нов протокол за обучение
        </button>
      )}

      {draft && (
        <div className="border border-brand-gold/30 bg-brand-gold/5 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-black uppercase text-brand-green">Нов протокол за проведено обучение</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">Протокол №</label>
              <input className={inputCls} value={draft.number} onChange={(e) => setDraft({ ...draft, number: e.target.value })} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">Дата</label>
              <input type="date" className={inputCls} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">Място на провеждане</label>
              <input className={inputCls} value={draft.place} onChange={(e) => setDraft({ ...draft, place: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">Тема на обучението</label>
            <select className={inputCls} value={draft.topic} onChange={(e) => setDraft({ ...draft, topic: e.target.value })}>
              {TRAINING_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">Лектор</label>
            <input className={inputCls} value={draft.lecturer} onChange={(e) => setDraft({ ...draft, lecturer: e.target.value })} />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">Присъствали служители</label>
            {employees.length === 0 ? (
              <p className="text-[10px] text-brand-dark/40 italic">
                Добавете служители от „Оборудване и персонал“, за да ги отбележите тук.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {employees.map((e) => {
                  const on = draft.attendees.includes(e.name);
                  return (
                    <button
                      key={e.name}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          attendees: on
                            ? draft.attendees.filter((a: string) => a !== e.name)
                            : [...draft.attendees, e.name],
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-colors ${
                        on ? "bg-brand-green text-white border-brand-green" : "bg-white text-brand-dark/50 border-brand-green/15"
                      }`}
                    >
                      {on ? "✓ " : ""}
                      {e.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">Резултат от оценката</label>
              <select className={inputCls} value={draft.result} onChange={(e) => setDraft({ ...draft, result: e.target.value })}>
                {TRAINING_RESULTS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">Бележки</label>
              <input className={inputCls} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setDraft(null)}
              className="text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-brand-green/15 text-brand-dark/50 cursor-pointer hover:bg-brand-light"
            >
              Отказ
            </button>
            <button
              onClick={saveDraft}
              className="text-[10px] font-black uppercase px-5 py-2 rounded-xl bg-brand-green text-white cursor-pointer border-0 shadow-md"
            >
              Запази протокола
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-xs text-brand-dark/40 italic text-center py-6 border border-dashed border-brand-green/15 rounded-xl">
            Няма записани обучения за {month.slice(0, 4)} г.
          </p>
        ) : (
          entries.map((e, idx) => (
            <div key={idx} className="flex flex-wrap items-center gap-3 bg-white border border-brand-green/10 rounded-xl px-4 py-3">
              <GraduationCap className="h-4 w-4 text-brand-gold shrink-0" />
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-bold text-brand-green">
                  Протокол №{e.number || idx + 1} — {e.date}
                </p>
                <p className="text-[10px] text-brand-dark/60">{e.topic}</p>
                <p className="text-[9px] text-brand-dark/40">
                  Лектор: {e.lecturer || "—"} · Присъствали: {(e.attendees || []).length} · Резултат: {e.result || "—"}
                </p>
              </div>
              {!readOnly && (
                <button onClick={() => removeEntry(idx)} className="text-red-300 hover:text-red-500 cursor-pointer p-1" title="Изтрий">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Редактор: въпросник / чек-лист (скали)                              */
/* ------------------------------------------------------------------ */

function SurveyEditor({
  data,
  month,
  onUpdate,
  readOnly,
  employees,
  groups,
  scaleMax,
  perEmployee,
}: {
  data: RegisterDocData;
  month: string;
  onUpdate: Updater;
  readOnly: boolean;
  employees: Employee[];
  groups: SurveyGroup[];
  scaleMax: number;
  perEmployee: boolean;
}) {
  const entries = data.entries || [];
  const [draft, setDraft] = useState<any>(null);
  const flatCount = groups.reduce((a, g) => a + g.questions.length, 0);

  const startDraft = () => setDraft({ date: todayISO(), name: "", employee: "", answers: {} });

  const saveDraft = () => {
    const answered = Object.keys(draft.answers).length;
    if (answered < flatCount) {
      if (!confirm(`Отговорени са ${answered} от ${flatCount} въпроса. Запазване въпреки това?`)) return;
    }
    if (perEmployee && !draft.employee) {
      alert("Изберете служител, за когото се попълва чек-листът.");
      return;
    }
    onUpdate((prev) => ({ ...prev, entries: [...(prev.entries || []), draft] }));
    setDraft(null);
  };

  const removeEntry = (idx: number) => {
    if (!confirm("Изтриване на този запис?")) return;
    onUpdate((prev) => {
      const list = [...(prev.entries || [])];
      list.splice(idx, 1);
      return { ...prev, entries: list };
    });
  };

  const entryScore = (e: any) => {
    const vals = Object.values(e.answers || {}) as number[];
    if (vals.length === 0) return null;
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
  };

  return (
    <div className="space-y-4">
      {!readOnly && !draft && (
        <button
          onClick={startDraft}
          className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] uppercase font-black px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer border-0 shadow-md shadow-brand-green/15"
        >
          <Plus className="h-3.5 w-3.5" /> {perEmployee ? "Нов чек-лист за служител" : "Попълни нов въпросник"}
        </button>
      )}

      {draft && (
        <div className="border border-brand-gold/30 bg-brand-gold/5 rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">Дата</label>
              <input type="date" className={inputCls} value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-brand-dark/50 block mb-1">
                {perEmployee ? "Служител" : "Име и длъжност (може анонимно)"}
              </label>
              {perEmployee ? (
                <select className={inputCls} value={draft.employee} onChange={(e) => setDraft({ ...draft, employee: e.target.value })}>
                  <option value="">— изберете —</option>
                  {employees.map((e) => (
                    <option key={e.name} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className={inputCls}
                  placeholder="оставете празно за анонимно"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              )}
            </div>
          </div>

          {(() => {
            let counter = -1;
            return groups.map((g) => (
              <div key={g.code} className="space-y-1.5">
                <h5 className="text-[10px] font-black uppercase text-brand-green bg-brand-green/5 rounded-lg px-3 py-1.5">{g.title}</h5>
                {g.questions.map((q) => {
                  counter++;
                  const qi = counter;
                  return (
                    <div key={qi} className="flex flex-col sm:flex-row sm:items-center gap-1.5 border-b border-brand-green/5 pb-1.5">
                      <span className="flex-1 text-[11px] text-brand-dark/75 leading-snug">{q}</span>
                      <div className="flex gap-1 shrink-0">
                        {Array.from({ length: scaleMax }, (_, i) => i + 1).map((n) => (
                          <button
                            key={n}
                            onClick={() => setDraft({ ...draft, answers: { ...draft.answers, [qi]: n } })}
                            title={scaleMax === 5 ? SURVEY_SCALE_LABELS[n - 1] : `Оценка ${n}`}
                            className={`w-7 h-7 rounded-lg text-[10px] font-black border cursor-pointer transition-colors ${
                              draft.answers[qi] === n
                                ? n >= (scaleMax === 5 ? 4 : 3)
                                  ? "bg-green-500 text-white border-green-500"
                                  : n <= (scaleMax === 5 ? 2 : 1)
                                    ? "bg-red-500 text-white border-red-500"
                                    : "bg-brand-gold text-brand-dark border-brand-gold"
                                : "bg-white text-brand-dark/40 border-brand-green/15 hover:border-brand-gold"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ));
          })()}

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setDraft(null)}
              className="text-[10px] font-black uppercase px-4 py-2 rounded-xl border border-brand-green/15 text-brand-dark/50 cursor-pointer hover:bg-brand-light"
            >
              Отказ
            </button>
            <button
              onClick={saveDraft}
              className="text-[10px] font-black uppercase px-5 py-2 rounded-xl bg-brand-green text-white cursor-pointer border-0 shadow-md"
            >
              Запази
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {entries.length === 0 ? (
          <p className="text-xs text-brand-dark/40 italic text-center py-6 border border-dashed border-brand-green/15 rounded-xl">
            Няма попълнени {perEmployee ? "чек-листове" : "въпросници"} за {month.slice(0, 4)} г.
          </p>
        ) : (
          entries.map((e, idx) => {
            const score = entryScore(e);
            const low = score !== null && parseFloat(score) < (scaleMax === 5 ? 4 : 2.5);
            return (
              <div key={idx} className="flex flex-wrap items-center gap-3 bg-white border border-brand-green/10 rounded-xl px-4 py-3">
                <FileText className="h-4 w-4 text-brand-gold shrink-0" />
                <div className="flex-1 min-w-[180px]">
                  <p className="text-xs font-bold text-brand-green">
                    {perEmployee ? e.employee : e.name || "Анонимен"} — {e.date}
                  </p>
                  <p className="text-[10px] text-brand-dark/50">
                    Средна оценка:{" "}
                    <span className={`font-black ${low ? "text-red-600" : "text-green-700"}`}>
                      {score ?? "—"} / {scaleMax}
                    </span>
                    {low && " — необходими са корективни мерки и допълнително обучение"}
                  </p>
                </div>
                {!readOnly && (
                  <button onClick={() => removeEntry(idx)} className="text-red-300 hover:text-red-500 cursor-pointer p-1" title="Изтрий">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Модал: оборудване и персонал                                        */
/* ------------------------------------------------------------------ */

function EquipmentModal({
  fridges,
  freezers,
  employees,
  hotPoint,
  hotAppliances,
  signature,
  signatureMode,
  onSave,
  onClose,
}: {
  fridges: string[];
  freezers: string[];
  employees: Employee[];
  hotPoint: boolean;
  hotAppliances: string[];
  signature?: string;
  signatureMode: "draw" | "manual";
  onSave: (patch: {
    customFridges: string[];
    customFreezers: string[];
    customEmployees: Employee[];
    hasHotPoint: boolean;
    hotAppliances: string[];
    signature?: string;
    signatureMode?: "draw" | "manual";
  }) => void | Promise<void>;
  onClose: () => void;
}) {
  const [localFridges, setLocalFridges] = useState<string[]>(fridges);
  const [localFreezers, setLocalFreezers] = useState<string[]>(freezers);
  const [localEmployees, setLocalEmployees] = useState<Employee[]>(employees);
  const [localHotPoint, setLocalHotPoint] = useState<boolean>(hotPoint);
  const [localAppliances, setLocalAppliances] = useState<string[]>(hotAppliances);
  const [localSignature, setLocalSignature] = useState<string | undefined>(signature);
  const [localSigMode, setLocalSigMode] = useState<"draw" | "manual">(signatureMode);
  const [newFridge, setNewFridge] = useState("");
  const [newFreezer, setNewFreezer] = useState("");
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpRole, setNewEmpRole] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onSave({
        customFridges: localFridges,
        customFreezers: localFreezers,
        customEmployees: localEmployees,
        hasHotPoint: localHotPoint,
        hotAppliances: localHotPoint ? localAppliances : [],
        signature: localSignature ?? "",
        signatureMode: localSigMode,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const listRow = (label: string, onRemove: () => void) => (
    <div className="flex items-center justify-between bg-brand-light/40 rounded-lg px-3 py-2">
      <span className="text-xs text-brand-dark/80">{label}</span>
      <button onClick={onRemove} className="text-red-300 hover:text-red-500 cursor-pointer p-0.5">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-brand-green">Оборудване и персонал</h3>
          <button onClick={onClose} className="text-brand-dark/40 hover:text-brand-dark cursor-pointer p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-[11px] text-brand-dark/50 leading-relaxed">
          Тези списъци се използват автоматично във всички дневници — температурни чек-листове, контролна карта за
          персонала, здравни книжки, обучения и работно облекло.
        </p>

        {/* Топла точка */}
        <button
          type="button"
          onClick={() => setLocalHotPoint(!localHotPoint)}
          className={`w-full flex items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-colors cursor-pointer ${
            localHotPoint ? "bg-brand-gold/10 border-brand-gold/40" : "bg-brand-light/40 border-brand-green/10 hover:border-brand-gold/30"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 font-black text-sm ${
              localHotPoint ? "bg-brand-gold border-brand-gold text-brand-dark" : "border-brand-green/25 text-transparent"
            }`}
          >
            ✓
          </span>
          <Flame className={`h-5 w-5 shrink-0 ${localHotPoint ? "text-brand-gold" : "text-brand-dark/30"}`} />
          <span className="flex-1">
            <span className="block text-xs font-black uppercase tracking-wide text-brand-green">Обектът има топла точка</span>
            <span className="block text-[10px] text-brand-dark/50 leading-snug mt-0.5">
              Скара, фритюрник, дюнер, печене, готвене, топла витрина… Включва допълнителните контролни и партидни карти
              (термична обработка, мазнина, супи, алергени и др.).
            </span>
          </span>
        </button>

        {/* Избор на конкретните уреди от топлата точка */}
        {localHotPoint && (
          <div className="space-y-2 border border-brand-gold/25 bg-brand-gold/5 rounded-2xl p-4">
            <h4 className="text-[10px] font-black uppercase text-brand-green flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-brand-gold" /> Кои уреди има в обекта?
            </h4>
            <p className="text-[10px] text-brand-dark/50 leading-snug">
              Системата ще показва само картите за избраните уреди и всеки ден ще пита кои от тях са използвани, за да
              напомня какво да се попълни.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {HOT_APPLIANCES.map((a) => {
                const on = localAppliances.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() =>
                      setLocalAppliances(on ? localAppliances.filter((x) => x !== a.id) : [...localAppliances, a.id])
                    }
                    className={`px-3 py-2 rounded-xl text-[10px] font-bold border cursor-pointer transition-colors flex items-center gap-1.5 ${
                      on
                        ? "bg-brand-green text-white border-brand-green"
                        : "bg-white text-brand-dark/55 border-brand-green/15 hover:border-brand-gold"
                    }`}
                  >
                    <span className="text-sm leading-none">{a.emoji}</span>
                    {a.label}
                    {on && <Check className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>
            {localAppliances.length === 0 && (
              <p className="text-[10px] text-amber-700 font-bold">
                Няма избрани уреди — ще се показват всички карти от топлата точка.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase text-brand-green flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5" /> Хладилни съоръжения (0…+4°C)
            </h4>
            {localFridges.map((f, i) => (
              <div key={i}>{listRow(f, () => setLocalFridges(localFridges.filter((_, j) => j !== i)))}</div>
            ))}
            <div className="flex gap-2">
              <input className={inputCls} placeholder="напр. Хладилна витрина №1" value={newFridge} onChange={(e) => setNewFridge(e.target.value)} />
              <button
                onClick={() => {
                  const v = newFridge.trim();
                  if (!v) return;
                  setLocalFridges([...localFridges, v]);
                  setNewFridge("");
                }}
                className="shrink-0 bg-brand-green text-white rounded-lg px-3 cursor-pointer border-0"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase text-brand-green flex items-center gap-1.5">
              <Snowflake className="h-3.5 w-3.5" /> Фризери (≤ −18°C)
            </h4>
            {localFreezers.map((f, i) => (
              <div key={i}>{listRow(f, () => setLocalFreezers(localFreezers.filter((_, j) => j !== i)))}</div>
            ))}
            <div className="flex gap-2">
              <input className={inputCls} placeholder="напр. Фризер №1" value={newFreezer} onChange={(e) => setNewFreezer(e.target.value)} />
              <button
                onClick={() => {
                  const v = newFreezer.trim();
                  if (!v) return;
                  setLocalFreezers([...localFreezers, v]);
                  setNewFreezer("");
                }}
                className="shrink-0 bg-brand-green text-white rounded-lg px-3 cursor-pointer border-0"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-[10px] font-black uppercase text-brand-green flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> Служители
          </h4>
          {localEmployees.map((e, i) => (
            <div key={i}>
              {listRow(`${e.name}${e.role ? ` — ${e.role}` : ""}`, () => setLocalEmployees(localEmployees.filter((_, j) => j !== i)))}
            </div>
          ))}
          <div className="flex flex-col sm:flex-row gap-2">
            <input className={inputCls} placeholder="Име и фамилия" value={newEmpName} onChange={(e) => setNewEmpName(e.target.value)} />
            <input className={inputCls} placeholder="Длъжност (напр. продавач)" value={newEmpRole} onChange={(e) => setNewEmpRole(e.target.value)} />
            <button
              onClick={() => {
                const v = newEmpName.trim();
                if (!v) return;
                setLocalEmployees([...localEmployees, { name: v, role: newEmpRole.trim() }]);
                setNewEmpName("");
                setNewEmpRole("");
              }}
              className="shrink-0 bg-brand-green text-white rounded-lg px-3 py-2 cursor-pointer border-0"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Електронен подпис */}
        <div className="space-y-3 border-t border-brand-green/10 pt-4">
          <h4 className="text-[10px] font-black uppercase text-brand-green flex items-center gap-1.5">
            <PenLine className="h-3.5 w-3.5" /> Електронен подпис
          </h4>
          <p className="text-[10px] text-brand-dark/50 leading-snug">
            Нарисувайте подписа си веднъж и системата ще го поставя автоматично на местата за подпис при печат — за да не
            се подписвате всеки път на ръка.
          </p>

          {/* Избор на режим */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLocalSigMode("draw")}
              className={`flex-1 min-w-[150px] text-left rounded-xl border px-3.5 py-2.5 cursor-pointer transition-colors ${
                localSigMode === "draw" ? "bg-brand-gold/10 border-brand-gold/40" : "bg-white border-brand-green/15 hover:border-brand-gold/30"
              }`}
            >
              <span className="block text-[11px] font-black text-brand-green">✍️ Електронен подпис</span>
              <span className="block text-[9px] text-brand-dark/50">Поставя се автоматично при печат</span>
            </button>
            <button
              type="button"
              onClick={() => setLocalSigMode("manual")}
              className={`flex-1 min-w-[150px] text-left rounded-xl border px-3.5 py-2.5 cursor-pointer transition-colors ${
                localSigMode === "manual" ? "bg-brand-gold/10 border-brand-gold/40" : "bg-white border-brand-green/15 hover:border-brand-gold/30"
              }`}
            >
              <span className="block text-[11px] font-black text-brand-green">🖊️ Ръчен подпис</span>
              <span className="block text-[9px] text-brand-dark/50">Оставя празна линия за подпис на ръка</span>
            </button>
          </div>

          {localSigMode === "draw" && (
            <SignaturePad initial={localSignature} onSave={(url) => setLocalSignature(url || undefined)} />
          )}
          {localSigMode === "draw" && localSignature && (
            <p className="text-[10px] text-green-700 font-bold flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Подписът е готов — ще се използва при печат.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-[10px] font-black uppercase px-4 py-2.5 rounded-xl border border-brand-green/15 text-brand-dark/50 cursor-pointer hover:bg-brand-light"
          >
            Отказ
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="text-[10px] font-black uppercase px-6 py-2.5 rounded-xl bg-brand-green text-white cursor-pointer border-0 shadow-md flex items-center gap-1.5 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Запази
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Основен компонент                                                   */
/* ------------------------------------------------------------------ */

interface RegistersTabProps {
  email: string;
  firm: PrintFirmInfo;
  fridges: string[];
  freezers: string[];
  employees: Employee[];
  /** Обектът има топла точка (скара, фритюрник, дюнер, печене…) — добавя контролните карти за топла точка */
  hotPoint?: boolean;
  /** Уредите от топлата точка, налични в обекта (ids от HOT_APPLIANCES) */
  hotAppliances?: string[];
  /** Електронен подпис (PNG data URL) и режим на подписване. */
  signature?: string;
  signatureMode?: "draw" | "manual";
  /** Записва оборудване/персонал в профила на потребителя */
  onSaveEquipment?: (patch: {
    customFridges?: string[];
    customFreezers?: string[];
    customEmployees?: Employee[];
    hasHotPoint?: boolean;
    hotAppliances?: string[];
    signature?: string;
    signatureMode?: "draw" | "manual";
  }) => void | Promise<void>;
  /** Режим само за преглед (админ одит) */
  readOnly?: boolean;
  /** Потребителят вече е виждал обиколката (пази се в профила) */
  tourSeen?: boolean;
  /** Извиква се, когато обиколката приключи/бъде пропусната — за траен запис */
  onTourDone?: () => void | Promise<void>;
}

/** Псевдо-регистър за отбелязване кои уреди са използвани през деня. */
const DAILY_USAGE_ID = "daily-usage";

export default function RegistersTab({
  email,
  firm,
  fridges,
  freezers,
  employees,
  hotPoint = false,
  hotAppliances = [],
  signature,
  signatureMode = "manual",
  onSaveEquipment,
  readOnly = false,
  tourSeen = false,
  onTourDone,
}: RegistersTabProps) {
  const [month, setMonth] = useState(currentMonth());
  /** Избраният ден — календарът, напомнянията и бързите действия работят спрямо него. */
  const [refDate, setRefDate] = useState(todayISO());
  const [docs, setDocs] = useState<Record<string, RegisterDocData>>({});
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<Record<string, "dirty" | "saving" | "saved">>({});
  const [showSettings, setShowSettings] = useState(false);
  const [activeTempUnit, setActiveTempUnit] = useState<string>("");
  const [showTour, setShowTour] = useState(false);

  // Обиколка при първо влизане: пази се в профила + localStorage (за мигновена защита от повторно показване)
  const tourStorageKey = `danka_registers_tour_${email.toLowerCase()}`;
  useEffect(() => {
    if (loading || readOnly || tourSeen || !email) return;
    if (typeof window !== "undefined" && localStorage.getItem(tourStorageKey)) return;
    const t = setTimeout(() => setShowTour(true), 900);
    return () => clearTimeout(t);
  }, [loading, readOnly, tourSeen, email, tourStorageKey]);

  const finishTour = useCallback(() => {
    setShowTour(false);
    try {
      localStorage.setItem(tourStorageKey, "1");
    } catch {}
    onTourDone?.();
  }, [tourStorageKey, onTourDone]);

  const docsRef = useRef<Record<string, RegisterDocData>>({});
  docsRef.current = docs;
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const openedRef = useRef<HTMLDivElement>(null);

  // При отваряне на карта (вкл. чрез клик на напомняне) — скролираме до нея,
  // за да е видимо веднага, че се е отворила.
  useEffect(() => {
    if (!openId) return;
    const t = setTimeout(() => {
      openedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => clearTimeout(t);
  }, [openId]);

  /** Всички регистри за зареждане на данни (пълният комплект при топла точка). */
  const activeRegisters = useMemo(() => registersFor(hotPoint), [hotPoint]);
  /** Видимите карти — филтрирани по притежаваните уреди. */
  const visibleRegisters = useMemo(
    () => visibleRegistersFor(hotPoint, hotAppliances),
    [hotPoint, hotAppliances]
  );
  /** Уредите от топлата точка, които панелът показва. */
  const ownedAppliances = useMemo(
    () =>
      hotAppliances.length > 0
        ? HOT_APPLIANCES.filter((a) => hotAppliances.includes(a.id))
        : HOT_APPLIANCES,
    [hotAppliances]
  );

  /** Всички ежедневни тригери: дейности (винаги) + уреди (при топла точка). */
  const dailyTriggers = useMemo(
    () => [...DAILY_ACTIVITIES, ...(hotPoint ? ownedAppliances : [])],
    [hotPoint, ownedAppliances]
  );

  const units = useMemo(
    () => [
      ...fridges.map((n) => ({ name: n, type: "fridge" as const })),
      ...freezers.map((n) => ({ name: n, type: "freezer" as const })),
    ],
    [fridges, freezers]
  );

  useEffect(() => {
    if (units.length > 0 && !units.some((u) => u.name === activeTempUnit)) {
      setActiveTempUnit(units[0].name);
    }
  }, [units, activeTempUnit]);

  // При смяна на месеца избраният ден се премества в него (днес, ако е текущият месец).
  useEffect(() => {
    if (!refDate.startsWith(month)) {
      setRefDate(month === currentMonth() ? todayISO() : `${month}-01`);
    }
  }, [month, refDate]);

  const isRefToday = refDate === todayISO();
  const refDay = String(parseInt(refDate.slice(8, 10), 10));
  /** „днес" или „15.07" — за заглавия и бутони */
  const dayLabel = isRefToday ? "днес" : `${refDate.slice(8, 10)}.${refDate.slice(5, 7)}`;

  /* ------------------ Зареждане от Firestore ------------------ */
  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const results: Record<string, RegisterDocData> = {};
      const toLoad: { id: string; period: string }[] = [
        ...activeRegisters.map((def) => ({ id: def.id, period: periodFor(def, month) })),
        // Псевдо-документ: кои дейности/уреди са отбелязани по дни.
        { id: DAILY_USAGE_ID, period: month },
        // Задачи, изпратени от администратора (постоянен документ).
        { id: ADMIN_REMINDERS_ID, period: "all" },
      ];
      await Promise.all(
        toLoad.map(async ({ id, period }) => {
          try {
            const key = registerDocKey(email, id, period);
            const snap = await getDoc(doc(db, "logs", key));
            results[id] = snap.exists() ? (snap.data() as RegisterDocData) : {};
          } catch (err) {
            console.error("Register load error", id, err);
            results[id] = {};
          }
        })
      );
      if (!cancelled) {
        setDocs(results);
        setSaveState({});
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [email, month, activeRegisters, hotPoint]);

  /* ------------------ Запис (автоматичен, с дебаунс) ------------------ */
  const persistRegister = useCallback(
    async (registerId: string) => {
      const def = REGISTER_BY_ID[registerId];
      if (!def && registerId !== DAILY_USAGE_ID && registerId !== ADMIN_REMINDERS_ID) return;
      setSaveState((s) => ({ ...s, [registerId]: "saving" }));
      try {
        const period = def ? periodFor(def, month) : registerId === ADMIN_REMINDERS_ID ? "all" : month;
        const key = registerDocKey(email, registerId, period);
        const data = { ...(docsRef.current[registerId] || {}), updatedAt: new Date().toISOString() };
        await setDoc(doc(db, "logs", key), data);
        setSaveState((s) => ({ ...s, [registerId]: "saved" }));
      } catch (err: any) {
        console.error("Register save error", registerId, err);
        alert("Грешка при запазване: " + (err?.message || err));
        setSaveState((s) => ({ ...s, [registerId]: "dirty" }));
      }
    },
    [email, month]
  );

  const makeUpdater = useCallback(
    (registerId: string): Updater =>
      (updater) => {
        if (readOnly) return;
        setDocs((prev) => ({ ...prev, [registerId]: updater(prev[registerId] || {}) }));
        setSaveState((s) => ({ ...s, [registerId]: "dirty" }));
        if (timersRef.current[registerId]) clearTimeout(timersRef.current[registerId]);
        timersRef.current[registerId] = setTimeout(() => persistRegister(registerId), 1200);
      },
    [persistRegister, readOnly]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  /* ------------------ Динамични опции ------------------ */
  const dynamicOptions: DynamicOptions = useMemo(
    () => ({
      suppliers: (docs["suppliers"]?.entries || []).map((e) => String(e.firm || "").trim()).filter(Boolean),
      cleaningAgents: (docs["cleaning-agents"]?.entries || []).map((e) => String(e.name || "").trim()).filter(Boolean),
      employees: employees.map((e) => e.name),
    }),
    [docs, employees]
  );

  /* ------------------ Задължения за конкретен ден ------------------ */
  /** Ежедневните задължения, липсващи за дадена дата — за календара и напомнянията. */
  const dayObligations = useCallback(
    (dateISO: string): { registerId: string; text: string }[] => {
      const dayNum = String(parseInt(dateISO.slice(8, 10), 10));
      const missing: { registerId: string; text: string }[] = [];

      const tempDoc = docs["temps"] || {};
      const missingUnits = units.filter((u) => {
        const row = tempDoc.units?.[u.name]?.rows?.[dayNum];
        return !(row && (String(row.t1 || "").trim() !== "" || String(row.t2 || "").trim() !== ""));
      });
      if (units.length > 0 && missingUnits.length > 0) {
        missing.push({
          registerId: "temps",
          text: `Температури: непопълнени ${missingUnits.length} от ${units.length} съоръжения (${missingUnits.map((u) => u.name).join(", ")}).`,
        });
      }

      if (!isRowFilled(docs["hygiene-daily"]?.rows?.[dayNum])) {
        missing.push({
          registerId: "hygiene-daily",
          text: "Дневникът за хигиена на обекта не е попълнен (попълва се след приключване на почистването).",
        });
      }

      if (employees.length > 0) {
        const checked = new Set(
          (docs["staff-hygiene"]?.entries || []).filter((e) => e.date === dateISO).map((e) => String(e.employee || ""))
        );
        const miss = employees.filter((e) => !checked.has(e.name));
        if (miss.length > 0) {
          missing.push({
            registerId: "staff-hygiene",
            text: `Контролната карта за лична хигиена липсва за: ${miss.map((e) => e.name).join(", ")} (попълва се преди започване на работа).`,
          });
        }
      }

      if (hotPoint) {
        if (!(docs["prework-check"]?.entries || []).some((e) => e.date === dateISO)) {
          missing.push({
            registerId: "prework-check",
            text: "Чек-листът „Хигиена и техническо състояние“ не е попълнен (попълва се преди започване на работа).",
          });
        }
      }

      // Отбелязани дейности/уреди за деня → изискват своите карти.
      const used = docs[DAILY_USAGE_ID]?.rows?.[dayNum] || {};
      dailyTriggers.forEach((trig) => {
        if (used[trig.id] !== "1") return;
        trig.registers.forEach((regId) => {
          const def = REGISTER_BY_ID[regId];
          if (!def) return;
          const dk = recordDateKey(def) || "date";
          if (!(docs[regId]?.entries || []).some((e) => e[dk] === dateISO)) {
            const isActivity = DAILY_ACTIVITIES.some((a) => a.id === trig.id);
            missing.push({
              registerId: regId,
              text: isActivity
                ? `${trig.emoji} Отбелязахте „${trig.label}“ — попълнете картата „${def.shortTitle}“.`
                : `${trig.emoji} Използван е „${trig.label}“ — попълнете картата „${def.shortTitle}“.`,
            });
          }
        });
      });

      return missing;
    },
    [docs, units, employees, hotPoint, dailyTriggers]
  );

  /* ------------------ Напомняния ------------------ */
  const reminders = useMemo(() => {
    const list: { level: "urgent" | "warn" | "info" | "admin"; text: string; registerId: string; adminId?: string }[] = [];
    if (loading) return list;
    const today = todayISO();

    // Задачи от администратора (д-р Николова) — показват се от датата им нататък,
    // докато не бъдат отбелязани като изпълнени. Имат приоритет най-отгоре.
    const adminItems = (docs[ADMIN_REMINDERS_ID]?.entries || []) as AdminReminder[];
    adminItems.forEach((a) => {
      if (a.done || !a.text) return;
      const show = isRefToday ? String(a.date || "") <= today : String(a.date || "") === refDate;
      if (show) {
        list.push({ level: "admin", text: a.text, registerId: a.registerId || "", adminId: a.id });
      }
    });
    // Напомнянията важат за избрания ден; за бъдещи дни не се показват.
    if (!refDate.startsWith(month) || refDate > today) return list;

    // Ежедневни задължения за избрания ден
    dayObligations(refDate).forEach((m) => list.push({ level: "urgent", ...m }));
    // Периодичните проверки (седмични, месечни, срокове) важат само за днешния ден.
    if (!isRefToday) return list;

    const weekIdx = Math.min(4, Math.floor((new Date().getDate() - 1) / 7));
    if (!isRowFilled(docs["hygiene-weekly"]?.rows?.[ROMAN_WEEKS[weekIdx]])) {
      list.push({
        level: "warn",
        registerId: "hygiene-weekly",
        text: `Седмичният контрол на оборудването за ${ROMAN_WEEKS[weekIdx]} седмица още не е попълнен (хладилник и фризер се почистват поне веднъж седмично).`,
      });
    }

    if ((docs["hygiene-monthly"]?.entries || []).length === 0) {
      list.push({
        level: "warn",
        registerId: "hygiene-monthly",
        text: "Месечният контрол на хигиената (тавани, осветление, труднодостъпни места) още не е извършен този месец.",
      });
    }

    const hb = docs["health-books"]?.entries || [];
    const soon = new Date();
    soon.setDate(soon.getDate() + 30);
    const soonISO = soon.toISOString().split("T")[0];
    hb.forEach((e) => {
      const v = String(e.validUntil || "");
      if (!v) return;
      if (v < today) {
        list.push({
          level: "urgent",
          registerId: "health-books",
          text: `Личната здравна книжка на ${e.employee || "служител"} е ИЗТЕКЛА (${v})! Необходима е нова заверка.`,
        });
      } else if (v <= soonISO) {
        list.push({
          level: "warn",
          registerId: "health-books",
          text: `Личната здравна книжка на ${e.employee || "служител"} изтича на ${v} — организирайте заверка.`,
        });
      }
    });

    if ((docs["training"]?.entries || []).length === 0) {
      list.push({
        level: "info",
        registerId: "training",
        text: `Няма проведено обучение на персонала през ${month.slice(0, 4)} г. Планирайте обучение по темите от плана.`,
      });
    }

    const quarter = Math.floor(new Date().getMonth() / 3);
    const clEntries = (docs["safety-checklist"]?.entries || []).filter((e) => {
      const d = String(e.date || "");
      if (!d.startsWith(month.slice(0, 4))) return false;
      const m = parseInt(d.slice(5, 7), 10) - 1;
      return Math.floor(m / 3) === quarter;
    });
    if (employees.length > 0 && clEntries.length < employees.length) {
      list.push({
        level: "info",
        registerId: "safety-checklist",
        text: `Чек-листът „Култура на безопасност“ за текущото тримесечие е попълнен за ${clEntries.length} от ${employees.length} служители.`,
      });
    }

    // ── Логични връзки „имаш X, но липсва задължителен запис Y" ──

    // Служител без вписана лична здравна книжка (работа с храни без ЛЗК е нарушение).
    if (employees.length > 0) {
      const hbNames = new Set(
        (docs["health-books"]?.entries || []).map((e) => String(e.employee || "").trim().toLowerCase())
      );
      const missingHb = employees.filter((e) => !hbNames.has(e.name.trim().toLowerCase()));
      if (missingHb.length > 0) {
        list.push({
          level: "warn",
          registerId: "health-books",
          text: `Няма вписана лична здравна книжка за: ${missingHb.map((e) => e.name).join(", ")}. Добавете ги в списъка на ЛЗК.`,
        });
      }
    }

    // Одобрен доставчик без попълнена оценка (карта „Оценка на доставчици").
    if (hotPoint) {
      const suppliers = (docs["suppliers"]?.entries || [])
        .map((e) => String(e.firm || "").trim())
        .filter(Boolean);
      const evaluated = new Set(
        (docs["supplier-eval"]?.entries || []).map((e) => String(e.supplier || "").trim().toLowerCase())
      );
      const notEvaluated = suppliers.filter((s) => !evaluated.has(s.toLowerCase()));
      if (notEvaluated.length > 0) {
        list.push({
          level: "info",
          registerId: "supplier-eval",
          text: `Оценете доставчик${notEvaluated.length === 1 ? "" : "и"}: ${notEvaluated.slice(0, 4).join(", ")}${notEvaluated.length > 4 ? " и др." : ""} (попълва се веднъж за всеки доставчик).`,
        });
      }

      // Меню с алергени още не е въведено (при топла точка е задължително).
      if ((docs["allergen-menu"]?.entries || []).length === 0) {
        list.push({
          level: "warn",
          registerId: "allergen-menu",
          text: "Менюто с алергени още не е попълнено. Отворете картата и заредете примерно меню, после го редактирайте.",
        });
      }
    }

    // Хигиена се води, но няма нито един вписан почистващ/дезинфекционен препарат.
    const anyHygiene =
      (docs["hygiene-daily"]?.rows && Object.values(docs["hygiene-daily"].rows).some((r) => isRowFilled(r))) ||
      false;
    if (anyHygiene && (docs["cleaning-agents"]?.entries || []).length === 0) {
      list.push({
        level: "info",
        registerId: "cleaning-agents",
        text: "Води се хигиена, но няма вписани препарати. Добавете използваните препарати за почистване и дезинфекция.",
      });
    }

    // ─── Топла точка ───
    if (hotPoint) {
      // Карти на 3 дни: смяна на мазнина (само при фритюрник) и остатъчни дезинфектанти
      const lastEntryDate = (id: string) => {
        const dates = (docs[id]?.entries || []).map((e) => String(e.date || "")).filter(Boolean).sort();
        return dates.length ? dates[dates.length - 1] : "";
      };
      const daysAgo = (iso: string) => {
        if (!iso) return Infinity;
        return Math.floor((Date.now() - new Date(iso + "T00:00:00").getTime()) / 86400000);
      };
      const hasFryer = hotAppliances.length === 0 || hotAppliances.includes("fryer");
      if (hasFryer) {
        // Дни от месеца, в които е отбелязана употреба на фритюрника → ISO дати.
        const usageRows = docs[DAILY_USAGE_ID]?.rows || {};
        const fryerUseDates = Object.keys(usageRows)
          .filter((dn) => usageRows[dn]?.fryer === "1")
          .map((dn) => `${month}-${dn.padStart(2, "0")}`)
          .sort();
        const lastDisposal = lastEntryDate("fryer-oil-destroy");
        // Начало на текущия 3-дневен цикъл = първата употреба на фритюрника
        // след последната смяна на мазнина (или първата употреба изобщо).
        const cycleStart = fryerUseDates.find((d) => !lastDisposal || d >= lastDisposal);
        if (cycleStart) {
          const oilDays = daysAgo(cycleStart);
          if (oilDays >= 3) {
            list.push({
              level: "urgent",
              registerId: "fryer-oil-destroy",
              text: `🍟 Използвате фритюрника от ${oilDays} дни без смяна на мазнината — попълнете карта „Унищожаване на използвана мазнина“ (задължително на всеки 3 дни).`,
            });
          }
        }
      }
      const resDays = daysAgo(lastEntryDate("disinfectant-residue"));
      if (resDays >= 3) {
        list.push({
          level: "warn",
          registerId: "disinfectant-residue",
          text: resDays === Infinity
            ? "Няма тест за остатъчни дезинфектанти този месец (извършва се на всеки 3 дни с тест ленти)."
            : `Последният тест за остатъчни дезинфектанти е преди ${resDays} дни — извършва се на всеки 3 дни.`,
        });
      }
    }

    return list;
  }, [docs, loading, month, refDate, refDay, isRefToday, dayObligations, employees, hotPoint, hotAppliances]);

  /* ------------------ Статус на регистър за картите ------------------ */
  const registerStatus = useCallback(
    (def: RegisterDef): { label: string; tone: "ok" | "due" | "neutral" } => {
      if (loading) return { label: "…", tone: "neutral" };
      const d = docs[def.id] || {};
      const isCurrent = month === currentMonth();
      // Статусите на дневните карти следват избрания ден от календара.
      const dayMode = refDate.startsWith(month) && refDate <= todayISO();
      const dayNum = refDay;
      const dLbl = isRefToday ? "Днес" : dayLabel;
      switch (def.id) {
        case "temps": {
          if (units.length === 0) return { label: "Добавете съоръжения", tone: "due" };
          if (!dayMode) break;
          const filled = units.filter((u) => {
            const row = d.units?.[u.name]?.rows?.[dayNum];
            return row && (String(row.t1 || "").trim() !== "" || String(row.t2 || "").trim() !== "");
          }).length;
          return filled === units.length
            ? { label: `${dLbl}: попълнено ✓`, tone: "ok" }
            : { label: `${dLbl}: ${filled}/${units.length} съоръжения`, tone: "due" };
        }
        case "hygiene-daily":
          if (!dayMode) break;
          return isRowFilled(d.rows?.[dayNum])
            ? { label: `${dLbl}: попълнено ✓`, tone: "ok" }
            : { label: `${dLbl}: непопълнено`, tone: "due" };
        case "staff-hygiene": {
          if (!dayMode || employees.length === 0) break;
          const cnt = new Set((d.entries || []).filter((e) => e.date === refDate).map((e) => e.employee)).size;
          return cnt >= employees.length
            ? { label: `${dLbl}: попълнено ✓`, tone: "ok" }
            : { label: `${dLbl}: ${cnt}/${employees.length} служители`, tone: "due" };
        }
        case "hygiene-weekly": {
          if (!isCurrent) break;
          const weekIdx = Math.min(4, Math.floor((new Date().getDate() - 1) / 7));
          return isRowFilled(d.rows?.[ROMAN_WEEKS[weekIdx]])
            ? { label: "Тази седмица: ✓", tone: "ok" }
            : { label: "Тази седмица: предстои", tone: "due" };
        }
        case "hygiene-monthly":
          if (!isCurrent) break;
          return (d.entries || []).length > 0
            ? { label: "Този месец: ✓", tone: "ok" }
            : { label: "Този месец: предстои", tone: "due" };
        case "prework-check": {
          if (!dayMode) break;
          return (d.entries || []).some((e) => e.date === refDate)
            ? { label: `${dLbl}: попълнено ✓`, tone: "ok" }
            : { label: `${dLbl}: непопълнено`, tone: "due" };
        }
        default:
          break;
      }
      // Карти, свързани с дейност/уред: статус според „отбелязано" за избрания ден
      const triggerId = REGISTER_APPLIANCE[def.id];
      if (triggerId && dayMode) {
        const markedOnDay = docs[DAILY_USAGE_ID]?.rows?.[dayNum]?.[triggerId] === "1";
        if (markedOnDay) {
          const dk = recordDateKey(def) || "date";
          return (d.entries || []).some((e) => e[dk] === refDate)
            ? { label: `${dLbl}: попълнено ✓`, tone: "ok" }
            : { label: `${TRIGGER_BY_ID[triggerId]?.emoji || ""} ${dLbl}: изисква се!`, tone: "due" };
        }
      }
      const count =
        (d.entries || []).length ||
        Object.values(d.rows || {}).filter((r) => isRowFilled(r)).length ||
        Object.values(d.units || {}).reduce(
          (acc, u) => acc + Object.values(u.rows || {}).filter((r) => isRowFilled(r)).length,
          0
        );
      return count > 0
        ? { label: `${count} запис${count === 1 ? "" : "а"}`, tone: "neutral" }
        : { label: "Няма записи", tone: "neutral" };
    },
    [docs, loading, month, units, employees, refDate, refDay, isRefToday, dayLabel]
  );

  /* ------------------ Печат ------------------ */
  const hasData = (def: RegisterDef) => {
    const d = docs[def.id] || {};
    if (def.kind === "temp-units")
      return Object.values(d.units || {}).some((u) => Object.values(u.rows || {}).some((r) => isRowFilled(r)));
    if (d.entries && d.entries.length > 0) return true;
    if (d.rows && Object.values(d.rows).some((r) => isRowFilled(r))) return true;
    return false;
  };

  // Подписът се вгражда в печата само ако обектът е избрал електронен подпис.
  const printFirm: PrintFirmInfo = {
    ...firm,
    signature: signatureMode === "draw" ? signature : undefined,
  };

  const printOne = (def: RegisterDef) => {
    const section = buildRegisterSection(def, docs[def.id] || {}, printFirm, month);
    printHtml(buildPrintDocument(def.title, [section]));
  };

  // Обектът отбелязва задача от администратора като изпълнена.
  const markAdminReminderDone = (adminId: string) => {
    makeUpdater(ADMIN_REMINDERS_ID)((prev) => ({
      ...prev,
      entries: (prev.entries || []).map((e: any) =>
        e.id === adminId ? { ...e, done: true, doneAt: new Date().toISOString() } : e
      ),
    }));
  };

  const printAll = () => {
    const sections = activeRegisters.filter((def) => hasData(def)).map((def) =>
      buildRegisterSection(def, docs[def.id] || {}, printFirm, month)
    );
    if (sections.length === 0) {
      alert("Няма попълнени дневници за избрания месец.");
      return;
    }
    printHtml(buildPrintDocument(`Дневници по самоконтрол — ${monthLabelBg(month)}`, sections));
  };

  /* ------------------ Изглед ------------------ */
  const openDef = openId ? activeRegisters.find((r) => r.id === openId) : null;
  const urgentCount = reminders.filter((r) => r.level === "urgent").length;

  return (
    <div className="space-y-6">
      {/* Заглавна лента */}
      <div data-tour="header" className="bg-white border border-brand-green/10 p-5 rounded-3xl shadow-xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-green/10 text-brand-green rounded-xl border border-brand-green/10">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-green leading-snug">
              Дневници по самоконтрол — търговия с храни
            </h2>
            <p className="text-[10px] text-brand-dark/50">
              Попълвайте онлайн — системата пази всичко автоматично и напомня какво предстои. Печат по всяко време.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-black text-brand-dark/70 uppercase tracking-wider">Месец:</label>
            <input
              type="month"
              value={month}
              onChange={(e) => e.target.value && setMonth(e.target.value)}
              className="text-xs border border-brand-green/15 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold rounded-xl px-3 py-2 bg-brand-light font-medium text-brand-dark"
            />
          </div>
          {!readOnly && (
            <button
              data-tour="equipment"
              onClick={() => setShowSettings(true)}
              className="bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/30 hover:border-brand-green/60 text-brand-green font-black text-xs uppercase px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] duration-150"
            >
              <Settings className="h-4 w-4 text-brand-green" />
              Оборудване и персонал
            </button>
          )}
          <button
            data-tour="print"
            onClick={printAll}
            className="bg-brand-gold hover:bg-brand-gold-light hover:scale-[1.02] active:scale-[0.98] text-brand-dark font-black text-xs uppercase px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-brand-gold/10 border-0 duration-150"
          >
            <Printer className="h-4 w-4" />
            Печат на всичко попълнено
          </button>
        </div>
      </div>

      {/* Календар на месеца: статус по дни */}
      {!loading && (() => {
        const today = todayISO();
        const n = daysInMonth(month);
        return (
          <div data-tour="calendar" className="bg-white border border-brand-green/10 rounded-3xl p-5 shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="h-4 w-4 text-brand-green/70" />
                <h3 className="text-xs font-black uppercase tracking-wider text-brand-dark/80">
                  Календар — {monthLabelBg(month)}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[9px] font-bold text-brand-dark/50">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-400" /> всичко попълнено</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-400" /> има непопълнено</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-brand-light border border-brand-green/15" /> предстоящ ден</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: n }, (_, i) => {
                const day = i + 1;
                const iso = `${month}-${String(day).padStart(2, "0")}`;
                const isFuture = iso > today;
                const missing = isFuture ? [] : dayObligations(iso);
                const isSelected = iso === refDate;
                const tone = isFuture
                  ? "bg-brand-light/70 text-brand-dark/30 border-brand-green/10"
                  : missing.length === 0
                    ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                    : "bg-red-100 text-red-600 border-red-300 hover:bg-red-200";
                return (
                  <button
                    key={iso}
                    onClick={() => setRefDate(iso)}
                    title={
                      isFuture
                        ? "Предстоящ ден"
                        : missing.length === 0
                          ? "Всичко е попълнено ✓"
                          : `Непопълнено (${missing.length}):\n• ${missing.map((m) => m.text).join("\n• ")}`
                    }
                    className={`relative w-10 h-10 rounded-xl border text-[11px] font-black transition-colors cursor-pointer ${tone} ${
                      isSelected ? "ring-2 ring-brand-gold ring-offset-1 scale-105" : ""
                    } ${iso === today ? "underline underline-offset-2" : ""}`}
                  >
                    {day}
                    {!isFuture && missing.length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-0.5 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center leading-none">
                        {missing.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {!isRefToday && (
              <div className="flex flex-wrap items-center justify-between gap-2 bg-brand-gold/10 border border-brand-gold/30 rounded-xl px-4 py-2.5">
                <span className="text-[11px] font-bold text-brand-dark/75">
                  Работите по <span className="text-brand-green font-black">{dayLabel}</span> — напомнянията, отметките и
                  новите записи се отнасят за този ден.
                </span>
                <button
                  onClick={() => { setMonth(currentMonth()); setRefDate(todayISO()); }}
                  className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg bg-white border border-brand-green/15 hover:border-brand-gold text-brand-dark/70 cursor-pointer"
                >
                  ← Обратно към днес
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* Какво се случи през избрания ден — дейности + уреди (топла точка) */}
      {!loading && refDate.startsWith(month) && refDate <= todayISO() && (() => {
        const dayNum = refDay;
        const marked = docs[DAILY_USAGE_ID]?.rows?.[dayNum] || {};
        const markedCount = dailyTriggers.filter((t) => marked[t.id] === "1").length;
        const nothingMarked = Object.keys(marked).length === 0;
        const toggle = (id: string) => {
          if (readOnly) return;
          makeUpdater(DAILY_USAGE_ID)((prev) => {
            const day = { ...((prev.rows || {})[dayNum] || {}) };
            day[id] = day[id] === "1" ? "0" : "1";
            return { ...prev, rows: { ...(prev.rows || {}), [dayNum]: day } };
          });
        };
        const chip = (t: typeof dailyTriggers[number]) => {
          const on = marked[t.id] === "1";
          return (
            <button
              key={t.id}
              disabled={readOnly}
              onClick={() => toggle(t.id)}
              title={
                on
                  ? `Отбелязано ${dayLabel} — изискват се: ${t.registers.map((r) => REGISTER_BY_ID[r]?.shortTitle).filter(Boolean).join(", ")}`
                  : `Кликнете, ако това се е случило ${dayLabel}`
              }
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wide border transition-colors cursor-pointer disabled:cursor-default flex items-center gap-1.5 ${
                on
                  ? "bg-brand-gold text-brand-dark border-brand-gold shadow-md shadow-brand-gold/20"
                  : "bg-white text-brand-dark/55 border-brand-green/15 hover:border-brand-gold"
              }`}
            >
              <span className="text-sm leading-none">{t.emoji}</span>
              {t.label}
              {on && <Check className="h-3 w-3" />}
            </button>
          );
        };
        const applianceChips = hotPoint ? dailyTriggers.filter((t) => HOT_APPLIANCE_BY_ID[t.id]) : [];
        const activityChips = dailyTriggers.filter((t) => !HOT_APPLIANCE_BY_ID[t.id]);
        return (
          <div
            data-tour="usage"
            className={`rounded-3xl border p-5 space-y-3 bg-white ${
              nothingMarked && !readOnly ? "border-brand-gold/50 shadow-lg shadow-brand-gold/10" : "border-brand-green/10 shadow-md"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-brand-gold" />
                <h3 className="text-xs font-black uppercase tracking-wider text-brand-dark/80">
                  Какво се случи {dayLabel}?
                </h3>
              </div>
              <span className="text-[10px] font-bold text-brand-dark/45">
                {markedCount > 0
                  ? `${markedCount} отбеляза${markedCount === 1 ? "но" : "ни"} за ${dayLabel}`
                  : readOnly
                    ? `Няма отбелязани дейности за ${dayLabel}`
                    : "Отбележете и системата ще Ви напомни кои карти да попълните"}
              </span>
            </div>

            {/* Дейности (за всеки обект) */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-brand-dark/40">Дейности</span>
              <div className="flex flex-wrap gap-2">{activityChips.map(chip)}</div>
            </div>

            {/* Уреди от топлата точка */}
            {hotPoint && applianceChips.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold/70 flex items-center gap-1">
                  <Flame className="h-3 w-3" /> Топла точка — използвани уреди
                </span>
                <div className="flex flex-wrap gap-2">{applianceChips.map(chip)}</div>
              </div>
            )}

            {hotPoint && hotAppliances.length === 0 && !readOnly && (
              <p className="text-[10px] text-brand-dark/40 leading-snug">
                Съвет: изберете кои уреди реално има в обекта от „Оборудване и персонал“ — списъкът тук и картите ще се
                съобразят автоматично.
              </p>
            )}
          </div>
        );
      })()}

      {/* Напомняния */}
      {!readOnly && reminders.length > 0 && (
        <div
          data-tour="reminders"
          className={`rounded-3xl border p-5 space-y-2.5 ${urgentCount > 0 ? "bg-red-50/70 border-red-200" : "bg-amber-50/70 border-amber-200"}`}
        >
          <div className="flex items-center gap-2">
            <Bell className={`h-4 w-4 ${urgentCount > 0 ? "text-red-500" : "text-amber-500"}`} />
            <h3 className="text-xs font-black uppercase tracking-wider text-brand-dark/80">
              Напомняния за {dayLabel} ({reminders.length})
            </h3>
          </div>
          <div className="space-y-1.5">
            {reminders.map((r, i) =>
              r.level === "admin" ? (
                <div
                  key={i}
                  className="w-full flex items-start gap-2 text-[11px] leading-snug rounded-xl px-3 py-2.5 border bg-brand-gold/10 border-brand-gold/40 text-brand-dark/85"
                >
                  <span className="shrink-0 mt-0.5 text-sm leading-none">📌</span>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[8px] font-black uppercase tracking-widest text-brand-gold/90 mb-0.5">
                      Задача от д-р Николова
                    </span>
                    <span className="block">{r.text}</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      {r.registerId && REGISTER_BY_ID[r.registerId] && (
                        <button
                          onClick={() => setOpenId(r.registerId)}
                          className="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg bg-white border border-brand-green/15 hover:border-brand-gold text-brand-green cursor-pointer"
                        >
                          Отвори картата →
                        </button>
                      )}
                      <button
                        onClick={() => r.adminId && markAdminReminderDone(r.adminId)}
                        className="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg bg-brand-green text-white border-0 cursor-pointer flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" /> Готово
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  key={i}
                  onClick={() => r.registerId && setOpenId(r.registerId)}
                  className={`w-full text-left flex items-start gap-2 text-[11px] leading-snug rounded-xl px-3 py-2 cursor-pointer transition-colors border ${
                    r.level === "urgent"
                      ? "bg-white border-red-200 text-red-800 hover:border-red-400"
                      : r.level === "warn"
                        ? "bg-white border-amber-200 text-amber-800 hover:border-amber-400"
                        : "bg-white border-brand-green/10 text-brand-dark/60 hover:border-brand-gold"
                  }`}
                >
                  {r.level === "urgent" ? (
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  )}
                  <span className="flex-1">{r.text}</span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-50" />
                </button>
              )
            )}
          </div>
        </div>
      )}
      {!readOnly && !loading && reminders.length === 0 && refDate.startsWith(month) && refDate <= todayISO() &&
        Object.keys(docs[DAILY_USAGE_ID]?.rows?.[refDay] || {}).length > 0 && (
        <div className="rounded-3xl border border-green-200 bg-green-50/70 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <p className="text-xs text-green-800 font-bold">
            Всичко за {dayLabel} е попълнено — обектът е изряден! Системата ще напомни при следващо задължение.
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-brand-dark/40">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-xs font-bold">Зареждане на дневниците…</span>
        </div>
      ) : openDef ? (
        /* ------------------ Отворен регистър ------------------ */
        <div ref={openedRef} className="scroll-mt-24 bg-white border border-brand-gold/40 p-6 rounded-3xl shadow-xl space-y-5 animate-fade-in ring-1 ring-brand-gold/20">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-green/5 pb-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setOpenId(null)}
                className="p-2 rounded-xl border border-brand-green/15 hover:border-brand-gold text-brand-dark/60 cursor-pointer bg-white mt-0.5"
                title="Назад към всички дневници"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div>
                <h3 className="font-serif text-base font-bold text-brand-green">
                  {openDef.num}. {openDef.title}
                </h3>
                <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">
                  {FREQUENCY_LABELS[openDef.frequency]}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saveState[openDef.id] === "saving" && (
                <span className="text-[9px] font-bold text-brand-dark/40 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Запазване…
                </span>
              )}
              {saveState[openDef.id] === "saved" && (
                <span className="text-[9px] font-bold text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Запазено
                </span>
              )}
              <button
                onClick={() => printOne(openDef)}
                className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-[10px] uppercase px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border-0 shadow-md shadow-brand-gold/10"
              >
                <Printer className="h-3.5 w-3.5" />
                Печат
              </button>
            </div>
          </div>

          {/* Кога се попълва */}
          <div className="bg-brand-gold/10 border border-brand-gold/25 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
            <p className="text-[11px] text-brand-dark/75 leading-relaxed">
              <span className="font-black uppercase text-[9px] tracking-wider text-brand-green block mb-0.5">
                Кога се попълва
              </span>
              {openDef.fillWhen}
            </p>
          </div>

          {/* Редактор */}
          {openDef.kind === "rows" && (
            <RowsEditor
              def={openDef}
              data={docs[openDef.id] || {}}
              onUpdate={makeUpdater(openDef.id)}
              readOnly={readOnly}
              employees={employees}
              dynamicOptions={dynamicOptions}
              refDate={refDate}
              dayLbl={dayLabel}
            />
          )}
          {openDef.kind === "grid-days" && (
            <GridEditor
              def={openDef}
              data={docs[openDef.id] || {}}
              month={month}
              rowKeys={Array.from({ length: daysInMonth(month) }, (_, i) => String(i + 1))}
              rowHeader="Дата"
              onUpdate={makeUpdater(openDef.id)}
              readOnly={readOnly}
              dynamicOptions={dynamicOptions}
              selectedDay={refDay}
              selectedDate={refDate}
              dayLbl={dayLabel}
              canTick={refDate.startsWith(month) && refDate <= todayISO()}
            />
          )}
          {openDef.kind === "grid-weeks" && (
            <GridEditor
              def={openDef}
              data={docs[openDef.id] || {}}
              month={month}
              rowKeys={ROMAN_WEEKS}
              rowHeader="Седмица"
              onUpdate={makeUpdater(openDef.id)}
              readOnly={readOnly}
              dynamicOptions={dynamicOptions}
              selectedDay={refDay}
              selectedDate={refDate}
              dayLbl={dayLabel}
              canTick={refDate.startsWith(month) && refDate <= todayISO()}
            />
          )}
          {openDef.kind === "temp-units" && (
            <TempEditor
              data={docs[openDef.id] || {}}
              month={month}
              units={units}
              activeUnit={activeTempUnit}
              setActiveUnit={setActiveTempUnit}
              onUpdate={makeUpdater(openDef.id)}
              readOnly={readOnly}
              selectedDay={refDay}
              dayLbl={dayLabel}
              selIsToday={isRefToday}
              canMark={refDate.startsWith(month) && refDate <= todayISO()}
            />
          )}
          {openDef.kind === "training" && (
            <TrainingEditor
              data={docs[openDef.id] || {}}
              month={month}
              onUpdate={makeUpdater(openDef.id)}
              readOnly={readOnly}
              employees={employees}
              firm={firm}
            />
          )}
          {openDef.kind === "survey" && (
            <SurveyEditor
              data={docs[openDef.id] || {}}
              month={month}
              onUpdate={makeUpdater(openDef.id)}
              readOnly={readOnly}
              employees={employees}
              groups={SAFETY_CULTURE_SURVEY}
              scaleMax={5}
              perEmployee={false}
            />
          )}
          {openDef.kind === "checklist3" && (
            <SurveyEditor
              data={docs[openDef.id] || {}}
              month={month}
              onUpdate={makeUpdater(openDef.id)}
              readOnly={readOnly}
              employees={employees}
              groups={SAFETY_CULTURE_CHECKLIST}
              scaleMax={3}
              perEmployee={true}
            />
          )}

          {/* Легенда / инструкции / корективни действия */}
          {(openDef.legend || openDef.instructions || openDef.corrective || openDef.infoPanels) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {openDef.legend && (
                <details className="bg-brand-light/40 border border-brand-green/10 rounded-xl px-4 py-3">
                  <summary className="text-[10px] font-black uppercase text-brand-green cursor-pointer">Легенда</summary>
                  <ul className="mt-2 space-y-1 text-[11px] text-brand-dark/70 list-disc pl-4">
                    {openDef.legend.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </details>
              )}
              {openDef.instructions && (
                <details className="bg-brand-light/40 border border-brand-green/10 rounded-xl px-4 py-3">
                  <summary className="text-[10px] font-black uppercase text-brand-green cursor-pointer">
                    Инструкция за попълване
                  </summary>
                  <ul className="mt-2 space-y-1 text-[11px] text-brand-dark/70 list-disc pl-4">
                    {openDef.instructions.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </details>
              )}
              {openDef.corrective && (
                <details className="bg-brand-light/40 border border-brand-green/10 rounded-xl px-4 py-3">
                  <summary className="text-[10px] font-black uppercase text-brand-green cursor-pointer">
                    Корективни действия при несъответствие
                  </summary>
                  <ul className="mt-2 space-y-1 text-[11px] text-brand-dark/70 list-disc pl-4">
                    {openDef.corrective.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </details>
              )}
              {openDef.infoPanels?.map((p, i) => (
                <details key={i} className="bg-brand-light/40 border border-brand-green/10 rounded-xl px-4 py-3">
                  <summary className="text-[10px] font-black uppercase text-brand-green cursor-pointer">{p.title}</summary>
                  <ul className="mt-2 space-y-1 text-[11px] text-brand-dark/70 list-disc pl-4">
                    {p.items.map((it, j) => (
                      <li key={j}>{it}</li>
                    ))}
                  </ul>
                </details>
              ))}
              {openDef.id === "hygiene-daily" && (
                <details className="bg-brand-light/40 border border-brand-green/10 rounded-xl px-4 py-3 md:col-span-2">
                  <summary className="text-[10px] font-black uppercase text-brand-green cursor-pointer">
                    Обхват и честота на почистването и дезинфекцията
                  </summary>
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-[10px] border-collapse">
                      <thead>
                        <tr className="text-left text-brand-green font-black uppercase text-[8px]">
                          <th className="p-1.5 border-b border-brand-green/10">Зона / оборудване</th>
                          <th className="p-1.5 border-b border-brand-green/10">Какво обхваща</th>
                          <th className="p-1.5 border-b border-brand-green/10">Честота</th>
                        </tr>
                      </thead>
                      <tbody>
                        {CLEANING_SCOPE.map((r, i) => (
                          <tr key={i} className="border-b border-brand-green/5 text-brand-dark/70 align-top">
                            <td className="p-1.5 font-bold">{r.zone}</td>
                            <td className="p-1.5">{r.what}</td>
                            <td className="p-1.5">{r.freq}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ------------------ Списък с карти ------------------ */
        <div data-tour="cards" className="space-y-6">
          {[
            { title: "Основни дневници по самоконтрол", defs: visibleRegisters.filter((d) => d.num <= 15) },
            ...(hotPoint
              ? [{ title: "Топла точка — контролни и партидни карти", defs: visibleRegisters.filter((d) => d.num > 15) }]
              : []),
          ].map((group) => (
            <div key={group.title} className="space-y-3">
              {hotPoint && (
                <div className="flex items-center gap-2.5 px-1">
                  {group.title.startsWith("Топла") ? (
                    <Flame className="h-4 w-4 text-brand-gold" />
                  ) : (
                    <ClipboardList className="h-4 w-4 text-brand-green/60" />
                  )}
                  <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-brand-dark/60">{group.title}</h3>
                  <div className="flex-1 h-px bg-brand-green/10" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.defs.map((def) => {
                  const Icon = REGISTER_ICONS[def.id] || FileText;
                  const status = registerStatus(def);
                  return (
                    <button
                      key={def.id}
                      onClick={() => setOpenId(def.id)}
                      className="text-left bg-white border border-brand-green/10 rounded-3xl p-5 shadow-md hover:shadow-xl hover:border-brand-gold/40 transition-all cursor-pointer group flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="p-2.5 bg-brand-green/10 text-brand-green rounded-2xl border border-brand-green/10 group-hover:scale-105 transition-transform">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-wider bg-brand-light text-brand-dark/50 px-2 py-1 rounded-full">
                          {FREQUENCY_LABELS[def.frequency]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-sm font-bold text-brand-green leading-snug">
                          {def.num}. {def.shortTitle}
                        </h3>
                        <p className="text-[10px] text-brand-dark/45 leading-snug mt-1 line-clamp-2">{def.fillWhen}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                            status.tone === "ok"
                              ? "bg-green-100 text-green-700"
                              : status.tone === "due"
                                ? "bg-red-100 text-red-600"
                                : "bg-brand-light text-brand-dark/45"
                          }`}
                        >
                          {status.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-brand-dark/25 group-hover:text-brand-gold group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {showTour && !readOnly && <RegistersTour steps={TOUR_STEPS} onClose={finishTour} />}

      {showSettings && !readOnly && (
        <EquipmentModal
          fridges={fridges}
          freezers={freezers}
          employees={employees}
          hotPoint={hotPoint}
          hotAppliances={hotAppliances}
          signature={signature}
          signatureMode={signatureMode}
          onSave={async (patch) => {
            await onSaveEquipment?.(patch);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
