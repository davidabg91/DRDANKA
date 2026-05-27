import Link from "next/link";
import { CheckCircle, BookOpen, AlertTriangle, ShieldCheck, FileText, Sparkles, Scale, ShieldAlert } from "lucide-react";
import type { LibraryMaterial } from "./types";

function EtiketiraneKontrolZashtitaPage() {
  return (
    <div className="space-y-12">
      {/* Quote-style intro */}
      <section className="relative bg-white border-l-4 border-brand-gold rounded-r-3xl p-6 sm:p-10 shadow-md">
        <Sparkles className="absolute top-6 right-6 h-5 w-5 text-brand-gold/40" />
        <p className="font-serif italic text-lg sm:text-xl text-brand-green leading-relaxed">
          „Този наръчник е Вашата персонална защита при БАБХ проверки. Той събира не просто текстовете от закона, а практическия начин да организирате етикетирането си така, че да избегнете глоби, забавяния и изземване на стока.“
        </p>
        <p className="mt-4 text-sm font-bold text-brand-dark/60 uppercase tracking-wider">— д-р Данка Николова</p>
      </section>

      {/* Why Module 6 is critical */}
      <section className="bg-gradient-to-br from-brand-green/95 to-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-dark flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-bold">Защита при проверки и санкции</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Най-ценната част от наръчника е **Модул 6**, посветен на реалната практика на инспекциите. В него споделям подробен чек-лист на това, което инспекторите проверяват най-често, как квалифицират несъответствията и как правилно да се държите по време и след проверка, за да сведете до минимум риска от тежки актове и глоби.
            </p>
          </div>
        </div>
      </section>

      {/* Modules Syllabus */}
      <section className="space-y-6">
        <div className="border-b border-brand-green/5 pb-3">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-2.5">
            <span className="p-2 bg-brand-gold/10 text-brand-gold rounded-xl"><BookOpen className="h-5 w-5" /></span>
            Съдържание на наръчника
          </h2>
          <p className="text-xs text-brand-dark/50 mt-1">Детайлно структуриран в 6 основни и един допълнителен модул</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Модул 1: Основи на етикетирането",
              desc: "Въведение и значение на информацията за храните. Нормативна рамка на Регламент (ЕС) № 1169/2011. Принципи при предоставяне на данни и забрана за подвеждане на потребителя.",
            },
            {
              title: "Модул 2: Задължителни реквизити",
              desc: "Наименование на храната, списък на съставките, нетно количество, срок на годност (датировка), условия за съхранение, име и адрес на оператора, страна на произход и партида (LOT).",
            },
            {
              title: "Модул 3: Изключения и нетипични казуси",
              desc: "Общи принципи и легални изключения от изискванията за описване на съставките, QUID количествено изразяване, срокове на годност при специфични храни и по-редки хипотези.",
            },
            {
              title: "Модул 4: Хранителна стойност",
              desc: "Кога обявяването на хранителната стойност е задължително и кои са изключенията. Задължителни елементи в таблицата, начини на изчисляване (лабораторно срещу калкулативно) и чести грешки.",
            },
            {
              title: "Модул 5: Хранителни и здравни твърдения",
              desc: "Понятия и правила за използване на твърдения за ползи върху здравето. Рискове при прикрити внушения, разрешени и забранени послания, и санкционна практика.",
            },
            {
              title: "Модул 6: Практика, контрол и защита",
              desc: "Какво проверяват БАБХ най-често. Чек-лист на инспектора, типични несъответствия и техните санкции. Подготовка, поведение по време на одит и писмена защита след него.",
            },
          ].map((mod, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-brand-green/5 p-5 shadow-sm space-y-2 hover:border-brand-gold/25 transition-all">
              <h3 className="font-serif text-sm font-bold text-brand-green flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-green/5 text-brand-green text-[10px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                {mod.title}
              </h3>
              <p className="text-xs text-brand-dark/70 leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Extra Module Info */}
      <section className="bg-amber-50 border border-brand-gold/25 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-serif text-base font-bold text-brand-green flex items-center gap-2">
          <span className="p-1.5 bg-brand-gold/20 text-brand-gold rounded-lg"><Sparkles className="h-4 w-4" /></span>
          Допълнителен Модул: Приложение III
        </h3>
        <p className="text-xs text-brand-dark/75 leading-relaxed">
          Извън стандартните правила, Регламентът изисква специфични допълнителни обозначения за определени групи храни. В това ръководство ще откриете пълно описание и правила за:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-brand-dark/80">
          {[
            "Храни, опаковани в защитна атмосфера",
            "Храни, съдържащи подсладители",
            "Продукти със сладък корен (глициризин)",
            "Напитки и храни с високо съдържание на кофеин",
            "Замразено месо, заготовки и рибни продукти",
            "Храни с добавени фитостероли и фитостаноли",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 font-medium">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* For whom */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center"><Scale className="h-5 w-5" /></span>
          За кого е предназначен?
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Производители на храни и пакетирани продукти",
            "Собственици на обекти за обществено хранене и кухни",
            "QA мениджъри и технолози в хранителната индустрия",
            "Дистрибутори и вносители на хранителни стоки",
            "Всеки стартиращ бизнес, който създава нови етикети",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-brand-dark/85 bg-white rounded-xl border border-brand-green/5 p-3">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Trust & Authorship */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4 shadow-md">
        <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-brand-green text-sm">Професионален наръчник от Академия „Спокоен хранителен бизнес“</p>
          <p className="text-xs text-brand-dark/60 leading-relaxed">
            Това е пълно систематизирано издание, разработено от д-р Данка Николова. То съдържа над 27 години практически опит в инспекциите на БАБХ, събрани в една книга, за да Ви осигури спокойствие и да спести хиляди левове от глоби.
          </p>
        </div>
      </section>

      <p className="text-center text-xs text-brand-dark/50">
        Имате въпроси за законодателството или етикетирането?{" "}
        <Link href="/contact" className="text-brand-gold hover:underline font-bold">
          Пишете на д-р Николова →
        </Link>
      </p>
    </div>
  );
}

export const etiketiraneKontrolZashtita: LibraryMaterial = {
  slug: "etiketirane-kontrol-zashtita",
  title: "Етикетиране на храни: съответствие, контрол и защита при проверки",
  tagline: "Цялостно практическо ръководство за изискванията, специфичните изключения, хранителните твърдения и чек-листа на инспектора от БАБХ.",
  priceEur: 67.00,
  originalPriceEur: 97.00,
  type: "pdf",
  contentUrl: "https://firebasestorage.googleapis.com/v0/b/danka-3e858.firebasestorage.app/o/library%2Fetiketirane-kontrol-zashtita%2Ffile.pdf?alt=media",
  card: {
    cover: "/Screenshot 2026-05-27 034346.png",
    badge: "Промоция до 30.06.2026",
    accent: "gold",
  },
  page: EtiketiraneKontrolZashtitaPage,
  metaDescription: "Детайлен наръчник за етикетиране на храни от д-р Данка Николова. Съответствие с Регламент 1169/2011, хранителни твърдения и защита при проверки на БАБХ.",
};
