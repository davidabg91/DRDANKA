"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  CheckCircle, 
  Award, 
  Building, 
  Users, 
  ShoppingBag, 
  Download, 
  FileText, 
  Check, 
  ArrowRight, 
  Building2 
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  duration: string;
  price: string;
  target: string;
  desc: string;
  features: string[];
}

const COURSES: Course[] = [
  {
    id: "haccp-basics",
    title: "Основи на хигиената и НАССР за персонал",
    duration: "4 академични часа",
    price: "80 €",
    target: "Готвачи, сервитьори, продавачи, помощен персонал",
    desc: "Задължително обучение съгласно българското законодателство. Запознава служителите с хигиенните изисквания, избягване на кръстосано замърсяване и правилно водене на дневниците по самоконтрол.",
    features: [
      "Нормативни изисквания по Закона за храните",
      "Лична хигиена и хигиенни практики на работното място",
      "Управление на отпадъци и дезинфекционни режими",
      "Официален Сертификат за проведено обучение",
    ],
  },
  {
    id: "babkh-prep",
    title: "Подготовка за инспекции от БАБХ",
    duration: "6 академични часа",
    price: "120 €",
    target: "Собственици на заведения, управители, отговорници по качеството",
    desc: "Практически курс за управление на процеса при проверка от инспектори. Какви документи се изискват първо, какви дневници трябва да са попълнени днес и как да реагираме при констатиране на предписания.",
    features: [
      "Списък с най-често проверяваните документи от БАБХ",
      "Правилно водене и архивиране на HACCP записите",
      "Права и задължения на бизнеса по време на проверка",
      "Казуси и примерни отговори при предписания",
    ],
  },
  {
    id: "safety-culture",
    title: "Култура на безопасност на храните (Food Safety)",
    duration: "8 академични часа",
    price: "200 €",
    target: "Мениджъри по качеството, управители на производства и фабрики",
    desc: "Внедряване на съвременните европейски изисквания за Food Safety Culture съгласно Регламент (ЕС) 2021/382. Развиване на ангажираност на персонала към стандартите за качество.",
    features: [
      "Теория и изисквания на Регламент 382/2021",
      "Методи за оценка на културата на безопасност в предприятието",
      "Комуникация, обучение и обратна връзка от служителите",
      "Изготвяне на план за подобряване на безопасността",
    ],
  },
];

interface MaterialPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
}

const MATERIAL_PACKAGES: MaterialPackage[] = [
  {
    id: "pkg-basic",
    name: "Пакет „Хигиенни изисквания и алергени“ (Базов)",
    price: "25 €",
    description: "Основни писмени наръчници и шаблони за бързо реагиране и маркиране на алергени.",
    features: [
      "PDF наръчник за управление на алергени",
      "Шаблони за обозначаване на алергени в менюта",
      "Базов чек-лист за ежедневна хигиена на персонала",
      "Примерни инструкции за дезинфекция на инвентар",
    ],
  },
  {
    id: "pkg-standard",
    name: "Пакет „Етикетиране и ДПП за търговия“ (Стандарт)",
    price: "45 €",
    description: "Подробно видео обучение и писмени процедури за обекти на дребно.",
    badge: "Най-популярен",
    features: [
      "Всичко от Базовия пакет",
      "Видео обучение по Регламент (ЕС) 1169/2011 за етикетиране (60 мин)",
      "Процедури за Добри Производствени Практики (ДПП)",
      "Температурни чек-листове за входящ контрол",
    ],
  },
  {
    id: "pkg-premium",
    name: "Пълен пакет „БАБХ Съвместимост & НАССР Дневници“",
    price: "75 €",
    description: "Пълен комплект документи, видео лекции и шаблони за попълване без нужда от скъпи консултанти.",
    features: [
      "Всичко от Стандартния пакет",
      "Готови шаблони за НАССР дневници (дневни форми)",
      "Видео разяснения за вярно попълване стъпка по стъпка",
      "Чек-лист за вътрешен самоодит преди проверка от БАБХ",
      "Безплатни актуализации на материалите за 12 месеца",
    ],
  },
];

