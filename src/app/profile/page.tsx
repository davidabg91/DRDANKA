"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Building, 
  Calendar, 
  Printer, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  Bell, 
  Clock, 
  Plus, 
  Trash2, 
  Settings, 
  LogOut, 
  Lock, 
  FileText, 
  Check, 
  Activity, 
  FileCheck, 
  Sparkles,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

// Mock templates for HACCP/DHP document generator
const DOCUMENT_TEMPLATES = {
  dhp: {
    title: "Система за самоконтрол (Добри Хигиенни Практики)",
    content: (firm: any) => `
РЕПУБЛИКА БЪЛГАРИЯ
ОБЕКТ: ${firm.name || "[Име на Фирма]"}
АДРЕС НА ОБЕКТА: ${firm.address || "[Адрес на Обекта]"}
УПРАВИТЕЛ: ${firm.manager || "[Име на Управител]"}
ЕИК: ${firm.eik || "[Булстат / ЕИК]"}

ДОБРИ ХИГИЕННИ И ПРОИЗВОДСТВЕНИ ПРАКТИКИ (ДХП / ДПП)
(съгласно изискванията на чл. 17 от Закона за храните)

1. ЛИЧНА ХИГИЕНА НА ПЕРСОНАЛА
Всички лица, работещи в обекта, преминават задължителен медицински преглед и притежават лична здравна книжка. Преди започване на работа персоналът облича чисто работно облекло, измива и дезинфекцира ръцете си.
2. ВХОДЯЩ КОНТРОЛ НА СУРОВИНИ
Хранителните стоки се приемат само от регистрирани по Закона за храните доставчици. За всяка доставка се проверява: партиден номер, срок на годност, температура на съхранение при транспорта и състояние на опаковката. Данните се записват в Дневника за входящ контрол.
3. СЪХРАНЕНИЕ НА ХРАНИТЕ
Храните се съхраняват при хладилни условия съобразно указанията на производителя (за бързоразвалящи се храни) или при стайна температура в сухи складове. Отчитането на хладилните температури се извършва двукратно (сутрин и вечер) в Дневника за температурния режим.
4. ПОЧИСТВАНЕ И ДЕЗИНФЕКЦИЯ
Обектът се почиства ежедневно по утвърден график с разрешени от МЗ дезинфекционни препарати. Резултатите се вписват ежедневно в Дневника по дезинфекционния режим.
    `
  },
  pest: {
    title: "Програма за мониторинг на вредители (ДДД)",
    content: (firm: any) => `
РЕПУБЛИКА БЪЛГАРИЯ
ОБЕКТ: ${firm.name || "[Име на Фирма]"}
АДРЕС НА ОБЕКТА: ${firm.address || "[Адрес на Обекта]"}
УПРАВИТЕЛ: ${firm.manager || "[Име на Управител]"}
ЕИК: ${firm.eik || "[Булстат / ЕИК]"}

ИНСТРУКЦИЯ И ПРОГРАМА ЗА ДЕЗИНСЕКЦИЯ И ДЕРАТИЗАЦИЯ (ДДД)

1. ЦЕЛ
Програмата цели предотвратяване на проникването и развитието на вредители (гризачи, насекоми) в помещенията на обекта, които могат да доведат до механично или микробиологично замърсяване на храните.
2. ОРГАНИЗАЦИЯ НА ТРЕТИРАНИЯТА
Обектът има сключен договор с лицензирана ДДД фирма. Обработките срещу вредители се извършват по график (поне веднъж месечно) или извънредно при сигнал.
3. МЕРКИ ЗА ЗАЩИТА
Всички отвори, прозорци и вентилационни канали са защитени с мрежи. Хранителните отпадъци се съхраняват в затворени контейнери с капаци и се извозват ежедневно. Преди всяка ДДД обработка хранителните продукти се покриват или прибират в хладилни съоръжения.
    `
  },
  allergens: {
    title: "Процедура за управление на алергени и етикетиране",
    content: (firm: any) => `
РЕПУБЛИКА БЪЛГАРИЯ
ОБЕКТ: ${firm.name || "[Име на Фирма]"}
АДРЕС НА ОБЕКТА: ${firm.address || "[Адрес на Обекта]"}
УПРАВИТЕЛ: ${firm.manager || "[Име на Управител]"}
ЕИК: ${firm.eik || "[Булстат / ЕИК]"}

ПРОЦЕДУРА ЗА УПРАВЛЕНИЕ НА АЛЕРГЕНИТЕ И ЕТИКЕТИРАНЕТО
(съгласно Регламент (ЕС) № 1169/2011)

1. ИДЕНТИФИЦИРАНЕ НА АЛЕРГЕНИ
При входящия контрол на суровини се следи за съдържанието на някои от 14-те основни алергена (глутен, мляко, яйца, ядки, фъстъци, соя, риба, целина, горчица, сусам, серен диоксид, ракообразни, мекотели, лупина).
2. ПРЕДОТВРАТЯВАНЕ НА КРЪСТОСАНО ЗАМЪРСЯВАНЕ
При подготовка на храните се използват отделни дъски за рязане, прибори и посуда за ястия, декларирани като „без съдържание на алергени“. Плотовете се измиват основно след обработка на глутенови или ядкови съставки.
3. ИНФОРМИРАНЕ НА КЛИЕНТИТЕ
Обектът излага Писмена Легенда за алергените на достъпно за клиентите място или в менюто с храните. Всеки персонал е обучен да отговаря на запитвания на клиенти с алергии.
    `
  },
  haccp: {
    title: "Система НАССР (Критични Контролни Точки)",
    content: (firm: any) => `
РЕПУБЛИКА БЪЛГАРИЯ
ОБЕКТ: ${firm.name || "[Име на Фирма]"}
АДРЕС НА ОБЕКТА: ${firm.address || "[Адрес на Обекта]"}
УПРАВИТЕЛ: ${firm.manager || "[Име на Управител]"}
ЕИК: ${firm.eik || "[Булстат / ЕИК]"}

СИСТЕМА ЗА АНАЛИЗ НА ОПАСНОСТИТЕ И КРИТИЧНИ КОНТРОЛНИ ТОЧКИ (НАССР)

1. КРИТИЧНИ КОНТРОЛНИ ТОЧКИ (ККТ)
В съответствие с технологичния процес са идентифицирани следните ККТ:
- ККТ 1: Приемане (Входящ контрол) и Съхранение на охладени/замразени животински суровини. Критична граница: Температура на охладени храни ≤ 4°C, замразени ≤ -18°C.
- ККТ 2: Термична обработка (Cooking). Критична граница: Вътрешна температура на продукта в центъра ≥ 75°C.
2. МОНИТОРИНГ И КОРЕКТИВНИ ДЕЙСТВИЯ
Отговорните служители извършват измервания на всяка критична точка. При превишаване на температурата:
- Доставката се отказва при входящ контрол.
- При термична обработка – времето на печене се удължава до достигане на нормата.
    `
  }
};

