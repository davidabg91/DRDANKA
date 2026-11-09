"use client";

/**
 * Админ → „Нови покупки“: всичко платено с карта (материали, курсове,
 * консултации, абонаменти), най-новите отгоре. Невидените светят като „Ново“.
 */

import { useEffect, useMemo, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { ShoppingBag } from "lucide-react";
import { db } from "@/lib/firebase";
import { findLibraryMaterial } from "@/data/library";
import { findLiveCourse } from "@/data/live-courses";
import { PLAN_BY_ID, isPlanId } from "@/lib/plans";
import { formatDateTime, useMarkSeenOnOpen } from "./adminInbox";

interface Purchase {
  id: string;
  kind?: "enrollment" | "subscription";
  title?: string;
  courseId?: string;
  itemKind?: string;
  plan?: string;
  buyerEmail?: string;
  buyerName?: string;
  amountPaidEur?: number;
  paidAt?: string;
  createdAt?: string;
}

const KIND_LABEL: Record<string, string> = {
  library: "Материал",
  pdf: "Материал",
  video: "Видео",
  live: "Курс на живо",
  zoom: "Курс на живо",
  training: "Обучение",
  booking: "Консултация",
  consultation: "Консултация",
  subscription: "Абонамент",
};

function purchaseTitle(p: Purchase): string {
  if (p.title) return p.title;
  if (p.kind === "subscription") return isPlanId(p.plan) ? `Абонамент „${PLAN_BY_ID[p.plan].name}“` : "Абонамент";
  const id = p.courseId || "";
  return findLibraryMaterial(id)?.title || findLiveCourse(id)?.title || id || "Покупка";
}

function kindLabel(p: Purchase): string {
  if (p.kind === "subscription") return KIND_LABEL.subscription;
  if (p.itemKind && KIND_LABEL[p.itemKind]) return KIND_LABEL[p.itemKind];
  if (findLiveCourse(p.courseId || "")) return KIND_LABEL.live;
  return KIND_LABEL.library;
}

export default function AdminPurchasesPanel() {
  const [items, setItems] = useState<Purchase[] | null>(null);
  const fresh = useMarkSeenOnOpen("purchases");

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "purchases"), orderBy("createdAt", "desc"), limit(200)),
      (snap) => setItems(snap.docs.map((d) => ({ ...(d.data() as Purchase), id: d.id }))),
      () => setItems([])
    );
  }, []);

  const stats = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7);
    const thisMonth = (items || []).filter((p) => (p.paidAt || p.createdAt || "").startsWith(month));
    return {
      count: thisMonth.length,
      total: thisMonth.reduce((sum, p) => sum + (p.amountPaidEur || 0), 0),
    };
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl font-bold text-brand-green">Нови покупки</h2>
          <p className="text-sm text-brand-dark/60 mt-1">
            Всичко платено с карта. Новите са отбелязани, докато не напуснете тази страница.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl bg-white border border-brand-green/10 px-4 py-3 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-wider text-brand-dark/50">Този месец</div>
            <div className="font-serif text-xl font-bold text-brand-green">{stats.total.toFixed(2)} €</div>
          </div>
          <div className="rounded-2xl bg-white border border-brand-green/10 px-4 py-3 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-wider text-brand-dark/50">Покупки</div>
            <div className="font-serif text-xl font-bold text-brand-green">{stats.count}</div>
          </div>
        </div>
      </div>

      {items === null ? (
        <p className="text-sm text-brand-dark/50">Зареждане…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white border border-brand-green/10 p-10 text-center text-brand-dark/55">
          <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-brand-gold/60" />
          Още няма плащания с карта.
        </div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((p) => {
            const isNew = fresh.has(p.id);
            return (
              <li
                key={p.id}
                className={`rounded-2xl border p-4 flex items-center gap-4 flex-wrap transition-colors ${
                  isNew ? "bg-brand-gold/10 border-brand-gold/50 shadow-md" : "bg-white border-brand-green/10 shadow-sm"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isNew && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black uppercase tracking-wider">Ново</span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green text-[9px] font-black uppercase tracking-wider">
                      {kindLabel(p)}
                    </span>
                    <span className="text-xs text-brand-dark/50">{formatDateTime(p.paidAt || p.createdAt)}</span>
                  </div>
                  <div className="font-bold text-brand-dark mt-1 break-words">{purchaseTitle(p)}</div>
                  <div className="text-xs text-brand-dark/60 mt-0.5 break-all">
                    {p.buyerName ? `${p.buyerName} · ` : ""}
                    {p.buyerEmail}
                  </div>
                </div>
                <div className="font-serif text-lg font-bold text-brand-green shrink-0">
                  {(p.amountPaidEur || 0).toFixed(2)} €
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
