import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  FileCheck,
  ClipboardList,
  Search,
  GraduationCap,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Clock,
  Scale,
  Check,
  ChevronRight,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema";
import { AREAS_SERVED, AUTHOR, BUSINESS } from "@/lib/siteConfig";

/**
 * Exact-match landing page for the highest-intent commercial query in this
 * market: "разработка и внедряване на HACCP / НАССР / ХАСЕП система".
 *
 * Deliberately a server component with zero client JS — every fact has to be
 * in the initial HTML, because the crawlers that feed answer engines mostly do
 * not execute JavaScript. The page is written answer-first (short extractable
 * paragraph, then scannable lists with concrete numbers and legal citations)
 * so a model can lift a complete, attributable claim from a single passage.
 */

const PATH = "/haccp-sistema";

const SUMMARY =
  "Д-р Данка Николова разработва и внедрява HACCP (ХАСЕП) системи и системи за самоконтрол за хранителни обекти в цяла България — заведения, магазини, производствени цехове, складове, кетъринг и подвижни обекти. Стандартна система се изготвя за 5 до 10 работни дни след първоначален одит на обекта и включва анализ на опасностите, определяне на критичните контролни точки, ДПХП процедури, мониторингови дневници и пълна документация за проверка от БАБХ.";

const DELIVERABLES = [
  {
    title: "Анализ на опасностите и ККТ",
    desc: "Пълен анализ на биологичните, химичните и физичните опасности по цялата технологична верига и определяне на критичните контролни точки с критични граници.",
    icon: Search,
  },
  {
    title: "Индивидуален HACCP план",
    desc: "План, изготвен по действителния технологичен поток на Вашия обект — не универсален шаблон. Включва блок-схеми, коригиращи действия и процедури за верификация.",
    icon: ClipboardList,
  },
  {
    title: "ДПХП и предпоставъчни програми",
    desc: "Добри хигиенни и производствени практики: почистване и дезинфекция, ДДД план, лична хигиена, работно облекло, входящ контрол, проследимост и управление на отпадъците.",
    icon: ShieldCheck,
  },
  {
    title: "Дневници по самоконтрол",
    desc: "Всички задължителни мониторингови дневници и записи — температурни режими, хигиена и дезинфекция, входящ контрол, здравни книжки, обучения — с инструкции за попълване.",
    icon: FileCheck,
  },
  {
    title: "Обучение на персонала",
    desc: "Практическо обучение на екипа на място или онлайн: кой какво записва, кога и защо, как се реагира при отклонение от критична граница.",
    icon: GraduationCap,
  },
  {
    title: "Поддръжка и актуализация",
    desc: "Актуализация при промяна в менюто, оборудването, технологичния поток или нормативната уредба, плюс отстраняване на предписания след инспекция.",
    icon: RefreshCw,
  },
];

const PROCESS = [
  {
    name: "Безплатна първоначална консултация",
    text: "Уточняваме типа обект, дейностите, асортимента и текущото състояние на документацията. Получавате конкретна оферта със срок и цена.",
  },
  {
    name: "Одит на обекта",
    text: "Оглед на място или онлайн: сграден фонд, работни потоци, оборудване, суровини, персонал. Тук се събират данните, върху които стъпва целият HACCP план.",
  },
  {
    name: "Разработване на системата",
    text: "Изготвяне на анализа на опасностите, HACCP плана, ДПХП процедурите, технологичните карти и пълния комплект дневници по самоконтрол за обекта.",
  },
  {
    name: "Внедряване и обучение на екипа",
    text: "Предаване на документацията, обучение на персонала как реално се води системата и настройка на записите така, че да издържат проверка.",
  },
  {
    name: "Придружаване при проверка и поддръжка",
    text: "Съдействие при инспекция от БАБХ/ОДБХ, отговор на предписания и последваща актуализация при всяка промяна в обекта или закона.",
  },
] as const;

const OBJECT_TYPES = [
  "Ресторанти, кафе-сладкарници, пицарии и заведения за бързо хранене",
  "Кетъринг компании и обекти за обществено хранене",
  "Магазини за храни, супермаркети, месарници и пекарни",
  "Производствени цехове — сладкарски, месни, млечни, хлебни изделия",
  "Складови бази за храни и логистични центрове",
  "Специализиран транспорт на храни и хладилна дистрибуция",
  "Подвижни обекти — каравани, фууд тръкове, павилиони",
  "Онлайн магазини за храни и обекти за хранителни добавки",
];

