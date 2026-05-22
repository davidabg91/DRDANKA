"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface Package {
  id: string;
  name: string;
  duration: string;
  price: string;
  desc: string;
}

const CONSULTATION_PACKAGES: Package[] = [
  {
    id: "free-intro",
    name: "Безплатен опознавателен разговор",
    duration: "10 минути",
    price: "0 €",
    desc: "Кратък безплатен разговор за насоки и уточняване на нуждите на Вашия бизнес, за да изберем най-подходящата услуга (консултация или обучение).",
  },
  {
    id: "basic",
    name: "Експресна консултация",
    duration: "30 минути",
    price: "35 €",
    desc: "Бърза сесия за конкретен казус, тълкуване на наредба или подготовка за предстояща внезапна проверка.",
  },
  {
    id: "startup",
    name: "Стартъп консултация",
    duration: "60 минути",
    price: "60 €",
    desc: "За предприемачи, отварящи нов обект. Обсъждане на изисквания, разпределение на помещенията и необходими документи.",
  },
  {
    id: "audit",
    name: "Пълен одит на документация",
    duration: "90 минути",
    price: "95 €",
    desc: "Подробен анализ на съществуващи НАССР/ISO системи. Идентификация на пропуски преди проверки от БАБХ.",
  },
];

const TRAINING_PACKAGES: Package[] = [
  {
    id: "haccp-basics",
    name: "Основи на хигиената и НАССР за персонал",
    duration: "4 академични часа",
    price: "80 €",
    desc: "Задължително обучение съгласно българското законодателство. Запознава служителите с хигиенните изисквания, избягване на кръстосано замърсяване и правилно водене на дневниците по самоконтрол.",
  },
  {
    id: "babkh-prep",
    name: "Подготовка за инспекции от БАБХ",
    duration: "6 академични часа",
    price: "120 €",
    desc: "Практически курс за собственици и управители. Как да преминавате инспекции без притеснение и глоби.",
  },
  {
    id: "safety-culture",
    name: "Култура на безопасност на храните (Food Safety Culture)",
    duration: "8 академични часа",
    price: "200 €",
    desc: "Внедряване на съвременните изисквания за Food Safety Culture съгласно Регламент (ЕС) 2021/382 за производства и цехове.",
  },
];

const CONSULTATION_TIME_SLOTS = ["09:00", "10:30", "11:30", "14:00", "15:30", "17:00"];
const TRAINING_TIME_SLOTS = ["14:00"];

interface BookingCalendarProps {
  mode?: "consultation" | "training";
  initialPackageId?: string;
}

