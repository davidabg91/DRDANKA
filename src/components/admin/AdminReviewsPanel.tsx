"use client";

/**
 * Админ → „Оценки“: как клиентите оценяват материалите (1–5 звезди и
 * коментар от MaterialRating). Средна оценка общо и по материал, а отдолу —
 * всички отзиви, най-новите отгоре. Новите светят като „Ново“.
 */

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Star, MessageSquare } from "lucide-react";
import { db } from "@/lib/firebase";
import type { MaterialReview } from "@/components/MaterialRating";
import { formatDateTime, useMarkSeenOnOpen } from "./adminInbox";

type Review = MaterialReview & { id: string };

function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value.toFixed(1)} от 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= Math.round(value) ? "fill-brand-gold text-brand-gold" : "text-brand-dark/20"}`} />
      ))}
    </span>
  );
}

export default function AdminReviewsPanel() {
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [onlySlug, setOnlySlug] = useState<string | null>(null);
  const fresh = useMarkSeenOnOpen("reviews");

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "reviews"), orderBy("updatedAt", "desc")),
      (snap) => setReviews(snap.docs.map((d) => ({ ...(d.data() as MaterialReview), id: d.id }))),
      () => setReviews([])
    );
  }, []);

  const summary = useMemo(() => {
    const list = reviews || [];
    const bySlug = new Map<string, { slug: string; title: string; sum: number; count: number }>();
    for (const r of list) {
      const row = bySlug.get(r.slug) || { slug: r.slug, title: r.title, sum: 0, count: 0 };
      row.sum += r.rating;
      row.count += 1;
      bySlug.set(r.slug, row);
    }
    const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: list.filter((r) => r.rating === n).length }));
    return {
      avg: list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0,
      count: list.length,
      comments: list.filter((r) => r.comment).length,
      dist,
      materials: [...bySlug.values()].sort((a, b) => b.count - a.count),
    };
  }, [reviews]);

  const shown = (reviews || []).filter((r) => !onlySlug || r.slug === onlySlug);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-green">Оценки от клиентите</h2>
        <p className="text-sm text-brand-dark/60 mt-1">
          Клиентите оценяват купените материали в края на четеца. Оценките са видими само за Вас.
        </p>
      </div>

      {reviews === null ? (
        <p className="text-sm text-brand-dark/50">Зареждане…</p>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl bg-white border border-brand-green/10 p-10 text-center text-brand-dark/55">
          <Star className="h-8 w-8 mx-auto mb-2 text-brand-gold/60" />
          Още няма оценки. Ще се появят тук, щом клиент оцени материал.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-brand-green/10 p-5 shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-wider text-brand-dark/50">Средна оценка</div>
              <div className="flex items-end gap-2 mt-1">
                <span className="font-serif text-4xl font-bold text-brand-green">{summary.avg.toFixed(1)}</span>
                <span className="text-sm text-brand-dark/50 pb-1.5">от 5</span>
              </div>
              <Stars value={summary.avg} size="h-5 w-5" />
              <div className="text-xs text-brand-dark/55 mt-2">
                {summary.count} оценки · {summary.comments} с коментар
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-brand-green/10 p-5 shadow-sm md:col-span-2 space-y-1.5">
              {summary.dist.map(({ n, count }) => (
                <div key={n} className="flex items-center gap-3 text-xs">
                  <span className="w-10 shrink-0 font-bold text-brand-dark/70 inline-flex items-center gap-1">
                    {n} <Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
                  </span>
                  <div className="flex-1 h-2.5 rounded-full bg-brand-green/10 overflow-hidden">
                    <div className="h-full bg-brand-gold rounded-full" style={{ width: `${summary.count ? (count / summary.count) * 100 : 0}%` }} />
                  </div>
                  <span className="w-8 text-right text-brand-dark/55">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-brand-green/10 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-brand-green/10 text-[10px] font-black uppercase tracking-wider text-brand-dark/50">
              По материали
            </div>
            <ul>
              {summary.materials.map((m) => {
                const active = onlySlug === m.slug;
                return (
                  <li key={m.slug}>
                    <button
                      onClick={() => setOnlySlug(active ? null : m.slug)}
                      className={`w-full text-left px-5 py-3 flex items-center gap-3 flex-wrap border-b border-brand-green/5 last:border-0 cursor-pointer ${
                        active ? "bg-brand-gold/10" : "hover:bg-brand-light"
                      }`}
                    >
                      <span className="flex-1 min-w-0 font-bold text-sm text-brand-dark break-words">{m.title}</span>
                      <Stars value={m.sum / m.count} />
                      <span className="text-sm font-bold text-brand-green w-8 text-right">{(m.sum / m.count).toFixed(1)}</span>
                      <span className="text-xs text-brand-dark/50 w-20 text-right">{m.count} оценки</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-brand-dark/50">
                {onlySlug ? `Отзиви за „${summary.materials.find((m) => m.slug === onlySlug)?.title}“` : "Всички отзиви"}
              </h3>
              {onlySlug && (
                <button onClick={() => setOnlySlug(null)} className="text-xs font-bold text-brand-gold hover:underline cursor-pointer">
                  Покажи всички
                </button>
              )}
            </div>
            {shown.map((r) => {
              const isNew = fresh.has(r.id);
              return (
                <div
                  key={r.id}
                  className={`rounded-2xl border p-4 ${isNew ? "bg-brand-gold/10 border-brand-gold/50 shadow-md" : "bg-white border-brand-green/10 shadow-sm"}`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    {isNew && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-wider">Ново</span>
                    )}
                    <Stars value={r.rating} />
                    <span className="text-xs text-brand-dark/50">{formatDateTime(r.updatedAt)}</span>
                  </div>
                  {!onlySlug && <div className="font-bold text-sm text-brand-dark mt-1.5 break-words">{r.title}</div>}
                  {r.comment ? (
                    <p className="text-sm text-brand-dark/80 mt-1.5 leading-relaxed whitespace-pre-line break-words">
                      <MessageSquare className="inline h-3.5 w-3.5 text-brand-gold mr-1.5 -mt-0.5" />
                      {r.comment}
                    </p>
                  ) : (
                    <p className="text-xs text-brand-dark/40 mt-1.5 italic">Без коментар</p>
                  )}
                  <div className="text-xs text-brand-dark/55 mt-2 break-all">
                    {r.name ? `${r.name} · ` : ""}
                    {r.email}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