const LEGAL_BASIS = [
  {
    title: "Регламент (ЕО) № 852/2004",
    desc: "Европейската рамка за хигиена на храните — задължава всеки оператор да въведе и поддържа процедури, базирани на принципите на HACCP.",
  },
  {
    title: "Закон за храните",
    desc: "Националната уредба. По чл. 26 се подава уведомление за регистрация на обект за производство и търговия с храни в БАБХ.",
  },
  {
    title: "Регламент (ЕС) № 1169/2011",
    desc: "Предоставяне на информация за храните на потребителите — основата на етикетирането и на задължителното обозначаване на 14-те алергена.",
  },
];

const FAQS = [
  {
    question:
      "Каква е разликата между HACCP, НАССР и ХАСЕП — това една и съща система ли е?",
    answer:
      "Да, това е една и съща система. HACCP е английското съкращение (Hazard Analysis and Critical Control Points), НАССР е същото изписано с кирилица, а ХАСЕП е разпространената в България фонетична транскрипция. Срещат се и изписванията ХАСАП и НАССР система. Във всички случаи става дума за системата за анализ на опасностите и контрол на критичните точки, която е задължителна за всеки обект за храни.",
  },
  {
    question: "Колко време отнема разработването и внедряването на ХАСЕП система?",
    answer:
      "Стандартна HACCP (ХАСЕП) система и система за самоконтрол се разработва в рамките на 5 до 10 работни дни след провеждане на първоначалния одит на обекта. За големи производствени предприятия с комплексни технологични линии срокът се договаря индивидуално.",
  },
  {
    question: "Задължителна ли е HACCP системата за моя обект?",
    answer:
      "Да. Съгласно Закона за храните и Регламент (ЕО) № 852/2004 системата за управление на безопасността на храните, базирана на принципите на HACCP, е задължителна за всеки обект, който произвежда, съхранява, транспортира или търгува с храни — включително заведения, магазини, пекарни, складове, кетъринг и подвижни обекти.",
  },
  {
    question: "Какви са санкциите при липса на работеща система за самоконтрол?",
    answer:
      "При инспекция от БАБХ и констатирана липса на HACCP документация или неработеща система имуществените санкции за юридически лица започват от 1 000 € (около 2 000 лв.) и могат да достигнат до временно затваряне на обекта.",
  },
  {
    question: "Може ли системата да се разработи изцяло онлайн?",
    answer:
      "Да. Чрез онлайн консултации, видеовръзка и електронен обмен на данни системата може да бъде разработена, внедрена и актуализирана за обекти в цяла България. За производствени обекти и при подготовка за първоначална регистрация препоръчваме и оглед на място.",
  },
  {
    question: "Работите ли с обекти извън Плевен?",
    answer:
      "Да. Офисът е в гр. Плевен, но услугата се предоставя за обекти в цяла България — включително София, Пловдив, Варна, Бургас, Русе, Стара Загора и Благоевград, присъствено или онлайн.",
  },
  {
    question:
      "Какво включва актуализацията на съществуваща HACCP система?",
    answer:
      "Актуализацията е необходима при промяна в менюто или асортимента, ново оборудване, промяна в технологичния поток или в нормативната уредба. Включва преглед на настоящите процедури, отстраняване на предписания от БАБХ и добавяне на нови мониторингови форми.",
  },
];

export const metadata: Metadata = {
  title:
    "Разработка и внедряване на HACCP (ХАСЕП) система — за 5–10 работни дни",
  description:
    "Разработка и внедряване на HACCP / НАССР / ХАСЕП система и система за самоконтрол за хранителни обекти в цяла България. Анализ на опасностите и ККТ, ДПХП процедури, дневници и пълна документация за БАБХ. Срок 5–10 работни дни. Д-р Данка Николова, 27 години опит в официалния контрол.",
  keywords: [
    "разработка и внедряване на HACCP система",
    "внедряване на ХАСЕП система",
    "разработка на ХАСЕП система",
    "НАССР система",
    "ХАСЕП система",
    "ХАСАП система",
    "HACCP система цена",
    "система за самоконтрол",
    "HACCP консултант България",
    "ХАСЕП документация БАБХ",
    "HACCP Плевен",
    "HACCP София",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title:
      "Разработка и внедряване на HACCP (ХАСЕП) система | Д-р Данка Николова",
    description:
      "HACCP / ХАСЕП система и система за самоконтрол за обекти в цяла България. Срок 5–10 работни дни, пълна документация за БАБХ, 27 години опит в официалния контрол.",
    url: `https://www.haccpspokoystvie.bg${PATH}`,
    locale: "bg_BG",
    type: "website",
  },
};

