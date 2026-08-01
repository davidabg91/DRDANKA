"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Player } from "@remotion/player";
import { SubscriptionVideo } from "@/remotion/SubscriptionVideo";
import { RegistersShowcaseVideo } from "@/remotion/RegistersShowcaseVideo";
import {
  ShieldCheck,
  Zap,
  ClipboardList,
  FileText,
  MessageSquare,
  Award,
  CheckCircle,
  XCircle,
  Star,
  ChevronRight,
  ArrowRight,
  Clock,
  Printer,
  Check,
  AlertTriangle,
  Play,
  HardDrive,
  Users,
  Layers,
  Lock
} from "lucide-react";

export default function VipSystemPage() {
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

  return (
    <div className="min-h-screen bg-[#06120E] text-white font-sans selection:bg-brand-gold selection:text-brand-dark overflow-x-hidden">
      
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative pt-28 pb-20 overflow-hidden border-b border-white/10">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-[35rem] h-[35rem] bg-brand-gold/15 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/4 w-[35rem] h-[35rem] bg-brand-green/30 rounded-full blur-[120px] pointer-events-none translate-y-1/3" />
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 24px), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 24px)"
          }}
        />

        <div className="w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-4 py-2 rounded-full shadow-lg">
            <Zap className="h-4 w-4" fill="currentColor" /> ВИП Абонаментна Система
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Title & Subtitle */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
                Система <span className="bg-gradient-to-r from-brand-gold via-yellow-200 to-brand-gold bg-clip-text text-transparent drop-shadow-sm">„Дигитално Спокойствие“</span>
              </h1>
              
              <p className="text-base sm:text-xl text-white/80 leading-relaxed font-light">
                Пълно дигитално управление на безопасността на храните във Вашия обект. <strong className="text-white font-bold">Край на разхвърляните папки, липсващите дати и стреса при инспекции от БАБХ.</strong>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-white/90">
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Електронни БАБХ дневници (100% зачетени)</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Генератор на етикети за проследимост</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>24/7 Лична поддръжка от д-р Николова</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
                  <span>Сертификати & обучение за персонала</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link
                  href="/profile"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="h-4 w-4" fill="currentColor" /> Тествай безплатно 14 дни
                </Link>
                <a
                  href="#video-demo"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="h-4 w-4 text-brand-gold fill-brand-gold" /> Изгледай видео демото
                </a>
              </div>
            </div>

            {/* Quick Stats / Guarantee card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-[#0F2A20] to-[#163D2E] border-2 border-brand-gold/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">
                    Гарантирана Защита
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    100% Законен стандарт
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-brand-gold/20 text-brand-gold rounded-xl shrink-0 mt-0.5">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Без никакъв риск от глоби</h4>
                      <p className="text-xs text-white/70 leading-relaxed mt-0.5">
                        Ако инспектор поиска дневници, отваряте профила на лаптоп или телефон. Всичко е попълнено и форматирано за печат на А4.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-brand-gold/20 text-brand-gold rounded-xl shrink-0 mt-0.5">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Спестява над 45 часа месечно</h4>
                      <p className="text-xs text-white/70 leading-relaxed mt-0.5">
                        Вместо да прекарвате 2 часа на ден в попълване на хартия, правите дневния запис за 60 секунди с автоматични предложения.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl text-center">
                  <span className="text-xs text-white/80 italic font-serif">
                    „Защото спокойният бизнес е успешният бизнес.“ — д-р Данка Николова
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ REMOTION VIDEO DEMO SECTION ═══════════════ */}
      <section id="video-demo" className="py-20 bg-[#081813] border-b border-white/10 relative">
        <div className="w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-[0.2em] bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-4 py-1.5 rounded-full inline-block">
              REMOTION АНИМИРАНА ДЕМОНСТРАЦИЯ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Вижте как работи системата в реално време
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Изгледайте интерактивното видео по-долу, описващо сцени от работния ден с електронните дневници и модули.
            </p>
          </div>

          {/* Player showcase 1: Subscription Video */}
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(212,175,55,0.15)] border-2 border-brand-gold/30 aspect-video bg-black relative">
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

      {/* ═══════════════ INTERACTIVE SYSTEM MODULE DEMONSTRATOR ═══════════════ */}
      <section className="py-20 relative border-b border-white/10">
        <div className="w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-[0.2em] bg-brand-green text-brand-gold px-4 py-1.5 rounded-full inline-block border border-brand-gold/30">
              ИНТЕРАКТИВЕН ПРЕГЛЕД НА ПАНЕЛИТЕ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Изберете модул, за да видите как действа
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              Кликнете върху различните табове по-долу, за да тествате как функционалностите на системата работят във Вашия профил.
            </p>
          </div>

          {/* Module Switcher Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-6">
            {[
              { id: "registers", label: "📋 БАБХ Дневници", icon: ClipboardList },
              { id: "labels", label: "🏷️ Генератор на Етикети", icon: FileText },
              { id: "chat", label: "💬 24/7 Чат с д-р Николова", icon: MessageSquare },
              { id: "academy", label: "🎓 Академия & Сертификати", icon: Award },
              { id: "updates", label: "📜 Автоматични Актуализации", icon: Layers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 border ${
                  activeTab === tab.id
                    ? "bg-brand-gold text-brand-dark border-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB CONTENT DEMO BOXES */}
          <div className="bg-[#0C241B] border-2 border-brand-gold/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            {/* MODULE 1: БАБХ ДНЕВНИЦИ */}
            {activeTab === "registers" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-gold flex items-center gap-2">
                      <ClipboardList className="h-6 w-6" /> Електронни Дневници по Самоконтрол
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed mt-1">
                      Пълен дигитален еквивалент на всички 10 хартиени дневници (температурен режим, хигиена, входящ контрол, отпадъци).
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                    ✓ Готови за А4 печат
                  </span>
                </div>

                {/* Interactive Demo Widget */}
                <div className="bg-[#06120E] border border-white/15 rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
                    ТЕСТОВА СИМУЛАЦИЯ: Дневен запис за хладилно съоръжение
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/70 uppercase">Съоръжение:</label>
                      <select className="w-full text-xs font-bold bg-white/10 border border-white/20 rounded-lg p-2.5 text-white">
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
                          className="w-full text-xs font-mono font-bold bg-white/10 border border-white/20 rounded-lg p-2.5 text-white"
                        />
                        <span className="text-xs font-bold text-brand-gold">°C</span>
                      </div>
                    </div>

                    <div className="pt-4 sm:pt-0">
                      <button
                        onClick={() => setTempSaved(true)}
                        className="w-full py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow"
                      >
                        {tempSaved ? "✓ Записано в базата!" : "Запиши за днес"}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Status Display */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-black font-mono ${tempVal >= 0 && tempVal <= 4 ? "text-emerald-400" : "text-red-400"}`}>
                        {tempVal.toFixed(1)}°C
                      </span>
                      <div className="text-xs">
                        <span className="font-bold text-white block">Статус на нормата:</span>
                        <span className={tempVal >= 0 && tempVal <= 4 ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                          {tempVal >= 0 && tempVal <= 4 ? "✓ В норма (Норма: 0°C до +4°C)" : "⚠️ ИЗВЪН НОРМА! Задейства се коригиращо действие!"}
                        </span>
                      </div>
                    </div>
                    {tempSaved && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded border border-emerald-500/30 font-mono">
                        Записан от: Иванов (10:00 ч.)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: ЕТИКЕТИ */}
            {activeTab === "labels" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-gold flex items-center gap-2">
                      <FileText className="h-6 w-6" /> Интелигентен Генератор на Етикети
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed mt-1">
                      Генерирайте легални етикети за отворени суровини с автоматично изчислени срокове на брак съгласно Наредбите.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-3 py-1.5 rounded-lg">
                    🏷️ Проследимост & Брак
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3 bg-[#06120E] border border-white/15 p-5 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
                      ГЕНЕРИРАНЕ НА ЕТИКЕТ:
                    </span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-white/70 uppercase">Суровина / Продукт:</label>
                      <input
                        type="text"
                        value={labelProduct}
                        onChange={(e) => setLabelProduct(e.target.value)}
                        className="w-full text-xs font-bold bg-white/10 border border-white/20 rounded-lg p-2.5 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/70 uppercase">Отворен на:</label>
                        <input
                          type="text"
                          value={labelDate}
                          onChange={(e) => setLabelDate(e.target.value)}
                          className="w-full text-xs font-bold bg-white/10 border border-white/20 rounded-lg p-2.5 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/70 uppercase">Партида #:</label>
                        <input
                          type="text"
                          value={labelBatch}
                          onChange={(e) => setLabelBatch(e.target.value)}
                          className="w-full text-xs font-bold bg-white/10 border border-white/20 rounded-lg p-2.5 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Printable Tag Live Output */}
                  <div className="bg-white text-brand-dark rounded-2xl p-6 border-4 border-dashed border-brand-gold/60 shadow-xl space-y-3">
                    <div className="flex justify-between items-start border-b border-brand-dark/10 pb-3">
                      <div>
                        <span className="text-[9px] font-black uppercase bg-brand-green text-white px-2 py-0.5 rounded">
                          ЕТИКЕТ ЗА ПРОСЛЕДИМОСТ
                        </span>
                        <h4 className="font-bold text-base text-brand-green mt-1">{labelProduct}</h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-brand-dark/60">{labelBatch}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                      <div>
                        <span className="text-[9px] text-brand-dark/50 block font-bold uppercase">Дата на отваряне:</span>
                        <span>{labelDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-red-600 block font-bold uppercase">Срок на годност (Брак):</span>
                        <span className="font-bold text-red-600">След 48 часа (04.08 08:30)</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-brand-dark/10 flex items-center justify-between text-[10px] text-brand-dark/60">
                      <span>Обект: Вкусни Мигове ЕООД</span>
                      <span className="font-bold text-brand-green flex items-center gap-1">
                        <Printer className="h-3 w-3" /> Принтирай А4
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: CHAT WITH DR. DANKA */}
            {activeTab === "chat" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-gold flex items-center gap-2">
                      <MessageSquare className="h-6 w-6" /> 24/7 Лична Връзка с д-р Николова
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed mt-1">
                      При внезапна инспекция или неяснота, изпращате съобщение директно през Вашата платформа.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Онлайн поддръжка
                  </span>
                </div>

                <div className="bg-[#06120E] border border-white/15 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-dark font-black flex items-center justify-center font-serif text-sm">
                      ДН
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">д-р Данка Николова</h4>
                      <span className="text-[10px] text-white/50 block">Експерт по контрол на храните (Бивш директор на ОДБХ)</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-end">
                      <div className="bg-brand-green text-white p-3 rounded-2xl rounded-tr-none max-w-md space-y-1">
                        <span className="text-[9px] text-brand-gold block font-bold">Вие (10:15 ч.):</span>
                        <p>Здравейте, д-р Николова! В момента в обекта влезе инспектор от БАБХ за проверка на хладилниците. Какво да им покажа?</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-white/10 text-white p-3.5 rounded-2xl rounded-tl-none max-w-md space-y-1 border border-white/10">
                        <span className="text-[9px] text-brand-gold block font-bold">д-р Данка Николова (10:16 ч.):</span>
                        <p>Здравейте! Спокойно, отворете таб „Дневници“ в системата и им покажете автоматично генерирания регистър за хладилниците. Всички температури са в норма и са записани с час и дата.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 4: ACADEMY */}
            {activeTab === "academy" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-gold flex items-center gap-2">
                      <Award className="h-6 w-6" /> Академия & Сертификация на Персонала
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed mt-1">
                      Обучете новите служители по изискванията за хигиена и HACCP с интерактивни тестове и автоматични сертификати.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-3 py-1.5 rounded-lg">
                    🎓 Обучен персонал
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">Модул 1: Лична Хигиена</span>
                    <h4 className="font-bold text-white text-base">Изисквания за дезинфекция и работно облекло</h4>
                    <p className="text-xs text-white/70 leading-relaxed">
                      Кратко интерактивно видео + тест от 5 въпроса за преминаване на задължителния минимум.
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-bold">✓ 100% Успеваемост</span>
                      <span className="text-white/50">Времетраене: 15 мин.</span>
                    </div>
                  </div>

                  <div className="bg-brand-gold/10 border border-brand-gold/30 p-5 rounded-2xl space-y-2 text-brand-dark bg-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-green block">ГЕНЕРИРАН СЕРТИФИКАТ</span>
                    <h4 className="font-serif text-base font-bold text-brand-green">Удостоверение за Преминато Обучение</h4>
                    <p className="text-xs text-brand-dark/80">Служител: Иван Иванов (Готвач)</p>
                    <p className="text-[10px] text-brand-dark/60 font-mono">Валиден до: 02.08.2027 г. • Издаден от БАБХ Спокойствие</p>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 5: UPDATES */}
            {activeTab === "updates" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-gold flex items-center gap-2">
                      <Layers className="h-6 w-6" /> Автоматични Законови Актуализации
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed mt-1">
                      При промяна на Наредбите или Закона за храните, Вашата документация се обновява автоматично без допълнително заплащане.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                    🔄 Винаги Актуална
                  </span>
                </div>

                <div className="bg-[#06120E] border border-white/15 p-5 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping mt-1.5 shrink-0" />
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">СИНХРОНИЗАЦИЯ С НОРМАТИВНАТА УРЕДБА</span>
                      <p className="text-xs text-white/80 leading-snug">
                        Открита е промяна в изискванията за алергените. Вашите технологични карти и легенда бяха обновени автоматично до версия 2.4.
                      </p>
                      <span className="text-[10px] text-white/40 font-mono block">Последна актуализация: Днес, 09:00 ч.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
      <section className="py-20 border-b border-white/10 bg-[#081813]">
        <div className="w-full max-w-[1536px] px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-[0.2em] bg-brand-gold/20 text-brand-gold border border-brand-gold/40 px-4 py-1.5 rounded-full inline-block">
              СРАВНЕНИЕ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Старият хартиен начин vs. Новата ВИП Система
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* OLD PAPER WAY */}
            <div className="bg-red-950/20 border-2 border-red-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
                <h3 className="font-serif text-xl font-bold text-red-400 flex items-center gap-2">
                  <XCircle className="h-6 w-6" /> Старият хартия & папки начин
                </h3>
                <span className="text-[10px] font-bold uppercase text-red-400 bg-red-900/40 px-2.5 py-1 rounded">Висок риск</span>
              </div>

              <ul className="space-y-3 text-xs text-white/80">
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Претрупани папки, прашни дневници и постоянно губене на листове.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Персоналът забравя да пише дати и температури — риск от акт над 2,000 лв.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Паника при внезапна инспекция от БАБХ и липса на експерт под ръка.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>Нямате представа дали продуктите в хладилника са годни или трябва брак.</span>
                </li>
              </ul>
            </div>

            {/* NEW VIP SYSTEM */}
            <div className="bg-emerald-950/30 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-4">
                <h3 className="font-serif text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" /> ВИП Система „Дигитално Спокойствие“
                </h3>
                <span className="text-[10px] font-bold uppercase text-emerald-300 bg-emerald-900/60 px-2.5 py-1 rounded">100% Спокойствие</span>
              </div>

              <ul className="space-y-3 text-xs text-white/90 font-medium">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Всичко се съхранява в облака — достъп от телефон, таблет или компютър.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Дневният запис отнема 60 секунди с автоматични предложения и контрол на нормите.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>24/7 директен чат с д-р Данка Николова по време на проверка.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Генератор на етикети с точно изчислен срок на годност и А4 печат.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CALL TO ACTION BOX ═══════════════ */}
      <section className="py-20 relative text-center">
        <div className="w-full max-w-4xl mx-auto px-4 space-y-8 bg-gradient-to-br from-[#0F2A20] via-[#0A1F18] to-[#163D2E] border-2 border-brand-gold p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/15 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] bg-brand-gold text-brand-dark px-4 py-1.5 rounded-full inline-block">
              БЕЗПЛАТЕН ТЕСТОВ ПЕРИОД
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Готови ли сте за пълно дигитално спокойствие?
            </h2>
            <p className="text-sm text-white/80 max-w-2xl mx-auto leading-relaxed">
              Започнете с 14 дни безплатен пробен период. Без задължения и без нужда от банкова карта при регистрация.
            </p>
          </div>

          <div className="relative z-10 pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/profile"
              className="w-full sm:w-auto px-10 py-5 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-black text-sm uppercase tracking-widest rounded-xl shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="h-5 w-5" fill="currentColor" /> Започни 14 Дни Безплатно <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <p className="text-[11px] text-white/50 italic relative z-10">
            * Броят на новите обекти за месеца е ограничен за да гарантираме личното внимание на д-р Николова.
          </p>
        </div>
      </section>

    </div>
  );
}
