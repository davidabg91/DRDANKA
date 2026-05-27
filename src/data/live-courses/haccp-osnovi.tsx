import Link from "next/link";
import { Calendar, Users, Award, CheckCircle, MessageSquare, Video, BookOpen } from "lucide-react";
import type { LiveCourse } from "./types";

/**
 * "НАССР основи — практически курс с д-р Николова" (example live course)
 *
 * Custom detail layout. Each live course can present itself differently.
 */

function HaccpOsnoviPage() {
  return (
    <div className="space-y-10">
      {/* Hook / opening pitch */}
      <section className="bg-gradient-to-br from-brand-green/95 to-brand-green text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold text-brand-dark flex items-center justify-center shrink-0 shadow-md">
            <Video className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold">Защо живо, а не запис?</h2>
            <p className="text-sm text-white/80 leading-relaxed">
              Защото казусите Ви са уникални. На живите сесии Вие питате — за Вашия обект, Вашите продукти, Вашите
              рискове — а д-р Николова отговаря в реално време с конкретно решение, не общи правила.
            </p>
          </div>
        </div>
      </section>

      {/* Format */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { Icon: Calendar, title: "3 сесии × 90 мин.", desc: "Веднъж седмично, в удобен за групата час." },
          { Icon: Users, title: "До 14 участници", desc: "Достатъчно малка група за индивидуални въпроси." },
          { Icon: Award, title: "Сертификат", desc: "След успешни тестове в Клиентския портал." },
        ].map(({ Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-brand-green/5 p-5 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
              <Icon className="h-5 w-5" />
            </div>
            <p className="font-bold text-brand-green text-sm">{title}</p>
            <p className="text-xs text-brand-dark/60 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Curriculum */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center"><BookOpen className="h-5 w-5" /></span>
          Програма на курса
        </h2>
        <div className="space-y-3">
          {[
            { n: "01", title: "Опасности и предотвратяване", desc: "Биологични, химични, физични — кое в кое производство се проявява и как се хваща." },
            { n: "02", title: "ККТ — Критични контролни точки", desc: "Как ги идентифицирате в Вашия процес. Реални примери от месо, мляко, заведения." },
            { n: "03", title: "Мониторинг + коригиращи действия", desc: "Какви температури, време, проверки. Какво правите когато нещо излезе извън нормата." },
          ].map(({ n, title, desc }) => (
            <div key={n} className="bg-white rounded-2xl border border-brand-green/5 p-5 hover:border-brand-gold/40 hover:shadow-md transition-all duration-300 flex items-start gap-4">
              <span className="font-serif text-3xl font-bold text-brand-gold/60 shrink-0 leading-none">{n}</span>
              <div className="space-y-1">
                <p className="font-bold text-brand-green">{title}</p>
                <p className="text-sm text-brand-dark/70 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white rounded-3xl border border-brand-green/5 p-6 sm:p-10 space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green">Как работи записването</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {[
            ["1.", "Записвате се сега", "Попълвате email, телефон и преминавате тестово плащане."],
            ["2.", "Сформиране на група", "Когато съберем нужните 6+ души, д-р Николова Ви пише с дати."],
            ["3.", "Live сесии в Zoom", "Получавате линк за всяка от 3-те сесии + достъп до записа след това."],
          ].map(([n, title, desc]) => (
            <div key={n} className="space-y-1">
              <span className="font-serif text-2xl font-bold text-brand-gold">{n}</span>
              <p className="font-bold text-brand-green text-sm">{title}</p>
              <p className="text-xs text-brand-dark/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For whom */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-brand-green">Подходящо за:</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Управители на хранителни обекти",
            "QA / технолози в производства",
            "Собственици на ресторанти, кафенета, пекарни",
            "Готвачи и шеф-готвачи отговорни за самоконтрол",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-brand-dark/80 bg-white rounded-xl border border-brand-green/5 p-3">
              <CheckCircle className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-brand-dark/50">
        Имате въпрос преди записване?{" "}
        <Link href="/contact" className="text-brand-gold hover:underline font-bold">
          Пишете на д-р Николова <MessageSquare className="h-3 w-3 inline" />
        </Link>
      </p>
    </div>
  );
}

export const haccpOsnovi: LiveCourse = {
  slug: "haccp-osnovi",
  title: "Практически курс по разработване, въвеждане и поддържане на НАССР система",
  tagline:
    "3 сесии онлайн в Zoom за внедряване на НАССР в реалния обект — с Вашите казуси, не учебникови.",
  priceEur: 149.0,
  platform: "zoom",
  hasCertificate: true,
  format: "3 сесии × 90 мин. (общо ~4.5 часа)",
  groupSize: "8–14 участници",
  nextBatch: "Следваща група: при достигане на 6 записани",
  card: {
    cover: "/viber_image_2026-05-27_16-15-03-570.jpg",
    badge: "Live с д-р Данка",
    accent: "green",
  },
  page: HaccpOsnoviPage,
  metaDescription:
    "Практически live онлайн курс по НАССР с д-р Данка Николова. 3 Zoom сесии, малка група, сертификат.",
};