// Course contents for reading inside profile
const COURSE_CONTENTS = {
  labeling: {
    title: "15 златни правила за етикетиране на храните",
    content: `
15 ЗЛАТНИ ПРАВИЛА ЗА ЕТИКЕТИРАНЕ НА ХРАНИТЕ
Практичен наръчник от д-р Данка Николова

Правило 1: Името на храната трябва да бъде точно и да не подвежда купувача.
Правило 2: Списъкът на съставките е задължителен и започва с най-голямото количество.
Правило 3: Всеки алерген трябва да е подчертан, удебелен или с различен цвят в съставките.
Правило 4: Количеството на определени съставки (напр. плодово съдържание) трябва да се посочва в проценти.
Правило 5: Нетното количество се изразява в литри, сантилитри, милилитри, килограми или грамове.
Правило 6: Датата на минимална трайност („Най-добър до...“) или срок на годност („Използвай преди...“) е задължителна.
Правило 7: Условията за съхранение (напр. от 0°C до 4°C) трябва да са ясно указани за бързоразвалящи се храни.
Правило 8: Бизнес името и адресът на производителя или вносителя трябва да присъстват.
Правило 9: Страната на произход е задължителна за месо, плодове, зеленчуци и мед.
Правило 10: Указанията за употреба се добавят, ако без тях е трудно правилното консумиране.
Правило 11: Действителното алкохолно съдържание по обем се посочва за напитки с над 1.2 об.%.
Правило 12: Хранителната декларация (енергийна стойност, мазнини, въглехидрати, протеини, сол) е задължителна за пакетирани храни.
Правило 13: Текстът на етикета в България задължително трябва да бъде на български език.
Правило 14: Шрифтът на задължителната информация не може да бъде по-малък от 1.2 мм височина на буквата "х".
Правило 15: Здравните претенции на етикета изискват научно доказателство и одобрение от ЕО.
    `
  },
  meat: {
    title: "Практическо ръководство за обекти с месо",
    content: `
ПРАКТИЧЕСКО МИНИ РЪКОВОДСТВО ЗА ОБЕКТИ С МЕСО И МЕСНИ ПРОДУКТИ
Как да избегнеш отказ, забавяне и излишни разходи при регистрация в БАБХ

Раздел 1: Подготовка на обекта и сграден фонд
Подовете трябва да са гладки, лесни за измиване и дезинфекция. Задължително е разделянето на зоните (чиста зона за разфасовка и мръсна зона за приемане и отпадъци).
Раздел 2: Водоснабдяване и вентилация
Обектът трябва да разполага с достатъчно топла и студена питейна вода. Вентилацията трябва да предотвратява конденз по стените и таваните.
Раздел 3: Хладилна верига
Охладено месо се съхранява от 0°C до 4°C (за птици – до 2°C, за мляно месо – до 2°C). Замразено месо – под -18°C. Хладилниците трябва да са оборудвани с термометри.
Раздел 4: Документация пред БАБХ
Изисква се подаване на заявление по образец, НАССР система със специфични ККТ за месо, ДХП процедури, договори за ДДД и екарисаж.
    `
  }
};

