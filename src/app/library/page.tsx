"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen, ShieldCheck, Video, Award, ArrowRight, Play,
} from "lucide-react";
import { LIBRARY_MATERIALS } from "@/data/library";
import { usePriceOverrides, resolvePrice } from "@/lib/priceOverrides";
import { useCourses } from "@/lib/firebaseHooks";
import { findMatchingCourse } from "@/lib/courseTypes";
import PageHero from "@/components/PageHero";

/**
 * /library — public catalog of "ready" materials (PDF manuals + recorded videos).
 *
 * Combines curated in-code materials and Firestore courses, automatically
 * deduplicating them so no course appears twice, and applying any admin-edited
 * descriptions, titles, and prices in real time.
 */
export default function LibraryPage() {
  const { overrides } = usePriceOverrides();
  const { courses: dbCourses } = useCourses();

  const displayItems = useMemo(() => {
    const rawMaterials = LIBRARY_MATERIALS.filter(
      (m) => m.category === "training" || (!m.category && m.type === "video")
    );

    const matchedDbCourseIds = new Set<string>();

    const mergedList = rawMaterials
      .map((m) => {
        const matched = findMatchingCourse(
          { slug: m.slug, id: m.slug, title: m.title },
          dbCourses
        );
        if (matched) {
          matchedDbCourseIds.add(matched.id);
          if (matched.published === false || matched.deleted) {
            return null;
          }
          return {
            key: m.slug,
            href: `/library/${m.slug}`,
            title: matched.title || m.title,
            description: matched.description || m.tagline,
            cover: matched.coverImageUrl || m.card.cover,
            badge: m.card.badge,
            type: (matched.type ?? m.type) === "video" ? "video" : "pdf",
            priceEur: resolvePrice(m.slug, overrides, matched.priceEur ?? m.priceEur),
            originalPriceEur: m.originalPriceEur,
          };
        }
        return {
          key: m.slug,
          href: `/library/${m.slug}`,
          title: m.title,
          description: m.tagline,
          cover: m.card.cover,
          badge: m.card.badge,
          type: m.type === "video" ? "video" : "pdf",
          priceEur: resolvePrice(m.slug, overrides, m.priceEur),
          originalPriceEur: m.originalPriceEur,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // Any extra courses created directly in Firestore that are not in code
    for (const c of dbCourses) {
      if (matchedDbCourseIds.has(c.id)) continue;
      if (c.published === false || c.deleted) continue;
      const matchesAny = rawMaterials.some((m) =>
        findMatchingCourse({ slug: m.slug, id: m.slug, title: m.title }, [c])
      );
      if (matchesAny) continue;

      mergedList.push({
        key: c.id,
        href: `/courses/${c.slug || c.id}`,
        title: c.title,
        description: c.description,
        cover: c.coverImageUrl || "",
        badge: undefined,
        type: (c.type ?? "pdf") === "video" ? "video" : "pdf",
        priceEur: resolvePrice(c.slug || c.id, overrides, c.priceEur),
        originalPriceEur: undefined,
      });
    }

    return mergedList;
  }, [dbCourses, overrides]);

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        badgeText="Обучения"
        title="Обучения за хранителен бизнес"
        subtitle="Професионални обучения от д-р Данка Николова — получавате ги веднага след покупка и учите във Вашето темпо."
        icon={Video}
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {displayItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center space-y-2">
            <BookOpen className="h-10 w-10 text-brand-gold/50 mx-auto" />
            <p className="text-brand-dark/60 text-sm">Скоро добавяме материали.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="group relative bg-white rounded-3xl border border-brand-green/10 hover:border-brand-gold/50 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-brand-gold/20 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-green/15 to-brand-gold/15 overflow-hidden">
                  {item.cover ? (
                    <Image
                      src={item.cover}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-brand-gold/30 blur-2xl animate-pulse" />
                        {item.type === "video" ? (
                          <Video className="relative h-20 w-20 text-brand-green/40" strokeWidth={1.5} />
                        ) : (
                          <BookOpen className="relative h-20 w-20 text-brand-green/40" strokeWidth={1.5} />
                        )}
                      </div>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-sm text-brand-green px-2.5 py-1 rounded-full shadow-sm">
                      {item.type === "video" ? <><Video className="h-3 w-3" /> Видео</> : <><BookOpen className="h-3 w-3" /> Файлове</>}
                    </span>
                  </div>
                  {item.badge && (
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                        item.badge.includes("50%") || item.badge.includes("Отстъпка")
                          ? "bg-red-600 text-white animate-pulse shadow-red-600/30"
                          : "bg-brand-gold text-brand-dark"
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green leading-snug group-hover:text-brand-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-dark/60 leading-relaxed line-clamp-2 flex-1">{item.description}</p>

                  <div className="flex items-end justify-between pt-4 mt-auto border-t border-brand-green/5">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-brand-dark/40 block leading-none mb-1">Цена</span>
                      <div className="flex flex-col">
                        {item.originalPriceEur && (
                          <span className="font-serif text-base sm:text-lg text-brand-dark/40 line-through decoration-red-500/60 decoration-2 leading-none mb-0.5">
                            {item.originalPriceEur.toFixed(2)}€
                          </span>
                        )}
                        <span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold leading-none">
                          {item.priceEur.toFixed(2)}<span className="text-sm text-brand-dark/50 font-sans ml-0.5">€</span>
                        </span>
                      </div>
                    </div>
                    <span className="relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-green group-hover:bg-brand-gold text-white group-hover:text-brand-dark font-bold text-[10px] uppercase tracking-widest rounded-full shadow-md group-hover:shadow-lg group-hover:shadow-brand-gold/40 transition-all duration-300">
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
                      Купи
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Cross-sell to live courses */}
        <Link
          href="/live"
          className="group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1F18] via-[#0F2A20] to-[#1A3D2E] border border-brand-gold/25 shadow-2xl shadow-brand-green/20 hover:shadow-brand-gold/20 transition-all duration-500 cursor-pointer mt-12"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-brand-gold/20 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-brand-green/40 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 p-6 sm:p-10 items-center">
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-brand-gold/30 blur-2xl animate-pulse" />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center shadow-xl shadow-brand-gold/40 group-hover:scale-105 transition-transform duration-500">
                  <Video className="h-12 w-12 sm:h-14 sm:w-14 text-brand-dark" strokeWidth={2.5} />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-brand-green border-4 border-[#0A1F18] flex items-center justify-center shadow-lg">
                    <Play className="h-3.5 w-3.5 text-brand-gold fill-brand-gold ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6 space-y-3 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
                Още от д-р Николова
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Live <span className="text-brand-gold">курсове</span> в Zoom
              </h2>
              <p className="text-sm text-white/70 leading-relaxed max-w-xl">
                Искате обучение с реална обратна връзка? Запишете се за груповите live сесии — д-р Николова отговаря
                на Вашите конкретни казуси в реално време.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 pt-2">
                {[
                  { Icon: Award, text: "Със сертификат" },
                  { Icon: Video, text: "Малки групи" },
                  { Icon: ShieldCheck, text: "Личен достъп" },
                ].map(({ Icon, text }) => (
                  <span key={text} className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80">
                    <Icon className="h-3.5 w-3.5 text-brand-gold" />
                    {text}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 flex justify-center lg:justify-end">
              <span className="relative overflow-hidden inline-flex items-center gap-2 px-6 py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-dark font-bold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/30 transition-all duration-300 whitespace-nowrap">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
                Виж live курсовете
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>

        <div className="mt-10 bg-white rounded-2xl border border-brand-green/5 p-6 sm:p-8 flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 text-brand-gold shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-brand-green text-sm">Сигурен достъп</p>
            <p className="text-xs text-brand-dark/60 leading-relaxed">
              Плащате с карта — без сложна регистрация. Веднага получавате достъп до материала на посочения email
              адрес.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