export default function Training() {
  const [selectedPkg, setSelectedPkg] = useState<MaterialPackage | null>(null);
  const [orderStep, setOrderStep] = useState(1); // 1 = Selection, 2 = Form, 3 = Success
  const [checkoutInfo, setCheckoutInfo] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    eik: "",
    needInvoice: false,
  });

  const handleSelectPackage = (pkg: MaterialPackage) => {
    setSelectedPkg(pkg);
    setOrderStep(2);
    setTimeout(() => {
      document.getElementById("checkout-form-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCheckoutInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutInfo.name || !checkoutInfo.email || !checkoutInfo.phone) {
      alert("Моля, попълнете основните полета за контакти.");
      return;
    }
    setOrderStep(3);
    setTimeout(() => {
      document.getElementById("checkout-form-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="bg-brand-light pb-24">
      {/* Page Header */}
      <section className="bg-brand-green py-20 text-center relative overflow-hidden border-b border-brand-gold/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-75 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase text-brand-gold tracking-widest block">
            ОБУЧЕНИЕ И МАТЕРИАЛИ
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Обучения и Готови Практически Материали
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Осигурете спазването на добрите хигиенни практики. Заявете обучение за персонала или купете готови писмени наръчници и видео обучения за самоподготовка.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Courses */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Certification Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="text-xs font-bold uppercase text-brand-gold tracking-wider block mb-2">
              ЗАЩО Е ЗАДЪЛЖИТЕЛНО?
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green mb-6">
              Обучението на персонала – ключ към спокойствие при проверка
            </h2>
            <p className="text-sm text-brand-dark/80 leading-relaxed mb-6">
              Съгласно Закона за храните, управителите на хранителни обекти са длъжни да осигурят периодично обучение на персонала по въпросите на безопасността и хигиената на храните. Липсата на писмено доказателство (Удостоверение/Сертификат) за такова обучение се счита за нарушение и се наказва с глоба от БАБХ.
            </p>
            <div className="space-y-3.5">
              <div className="flex items-start text-xs sm:text-sm text-brand-dark/95">
                <CheckCircle className="h-5 w-5 text-brand-gold mr-3 shrink-0" />
                <span>Сертификати, напълно съобразени с изискванията на БАБХ и МЗ.</span>
              </div>
              <div className="flex items-start text-xs sm:text-sm text-brand-dark/95">
                <CheckCircle className="h-5 w-5 text-brand-gold mr-3 shrink-0" />
                <span>Опции за присъствени обучения на място в обекта или онлайн курсове.</span>
              </div>
              <div className="flex items-start text-xs sm:text-sm text-brand-dark/95">
                <CheckCircle className="h-5 w-5 text-brand-gold mr-3 shrink-0" />
                <span>Удобни интерактивни презентации и практически примери за Вашата ниша.</span>
              </div>
            </div>
          </div>

          {/* Video Lessons Embed Card */}
          <div className="bg-white border border-brand-green/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="aspect-video rounded-xl overflow-hidden border border-brand-green/15 relative bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/HIllfSOoUIg"
                title="3 Стъпки за регистрация на производство, преработка и дистрибуция на храни от животински произход"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-6">
              <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block mb-1">
                Видео наръчник
              </span>
              <h3 className="font-serif text-sm sm:text-base font-bold text-brand-green leading-snug">
                3 стъпки за регистрация на производство, преработка и дистрибуция на храни от животински произход
              </h3>
            </div>
            <div className="mt-4 flex justify-between items-center text-xs border-t border-brand-green/5 pt-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-4.5 w-4.5 text-brand-gold" />
                <span className="font-semibold text-brand-dark">Видео Лекция</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4.5 w-4.5 text-brand-gold" />
                <span className="font-semibold text-brand-green">БАБХ Стандарт</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Courses Section */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
              Специализирани курсове по безопасност за екипи
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/60 leading-relaxed">
              Обучете служителите си и получете валидни сертификати пред БАБХ.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {COURSES.map((course, i) => (
              <div
                key={i}
                className="bg-white border border-brand-green/5 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-brand-gold/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-lg font-bold text-brand-green leading-snug pr-2">
                      {course.title}
                    </h3>
                    <span className="text-lg font-bold text-brand-gold whitespace-nowrap">{course.price}</span>
                  </div>
                  <div className="space-y-1 mb-5 text-[11px] font-semibold text-brand-dark/50 uppercase tracking-wide">
                    <div className="flex items-center">
                      <span className="text-brand-gold mr-1">Времетраене:</span> {course.duration}
                    </div>
                    <div className="flex items-center">
                      <span className="text-brand-gold mr-1">Подходящо за:</span> {course.target}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed mb-6">
                    {course.desc}
                  </p>
                  <div className="border-t border-brand-green/5 pt-5 mb-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-dark mb-3">
                      Основни модули:
                    </h4>
                    <ul className="space-y-2 text-xs text-brand-dark/80">
                      {course.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-brand-gold mr-2.5 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Link
                  href={`/contact?subject=live-training-${course.id}`}
                  className="w-full text-center block py-3 px-4 bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold uppercase tracking-wider rounded transition-all duration-300 cursor-pointer shadow-md hover:shadow-brand-green/20"
                >
                  Заяви обучение
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Group Inquiry Banner */}
        <div className="bg-brand-green text-white border border-brand-gold/20 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-28">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-brand-gold/10 border border-brand-gold/30 text-xs font-semibold text-brand-gold uppercase tracking-wider">
                <Building className="h-3.5 w-3.5 mr-1.5" /> КОРПОРАТИВНИ ОБУЧЕНИЯ
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-bold leading-tight">
                Групови обучения за Вашия ресторант или фабрика?
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Предлагаме специални условия и преференциални цени за заведения с повече от 5 служители или индустриални производства. Нашите лектори могат да проведат обучението на място при Вас или в удобен за екипа Ви часови диапазон онлайн.
              </p>
              <div className="flex space-x-6 text-xs text-white/70 pt-2">
                <span className="flex items-center">
                  <Users className="h-4.5 w-4.5 mr-2 text-brand-gold" />
                  Индивидуален фокус
                </span>
                <span className="flex items-center">
                  <GraduationCap className="h-4.5 w-4.5 mr-2 text-brand-gold" />
                  Валидни дипломи
                </span>
              </div>
            </div>
            <div className="lg:col-span-5 text-center lg:text-right">
              <Link
                href="/contact?type=corporate-training"
                className="inline-block px-8 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest transition-all rounded shadow-lg cursor-pointer"
              >
                Поискайте оферта за екип
              </Link>
            </div>
          </div>
        </div>

        {/* Digital Products Section (replaces Live Booking Calendar) */}
        <div id="digital-materials-section" className="space-y-12 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase text-brand-gold tracking-widest block">
              ДИГИТАЛНА КНИЖАРНИЦА ЗА ХРАНИТЕЛЕН БИЗНЕС
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-green">
              Готови Писмени Наръчници и Видео Обучения
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/60 leading-relaxed">
              Спестете време и разходи. Изберете готов пакет с писмени процедури, видео указания и шаблони за самостоятелно внедряване и подготовка на Вашите обекти.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {MATERIAL_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white border rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  selectedPkg?.id === pkg.id 
                    ? "border-brand-gold shadow-xl shadow-brand-gold/5 scale-[1.02]" 
                    : "border-brand-green/5 shadow-md hover:shadow-lg"
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-brand-gold text-[10px] font-bold text-brand-dark uppercase tracking-wider shadow">
                    {pkg.badge}
                  </span>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-brand-green mb-2 leading-snug">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-brand-dark/60 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="flex items-baseline space-x-1.5 py-4 border-y border-brand-green/5">
                    <span className="text-3xl font-bold text-brand-green">{pkg.price}</span>
                    <span className="text-[10px] text-brand-dark/40 font-semibold uppercase tracking-wider">Еднократно плащане</span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-dark mb-1">
                      Какво включва пакетът:
                    </h4>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start text-xs text-brand-dark/85">
                          <Check className="h-4 w-4 text-brand-gold mr-2.5 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleSelectPackage(pkg)}
                    className={`w-full py-3 text-center text-xs font-bold uppercase tracking-wider rounded transition-all duration-300 flex items-center justify-center cursor-pointer ${
                      selectedPkg?.id === pkg.id 
                        ? "bg-brand-gold text-brand-dark shadow-md"
                        : "bg-brand-green hover:bg-brand-green/90 text-white hover:shadow-md"
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Поръчай пакета
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Persuasive copy section to convert digital buyers */}
          <div className="bg-white border border-brand-green/10 rounded-2xl p-8 sm:p-12 shadow-md grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mb-3">
                  Защо само с информация от интернет често се стига до грешки и откази при регистрация?
                </h3>
                <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed">
                  Информацията, която ще намерите онлайн, е разпокъсана, обща и често остаряла. Законите са написани формално и не показват как да приложите изискванията на практика за Вашия конкретен обект. Няма ясна система, която да Ви покаже какво да направите първо, какво следва и как да избегнете пропуските, които водят до отказ от БАБХ.
                </p>
              </div>

              <div>
                <h4 className="font-serif text-base font-bold text-brand-green mb-3">
                  Тези материали са за Вас, ако:
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-brand-dark/85">
                  <li className="flex items-start">
                    <span className="text-brand-gold mr-2 font-bold">✔</span>
                    <span>Искате да стартирате бизнес с храни, но не знаете откъде да започнете.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-gold mr-2 font-bold">✔</span>
                    <span>Искате да сте сигурни, че обектът Ви отговаря на изискванията на БАБХ.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-gold mr-2 font-bold">✔</span>
                    <span>Искате ясен план стъпка по стъпка, вместо да се лутате в закони и документи.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-gold mr-2 font-bold">✔</span>
                    <span>Се притеснявате да не допуснете грешки, които водят до отказ или забавяния.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6 lg:border-l lg:border-brand-green/10 lg:pl-12">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mb-3">
                  Какво ще спестите и какво ще получите?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      ⚠️ Какво ще избегнете:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-brand-dark/85">
                      <li>• Забавяне с месеци при регистрацията</li>
                      <li>• Преустройство на обекта или оборудването</li>
                      <li>• Излишни разходи за нови документи</li>
                      <li>• Загуба на мотивация и нерви още в началото</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-brand-green uppercase tracking-wider">
                      🎯 Какво ще получите:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-brand-dark/85">
                      <li>• Пълна яснота какво се изисква и как да го приложите</li>
                      <li>• Конкретни стъпки, които да следвате лесно</li>
                      <li>• Готови шаблони за попълване</li>
                      <li>• Увереност, че правите нещата правилно</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-brand-light/50 border border-brand-green/5 rounded-xl p-5 text-xs sm:text-sm text-brand-dark/85 leading-relaxed">
                <span className="font-bold text-brand-green block mb-1">🔐 Краен резултат:</span>
                Ще посрещнете проверката по регистрация спокойно — не защото се надявате, че всичко е наред, а защото знаете, че сте подготвени както трябва. Ще разберете какво реално гледат инспекторите и как да преминете през БАБХ без проблеми.
              </div>
            </div>
          </div>

          {/* Checkout Form Container (Shows step 2 and 3 dynamic checkout content) */}
          {selectedPkg && (
            <div 
              id="checkout-form-section" 
              className="mt-16 bg-white border border-brand-green/10 rounded-2xl shadow-xl overflow-hidden max-w-3xl mx-auto scroll-mt-24"
            >
              {/* Checkout Header */}
              <div className="bg-brand-green px-6 sm:px-8 py-5 border-b border-brand-gold/20 flex justify-between items-center text-white">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold">
                    {orderStep === 3 ? "Поръчката е завършена" : "Оформяне на Вашата поръчка"}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-brand-gold font-medium uppercase tracking-wider mt-0.5">
                    {orderStep === 3 ? "Благодарим Ви за доверието!" : `Избран продукт: ${selectedPkg.name}`}
                  </p>
                </div>
                <span className="text-xs font-bold text-brand-gold">
                  {orderStep === 3 ? "Стъпка 3 от 3" : "Стъпка 2 от 3"}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                {/* Step 2: Contact Form & Invoice */}
                {orderStep === 2 && (
                  <form onSubmit={handleSubmitOrder} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                          Име и фамилия <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={checkoutInfo.name}
                          onChange={handleInputChange}
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
                          value={checkoutInfo.phone}
                          onChange={handleInputChange}
                          placeholder="+359 888 123 456"
                          className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                        Имейл адрес <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={checkoutInfo.email}
                        onChange={handleInputChange}
                        placeholder="ivan.petrov@example.com"
                        className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all"
                        required
                      />
                      <p className="text-[10px] text-brand-dark/45 mt-1.5">
                        На този имейл ще получите фактурата и материалите за сваляне.
                      </p>
                    </div>

                    {/* Invoice Request Checkbox */}
                    <div className="border-t border-brand-green/5 pt-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="needInvoice"
                          checked={checkoutInfo.needInvoice}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-brand-green/10 text-brand-green focus:ring-brand-gold cursor-pointer"
                        />
                        <span className="text-xs font-semibold text-brand-dark/80 uppercase tracking-wide">
                          Желая да ми бъде издадена фактура на фирма
                        </span>
                      </label>
                    </div>

                    {/* Company Invoicing Fields */}
                    {checkoutInfo.needInvoice && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-brand-light/35 border border-brand-green/5 rounded-xl p-4 animate-fadeIn">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                            Име на фирма
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            value={checkoutInfo.companyName}
                            onChange={handleInputChange}
                            placeholder="Фирма ООД"
                            className="w-full bg-white border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:outline-none transition-all"
                            required={checkoutInfo.needInvoice}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                            ЕИК / Булстат
                          </label>
                          <input
                            type="text"
                            name="eik"
                            value={checkoutInfo.eik}
                            onChange={handleInputChange}
                            placeholder="123456789"
                            className="w-full bg-white border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:outline-none transition-all"
                            required={checkoutInfo.needInvoice}
                          />
                        </div>
                      </div>
                    )}

                    {/* Cost summary card */}
                    <div className="bg-brand-light border border-brand-green/5 rounded-xl p-4 text-xs space-y-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-brand-dark/50">Продукт:</span>
                        <span className="text-brand-green">{selectedPkg.name}</span>
                      </div>
                      <div className="flex justify-between border-t border-brand-green/5 pt-2 font-bold text-sm">
                        <span className="text-brand-dark/50">Обща сума:</span>
                        <span className="text-brand-gold">{selectedPkg.price}</span>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-brand-green/5">
                      <button
                        type="button"
                        onClick={() => setSelectedPkg(null)}
                        className="px-5 py-2.5 border border-brand-green/20 text-brand-green text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-green/5 transition-colors cursor-pointer"
                      >
                        Отказ
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3 bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center cursor-pointer shadow-md hover:shadow-brand-green/20"
                      >
                        Завърши поръчката
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Success Screen */}
                {orderStep === 3 && (
                  <div className="text-center py-8 space-y-6">
                    <div className="h-16 w-16 bg-brand-gold/10 border border-brand-gold/30 rounded-full flex items-center justify-center mx-auto text-brand-gold animate-bounce">
                      <Check className="h-8 w-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-serif text-2xl font-bold text-brand-green">
                        Поръчката е регистрирана!
                      </h4>
                      <p className="text-xs sm:text-sm text-brand-dark/85 max-w-lg mx-auto leading-relaxed">
                        Изпратихме потвърждение и проформа фактура за плащане на имейл адрес <span className="font-semibold text-brand-green">{checkoutInfo.email}</span>.
                      </p>
                      <p className="text-xs text-brand-dark/60 max-w-md mx-auto leading-relaxed mt-2">
                        След получаване на плащането по банков път, ще получите автоматичен линк за незабавно сваляне на всички материали и видео обучението на същия имейл адрес.
                      </p>
                    </div>

                    {/* Receipt Details Card */}
                    <div className="bg-brand-light max-w-md mx-auto rounded-xl p-5 border border-brand-green/5 text-xs text-left space-y-2 mb-6">
                      <div className="flex justify-between">
                        <span className="text-brand-dark/50 uppercase">Купувач:</span>
                        <span className="font-semibold text-brand-dark">{checkoutInfo.name}</span>
                      </div>
                      {checkoutInfo.needInvoice && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-brand-dark/50 uppercase">Фирма:</span>
                            <span className="font-semibold text-brand-dark">{checkoutInfo.companyName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-brand-dark/50 uppercase">ЕИК:</span>
                            <span className="font-semibold text-brand-dark">{checkoutInfo.eik}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-brand-dark/50 uppercase">Продукт:</span>
                        <span className="font-semibold text-brand-dark text-right max-w-[200px] leading-tight block">
                          {selectedPkg.name}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-brand-green/5 pt-2">
                        <span className="text-brand-dark/50 uppercase font-semibold">Сума за плащане:</span>
                        <span className="font-bold text-brand-gold">{selectedPkg.price}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPkg(null);
                        setOrderStep(1);
                        setCheckoutInfo({
                          name: "",
                          email: "",
                          phone: "",
                          companyName: "",
                          eik: "",
                          needInvoice: false,
                        });
                      }}
                      className="px-6 py-2.5 bg-brand-green text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-brand-green/90 transition-colors cursor-pointer"
                    >
                      Към материалите
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
