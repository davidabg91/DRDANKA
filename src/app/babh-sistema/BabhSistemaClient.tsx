"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Player } from "@remotion/player";
import { SubscriptionVideo } from "@/remotion/SubscriptionVideo";
import {
  ShieldCheck,
  Zap,
  ClipboardList,
  FileText,
  MessageSquare,
  Award,
  CheckCircle,
  XCircle,
  ChevronRight,
  ArrowRight,
  Printer,
  Check,
  Layers,
  Thermometer,
  Truck,
  UserCheck,
  Trash2,
  Flame,
  Bug,
  Settings,
  Scale
} from "lucide-react";

export default function BabhSistemaClient() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"registers" | "labels" | "chat" | "academy" | "updates">("registers");

  // Interactive Label State Demo
  const [labelProduct, setLabelProduct] = useState("Прясно мляко (отворена опаковка)");
  const [labelDate, setLabelDate] = useState("2026-08-02 08:30");
  const [labelBatch, setLabelBatch] = useState("LOT-8492");

  // Interactive Temp Log Demo
  const [tempVal, setTempVal] = useState(3.8);
  const [tempSaved, setTempSaved] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ALL 10 MANDATORY BABH REGISTERS (ДНЕВНИЦИ ПО САМОКОНТРОЛ / HACCP)
  const BABH_REGISTERS = [
    {
      id: 1,
      name: "Дневник за температурен режим на хладилните съоръжения",
      icon: Thermometer,
      norm: "0°C до +4°C / ≤ -18°C",
      freq: "Двукратно дневно (сутрин / следобед)",
      desc: "Непрекъснато следене на плюсови и минусови хладилни камери и витрини.",
      automation: "Автоматично отчитане с 1 клик, попълване на нормите за всички съоръжения наведнъж и моментален сигнализатор при отклонение."
    },
    {
      id: 2,
      name: "Дневник за хигиената на обекта и дезинфекцията",
      icon: ClipboardList,
      norm: "Наредба № 1 / ДПХП",
      freq: "Ежедневно / След всяка смяна",
      desc: "Контрол на почистването и дезинфекцията на подове, работни плотове, машини и санитарни възли с разрешени биоциди.",
      automation: "Дигитален чек-лист с готови графици по зони и автоматично генериране на дневния хигиенен протокол."
    },
    {
      id: 3,
      name: "Дневник за входящ контрол на приеманите храни и суровини",
      icon: Truck,
      norm: "Закон за храните / Регламент 178/2002",
      freq: "При всяка доставка",
      desc: "Проверка на температурата на доставката, партидните номера, годността, опаковката и придружителните документи от доставчика.",
      automation: "Автоматичен избор на редовни доставчици, въвеждане на фактура и автоматична регистрация на партидата в системата."
    },
    {
      id: 4,
      name: "Дневник за личната хигиена и здравното състояние на персонала",
      icon: UserCheck,
      norm: "Наредба № 15 за здравните изисквания",
      freq: "Ежедневно преди започване на работа",
      desc: "Проверка на служителите за липса на кожни заболявания, гноен обрив, респираторни симптоми и изрядно работно облекло.",
      automation: "Отбелязване на целия дежурен екип с един бутон + автоматичен календар с напомняния за изтичащи здравни книжки."
    },
    {
      id: 5,
      name: "Дневник за бракуване и отпадъци от храни",
      icon: Trash2,
      norm: "Регламент (ЕО) 1069/2009 (Странични животински продукти)",
      freq: "При наличие на бракувана стока",
      desc: "Опис на бракуваните продукти, причини за брака (изтекъл срок, разваляне), количество и препредаване на екарисаж.",
      automation: "Автоматично съставяне на протокол за брак с електронно подписване от управителя и отчет за отпадъка."
    },
    {
      id: 6,
      name: "Дневник за термична обработка и бързо охлаждане",
      icon: Flame,
      norm: "Температура в сърцевината ≥ 75°C",
      freq: "При приготвяне на готова кулинарна продукция",
      desc: "Контрол на температурата при готвене/печене и проследяване на бързото охлаждане до +4°C в рамките на 2 часа.",
      automation: "Въвеждане на ключови ястия и автоматична верификация, че критичните граници са спазени."
    },
    {
      id: 7,
      name: "Дневник за провеждане на обучения на персонала",
      icon: Award,
      norm: "Задължително по HACCP / ДПХП",
      freq: "При постъпване + ежегодно",
      desc: "Регистър на преминатите вътрешни и външни обучения по добра хигиенна практика, добри производствени практики и ХАСЕП.",
      automation: "Интегрирана онлайн академия — персоналът решава теста в платформата, а дневникът се попълва автоматично с издаден сертификат."
    },
    {
      id: 8,
      name: "Дневник за контрол на вредителите (ДДД обслужване)",
      icon: Bug,
      norm: "Договор с лицензирана ДДД фирма",
      freq: "Месечно / Тримесечно",
      desc: "Проследяване на обработките срещу гризачи и инсекти, проверка на точките с примамки и налични протоколи.",
      automation: "Прикачване на ДДД протоколите и автоматично известие 5 дни преди следващата задължителна дезинсекция/дератизация."
    },
    {
      id: 9,
      name: "Дневник за технологичен контрол и проследимост",
      icon: Scale,
      norm: "Регламент 1169/2011 / Етикетиране",
      freq: "При отваряне на опаковки / подготвяне на заготовки",
      desc: "Проследимост на вложените суровини от приемането им до крайния продукт, включително обособяване на партиди.",
      automation: "Връзка с интелигентния генератор на етикети — автоматично генериране на стикер с дата на отваряне и краен срок на годност."
    },
    {
      id: 10,
      name: "Дневник за поддръжка и метрологичен контрол на оборудването",
      icon: Settings,
      norm: "Закон за измерванията / HACCP",
      freq: "Ежемесечно / При сервиз",
      desc: "Проверка на техническото състояние и калибриране на контролно-измервателните уреди (работни термометри, везни).",
      automation: "Автоматичен регистър на уредите в обекта с хронология на калибрирането за БАБХ инспекторите."
    }
  ];

  return (
    <div className="min-h-screen bg-[#06120E] text-white font-sans selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden">
      
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative pt-12 pb-10 border-b border-white/10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[28rem] h-[28rem] bg-brand-gold/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[28rem] h-[28rem] bg-brand-green/20 rounded-full blur-[100px] pointer-events-none translate-y-1/3" />
        
        <div className="w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-3 py-1 rounded-md">
              <Zap className="h-3.5 w-3.5" fill="currentColor" /> БАБХ Система & Електронни Дневници
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              ✓ 100% Съответствие с БАБХ и ЕС
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Title & Subtitle */}
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Автоматична БАБХ Система <span className="bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold bg-clip-text text-transparent">„Дигитално Спокойствие“</span>
              </h1>
              
              <p className="text-xs sm:text-base text-white/80 leading-relaxed font-light max-w-3xl">
                Пълна онлайн платформа за автоматично попълване на БАБХ дневниците по самоконтрол за 60 сек/ден. <strong className="text-white font-bold">Край на хартиените папки, прашните тетрадки и страха от актове и глоби при внезапни проверки от БАБХ.</strong>
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/profile"
                  className="px-6 py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="h-4 w-4" fill="currentColor" /> Тествай безплатно 14 дни
                </Link>
                <a
                  href="#babh-registers-section"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ClipboardList className="h-4 w-4 text-brand-gold" /> Разгледай 10-те БАБХ Дневника
                </a>
              </div>
            </div>

            {/* Compact Highlight Box */}
            <div className="lg:col-span-4">
              <div className="bg-gradient-to-br from-[#0F2A20] to-[#163D2E] border border-brand-gold/40 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Спестяване & Защита</span>
                  <span className="text-[10px] text-white/60 font-mono">14 дни проба</span>
                </div>
                <div className="space-y-2 text-xs text-white/85">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>Попълване на всички дневници за <strong>60 секунди на ден</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                    <span><strong>24/7 Чат & поддръжка</strong> с д-р Николова по време на проверка.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                    <span>Автоматичен печат на перфектни А4 протоколи за БАБХ.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ ALL 10 MANDATORY BABH REGISTERS SECTION ═══════════════ */}
      <section id="babh-registers-section" className="py-12 border-b border-white/10 bg-[#081813]">
        <div className="w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-3 py-1 rounded-md inline-block mb-1">
                ПЪЛЕН ОБХВАТ НА ДОКУМЕНТАЦИЯТА
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Всички 10 Задължителни БАБХ Дневници по Самоконтрол
              </h2>
            </div>
            <p className="text-xs text-white/70 max-w-lg">
              Системата покрива 100% от изискванията на БАБХ съгласно Закона за храните, Наредба № 1 и европейските регламенти.
            </p>
          </div>

          {/* High-density 2-column Grid of all 10 Registers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BABH_REGISTERS.map((reg) => {
              const IconComp = reg.icon;
              return (
                <div
                  key={reg.id}
                  className="bg-[#0C241B] border border-white/15 rounded-xl p-4 sm:p-5 shadow-md hover:border-brand-gold/40 hover:bg-[#0E2C21] transition-all duration-200 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-brand-gold/15 text-brand-gold rounded-lg shrink-0 border border-brand-gold/30">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-brand-gold/80 block"># {reg.id} от 10</span>
                        <h3 className="font-bold text-sm text-white leading-snug">{reg.name}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/75 bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <div>
                      <strong className="text-brand-gold block font-mono text-[9px] uppercase">Законова Норма:</strong>
                      <span className="truncate block">{reg.norm}</span>
                    </div>
                    <div>
                      <strong className="text-brand-gold block font-mono text-[9px] uppercase">Честота на запис:</strong>
                      <span className="truncate block">{reg.freq}</span>
                    </div>
                  </div>

                  <p className="text-xs text-white/85 leading-relaxed">
                    {reg.desc}
                  </p>

                  <div className="bg-brand-green/10 border border-brand-green/20 rounded-lg p-2.5 text-[11px] text-emerald-300 flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-tight"><strong className="text-white">Автоматизация в платформата:</strong> {reg.automation}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════ REMOTION VIDEO DEMO ═══════════════ */}
      <section className="py-10 bg-[#06120E] border-b border-white/10">
        <div className="w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-3 py-1 rounded-md inline-block">
              REMOTION АНИМАЦИЯ
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Вижте как работят модулите на живо
            </h2>
          </div>

          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-brand-gold/30 aspect-video bg-black relative">
            {isMounted && (
              <Player
                acknowledgeRemotionLicense={true}
                component={SubscriptionVideo}
                durationInFrames={300}
                compositionWidth={1280}
                compositionHeight={720}
                fps={30}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                controls={true}
                autoPlay={true}
                loop={true}
                initiallyMuted={true}
              />
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════ INTERACTIVE SYSTEM MODULE SWITCHER (COMPACT) ═══════════════ */}
      <section className="py-12 border-b border-white/10">
        <div className="w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-brand-green text-brand-gold px-3 py-1 rounded-md inline-block border border-brand-gold/30">
              ИНТЕРАКТИВНА СИМУЛАЦИЯ
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Изберете панел за проба
            </h2>
          </div>

          {/* Module Switcher Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-4">
            {[
              { id: "registers", label: "📋 БАБХ Дневници" },
              { id: "labels", label: "🏷️ Етикети & Брак" },
              { id: "chat", label: "💬 24/7 Чат с Експерт" },
              { id: "academy", label: "🎓 Сертификати" },
              { id: "updates", label: "📜 Авто-Актуализации" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  activeTab === tab.id
                    ? "bg-brand-gold text-brand-dark border-brand-gold shadow-md"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB DEMO CONTENT */}
          <div className="bg-[#0C241B] border border-brand-gold/30 rounded-2xl p-5 sm:p-7 shadow-xl">
            
            {/* MODULE 1: БАБХ ДНЕВНИЦИ */}
            {activeTab === "registers" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-brand-gold flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" /> Електронни Дневници по Самоконтрол
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5">
                      Пълен дигитален еквивалент на всички 10 дневника с моментален А4 печат.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded">
                    ✓ 1-Клик попълване
                  </span>
                </div>

                <div className="bg-[#06120E] border border-white/15 rounded-xl p-4 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
                    СИМУЛАЦИЯ: Дневен запис за хладилно съоръжение
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/70 uppercase">Съоръжение:</label>
                      <select className="w-full text-xs font-bold bg-white/10 border border-white/20 rounded-lg p-2 text-white">
                        <option>Хладилна витрина #1 (Прясно месо)</option>
                        <option>Фризер дълбоко замразяване #2</option>
                        <option>Хладилник за готови ястия</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/70 uppercase">Отчетена температура (°C):</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          value={tempVal}
                          onChange={(e) => {
                            setTempVal(parseFloat(e.target.value) || 0);
                            setTempSaved(false);
                          }}
                          className="w-full text-xs font-mono font-bold bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                        />
                        <span className="text-xs font-bold text-brand-gold">°C</span>
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-0">
                      <button
                        onClick={() => setTempSaved(true)}
                        className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow"
                      >
                        {tempSaved ? "✓ Записано в базата!" : "Запиши за днес"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-black font-mono ${tempVal >= 0 && tempVal <= 4 ? "text-emerald-400" : "text-red-400"}`}>
                        {tempVal.toFixed(1)}°C
                      </span>
                      <span className={tempVal >= 0 && tempVal <= 4 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                        {tempVal >= 0 && tempVal <= 4 ? "✓ В норма (0°C до +4°C)" : "⚠️ ИЗВЪН НОРМА!"}
                      </span>
                    </div>
                    {tempSaved && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                        Записан: Иванов (10:00 ч.)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: ЕТИКЕТИ */}
            {activeTab === "labels" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-brand-gold flex items-center gap-2">
                      <FileText className="h-5 w-5" /> Генератор на Етикети за Проследимост
                    </h3>
                    <p className="text-xs text-white/70 mt-0.5">
                      Автоматично изчисляване на срокове на брак за отворени опаковки.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2 bg-[#06120E] border border-white/15 p-4 rounded-xl text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/70 uppercase">Суровина:</label>
                      <input
                        type="text"
                        value={labelProduct}
                        onChange={(e) => setLabelProduct(e.target.value)}
                        className="w-full text-xs font-bold bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/70 uppercase">Отворено на:</label>
                        <input
                          type="text"
                          value={labelDate}
                          onChange={(e) => setLabelDate(e.target.value)}
                          className="w-full text-xs font-bold bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/70 uppercase">Партида #:</label>
                        <input
                          type="text"
                          value={labelBatch}
                          onChange={(e) => setLabelBatch(e.target.value)}
                          className="w-full text-xs font-bold bg-white/10 border border-white/20 rounded-lg p-2 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white text-brand-dark rounded-xl p-4 border-2 border-dashed border-brand-gold/60 space-y-2 shadow">
                    <div className="flex justify-between items-start border-b border-brand-dark/10 pb-2">
                      <div>
                        <span className="text-[8px] font-black uppercase bg-brand-green text-white px-2 py-0.5 rounded">
                          ЕТИКЕТ ЗА ПРОСЛЕДИМОСТ
                        </span>
                        <h4 className="font-bold text-sm text-brand-green mt-1">{labelProduct}</h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-brand-dark/60">{labelBatch}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[9px] text-brand-dark/50 block font-bold">Отворено:</span>
                        <span>{labelDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-red-600 block font-bold">Годно до:</span>
                        <span className="font-bold text-red-600">След 48ч (04.08 08:30)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: CHAT WITH DR. DANKA */}
            {activeTab === "chat" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-serif text-xl font-bold text-brand-gold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" /> 24/7 Директен Чат с д-р Николова
                  </h3>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30">
                    ● Онлайн поддръжка
                  </span>
                </div>

                <div className="bg-[#06120E] border border-white/15 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex justify-end">
                    <div className="bg-brand-green text-white p-2.5 rounded-xl rounded-tr-none max-w-sm">
                      <span className="text-[9px] text-brand-gold block font-bold">Вие (10:15 ч.):</span>
                      <p>Здравейте, в обекта влезе инспектор от БАБХ за проверка на хладилниците. Какво да им покажа?</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white/10 text-white p-3 rounded-xl rounded-tl-none max-w-sm border border-white/10">
                      <span className="text-[9px] text-brand-gold block font-bold">д-р Николова (10:16 ч.):</span>
                      <p>Здравейте! Спокойно, отворете таб „Дневници“ в системата и покажете регистъра. Всички температури са в норма!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 4: ACADEMY */}
            {activeTab === "academy" && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
                  <Award className="h-5 w-5" /> Дигитални Сертификати за Персонала
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-[9px] font-bold text-brand-gold uppercase block">Обучителен модул</span>
                    <h4 className="font-bold text-white text-sm">Лична хигиена и ДПХП изисквания</h4>
                    <span className="text-emerald-400 font-bold block">✓ Издържан тест (100%)</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl text-brand-dark space-y-1">
                    <span className="text-[9px] font-bold text-brand-green uppercase block">ГЕНЕРИРАН СЕРТИФИКАТ</span>
                    <h4 className="font-bold text-sm text-brand-green">Удостоверение за Преминато Обучение</h4>
                    <span className="text-[10px] text-brand-dark/60 block">Издадено от БАБХ Спокойствие</span>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: UPDATES */}
            {activeTab === "updates" && (
              <div className="space-y-3">
                <h3 className="font-serif text-xl font-bold text-brand-gold flex items-center gap-2 border-b border-white/10 pb-3">
                  <Layers className="h-5 w-5" /> Автоматични Законови Актуализации
                </h3>
                <div className="bg-[#06120E] border border-white/15 p-4 rounded-xl text-xs space-y-1">
                  <span className="text-emerald-400 font-bold uppercase block text-[10px]">СИНХРОНИЗАЦИЯ С ЗАКОНОДАТЕЛСТВОТО</span>
                  <p className="text-white/80">
                    Вашите технологични карти и НАССР процедури се обновяват автоматично при промяна на Наредбите на МЗ и БАБХ.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ═══════════════ COMPARISON TABLE (COMPACT) ═══════════════ */}
      <section className="py-10 border-b border-white/10 bg-[#081813]">
        <div className="w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="text-center space-y-1 max-w-2xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-3 py-1 rounded-md inline-block">
              СРАВНЕНИЕ
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Хартиен начин vs. Автоматична БАБХ Система
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch text-xs">
            
            {/* OLD PAPER WAY */}
            <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-5 space-y-3">
              <h3 className="font-serif text-lg font-bold text-red-400 flex items-center gap-2 border-b border-red-500/20 pb-2">
                <XCircle className="h-5 w-5" /> Старият хартия & папки начин
              </h3>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Претрупани папки и постоянно губене на хартиени листове.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Забравени дати и температури — риск от акт над 2,000 лв.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Паника при внезапна инспекция от БАБХ.</span>
                </li>
              </ul>
            </div>

            {/* NEW VIP SYSTEM */}
            <div className="bg-emerald-950/30 border border-emerald-500/50 rounded-2xl p-5 space-y-3 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-emerald-400 flex items-center gap-2 border-b border-emerald-500/30 pb-2">
                <CheckCircle className="h-5 w-5" /> БАБХ Система „Дигитално Спокойствие“
              </h3>
              <ul className="space-y-2 text-white/90 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Достъп от телефон, таблет или компютър 24/7 в облака.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Дневен запис за 60 секунди с автоматични предложения.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>24/7 директен чат с д-р Данка Николова по време на проверка.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CALL TO ACTION BOX ═══════════════ */}
      <section className="py-12 text-center">
        <div className="w-full max-w-3xl mx-auto px-4 space-y-6 bg-gradient-to-br from-[#0F2A20] via-[#0A1F18] to-[#163D2E] border border-brand-gold p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-brand-gold text-brand-dark px-3 py-1 rounded-md inline-block">
              БЕЗПЛАТЕН ТЕСТОВ ПЕРИОД
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Готови ли сте за пълно дигитално спокойствие?
            </h2>
            <p className="text-xs text-white/80 max-w-xl mx-auto leading-relaxed">
              Започнете с 14 дни безплатен пробен период. Без задължения и без банкова карта при регистрация.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/profile"
              className="w-full sm:w-auto px-8 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-xs uppercase tracking-widest rounded-xl shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="h-4 w-4" fill="currentColor" /> Започни 14 Дни Безплатно <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
