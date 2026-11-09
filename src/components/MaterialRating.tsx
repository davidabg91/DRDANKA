"use client";

/**
 * Оценка (1–5 звезди) и коментар на купен материал. Записва се в
 * `reviews/{slug}__{email}` — един отзив на клиент за материал, който може да
 * се промени. Вижда го само админът („Оценки“ в админ менюто) и самият клиент.
 *
 * Firestore правилата пускат оценка само за пакет от `purchasedCourseIds`,
 * затова компонентът избира от `candidates` id-то, което клиентът наистина
 * притежава, и не се показва, ако няма такова (напр. за админа).
 */

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Star, Check, Loader2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";

export const REVIEW_COMMENT_MAX = 1500;

export interface MaterialReview {
  slug: string;
  title: string;
  email: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  seenByAdmin: boolean;
}

export const reviewDocId = (slug: string, email: string) => `${slug}__${email.trim().toLowerCase()}`;

const RATING_LABELS = ["", "Слабо", "Може и по-добре", "Добре", "Много добре", "Отлично"];

export default function MaterialRating({
  candidates,
  title,
  tone = "dark",
}: {
  /** Възможните id на материала (slug, id на курса…) — взима се притежаваното. */
  candidates: (string | undefined | null)[];
  title: string;
  tone?: "dark" | "light";
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState<string | null>(null);
  const [saved, setSaved] = useState<MaterialReview | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [editing, setEditing] = useState(false);
  const key = candidates.filter(Boolean).join("|");

  useEffect(() => {
    const wanted = key.split("|").filter(Boolean).map((c) => c.toLowerCase());
    return onAuthStateChanged(auth, async (user) => {
      const clean = user?.email?.toLowerCase() || "";
      setEmail(clean);
      setSlug(null);
      if (!clean) return;
      try {
        const me = await getDoc(doc(db, "users", clean));
        const data = me.data() || {};
        const owned: string[] = data.purchasedCourseIds || [];
        const match = owned.find((id) => wanted.includes(id.toLowerCase()));
        if (!match) return;
        setName(data.contact || data.manager || user?.displayName || "");
        setSlug(match);
        const existing = await getDoc(doc(db, "reviews", reviewDocId(match, clean)));
        if (existing.exists()) {
          const r = existing.data() as MaterialReview;
          setSaved(r);
          setRating(r.rating);
          setComment(r.comment || "");
        }
      } catch {
        // без оценка — материалът се чете нормално
      }
    });
  }, [key]);

  if (!slug || !email) return null;

  const submit = async () => {
    if (!rating) return;
    setStatus("saving");
    const now = new Date().toISOString();
    const review: MaterialReview = {
      slug,
      title,
      email,
      name,
      rating,
      comment: comment.trim().slice(0, REVIEW_COMMENT_MAX),
      createdAt: saved?.createdAt || now,
      updatedAt: now,
      // Нова или променена оценка → отново „нова“ за админа.
      seenByAdmin: false,
    };
    try {
      await setDoc(doc(db, "reviews", reviewDocId(slug, email)), review);
      setSaved(review);
      setEditing(false);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  const dark = tone === "dark";
  const box = dark
    ? "bg-white/[0.06] border-white/10 text-white"
    : "bg-white border-brand-green/15 text-brand-dark shadow-md";
  const muted = dark ? "text-white/60" : "text-brand-dark/60";
  const shown = hover || rating;

  if (saved && !editing) {
    return (
      <div className={`max-w-xl mx-auto rounded-2xl border p-5 print:hidden ${box}`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold">Вашата оценка</div>
            <div className="flex items-center gap-1 mt-1" aria-label={`${saved.rating} от 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= saved.rating ? "fill-brand-gold text-brand-gold" : muted}`} />
              ))}
              {status === "saved" && (
                <span className={`ml-2 inline-flex items-center gap-1 text-xs ${muted}`}>
                  <Check className="h-3.5 w-3.5 text-brand-gold" /> Благодарим!
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => { setEditing(true); setStatus("idle"); }}
            className="text-xs font-bold uppercase tracking-wider text-brand-gold hover:underline cursor-pointer"
          >
            Промени
          </button>
        </div>
        {saved.comment && <p className={`mt-3 text-sm leading-relaxed whitespace-pre-line ${muted}`}>„{saved.comment}“</p>}
      </div>
    );
  }

  return (
    <div className={`max-w-xl mx-auto rounded-2xl border p-5 space-y-3 print:hidden ${box}`}>
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-gold">Оценете материала</div>
        <p className={`text-sm mt-1 ${muted}`}>Доволни ли сте? Оценката Ви помага на д-р Николова да прави материалите още по-полезни.</p>
      </div>
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Оценка">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} от 5 — ${RATING_LABELS[n]}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => setRating(n)}
            className="p-1 cursor-pointer transition-transform hover:scale-110"
          >
            <Star className={`h-7 w-7 ${n <= shown ? "fill-brand-gold text-brand-gold" : dark ? "text-white/30" : "text-brand-dark/25"}`} />
          </button>
        ))}
        <span className={`ml-2 text-xs font-bold ${muted}`}>{RATING_LABELS[shown]}</span>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, REVIEW_COMMENT_MAX))}
        rows={3}
        placeholder="Коментар (по желание) — какво Ви хареса, какво да подобрим?"
        className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/50 ${
          dark ? "bg-black/30 border-white/10 text-white placeholder:text-white/35" : "bg-brand-light border-brand-green/15 text-brand-dark placeholder:text-brand-dark/40"
        }`}
      />
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={submit}
          disabled={!rating || status === "saving"}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-black text-xs uppercase tracking-wider hover:bg-brand-gold/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {status === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
          Изпрати оценката
        </button>
        {saved && (
          <button onClick={() => { setEditing(false); setRating(saved.rating); setComment(saved.comment); }} className={`text-xs font-bold cursor-pointer hover:underline ${muted}`}>
            Отказ
          </button>
        )}
        {status === "error" && <span className="text-xs text-red-400">Не успяхме да запишем оценката. Опитайте пак.</span>}
      </div>
    </div>
  );
}
