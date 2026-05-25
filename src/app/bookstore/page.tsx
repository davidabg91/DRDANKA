"use client";

import Link from "next/link";
import { useCourses } from "@/lib/firebaseHooks";
import { BookOpen, ShieldCheck } from "lucide-react";

/**
 * Public digital bookstore catalog.
 * Anyone can browse — no auth required (Firestore rules permit public read on /courses).
 */
export default function BookstorePage() {
  const { courses, loading } = useCourses(true);

  return (
    <div className="bg-brand-light min-h-screen pb-24">
      <section className="bg-brand-green text-white py-16 border-b border-brand-gold/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
            <BookOpen className="h-3.5 w-3.5" />
            Дигитална Книжарница
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Книжарница за хранителен бизнес
          </h1>
          <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto font-light">
            Практически наръчници, обучения и материали от д-р Данка Николова — изтеглят се веднага след покупка и
            се четат онлайн в защитен формат.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center text-brand-dark/50 text-sm">
            Зареждане на каталога…
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center space-y-2">
            <BookOpen className="h-10 w-10 text-brand-gold/50 mx-auto" />
            <p className="text-brand-dark/60 text-sm">В момента няма публикувани материали. Скоро ще има!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(c => (
              <Link
                key={c.id}
                href={`/courses/${c.id}`}
                className="group bg-white rounded-2xl border border-brand-green/10 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-gold/40 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-brand-green/10 to-brand-gold/10 flex items-center justify-center overflow-hidden">
                  {c.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.coverImageUrl} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <BookOpen className="h-16 w-16 text-brand-green/30" />
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <h3 className="font-serif text-lg font-bold text-brand-green leading-tight group-hover:text-brand-gold transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-brand-dark/60 leading-relaxed line-clamp-3 flex-1">
                    {c.description}
                  </p>
                  <div className="flex items-end justify-between pt-3 border-t border-brand-green/5">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/40 block">Цена</span>
                      <span className="font-serif text-2xl font-bold text-brand-gold">{c.priceBgn.toFixed(2)}<span className="text-xs text-brand-dark/50 font-sans ml-1">лв.</span></span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green group-hover:text-brand-gold transition-colors">
                      Виж →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 bg-white rounded-2xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-brand-green text-sm">Сигурно плащане и достъп</p>
            <p className="text-xs text-brand-dark/60 leading-relaxed">
              Плащате с карта през Stripe — без сложна регистрация. След успешно плащане получавате на email-а си
              линк за достъп. Материалите се четат онлайн във вашия защитен профил.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