export default function ProfilePage() {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // User details states
  const [firmInfo, setFirmInfo] = useState({
    name: "",
    eik: "",
    address: "",
    manager: "",
    niche: "Заведение за хранене" // Default niche
  });

  // Navigation tabs in profile
  const [activeTab, setActiveTab] = useState("logs"); // logs, haccp, courses, tools, settings

  // Daily logs state
  const [selectedDate, setSelectedDate] = useState("");
  const [logIncoming, setLogIncoming] = useState<any[]>([]);
  const [logFridges, setLogFridges] = useState<any[]>([]);
  const [logHygiene, setLogHygiene] = useState<any>({
    desinfection: false,
    surfaces: false,
    floors: false,
    waste: false
  });
  const [logStaff, setLogStaff] = useState<any>({
    checkPassed: false,
    healthy: true
  });
  const [logThermal, setLogThermal] = useState<any[]>([]);
  const [logFryer, setLogFryer] = useState<any>({
    fryerUsed: false,
    oilQualityOk: true,
    oilChanged: false
  });

  // Tools state: Self-Audit Questionnaire
  const [auditAnswers, setAuditAnswers] = useState<any>({});
  const [auditScore, setAuditScore] = useState<number | null>(null);

  // Tools state: Expiration Tracker
  const [dueDates, setDueDates] = useState({
    dddContract: "2026-06-15",
    healthCards: "2026-09-01",
    waterAnalysis: "2026-11-20"
  });

  // Tools state: Food shelf-life calculator
  const [foodType, setFoodType] = useState("milk");
  const [openedTime, setOpenedTime] = useState("");
  const [calculatedExpiry, setCalculatedExpiry] = useState("");

  // Document modal viewer
  const [activeDocKey, setActiveDocKey] = useState<string | null>(null);
  // Course modal reader
  const [activeCourseKey, setActiveCourseKey] = useState<string | null>(null);

  // Load state and initial date on client mount
  useEffect(() => {
    // Current date default
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);

    // Simulated check auth
    const storedAuth = localStorage.getItem("danka_auth_logged");
    if (storedAuth === "true") {
      setIsLoggedIn(true);
      const storedFirm = localStorage.getItem("danka_firm_info");
      if (storedFirm) {
        setFirmInfo(JSON.parse(storedFirm));
      }
    }
  }, []);

  // Sync date-based logs when selectedDate changes or when user details change
  useEffect(() => {
    if (!isLoggedIn || !selectedDate) return;
    const key = `danka_logs_${selectedDate}`;
    const storedLogs = localStorage.getItem(key);
    if (storedLogs) {
      const parsed = JSON.parse(storedLogs);
      setLogIncoming(parsed.incoming || []);
      setLogFridges(parsed.fridges || []);
      setLogHygiene(parsed.hygiene || { desinfection: false, surfaces: false, floors: false, waste: false });
      setLogStaff(parsed.staff || { checkPassed: false, healthy: true });
      setLogThermal(parsed.thermal || []);
      setLogFryer(parsed.fryer || { fryerUsed: false, oilQualityOk: true, oilChanged: false });
    } else {
      // Default empty structures based on niche
      setLogIncoming([
        { product: "Охладено пилешко месо", supplier: "Метро Кеш & Кери", batch: "P2981-L", temp: "2", expiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], compliant: true }
      ]);
      setLogFridges([
        { name: "Хладилна витрина (салати)", tempAm: "3", tempPm: "4" },
        { name: "Хладилник за месо", tempAm: "1", tempPm: "2" },
        { name: "Основен фризер", tempAm: "-19", tempPm: "-18" }
      ]);
      setLogHygiene({ desinfection: false, surfaces: false, floors: false, waste: false });
      setLogStaff({ checkPassed: false, healthy: true });
      setLogThermal([
        { product: "Готвено пилешко филе", time: "11:30", tempCook: "78", cooled: true }
      ]);
      setLogFryer({ fryerUsed: false, oilQualityOk: true, oilChanged: false });
    }
  }, [selectedDate, isLoggedIn]);

  // Handle mock sign in
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail && authPassword) {
      localStorage.setItem("danka_auth_logged", "true");
      setIsLoggedIn(true);
      
      // Seed default firm info if empty
      const storedFirm = localStorage.getItem("danka_firm_info");
      if (!storedFirm) {
        const defaultFirm = {
          name: "Вкусни Мигове ЕООД",
          eik: "207654321",
          address: "гр. София, бул. Витоша 45",
          manager: "Георги Георгиев",
          niche: "Заведение за хранене"
        };
        localStorage.setItem("danka_firm_info", JSON.stringify(defaultFirm));
        setFirmInfo(defaultFirm);
      } else {
        setFirmInfo(JSON.parse(storedFirm));
      }
    } else {
      alert("Моля, попълнете имейл и парола.");
    }
  };

  // Handle mock registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail || !regPassword) {
      alert("Моля, попълнете всички полета.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      alert("Паролите не съвпадат.");
      return;
    }
    localStorage.setItem("danka_auth_logged", "true");
    setIsLoggedIn(true);
    const newFirm = {
      name: "",
      eik: "",
      address: "",
      manager: "",
      niche: "Заведение за хранене"
    };
    localStorage.setItem("danka_firm_info", JSON.stringify(newFirm));
    setFirmInfo(newFirm);
    setActiveTab("settings");
    alert("Успешна регистрация! Сега попълнете профила на Вашата фирма.");
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("danka_auth_logged");
    setIsLoggedIn(false);
    setActiveTab("logs");
  };

  // Save firm settings
  const handleSaveFirm = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("danka_firm_info", JSON.stringify(firmInfo));
    alert("Данните за фирмата бяха запазени успешно!");
  };

  // Save current date logbooks
  const handleSaveLogs = () => {
    const key = `danka_logs_${selectedDate}`;
    const logsData = {
      incoming: logIncoming,
      fridges: logFridges,
      hygiene: logHygiene,
      staff: logStaff,
      thermal: logThermal,
      fryer: logFryer
    };
    localStorage.setItem(key, JSON.stringify(logsData));
    alert(`Ежедневните дневници за дата ${selectedDate} бяха успешно запазени!`);
  };

  // Print function helper
  const handlePrint = () => {
    window.print();
  };

  // Add Row to Delivery control table
  const addDeliveryRow = () => {
    setLogIncoming([...logIncoming, { product: "", supplier: "", batch: "", temp: "", expiry: "", compliant: true }]);
  };

  // Delete Row from Delivery control table
  const deleteDeliveryRow = (index: number) => {
    const updated = [...logIncoming];
    updated.splice(index, 1);
    setLogIncoming(updated);
  };

  // Update Delivery Row field
  const updateDeliveryRow = (index: number, field: string, value: any) => {
    const updated = [...logIncoming];
    updated[index][field] = value;
    setLogIncoming(updated);
  };

  // Add Row to Cooking temp table
  const addThermalRow = () => {
    setLogThermal([...logThermal, { product: "", time: "", tempCook: "", cooled: false }]);
  };

  // Delete Row from Cooking temp table
  const deleteThermalRow = (index: number) => {
    const updated = [...logThermal];
    updated.splice(index, 1);
    setLogThermal(updated);
  };

  // Update Cooking Row field
  const updateThermalRow = (index: number, field: string, value: any) => {
    const updated = [...logThermal];
    updated[index][field] = value;
    setLogThermal(updated);
  };

  // Update fridge temperature
  const updateFridgeTemp = (index: number, field: 'tempAm' | 'tempPm', value: string) => {
    const updated = [...logFridges];
    updated[index][field] = value;
    setLogFridges(updated);
  };

  // Run Self-Audit Evaluation
  const runSelfAudit = () => {
    let score = 0;
    const totalQuestions = 15;
    let answeredCount = 0;

    for (let i = 1; i <= totalQuestions; i++) {
      if (auditAnswers[`q${i}`] === "yes") {
        score += 1;
        answeredCount++;
      } else if (auditAnswers[`q${i}`] === "no" || auditAnswers[`q${i}`] === "partial") {
        answeredCount++;
      }
    }

    if (answeredCount === 0) {
      alert("Моля, отговорете поне на няколко въпроса.");
      return;
    }

    const percentage = Math.round((score / totalQuestions) * 100);
    setAuditScore(percentage);
  };

  // Calculate Food Expiry Time
  const calculateFoodExpiry = () => {
    if (!openedTime) {
      alert("Моля, изберете дата и час на отваряне.");
      return;
    }
    const openDate = new Date(openedTime);
    let hoursToAdd = 48; // default

    if (foodType === "milk") hoursToAdd = 48; // 2 days
    else if (foodType === "meat") hoursToAdd = 72; // 3 days
    else if (foodType === "eggs_pasteurised") hoursToAdd = 120; // 5 days
    else if (foodType === "canned_open") hoursToAdd = 24; // 24 hours
    else if (foodType === "cooked_dish") hoursToAdd = 48; // 48 hours

    const expiryDate = new Date(openDate.getTime() + hoursToAdd * 60 * 60 * 1000);
    
    const formatted = expiryDate.toLocaleString("bg-BG", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    setCalculatedExpiry(formatted);
  };

  return (
    <div className="bg-brand-light min-h-screen pb-20">
      {/* 1. Header Hero Banner - Hidden on print */}
      <section className="bg-brand-green py-10 text-center relative overflow-hidden border-b border-brand-gold/15 print:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-75 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-2">
          <span className="text-[10px] font-bold uppercase text-brand-gold tracking-widest block">
            СИСТЕМА ЗА ХРАНИТЕЛНА БЕЗОПАСНОСТ
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Клиентски Портал и Записи
          </h1>
          {isLoggedIn && (
            <p className="text-xs text-white/80 max-w-2xl mx-auto font-medium">
              Обект: <span className="text-brand-gold font-bold">{firmInfo.name || "Неконфигуриран"}</span> ({firmInfo.niche})
            </p>
          )}
        </div>
      </section>

      {/* 2. AUTHENTICATION SCREENS (LOGIN / REGISTER) - Hidden on print */}
      {!isLoggedIn && (
        <div className="max-w-md mx-auto mt-16 px-4 print:hidden">
          <div className="bg-white border border-brand-green/10 p-8 rounded-2xl shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-brand-gold/10 rounded-full border border-brand-gold/20 text-brand-gold">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-brand-green">
                {isRegisterMode ? "Регистрирайте обект" : "Вход в портала"}
              </h2>
              <p className="text-xs text-brand-dark/60">
                {isRegisterMode 
                  ? "Създайте профил за Вашата фирма за автоматично съответствие" 
                  : "Въведете акаунта си, за да управлявате БАБХ папките и дневниците"}
              </p>
            </div>

            {/* Simulated Credentials Tip */}
            {!isRegisterMode && (
              <div className="bg-brand-gold/10 border border-brand-gold/25 p-3 rounded-lg text-[11px] text-brand-dark/95 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Бърз достъп за тестване:</span>
                  Въведете произволен имейл и парола (напр. <code className="bg-white px-1 rounded border">test@test.com</code> / <code className="bg-white px-1 rounded border">123</code>) за демонстрация.
                </div>
              </div>
            )}

            {isRegisterMode ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Имейл адрес</label>
                  <input 
                    type="email" 
                    required 
                    value={regEmail} 
                    onChange={(e) => setRegEmail(e.target.value)} 
                    placeholder="name@business.com" 
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Парола</label>
                  <input 
                    type="password" 
                    required 
                    value={regPassword} 
                    onChange={(e) => setRegPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Повторете парола</label>
                  <input 
                    type="password" 
                    required 
                    value={regConfirmPassword} 
                    onChange={(e) => setRegConfirmPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer"
                >
                  Регистрация и Настройки
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Имейл адрес</label>
                  <input 
                    type="email" 
                    required 
                    value={authEmail} 
                    onChange={(e) => setAuthEmail(e.target.value)} 
                    placeholder="name@business.com" 
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Парола</label>
                  <input 
                    type="password" 
                    required 
                    value={authPassword} 
                    onChange={(e) => setAuthPassword(e.target.value)} 
                    placeholder="••••••••" 
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors cursor-pointer"
                >
                  Влизане в системата
                </button>
              </form>
            )}

            <div className="text-center">
              <button 
                onClick={() => setIsRegisterMode(!isRegisterMode)} 
                className="text-xs text-brand-gold hover:underline font-bold"
              >
                {isRegisterMode ? "Вече имате профил? Влезте оттук" : "Нямате профил? Регистрирайте обекта си сега"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. LOGGED-IN DASHBOARD */}
      {isLoggedIn && (
        <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar Menu - Hidden on print */}
            <aside className="lg:col-span-3 bg-white border border-brand-green/5 rounded-2xl p-5 shadow-md space-y-6 print:hidden">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-brand-dark/45 tracking-widest block">Навигация</span>
                <nav className="flex flex-col gap-1.5">
                  <button 
                    onClick={() => setActiveTab("logs")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left ${activeTab === "logs" ? "bg-brand-green text-white" : "text-brand-dark hover:bg-brand-light"}`}
                  >
                    <Calendar className="h-4 w-4" />
                    БАБХ Дневници
                  </button>
                  <button 
                    onClick={() => setActiveTab("haccp")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left ${activeTab === "haccp" ? "bg-brand-green text-white" : "text-brand-dark hover:bg-brand-light"}`}
                  >
                    <FileText className="h-4 w-4" />
                    НАССР Документи
                  </button>
                  <button 
                    onClick={() => setActiveTab("courses")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left ${activeTab === "courses" ? "bg-brand-green text-white" : "text-brand-dark hover:bg-brand-light"}`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Моите Обучения
                  </button>
                  <button 
                    onClick={() => setActiveTab("tools")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left ${activeTab === "tools" ? "bg-brand-green text-white" : "text-brand-dark hover:bg-brand-light"}`}
                  >
                    <Activity className="h-4 w-4" />
                    Инструменти
                  </button>
                  <button 
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left ${activeTab === "settings" ? "bg-brand-green text-white" : "text-brand-dark hover:bg-brand-light"}`}
                  >
                    <Settings className="h-4 w-4" />
                    Фирма и Профил
                  </button>
                </nav>
              </div>

              <div className="border-t border-brand-green/5 pt-4">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Излизане
                </button>
              </div>
            </aside>

            {/* Right Main Content Area */}
            <main className="lg:col-span-9 space-y-8">
              
              {/* TAB 1: DAILY LOGBOOKS (ДНЕВНИЦИ) */}
              {activeTab === "logs" && (
                <div className="space-y-6">
                  {/* Control panel - Hidden on print */}
                  <div className="bg-white border border-brand-green/5 p-5 rounded-2xl shadow-md flex flex-wrap gap-4 items-center justify-between print:hidden">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-lg font-bold text-brand-green leading-snug">Ежедневни Дневници по Самоконтрол</h2>
                        <p className="text-[10px] text-brand-dark/50">Попълвайте записи онлайн и ги печатайте за инспекторите</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-brand-dark/70 uppercase">Изберете дата:</label>
                        <input 
                          type="date" 
                          value={selectedDate} 
                          onChange={(e) => setSelectedDate(e.target.value)} 
                          className="text-xs border border-brand-green/20 rounded px-2.5 py-1.5 focus:outline-none focus:border-brand-gold bg-brand-light"
                        />
                      </div>
                      <button 
                        onClick={handlePrint}
                        className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Печат на всичко
                      </button>
                    </div>
                  </div>

                  {/* PRINT VIEW HEADER - Visible only on print */}
                  <div className="hidden print:block space-y-4 mb-6 border-b-2 border-brand-dark pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="font-serif text-xl font-bold uppercase">ЕЖЕДНЕВНИ ЗАПИСИ ПО СИСТЕМАТА ЗА САМОКОНТРОЛ</h1>
                        <p className="text-xs">Обект: {firmInfo.name} | ЕИК: {firmInfo.eik}</p>
                        <p className="text-xs">Адрес: {firmInfo.address} | Управител: {firmInfo.manager}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold block border border-brand-dark px-3 py-1 bg-brand-light">
                          ДАТА: {selectedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Logbook Forms Container */}
                  <div className="space-y-8">
                    
                    {/* FORM 1: Входящ Контрол на храни */}
                    <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                      <div className="flex items-center justify-between border-b border-brand-green/5 pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-brand-gold" />
                          <h3 className="font-serif text-base font-bold text-brand-green">1. Дневник за входящ контрол на суровини</h3>
                        </div>
                        <button 
                          onClick={addDeliveryRow}
                          className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer print:hidden"
                        >
                          <Plus className="h-3.5 w-3.5" /> Добави доставка
                        </button>
                      </div>

                      {logIncoming.length === 0 ? (
                        <p className="text-xs text-brand-dark/50 italic py-2 text-center">Няма въведени доставяни храни за тази дата.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse border border-brand-green/10">
                            <thead>
                              <tr className="bg-brand-green/5 text-[10px] font-bold text-brand-green uppercase">
                                <th className="border border-brand-green/10 p-2.5">Продукт / Суровина</th>
                                <th className="border border-brand-green/10 p-2.5">Доставчик</th>
                                <th className="border border-brand-green/10 p-2.5">Партида / Номер</th>
                                <th className="border border-brand-green/10 p-2.5 w-20 text-center">t° при трансп. (°C)</th>
                                <th className="border border-brand-green/10 p-2.5 w-28 text-center">Срок на годност</th>
                                <th className="border border-brand-green/10 p-2.5 w-24 text-center">Изрядна опаковка</th>
                                <th className="border border-brand-green/10 p-2.5 w-12 text-center print:hidden">Изтрий</th>
                              </tr>
                            </thead>
                            <tbody>
                              {logIncoming.map((row, idx) => (
                                <tr key={idx} className="hover:bg-brand-light/40 transition-colors">
                                  <td className="border border-brand-green/10 p-1.5">
                                    <input 
                                      type="text" 
                                      value={row.product} 
                                      onChange={(e) => updateDeliveryRow(idx, "product", e.target.value)}
                                      placeholder="напр. Домати" 
                                      className="w-full px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                    />
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5">
                                    <input 
                                      type="text" 
                                      value={row.supplier} 
                                      onChange={(e) => updateDeliveryRow(idx, "supplier", e.target.value)}
                                      placeholder="напр. Метро" 
                                      className="w-full px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                    />
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5">
                                    <input 
                                      type="text" 
                                      value={row.batch} 
                                      onChange={(e) => updateDeliveryRow(idx, "batch", e.target.value)}
                                      placeholder="напр. L3981" 
                                      className="w-full px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none font-mono"
                                    />
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5 text-center">
                                    <input 
                                      type="text" 
                                      value={row.temp} 
                                      onChange={(e) => updateDeliveryRow(idx, "temp", e.target.value)}
                                      placeholder="4" 
                                      className="w-full text-center px-1 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                    />
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5 text-center">
                                    <input 
                                      type="date" 
                                      value={row.expiry} 
                                      onChange={(e) => updateDeliveryRow(idx, "expiry", e.target.value)}
                                      className="px-1 py-0.5 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                    />
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5 text-center">
                                    <select
                                      value={row.compliant ? "yes" : "no"}
                                      onChange={(e) => updateDeliveryRow(idx, "compliant", e.target.value === "yes")}
                                      className="text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none p-1 font-bold text-brand-green"
                                    >
                                      <option value="yes" className="text-green-600 font-bold">Да (ОК)</option>
                                      <option value="no" className="text-red-600 font-bold">Не (Брак)</option>
                                    </select>
                                  </td>
                                  <td className="border border-brand-green/10 p-1.5 text-center print:hidden">
                                    <button 
                                      onClick={() => deleteDeliveryRow(idx)}
                                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* FORM 2: Температурен Дневник за хладилници */}
                    <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                      <div className="border-b border-brand-green/5 pb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-brand-gold" />
                          <h3 className="font-serif text-base font-bold text-brand-green">2. Дневник за температурния режим на хладилните съоръжения</h3>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse border border-brand-green/10">
                          <thead>
                            <tr className="bg-brand-green/5 text-[10px] font-bold text-brand-green uppercase">
                              <th className="border border-brand-green/10 p-2.5">Хладилно съоръжение (Име / №)</th>
                              <th className="border border-brand-green/10 p-2.5 w-36 text-center">Температура Сутрин (°C)</th>
                              <th className="border border-brand-green/10 p-2.5 w-36 text-center">Температура Вечер (°C)</th>
                              <th className="border border-brand-green/10 p-2.5 w-40 text-center">Норматив (Препоръчително)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {logFridges.map((row, idx) => (
                              <tr key={idx} className="hover:bg-brand-light/40 transition-colors">
                                <td className="border border-brand-green/10 p-2.5 font-bold text-brand-green">
                                  {row.name}
                                </td>
                                <td className="border border-brand-green/10 p-1.5 text-center">
                                  <input 
                                    type="text" 
                                    value={row.tempAm} 
                                    onChange={(e) => updateFridgeTemp(idx, "tempAm", e.target.value)}
                                    placeholder="напр. 3" 
                                    className="w-full text-center px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                  />
                                </td>
                                <td className="border border-brand-green/10 p-1.5 text-center">
                                  <input 
                                    type="text" 
                                    value={row.tempPm} 
                                    onChange={(e) => updateFridgeTemp(idx, "tempPm", e.target.value)}
                                    placeholder="напр. 4" 
                                    className="w-full text-center px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                  />
                                </td>
                                <td className="border border-brand-green/10 p-2.5 text-center text-[10px] text-brand-dark/50 italic">
                                  {row.name.toLowerCase().includes("фризер") ? "под -18 °C" : "от 0 до 4 °C"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* TWO-COLUMN GRID FOR HYGIENE AND HEALTH CHECK */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      
                      {/* FORM 3: Почистване и Дезинфекция */}
                      <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                        <div className="border-b border-brand-green/5 pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-brand-gold" />
                            <h3 className="font-serif text-base font-bold text-brand-green">3. Дневник по дезинфекция</h3>
                          </div>
                        </div>

                        <p className="text-[10px] text-brand-dark/50 italic leading-snug">Отбележете извършените ежедневни хигиенни процедури в обекта:</p>
                        
                        <div className="space-y-3.5">
                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logHygiene.desinfection} 
                              onChange={(e) => setLogHygiene({...logHygiene, desinfection: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block">Дезинфекция на инвентар и прибори</span>
                              <span className="text-[10px] text-brand-dark/60 block">Обработка на дъски, ножове, тигани, контейнери</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logHygiene.surfaces} 
                              onChange={(e) => setLogHygiene({...logHygiene, surfaces: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block">Почистване на работни повърхности</span>
                              <span className="text-[10px] text-brand-dark/60 block">Дезинфекциране на плотове и метални повърхности</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logHygiene.floors} 
                              onChange={(e) => setLogHygiene({...logHygiene, floors: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block">Подобряване и измиване на подове</span>
                              <span className="text-[10px] text-brand-dark/60 block">Ежедневно забърсване и измиване със саниращи разтвори</span>
                            </div>
                          </label>

                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logHygiene.waste} 
                              onChange={(e) => setLogHygiene({...logHygiene, waste: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block">Извозване на хранителни отпадъци</span>
                              <span className="text-[10px] text-brand-dark/60 block">Изхвърляне на кофите, почистване на контейнери и дезинфекция</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* FORM 4: Здравен Статус / Лична Хигиена */}
                      <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                        <div className="border-b border-brand-green/5 pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-brand-gold" />
                            <h3 className="font-serif text-base font-bold text-brand-green">4. Лична хигиена и здравен статус</h3>
                          </div>
                        </div>

                        <p className="text-[10px] text-brand-dark/50 italic leading-snug">Декларация на управителя за здравословно състояние на екипа:</p>

                        <div className="space-y-4 bg-brand-light/40 p-4 rounded-xl border border-brand-green/5">
                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logStaff.checkPassed} 
                              onChange={(e) => setLogStaff({...logStaff, checkPassed: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block text-brand-green">Извършен входящ филтър на персонала</span>
                              <span className="text-[10px] text-brand-dark/60 block">Служителите са проверени преди започване на смяна</span>
                            </div>
                          </label>

                          <div className="flex items-center justify-between border-t border-brand-green/5 pt-3">
                            <span className="text-xs font-bold">Персоналът е здрав и изряден:</span>
                            <select
                              value={logStaff.healthy ? "healthy" : "sick"}
                              onChange={(e) => setLogStaff({...logStaff, healthy: e.target.value === "healthy"})}
                              className="text-xs font-bold border border-brand-green/10 rounded px-2.5 py-1 bg-white focus:outline-none focus:border-brand-gold text-brand-green"
                            >
                              <option value="healthy" className="text-green-600 font-bold">Да (Всички ОК)</option>
                              <option value="sick" className="text-red-600 font-bold">Не (Има временно отстранени)</option>
                            </select>
                          </div>
                        </div>

                        <div className="text-[10px] text-brand-dark/50 leading-relaxed border-l-2 border-brand-gold/30 pl-3">
                          <span className="font-bold block text-brand-dark/70">БАБХ Стандарт:</span>
                          Лица с гнойни рани, кожни обриви или грипоподобни симптоми се отстраняват незабавно от кухнята.
                        </div>
                      </div>
                    </div>

                    {/* NICHE-SPECIFIC FORM: 5. Термична Обработка (cooking temp log) - Rendered if Niche is Заведение or Пекарна/Производство */}
                    {(firmInfo.niche === "Заведение за хранене" || firmInfo.niche === "Пекарна или производство") && (
                      <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                        <div className="flex items-center justify-between border-b border-brand-green/5 pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-brand-gold" />
                            <h3 className="font-serif text-base font-bold text-brand-green">5. Дневник за температурна (термична) обработка</h3>
                          </div>
                          <button 
                            onClick={addThermalRow}
                            className="bg-brand-green hover:bg-brand-green/90 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer print:hidden"
                          >
                            <Plus className="h-3.5 w-3.5" /> Добави запис
                          </button>
                        </div>

                        <p className="text-[10px] text-brand-dark/50 italic leading-snug">Задължително вписване на t° при печене/варене/пържене (минимална t° в ядрото 75°C):</p>

                        {logThermal.length === 0 ? (
                          <p className="text-xs text-brand-dark/50 italic py-2 text-center">Няма въведени топлинни обработки за тази дата.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse border border-brand-green/10">
                              <thead>
                                <tr className="bg-brand-green/5 text-[10px] font-bold text-brand-green uppercase">
                                  <th className="border border-brand-green/10 p-2.5">Приготвено ястие / Продукт</th>
                                  <th className="border border-brand-green/10 p-2.5 w-24 text-center">Час</th>
                                  <th className="border border-brand-green/10 p-2.5 w-36 text-center">t° в центъра (°C)</th>
                                  <th className="border border-brand-green/10 p-2.5 w-40 text-center">Правилно охлаждане</th>
                                  <th className="border border-brand-green/10 p-2.5 w-12 text-center print:hidden">Изтрий</th>
                                </tr>
                              </thead>
                              <tbody>
                                {logThermal.map((row, idx) => (
                                  <tr key={idx} className="hover:bg-brand-light/40 transition-colors">
                                    <td className="border border-brand-green/10 p-1.5">
                                      <input 
                                        type="text" 
                                        value={row.product} 
                                        onChange={(e) => updateThermalRow(idx, "product", e.target.value)}
                                        placeholder="напр. Пиле с картофи" 
                                        className="w-full px-2 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                      />
                                    </td>
                                    <td className="border border-brand-green/10 p-1.5 text-center">
                                      <input 
                                        type="text" 
                                        value={row.time} 
                                        onChange={(e) => updateThermalRow(idx, "time", e.target.value)}
                                        placeholder="12:00" 
                                        className="w-full text-center px-1 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                      />
                                    </td>
                                    <td className="border border-brand-green/10 p-1.5 text-center">
                                      <input 
                                        type="text" 
                                        value={row.tempCook} 
                                        onChange={(e) => updateThermalRow(idx, "tempCook", e.target.value)}
                                        placeholder="78" 
                                        className="w-full text-center px-1 py-1 text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none"
                                      />
                                    </td>
                                    <td className="border border-brand-green/10 p-1.5 text-center">
                                      <select
                                        value={row.cooled ? "yes" : "no"}
                                        onChange={(e) => updateThermalRow(idx, "cooled", e.target.value === "yes")}
                                        className="text-xs border border-transparent hover:border-brand-green/20 focus:border-brand-gold rounded bg-transparent focus:bg-white focus:outline-none p-1 font-bold text-brand-green"
                                      >
                                        <option value="yes" className="text-green-600 font-bold">Да (Бързо охлаждане)</option>
                                        <option value="no" className="text-brand-gold font-bold">Не се изисква</option>
                                      </select>
                                    </td>
                                    <td className="border border-brand-green/10 p-1.5 text-center print:hidden">
                                      <button 
                                        onClick={() => deleteThermalRow(idx)}
                                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* NICHE-SPECIFIC FORM: 6. Контрол на фритюрна мазнина - Rendered if Niche is Заведение or Каравана */}
                    {(firmInfo.niche === "Заведение за хранене" || firmInfo.niche === "Каравана или павилион") && (
                      <div className="bg-white border border-brand-green/5 p-6 rounded-2xl shadow-md space-y-4 break-inside-avoid">
                        <div className="border-b border-brand-green/5 pb-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-brand-gold" />
                            <h3 className="font-serif text-base font-bold text-brand-green">6. Дневник за фритюрна мазнина</h3>
                          </div>
                        </div>

                        <div className="bg-brand-light/40 p-4 rounded-xl border border-brand-green/5 space-y-4">
                          <label className="flex items-start gap-3 text-xs text-brand-dark select-none cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={logFryer.fryerUsed} 
                              onChange={(e) => setLogFryer({...logFryer, fryerUsed: e.target.checked})} 
                              className="mt-0.5 rounded border-brand-green/20 focus:ring-brand-gold text-brand-green"
                            />
                            <div>
                              <span className="font-bold block">Фритюрниците са използвани на тази дата</span>
                              <span className="text-[10px] text-brand-dark/60 block">Следи се качеството на олиото след употреба</span>
                            </div>
                          </label>

                          {logFryer.fryerUsed && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-green/5 pt-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold">Качество на мазнината:</span>
                                <select
                                  value={logFryer.oilQualityOk ? "ok" : "bad"}
                                  onChange={(e) => setLogFryer({...logFryer, oilQualityOk: e.target.value === "ok"})}
                                  className="text-xs border border-brand-green/10 rounded px-2.5 py-1 bg-white focus:outline-none focus:border-brand-gold font-bold text-brand-green"
                                >
                                  <option value="ok" className="text-green-600 font-bold">Годна (Добра)</option>
                                  <option value="bad" className="text-red-600 font-bold">Негодна (Потъмняла)</option>
                                </select>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold">Извършена ли е подмяна:</span>
                                <select
                                  value={logFryer.oilChanged ? "yes" : "no"}
                                  onChange={(e) => setLogFryer({...logFryer, oilChanged: e.target.value === "yes"})}
                                  className="text-xs border border-brand-green/10 rounded px-2.5 py-1 bg-white focus:outline-none focus:border-brand-gold font-bold text-brand-green"
                                >
                                  <option value="no" className="text-brand-dark/60">Не</option>
                                  <option value="yes" className="text-green-600 font-bold">Да (Напълно подменена)</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Save Button - Hidden on print */}
                  <div className="flex justify-end gap-3 print:hidden">
                    <button 
                      onClick={handleSaveLogs}
                      className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors cursor-pointer shadow-lg shadow-brand-green/10"
                    >
                      Запази Дневници за тази дата
                    </button>
                  </div>

                  {/* SIGNATURE FIELDS - Visible only on print */}
                  <div className="hidden print:grid grid-cols-2 gap-12 mt-16 pt-8 border-t border-dashed border-brand-dark/40 text-xs">
                    <div>
                      <p className="font-bold">ПОДПИС НА ИЗВЪРШИЛ КОНТРОЛА:</p>
                      <p className="mt-8 border-b border-brand-dark w-48"></p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">ПОДПИС НА УПРАВИТЕЛ / ОТГОВОРНИК:</p>
                      <p className="mt-8 border-b border-brand-dark w-48 ml-auto"></p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: AUTO-GENERATED HACCP & DHP DOCUMENTS */}
              {activeTab === "haccp" && (
                <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                  <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                    <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-brand-green">Автоматичен Генератор на БАБХ Документи</h2>
                      <p className="text-xs text-brand-dark/50">Генерирайте Вашата регламентирана папка с попълнени корпоративни данни</p>
                    </div>
                  </div>

                  <div className="bg-brand-gold/10 border border-brand-gold/25 p-4 rounded-xl text-xs leading-relaxed space-y-2">
                    <span className="font-bold block text-brand-green uppercase tracking-wider">Как работи?</span>
                    <p>
                      Системата взема данните за Вашата фирма (Име, ЕИК, Адрес и Управител), които сте въвели в настройките, и ги вгражда динамично в готови официални декларации и процедури. Изберете документ от списъка по-долу, прегледайте го и го отпечатайте на А4.
                    </p>
                  </div>

                  {/* List of Documents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="border border-brand-green/5 rounded-xl p-4 hover:border-brand-gold/45 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">Задължително по Закон</span>
                        <h4 className="font-serif text-sm font-bold text-brand-green">Система за самоконтрол (ДХП)</h4>
                        <p className="text-[10px] text-brand-dark/60 leading-normal">
                          Процедури за лична хигиена, входящ контрол на суровините, почистване, дезинфекция и управление на отпадъци.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveDocKey("dhp")}
                        className="mt-4 bg-brand-green/5 hover:bg-brand-green text-brand-green hover:text-white font-bold text-[10px] uppercase py-2 rounded transition-colors w-full cursor-pointer text-center"
                      >
                        Прегледай и генерирай
                      </button>
                    </div>

                    <div className="border border-brand-green/5 rounded-xl p-4 hover:border-brand-gold/45 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">Задължително по Закон</span>
                        <h4 className="font-serif text-sm font-bold text-brand-green">Програма за мониторинг на вредители (ДДД)</h4>
                        <p className="text-[10px] text-brand-dark/60 leading-normal">
                          Инструкции за борба с гризачи и насекоми, сключени договори и мониторингови карти за безопасност.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveDocKey("pest")}
                        className="mt-4 bg-brand-green/5 hover:bg-brand-green text-brand-green hover:text-white font-bold text-[10px] uppercase py-2 rounded transition-colors w-full cursor-pointer text-center"
                      >
                        Прегледай и генерирай
                      </button>
                    </div>

                    <div className="border border-brand-green/5 rounded-xl p-4 hover:border-brand-gold/45 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">ЕС 1169/2011</span>
                        <h4 className="font-serif text-sm font-bold text-brand-green">Процедура за управление на алергени</h4>
                        <p className="text-[10px] text-brand-dark/60 leading-normal">
                          Методология за маркиране на алергени в съставките, предпазване от кръстосано замърсяване и легенда за меню.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveDocKey("allergens")}
                        className="mt-4 bg-brand-green/5 hover:bg-brand-green text-brand-green hover:text-white font-bold text-[10px] uppercase py-2 rounded transition-colors w-full cursor-pointer text-center"
                      >
                        Прегледай и генерирай
                      </button>
                    </div>

                    <div className="border border-brand-green/5 rounded-xl p-4 hover:border-brand-gold/45 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold uppercase bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full">ККТ Контрол</span>
                        <h4 className="font-serif text-sm font-bold text-brand-green">Система НАССР (План и граници)</h4>
                        <p className="text-[10px] text-brand-dark/60 leading-normal">
                          Анализ на опасностите при печене, охлаждане, съхранение и определяне на Критични Контролни Точки.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveDocKey("haccp")}
                        className="mt-4 bg-brand-green/5 hover:bg-brand-green text-brand-green hover:text-white font-bold text-[10px] uppercase py-2 rounded transition-colors w-full cursor-pointer text-center"
                      >
                        Прегледай и генерирай
                      </button>
                    </div>
                  </div>

                  {/* DOCUMENT PREVIEW MODAL SCREEN */}
                  {activeDocKey && (
                    <div className="border-2 border-brand-gold/30 rounded-xl p-6 bg-brand-light/30 relative space-y-4">
                      <div className="flex items-center justify-between border-b border-brand-green/5 pb-2">
                        <h4 className="font-serif text-sm font-bold text-brand-green">Генериран Документ: {(DOCUMENT_TEMPLATES as any)[activeDocKey].title}</h4>
                        <div className="flex gap-2">
                          <button 
                            onClick={handlePrint}
                            className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-[10px] uppercase px-3 py-1.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="h-3 w-3" /> Принтирай А4
                          </button>
                          <button 
                            onClick={() => setActiveDocKey(null)}
                            className="text-xs text-brand-dark/50 hover:text-brand-dark font-bold hover:underline"
                          >
                            Затвори
                          </button>
                        </div>
                      </div>

                      {/* Clean pre-formatted paper preview */}
                      <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed p-4 border border-brand-green/10 bg-white rounded shadow-sm text-brand-dark max-h-96 overflow-y-auto">
                        {(DOCUMENT_TEMPLATES as any)[activeDocKey].content(firmInfo)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MY PURCHASED COURSES */}
              {activeTab === "courses" && (
                <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                  <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                    <div className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-bold text-brand-green">Моите Закупени Материали и Наръчници</h2>
                      <p className="text-xs text-brand-dark/50">Всички Ваши образователни ресурси за самоподготовка на едно място</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="border border-brand-green/5 rounded-xl p-5 flex flex-col justify-between hover:border-brand-gold/30 transition-all duration-300">
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold uppercase bg-brand-gold text-brand-dark px-2 py-0.5 rounded-full">Пълен Достъп</span>
                        <h4 className="font-serif text-base font-bold text-brand-green">15 златни правила за етикетиране на храните</h4>
                        <p className="text-xs text-brand-dark/60 leading-normal">
                          Практически указания, съобразени с българското законодателство и Регламент 1169 за етикети, алергени и шрифтове.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveCourseKey("labeling")}
                        className="mt-6 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase py-3 rounded-lg transition-colors w-full cursor-pointer text-center shadow-md"
                      >
                        Прочети наръчника
                      </button>
                    </div>

                    <div className="border border-brand-green/5 rounded-xl p-5 flex flex-col justify-between hover:border-brand-gold/30 transition-all duration-300">
                      <div className="space-y-3">
                        <span className="text-[9px] font-bold uppercase bg-brand-gold text-brand-dark px-2 py-0.5 rounded-full">Пълен Достъп</span>
                        <h4 className="font-serif text-base font-bold text-brand-green">Практическо ръководство за обекти с месо</h4>
                        <p className="text-xs text-brand-dark/60 leading-normal">
                          Пълно ръководство за изискванията на БАБХ при обекти за месни продукти, съхранение, рязане и етикетиране.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveCourseKey("meat")}
                        className="mt-6 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase py-3 rounded-lg transition-colors w-full cursor-pointer text-center shadow-md"
                      >
                        Прочети наръчника
                      </button>
                    </div>
                  </div>

                  {/* COURSE READING VIEWER */}
                  {activeCourseKey && (
                    <div className="border border-brand-gold/30 rounded-xl p-6 bg-brand-light/30 relative space-y-4 pt-5 mt-6">
                      <div className="flex items-center justify-between border-b border-brand-green/5 pb-2">
                        <h4 className="font-serif text-sm font-bold text-brand-green">Наръчник: {(COURSE_CONTENTS as any)[activeCourseKey].title}</h4>
                        <button 
                          onClick={() => setActiveCourseKey(null)}
                          className="text-xs text-brand-dark/50 hover:text-brand-dark font-bold hover:underline"
                        >
                          Затвори четенето
                        </button>
                      </div>
                      <pre className="font-sans text-xs sm:text-sm whitespace-pre-wrap leading-relaxed p-6 border border-brand-green/10 bg-white rounded shadow-sm text-brand-dark max-h-[500px] overflow-y-auto">
                        {(COURSE_CONTENTS as any)[activeCourseKey].content}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: USEFUL SYSTEM TOOLS (ИНСТРУМЕНТИ) */}
              {activeTab === "tools" && (
                <div className="space-y-8">
                  
                  {/* TOOL 1: SELF-AUDIT CALCULATOR */}
                  <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                      <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
                        <ShieldAlert className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-lg font-bold text-brand-green">Калкулатор за БАБХ самоодит</h2>
                        <p className="text-[10px] text-brand-dark/50">Проверете готовността на Вашия обект преди инспекторите</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* List of self-audit questions */}
                      {[
                        { id: "q1", text: "Разполагате ли с попълнена папка Система за самоконтрол (ДХП / НАССР) в обекта?" },
                        { id: "q2", text: "Всички хладилни съоръжения имат ли работещи термометри?" },
                        { id: "q3", text: "Водят ли се ежедневни дневници за температурата на хладилниците?" },
                        { id: "q4", text: "Всички служители притежават ли заверени лични здравни книжки?" },
                        { id: "q5", text: "Имате ли изложена легенда за 14-те основни алергена в обекта?" },
                        { id: "q6", text: "Всички пакетирани суровини в склада имат ли четливи етикети на български език?" },
                        { id: "q7", text: "Продуктите с изтекъл срок на годност бракуват ли се веднага в отделно маркирано място?" },
                        { id: "q8", text: "Стените, подовете и таваните в кухнята без дупки, мухъл и пукнатини ли са?" },
                        { id: "q9", text: "Имате ли сключен валиден договор с ДДД фирма за борба с вредители?" },
                        { id: "q10", text: "Имате ли отделни мивки за измиване на яйца, зеленчуци и ръце на персонала?" },
                      ].map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 hover:bg-brand-light/30 rounded-lg border border-transparent hover:border-brand-green/5 transition-all text-xs">
                          <span className="font-medium text-brand-dark/90">{item.text}</span>
                          <div className="flex gap-2.5 shrink-0">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name={item.id} 
                                value="yes" 
                                checked={auditAnswers[item.id] === "yes"}
                                onChange={(e) => setAuditAnswers({...auditAnswers, [item.id]: e.target.value})}
                                className="text-brand-green focus:ring-brand-gold"
                              />
                              <span>Да</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name={item.id} 
                                value="no" 
                                checked={auditAnswers[item.id] === "no"}
                                onChange={(e) => setAuditAnswers({...auditAnswers, [item.id]: e.target.value})}
                                className="text-brand-green focus:ring-brand-gold"
                              />
                              <span className="text-red-500 font-medium">Не</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input 
                                type="radio" 
                                name={item.id} 
                                value="partial" 
                                checked={auditAnswers[item.id] === "partial"}
                                onChange={(e) => setAuditAnswers({...auditAnswers, [item.id]: e.target.value})}
                                className="text-brand-green focus:ring-brand-gold"
                              />
                              <span className="text-brand-gold">Частично</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-green/5 pt-5">
                      <button 
                        onClick={runSelfAudit}
                        className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Изчисли резултат
                      </button>

                      {auditScore !== null && (
                        <div className="flex items-center gap-3 bg-brand-light p-3 rounded-lg border border-brand-green/5">
                          <span className="text-xs font-bold text-brand-dark/70">Резултат:</span>
                          <span className={`text-xl font-extrabold ${auditScore >= 80 ? "text-green-600" : auditScore >= 50 ? "text-brand-gold" : "text-red-600"}`}>
                            {auditScore}%
                          </span>
                          <span className="text-[10px] text-brand-dark/60 font-medium">
                            {auditScore >= 80 
                              ? "Отлична готовност! Обектът е защитен." 
                              : auditScore >= 50 
                              ? "Имате пропуски! Отстранете ги за избягване на глоби." 
                              : "Критичен риск! Свържете се спешно с нас!"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TOOL 2: CONTRACT & EXPIRATION CALENDAR */}
                  <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                      <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-lg font-bold text-brand-green">Календар за изтичащи срокове</h2>
                        <p className="text-[10px] text-brand-dark/50">Проследявайте задължителните дати за външни контроли</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-brand-light/50 border border-brand-green/5 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block">Ежемесечен одит</span>
                        <span className="text-xs font-bold block">ДДД Обработка (Вредители)</span>
                        <div className="flex justify-between items-center text-[10px] text-brand-dark/60 pt-2 border-t border-brand-green/5">
                          <span>Краен срок:</span>
                          <span className="font-bold text-brand-green">{dueDates.dddContract}</span>
                        </div>
                      </div>

                      <div className="bg-brand-light/50 border border-brand-green/5 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block">Годишен одит</span>
                        <span className="text-xs font-bold block">Анализ на питейна вода</span>
                        <div className="flex justify-between items-center text-[10px] text-brand-dark/60 pt-2 border-t border-brand-green/5">
                          <span>Краен срок:</span>
                          <span className="font-bold text-brand-green">{dueDates.waterAnalysis}</span>
                        </div>
                      </div>

                      <div className="bg-brand-light/50 border border-brand-green/5 p-4 rounded-xl space-y-2">
                        <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block">Постоянен статус</span>
                        <span className="text-xs font-bold block">Здравни книжки (персонал)</span>
                        <div className="flex justify-between items-center text-[10px] text-brand-dark/60 pt-2 border-t border-brand-green/5">
                          <span>Следващ одит:</span>
                          <span className="font-bold text-brand-green">{dueDates.healthCards}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TOOL 3: STORAGE SHELF-LIFE CALCULATOR */}
                  <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                      <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="font-serif text-lg font-bold text-brand-green">Калкулатор за срок на годност</h2>
                        <p className="text-[10px] text-brand-dark/50">Изчислете кога изтичат отворените суровини според изискванията</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Вид суровина / съставка:</label>
                          <select 
                            value={foodType} 
                            onChange={(e) => setFoodType(e.target.value)} 
                            className="w-full text-xs border border-brand-green/20 rounded-lg p-2 bg-brand-light focus:outline-none focus:border-brand-gold"
                          >
                            <option value="milk">Прясно мляко (отворено, хладилник) - 48 часа</option>
                            <option value="meat">Сурово мляно месо (охладено) - 72 часа</option>
                            <option value="eggs_pasteurised">Пастьоризиран яйчен меланж - 120 часа</option>
                            <option value="canned_open">Отворени консерви (метални опаковки) - 24 часа</option>
                            <option value="cooked_dish">Сготвени ястия (готови за консумация) - 48 часа</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Дата и час на отваряне / приготвяне:</label>
                          <input 
                            type="datetime-local" 
                            value={openedTime}
                            onChange={(e) => setOpenedTime(e.target.value)}
                            className="w-full text-xs border border-brand-green/20 rounded-lg p-2 bg-brand-light focus:outline-none focus:border-brand-gold"
                          />
                        </div>

                        <button 
                          onClick={calculateFoodExpiry}
                          className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer w-full"
                        >
                          Изчисли срок на брак
                        </button>
                      </div>

                      {calculatedExpiry && (
                        <div className="bg-brand-light p-5 rounded-xl border border-brand-green/5 text-center space-y-3">
                          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">ЕТИКЕТ ЗА ПРОСЛЕДИМОСТ</span>
                          
                          <div className="border border-dashed border-brand-dark/20 p-4 bg-white rounded space-y-1 inline-block text-left w-full">
                            <span className="text-[10px] block font-bold text-brand-green uppercase">ОБЕКТ: {firmInfo.name || "Вкусни Мигове"}</span>
                            <span className="text-xs font-bold block">Продукт: {
                              foodType === "milk" ? "Прясно мляко" :
                              foodType === "meat" ? "Мляно месо" :
                              foodType === "eggs_pasteurised" ? "Яйчен меланж" :
                              foodType === "canned_open" ? "Отворена консерва" : "Сготвено ястие"
                            }</span>
                            <span className="text-[10px] text-brand-dark/60 block">Отворен на: {openedTime.replace("T", " ")}</span>
                            <span className="text-xs font-bold text-red-600 block mt-1">ГОДЕН ДО: {calculatedExpiry}</span>
                          </div>

                          <button 
                            onClick={handlePrint}
                            className="bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-[10px] uppercase px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer mx-auto shadow"
                          >
                            <Printer className="h-3 w-3" /> Принтирай етикет
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 5: FIRM PROFILE SETTINGS (ФИРМА И ПРОФИЛ) */}
              {activeTab === "settings" && (
                <div className="bg-white border border-brand-green/5 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
                  <div className="flex items-center gap-3 border-b border-brand-green/5 pb-4">
                    <div className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-brand-green">Фирма и Обект</h2>
                      <p className="text-[10px] text-brand-dark/50">Въведете детайлите на фирмата за авто-генериране на документи</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveFirm} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Наименование на Фирмата</label>
                        <input 
                          type="text" 
                          required
                          value={firmInfo.name} 
                          onChange={(e) => setFirmInfo({...firmInfo, name: e.target.value})} 
                          placeholder="напр. Ресторант Вечер ЕООД"
                          className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50 font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Булстат / ЕИК</label>
                        <input 
                          type="text" 
                          required
                          value={firmInfo.eik} 
                          onChange={(e) => setFirmInfo({...firmInfo, eik: e.target.value})} 
                          placeholder="напр. 207123456"
                          className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Адрес на обекта</label>
                      <input 
                        type="text" 
                        required
                        value={firmInfo.address} 
                        onChange={(e) => setFirmInfo({...firmInfo, address: e.target.value})} 
                        placeholder="напр. гр. Пловдив, ул. Главна 12"
                        className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Име на управител / МОЛ</label>
                        <input 
                          type="text" 
                          required
                          value={firmInfo.manager} 
                          onChange={(e) => setFirmInfo({...firmInfo, manager: e.target.value})} 
                          placeholder="напр. Иван Иванов"
                          className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-brand-dark uppercase tracking-wider block">Сфера на дейност (Ниша)</label>
                        <select 
                          value={firmInfo.niche} 
                          onChange={(e) => setFirmInfo({...firmInfo, niche: e.target.value})} 
                          className="w-full text-sm px-4 py-2.5 rounded-lg border border-brand-green/20 focus:outline-none focus:border-brand-gold transition-colors bg-brand-light/50 font-medium"
                        >
                          <option value="Заведение за хранене">Заведение за хранене (Ресторант/Кафе)</option>
                          <option value="Хранителен магазин">Хранителен магазин / Супермаркет</option>
                          <option value="Каравана или павилион">Подвижен обект / Каравана</option>
                          <option value="Пекарна или производство">Пекарна или Хранително Производство</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors cursor-pointer w-full"
                    >
                      Запази настройките на фирмата
                    </button>
                  </form>
                </div>
              )}

            </main>
          </div>
        </div>
      )}
    </div>
  );
}