export default function BookingCalendar({ mode = "consultation", initialPackageId }: BookingCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const packages = mode === "training" ? TRAINING_PACKAGES : CONSULTATION_PACKAGES;
  const timeSlots = mode === "training" ? TRAINING_TIME_SLOTS : CONSULTATION_TIME_SLOTS;
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package>(() => {
    const pkgs = mode === "training" ? TRAINING_PACKAGES : CONSULTATION_PACKAGES;
    return pkgs.find((p) => p.id === "free-intro") || pkgs.find((p) => p.id === "startup") || pkgs[0];
  });
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientInfo, setClientInfo] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
  });

  const scrollToContainerTop = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      window.scrollTo({
        top: rect.top + scrollTop - 100,
        behavior: "smooth",
      });
    }
  };

  // Sync selected package and advance step when initialPackageId changes
  useEffect(() => {
    if (initialPackageId) {
      const pkg = packages.find((p) => p.id === initialPackageId);
      if (pkg) {
        setSelectedPackage(pkg);
        setStep(2); // Auto-advance to date picker
      }
    } else {
      const defaultPkg = packages.find((p) => p.id === "free-intro") || packages.find((p) => p.id === "startup") || packages[0];
      setSelectedPackage(defaultPkg);
    }
  }, [initialPackageId, mode, packages]);

  // Mock date generator for next 7 days (excluding Sunday)
  const getNextDays = () => {
    const days = [];
    const locale = "bg-BG";
    const today = new Date();
    
    for (let i = 1; i <= 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (date.getDay() !== 0) { // Exclude Sundays
        const dayName = date.toLocaleDateString(locale, { weekday: "short" });
        const dayNum = date.getDate().toString();
        const monthName = date.toLocaleDateString(locale, { month: "short" });
        const fullDate = date.toISOString().split("T")[0];
        
        days.push({ dayName, dayNum, monthName, fullDate });
      }
    }
    return days;
  };

  const nextDays = getNextDays();

  const handleNext = () => {
    setStep((prev) => prev + 1);
    scrollToContainerTop();
  };
  const handlePrev = () => {
    setStep((prev) => prev - 1);
    scrollToContainerTop();
  };

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleBook = () => {
    if (!clientInfo.name || !clientInfo.phone || !clientInfo.email) {
      alert("Моля, попълнете всички задължителни полета.");
      return;
    }
    setStep(4);
    scrollToContainerTop();
  };

  return (
    <div ref={containerRef} className="bg-white border border-brand-green/10 rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header Indicator */}
      <div className="bg-brand-green px-6 sm:px-8 py-5 border-b border-brand-gold/20 flex justify-between items-center text-white">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold">
            {mode === "training" ? "Заявете професионално обучение" : "Резервирайте онлайн консултация"}
          </h3>
          <p className="text-[10px] text-brand-gold font-medium uppercase tracking-wider mt-0.5">
            {mode === "training" ? "Специализирано обучение за Вашия екип" : "Професионални насоки директно от д-р Данка Николова"}
          </p>
        </div>
        <div className="text-xs sm:text-sm font-semibold text-brand-gold">
          Стъпка {step} от 4
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-brand-light h-1">
        <div
          className="bg-brand-gold h-1 transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      <div className="p-6 sm:p-8 min-h-[350px]">
        {/* Step 1: Package Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-bold text-brand-green">
              {mode === "training" ? "1. Изберете обучение" : "1. Изберете тип консултация"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative overflow-hidden border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between group ${
                    selectedPackage.id === pkg.id
                      ? "border-brand-gold bg-brand-gold/5 shadow-lg shadow-brand-gold/20 scale-[1.02]"
                      : "border-brand-green/10 bg-white hover:border-brand-gold/50 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  <div>
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-2 gap-2">
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 shrink-0 transition-colors duration-300 ${selectedPackage.id === pkg.id ? 'text-brand-gold' : 'text-brand-green/20 group-hover:text-brand-gold/50'}`}>
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <h5 className="font-serif text-base font-bold text-brand-green leading-snug">
                          {pkg.name}
                        </h5>
                      </div>
                      {pkg.id === "free-intro" && (
                        <span className="text-[9px] font-bold text-brand-green bg-brand-gold px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap shrink-0">
                          Препоръчано
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-3 mb-4 text-xs font-semibold text-brand-dark/50">
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-brand-gold" />
                        {pkg.duration}
                      </span>
                    </div>
                    <p className="text-xs text-brand-dark/70 leading-relaxed mb-6">
                      {pkg.desc}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-brand-green/5">
                    <span className="text-sm font-serif font-bold text-brand-green">Цена</span>
                    <span className="text-lg font-bold text-brand-gold">{pkg.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-brand-green text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-green/90 transition-colors flex items-center cursor-pointer"
              >
                Продължи
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-bold text-brand-green">
              {mode === "training" ? "2. Изберете дата за старт" : "2. Изберете дата и час"}
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Date selection list */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-brand-gold" />
                  Налични дати
                </h5>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {nextDays.map((day) => (
                    <button
                      key={day.fullDate}
                      onClick={() => {
                        setSelectedDate(day.fullDate);
                        setSelectedTime(""); // Reset time selection on date change
                      }}
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                        selectedDate === day.fullDate
                          ? "border-brand-gold bg-brand-gold/10 text-brand-green font-bold"
                          : "border-brand-green/10 bg-white hover:border-brand-gold/50"
                      }`}
                    >
                      <span className="text-[10px] uppercase text-brand-dark/40 font-semibold">
                        {day.dayName}
                      </span>
                      <span className="text-lg font-serif mt-1">{day.dayNum}</span>
                      <span className="text-[10px] text-brand-dark/60 font-medium">
                        {day.monthName}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time selection list */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-brand-gold" />
                  Свободни часове
                </h5>
                {selectedDate ? (
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border text-sm transition-all text-center ${
                          selectedTime === time
                            ? "border-brand-gold bg-brand-gold text-brand-dark font-bold"
                            : "border-brand-green/10 bg-white hover:border-brand-gold/50 text-brand-dark"
                        }`}
                      >
                        {time} ч.
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed border-brand-green/15 rounded-xl p-8 text-center text-sm text-brand-dark/50">
                    Изберете дата, за да видите наличните часове.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-brand-green/5">
              <button
                onClick={handlePrev}
                className="px-5 py-2.5 border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-green/5 transition-colors flex items-center cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime}
                className="px-6 py-3 bg-brand-green text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-green/90 transition-colors flex items-center disabled:opacity-50 cursor-pointer"
              >
                Продължи
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Client Details */}
        {step === 3 && (
          <div className="space-y-6">
            <h4 className="font-serif text-lg font-bold text-brand-green">3. Данни за връзка</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Име и фамилия <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={clientInfo.name}
                  onChange={handleClientInfoChange}
                  placeholder="Иван Петров"
                  className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Телефонен номер <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={clientInfo.phone}
                  onChange={handleClientInfoChange}
                  placeholder="+359 888 123 456"
                  className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Имейл адрес <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={clientInfo.email}
                  onChange={handleClientInfoChange}
                  placeholder="ivan.petrov@example.com"
                  className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  {mode === "training" ? "Брой участници и допълнителни изисквания?" : "Имате ли конкретни въпроси или предписания?"}
                </label>
                <textarea
                  name="note"
                  rows={3}
                  value={clientInfo.note}
                  onChange={handleClientInfoChange}
                  placeholder={mode === "training" ? "Напишете колко души ще участват в обучението и дали имате специфични предпочитания..." : "Напишете накратко каква е дейността на обекта Ви..."}
                  className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            {/* Selected Summary Card */}
            <div className="bg-brand-light/80 border border-brand-green/5 rounded-xl p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-brand-dark/50 uppercase">
                  {mode === "training" ? "Избрано обучение:" : "Избрана консултация:"}
                </span>
                <span className="font-bold text-brand-green">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-brand-dark/50 uppercase">Време:</span>
                <span className="font-bold text-brand-green">
                  {selectedDate.split("-").reverse().join(".")} г. в {selectedTime} ч. ({selectedPackage.duration})
                </span>
              </div>
              <div className="flex justify-between border-t border-brand-green/5 pt-2">
                <span className="font-semibold text-brand-dark/50 uppercase">Обща сума:</span>
                <span className="font-bold text-brand-gold text-sm">{selectedPackage.price}</span>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-brand-green/5">
              <button
                onClick={handlePrev}
                className="px-5 py-2.5 border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-green/5 transition-colors flex items-center cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </button>
              <button
                onClick={handleBook}
                className="px-6 py-3 bg-brand-green text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-green/90 transition-colors flex items-center cursor-pointer"
              >
                {mode === "training" ? "Заяви обучението" : "Резервирай консултация"}
                <CheckCircle className="h-4 w-4 ml-2 text-brand-gold" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success confirmation */}
        {step === 4 && (
          <div className="text-center py-10 space-y-6">
            <CheckCircle className="h-16 w-16 text-brand-gold mx-auto animate-bounce" />
            <div className="space-y-2">
              <h4 className="font-serif text-2xl font-bold text-brand-green">
                {mode === "training" ? "Заявката е изпратена успешно!" : "Часът е резервиран!"}
              </h4>
              <p className="text-sm text-brand-dark/80 max-w-lg mx-auto leading-relaxed">
                {mode === "training" ? (
                  <>
                    Потвърждение и проформа фактура за плащане са изпратени на имейл адрес <span className="font-semibold">{clientInfo.email}</span>. Д-р Данка Николова ще се свърже с Вас за подготовка на учебните материали и провеждането.
                  </>
                ) : (
                  <>
                    Потвърждение и линк за онлайн срещата (Google Meet) са изпратени на имейл адрес <span className="font-semibold">{clientInfo.email}</span>. Д-р Данка Николова ще се свърже с Вас за подготовка на срещата.
                  </>
                )}
              </p>
            </div>

            <div className="bg-brand-light max-w-md mx-auto rounded-xl p-5 border border-brand-green/5 text-xs text-left space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-brand-dark/50 uppercase">Клиент:</span>
                <span className="font-semibold text-brand-dark">{clientInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-dark/50 uppercase">Тип:</span>
                <span className="font-semibold text-brand-dark">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-dark/50 uppercase">Желана дата & час:</span>
                <span className="font-semibold text-brand-green">
                  {selectedDate.split("-").reverse().join(".")} в {selectedTime} ч.
                </span>
              </div>
              <div className="flex justify-between border-t border-brand-green/5 pt-2">
                <span className="text-brand-dark/50 uppercase font-semibold">Цена:</span>
                <span className="font-bold text-brand-gold">{selectedPackage.price}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setSelectedDate("");
                setSelectedTime("");
                setClientInfo({ name: "", phone: "", email: "", note: "" });
              }}
              className="px-6 py-2.5 border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-green/5 transition-colors cursor-pointer"
            >
              Нова заявка
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