export default function HaccpSistemaPage() {
  return (
    <div className="min-h-screen pb-20">
      <JsonLd
        data={[
          serviceSchema({
            name: "Разработка и внедряване на HACCP (ХАСЕП) система",
            description: SUMMARY,
            path: PATH,
            serviceType: "Разработка и внедряване на HACCP система",
            image: "/haccp-prakticheska-sistema.webp",
          }),
          howToSchema({
            name: "Как протича внедряването на HACCP (ХАСЕП) система",
            description:
              "Петте стъпки от първоначалната консултация до готова, внедрена система за самоконтрол, приета при проверка от БАБХ.",
            totalTime: "P10D",
            steps: PROCESS,
          }),
          faqSchema(FAQS),
          webPageSchema({
            name: "Разработка и внедряване на HACCP (ХАСЕП) система",
            description: SUMMARY,
            path: PATH,
          }),
          breadcrumbSchema([
            { name: "Начало", path: "/" },
            { name: "Услуги", path: "/services" },
            { name: "Разработка и внедряване на HACCP система", path: PATH },
          ]),
        ]}
      />

      <PageHero
        badgeText="Основна услуга"
        title="Разработка и внедряване на HACCP (ХАСЕП) система"
        subtitle="HACCP / НАССР / ХАСЕП система и система за самоконтрол за хранителни обекти в цяла България — изготвена по Вашия технологичен поток и внедрена така, че да работи при реална проверка."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 mt-10">
        {/* Answer-first summary. Kept as one self-contained paragraph on
            purpose: it has to make sense when quoted out of context. */}
        <section className="bg-brand-light border-l-4 border-brand-gold rounded-xl p-6 sm:p-7 shadow-sm">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-green mb-3">
            Накратко
          </h2>
          <p className="text-sm sm:text-base text-brand-dark/85 leading-relaxed">
            {SUMMARY}
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-brand-green/10">
            <div>
              <dt className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">
                Срок
              </dt>
              <dd className="font-serif text-lg font-bold text-brand-green">
                5–10 работни дни
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">
                Покритие
              </dt>
              <dd className="font-serif text-lg font-bold text-brand-green">
                Цяла България
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-widest text-brand-dark/50">
                Опит
              </dt>
              <dd className="font-serif text-lg font-bold text-brand-green">
                {AUTHOR.experienceYears} години в контрола
              </dd>
            </div>
          </dl>
        </section>

        {/* What the system contains */}
        <section className="space-y-6">
          <div className="border-b border-brand-green/10 pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
              Обхват на услугата
            </span>
            <h2 className="font-serif text-2xl font-bold text-brand-green">
              Какво включва внедряването на HACCP (ХАСЕП) система
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DELIVERABLES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-brand-green/10 rounded-xl p-5 shadow-sm space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-brand-green/5 border border-brand-green/10 text-brand-green rounded-lg shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-serif text-base font-bold text-brand-green leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-brand-dark/75 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Process — mirrors the HowTo node above */}
        <section className="space-y-6">
          <div className="border-b border-brand-green/10 pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
              Процес
            </span>
            <h2 className="font-serif text-2xl font-bold text-brand-green">
              Как протича внедряването — стъпка по стъпка
            </h2>
          </div>

          <ol className="space-y-4">
            {PROCESS.map((step, i) => (
              <li
                key={step.name}
                className="flex gap-4 bg-white border border-brand-green/10 rounded-xl p-5 shadow-sm"
              >
                <span className="shrink-0 h-8 w-8 rounded-full bg-brand-green text-brand-gold font-serif font-black flex items-center justify-center text-sm">
                  {i + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-brand-green">
                    {step.name}
                  </h3>
                  <p className="text-xs text-brand-dark/75 leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="text-xs text-brand-dark/60 flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-gold shrink-0" />
            Стандартен срок от одита до предадена система: 5–10 работни дни. За
            големи производствени предприятия срокът се договаря индивидуално.
          </p>
        </section>

        {/* Who it is for */}
        <section className="space-y-6">
          <div className="border-b border-brand-green/10 pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
              За кого
            </span>
            <h2 className="font-serif text-2xl font-bold text-brand-green">
              Обекти, за които разработваме ХАСЕП система
            </h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
            {OBJECT_TYPES.map((type) => (
              <li
                key={type}
                className="flex items-start gap-2 text-sm text-brand-dark/80 leading-snug"
              >
                <Check
                  className="h-4 w-4 text-brand-gold shrink-0 mt-0.5"
                  strokeWidth={2.5}
                />
                {type}
              </li>
            ))}
          </ul>
        </section>

        {/* Legal basis */}
        <section className="space-y-6">
          <div className="border-b border-brand-green/10 pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
              Нормативна база
            </span>
            <h2 className="font-serif text-2xl font-bold text-brand-green">
              На какво стъпва системата
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LEGAL_BASIS.map((law) => (
              <div
                key={law.title}
                className="bg-white border border-brand-green/10 rounded-xl p-5 shadow-sm space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-brand-gold shrink-0" />
                  <h3 className="font-serif text-sm font-bold text-brand-green leading-snug">
                    {law.title}
                  </h3>
                </div>
                <p className="text-xs text-brand-dark/75 leading-relaxed">
                  {law.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage */}
        <section className="space-y-4">
          <div className="border-b border-brand-green/10 pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
              Къде работим
            </span>
            <h2 className="font-serif text-2xl font-bold text-brand-green">
              Обслужвани райони
            </h2>
          </div>
          <p className="text-sm text-brand-dark/80 leading-relaxed">
            Услугата се предоставя присъствено и онлайн за обекти в{" "}
            {AREAS_SERVED.join(", ")}. Офисът е в гр.{" "}
            {BUSINESS.addressLocality}, {BUSINESS.streetAddress}.
          </p>
        </section>

        {/* FAQ — plain <details> so the answers are in the HTML without JS */}
        <section className="space-y-5">
          <div className="border-b border-brand-green/10 pb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold block">
              Въпроси и отговори
            </span>
            <h2 className="font-serif text-2xl font-bold text-brand-green">
              Често задавани въпроси за HACCP / ХАСЕП системите
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group bg-white border border-brand-green/10 rounded-xl px-5 py-4 shadow-sm"
              >
                <summary className="font-serif text-sm sm:text-base font-bold text-brand-green cursor-pointer list-none flex items-start justify-between gap-3">
                  {faq.question}
                  <ChevronRight className="h-4 w-4 text-brand-gold shrink-0 mt-1 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed mt-3 pt-3 border-t border-brand-green/10">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA + NAP, repeated as text so it is extractable */}
        <section className="bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] text-white rounded-2xl p-7 sm:p-9 shadow-xl border border-brand-gold/20 space-y-5">
          <h2 className="font-serif text-2xl font-bold text-white leading-tight">
            Заявете разработка на HACCP (ХАСЕП) система
          </h2>
          <p className="text-sm text-white/80 leading-relaxed max-w-2xl">
            Първоначалната консултация е безплатна. Свържете се за конкретна
            оферта със срок и цена за Вашия обект — системата се изготвя лично
            от {AUTHOR.name}, {AUTHOR.jobTitle.toLowerCase()} с{" "}
            {AUTHOR.experienceYears} години опит в официалния контрол.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/85">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-gold shrink-0" />
              <a href={AUTHOR.phoneTel} className="hover:text-brand-gold">
                {AUTHOR.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-brand-gold shrink-0" />
              <a
                href={`mailto:${AUTHOR.email}`}
                className="hover:text-brand-gold break-all"
              >
                {AUTHOR.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-gold shrink-0" />
              гр. {BUSINESS.addressLocality}
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/contact?service=%D0%A0%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0%20%D0%BD%D0%B0%20HACCP%20%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0"
              className="px-6 py-3 text-xs font-black uppercase tracking-widest rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark shadow-md transition-all text-center"
            >
              Заявете оферта
            </Link>
            <Link
              href="/consultations"
              className="px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white transition-all text-center"
            >
              Запишете консултация
            </Link>
            <Link
              href="/services"
              className="px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 text-white/90 transition-all text-center"
            >
              Всички услуги
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
