import Link from "next/link";
import Image from "next/image";
import { PlayCircle, CheckCircle, Award, BookOpen, Clock, Sparkles, ShieldCheck, HelpCircle, FileText, CheckSquare, Users } from "lucide-react";
import type { LibraryMaterial } from "./types";

function HaccpPrakticheskaSistemaPage() {
  return (
    <div className="space-y-12">
      {/* Hero / Main Value Prop */}
      <section className="relative bg-white border border-brand-green/10 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Онлайн практическо обучение
            </div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-wider animate-pulse shadow-sm">
              -50% Намалено в момента
            </div>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green leading-tight">
            Организирай правилно документацията и контрола в хранителния си обект
          </h2>
          <p className="text-sm text-brand-dark/70 leading-relaxed font-semibold mt-2">
            „Не е достатъчно да имаш документи. Трябва да можеш да докажеш реален контрол.“
          </p>
          <p className="text-sm text-brand-dark/70 leading-relaxed">
            Специално създадено за производители и търговци на храни, собственици и управители на хранителни обекти, магазини, заведения, складове и лица, подготвящи регистрация.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {[
              "ДХПП и НАССР записи",
              "Проследимост и мониторинг",
              "Вътрешен контрол",
              "Хигиенни практики",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs text-brand-dark/80 font-medium">
                <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Stats / Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: FileText, label: "Вечен достъп", desc: "Учете със собствено темпо" },
          { icon: Sparkles, label: "Реални примери", desc: "От официалния контрол" },
          { icon: ShieldCheck, label: "Без хаос", desc: "Работеща система, без фиктивни записи" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-brand-green/5 p-6 shadow-md flex items-start gap-4">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-xl shrink-0">
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-brand-green text-sm">{stat.label}</h4>
              <p className="text-[11px] text-brand-dark/60 leading-normal">{stat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Benefits / What you'll achieve */}
      <section className="bg-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-2xl space-y-6">
          <h3 className="font-serif text-2xl font-bold text-brand-gold">Представи си как още от утре:</h3>
          <div className="space-y-4 text-sm text-white/80">
            {[
              "знаеш какви записи трябва да се водят и как",
              "документацията е подредена и адекватна на дейността",
              "персоналът знае какво трябва да прави",
              "имаш реални доказателства за контрол",
              "намаляваш риска от глоби, предписания и напрежение при проверки"
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="leading-relaxed text-sm text-white">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonuses */}
      <section className="space-y-6">
        <div className="border-b border-brand-green/5 pb-3">
          <h2 className="font-serif text-2xl font-bold text-brand-green flex items-center gap-2.5">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><Award className="h-5 w-5" /></span>
            Какво получаваш към обучението?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: FileText,
              title: "БОНУС #1: Примерни записи и контролни форми",
              desc: "Ще ти помогнат по-лесно да организираш документацията и контрола в хранителния си обект."
            },
            {
              icon: CheckSquare,
              title: "БОНУС #2: Контролен чек-лист",
              desc: "За проверка дали документацията и записите в обекта са адекватни, актуални и подготвени за проверка."
            },
            {
              icon: BookOpen,
              title: "БОНУС #3: PDF практическо ръководство",
              desc: "Най-честите грешки при воденето на записи по ДХПП и НАССР и как да ги избегнете (базирано на реални несъответствия)."
            },
            {
              icon: Users,
              title: "БОНУС #4: Ексклузивен достъп до онлайн група",
              desc: "Среда за обмен на опит и надграждане на знанията с безплатни ресурси."
            }
          ].map((bonus, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-brand-gold/20 p-5 shadow-sm space-y-3">
              <h3 className="font-serif text-sm font-bold text-brand-green flex items-center gap-2">
                <bonus.icon className="h-5 w-5 text-brand-gold shrink-0" />
                {bonus.title}
              </h3>
              <p className="text-xs text-brand-dark/70 leading-relaxed">
                {bonus.desc}
              </p>
            </div>
          ))}
        </div>
        
        <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-2xl p-5 flex items-start gap-4 mt-4 shadow-sm">
          <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0" />
          <div>
            <h4 className="font-bold text-brand-green text-sm mb-1">БОНУС #5: Гаранция за 100% Възстановяване на парите</h4>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Ако след като преминеш обучението и приложиш показаните практически насоки не почувстваш по-голяма яснота, организация и увереност, ще възстановим заплатената сума.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="bg-brand-light rounded-3xl border border-brand-green/10 p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-xl font-bold text-brand-green text-center">За кого е подходящо това обучение?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {[
            "Производители и търговци на храни",
            "Собственици и управители на хранителни обекти",
            "Стартиращи хранителни бизнеси",
            "Лица, подготвящи регистрация по Закона за храните",
            "Персонал в производството и търговията с храни",
            "Отговорници по безопасност на храните",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-brand-green/5 shadow-sm">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
              <span className="text-xs font-medium text-brand-dark">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-brand-dark/60 max-w-2xl mx-auto">
          Не е необходимо да имаш задълбочени познания по документация. Необходимo е единствено желание да организираш по-добре контрола и документацията в своя обект.
        </p>
      </section>

      {/* Questions Section */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4 shadow-md">
        <HelpCircle className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green text-sm">Имате въпроси за курса?</p>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            Ако имате допълнителни въпроси преди покупка, можете да се свържете с нас от страницата за контакти.
          </p>
        </div>
      </section>

      <p className="text-center text-xs text-brand-dark/50">
        Искате да зададете въпрос директно?{" "}
        <Link href="/contact" className="text-brand-gold hover:underline font-bold">
          Пишете ни тук →
        </Link>
      </p>
    </div>
  );
}

export const haccpPrakticheskaSistema: LibraryMaterial = {
  slug: "haccp-prakticheska-sistema",
  title: "Обучение по разработване, въвеждане и прилагане на ДХПП и процедури (НАССР)",
  tagline:
    "Практическа система за реален контрол и спокойствие при проверки от ОДБХ. Включва 5 ценни бонуса.",
  priceEur: 29, // 56.73 lv
  originalPriceEur: 58,
  type: "pdf",
  category: "training",
  contentUrl: "#", // Add the course link here when available
  card: {
    cover: "/haccp-prakticheska-sistema.webp",
    badge: "-50% Отстъпка",
    accent: "gold",
  },
  page: HaccpPrakticheskaSistemaPage,
  metaDescription:
    "Онлайн практическо обучение по ДХПП и НАССР за хранителни обекти. Изгради реално работеща система и намали риска от глоби при проверки от ОДБХ.",
};
