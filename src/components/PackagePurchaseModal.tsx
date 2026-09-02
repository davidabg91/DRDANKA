"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X, Landmark, Loader2, CheckCircle, ShieldCheck, User, Building2,
  ArrowRight,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import BankTransferNotice from "@/components/BankTransferNotice";
import { trackInitiateCheckout, trackPurchase } from "@/lib/fpixel";

/**
 * Unified purchase + registration modal shared by the digital bookstore
 * (/library/[slug]) and the trainings catalog (/trainings/[id]).
 *
 * Flow:
 *   1. Buyer registers a real account (email + password) — createUserWithEmailAndPassword,
 *      or if already logged in, uses their existing authenticated session seamlessly.
 *   2. Optional "14 дни безплатно" tab: also fills the business profile and starts
 *      the 14-day дневници trial (subscriptionStatus:'trial').
 *   3. Records an `enrollments` doc with status 'awaiting_payment'. Access is NOT
 *      granted yet — д-р Николова confirms the bank transfer from the admin panel
 *      and adds the package id to the buyer's purchasedCourseIds.
 */

const validEmail = (s: string) => /^[^@]+@[^@]+\.[^@]+$/.test(s);

export default function PackagePurchaseModal({
  open,
  onClose,
  packageId,
  packageTitle,
  packageKind,
  contentType,
  priceEur,
}: {
  open: boolean;
  onClose: () => void;
  /** slug (library) or training id — becomes the purchasedCourseIds key. */
  packageId: string;
  packageTitle: string;
  packageKind: "library" | "training";
  contentType: "pdf" | "video";
  priceEur: number;
}) {
  const [tab, setTab] = useState<"buy" | "trial">("buy");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Account + contact fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  // Trial-only business fields
  const [firmName, setFirmName] = useState("");
  const [eik, setEik] = useState("");
  const [niche, setNiche] = useState("");
  const [desc, setDesc] = useState("");
  const [address, setAddress] = useState("");

  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    trackInitiateCheckout({
      content_name: packageTitle,
      content_ids: [packageId],
      value: priceEur,
      currency: "EUR",
      num_items: 1,
    });
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u && u.email) {
        setIsLoggedIn(true);
        const clean = u.email.toLowerCase();
        setEmail(clean);
        try {
          const snap = await getDoc(doc(db, "users", clean));
          if (snap.exists()) {
            const data = snap.data();
            if (data.contact) setFullName(data.contact);
            else if (data.manager) setFullName(data.manager);
            else if (u.displayName) setFullName(u.displayName);

            if (data.phone) setPhone(data.phone);
            if (data.firmName) { setCompany(data.firmName); setFirmName(data.firmName); }
            if (data.eik) setEik(data.eik);
            if (data.niche) setNiche(data.niche);
            if (data.desc) setDesc(data.desc);
            if (data.address) setAddress(data.address);
          } else if (u.displayName) {
            setFullName(u.displayName);
          }
        } catch (err) {
          console.error("Error prefilling logged in user profile:", err);
        }
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsub();
  }, [open]);

  if (!open) return null;

  const withTrial = tab === "trial";

  const reset = () => {
    setFullName(""); setEmail(""); setPassword(""); setConfirm("");
    setPhone(""); setCompany(""); setFirmName(""); setEik("");
    setNiche(""); setDesc(""); setAddress(""); setStatus("idle"); setError("");
  };

  const close = () => {
    if (status === "processing") return;
    reset();
    onClose();
  };

  const submit = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!fullName.trim() || !validEmail(cleanEmail) || !phone.trim()) {
      setError("Моля попълнете име, валиден email и телефон.");
      return;
    }
    if (!isLoggedIn) {
      if (password.length < 6) {
        setError("Паролата трябва да е поне 6 символа.");
        return;
      }
      if (password !== confirm) {
        setError("Паролите не съвпадат.");
        return;
      }
    }
    if (withTrial && !firmName.trim()) {
      setError("За безплатния тест въведете име на фирмата.");
      return;
    }
    setError("");
    setStatus("processing");

    try {
      let isNewAccount = false;
      if (!isLoggedIn) {
        isNewAccount = true;
        try {
          await createUserWithEmailAndPassword(auth, cleanEmail, password);
        } catch (err: any) {
          if (err?.code === "auth/email-already-in-use") {
            try {
              await signInWithEmailAndPassword(auth, cleanEmail, password);
              isNewAccount = false;
            } catch {
              setError("Този email вече има акаунт, но паролата е грешна. Въведете съществуващата си парола.");
              setStatus("idle");
              return;
            }
          } else {
            throw err;
          }
        }
      }

      const userRef = doc(db, "users", cleanEmail);

      if (isNewAccount) {
        await setDoc(userRef, {
          email: cleanEmail,
          firmName: withTrial ? firmName.trim() : "",
          eik: withTrial ? (eik.trim() || "Няма въведен") : "",
          contact: fullName.trim(),
          phone: phone.trim(),
          sector: "",
          niche: withTrial ? niche.trim() : "",
          desc: withTrial ? desc.trim() : "",
          address: withTrial ? (address.trim() || "Не е въведен") : "",
          manager: fullName.trim(),
          status: "approved",
          subscriptionStatus: withTrial ? "trial" : "none",
          ...(withTrial ? { trialStartedAt: new Date().toISOString() } : {}),
          role: "user",
          assignedDocs: [],
          messages: [],
          purchasedCourseIds: [],
        });
      } else {
        const updates: any = {
          contact: fullName.trim(),
          phone: phone.trim(),
        };
        if (withTrial) {
          updates.firmName = firmName.trim();
          updates.eik = eik.trim() || "Няма въведен";
          updates.niche = niche.trim();
          updates.desc = desc.trim();
          updates.address = address.trim() || "Не е въведен";
          updates.subscriptionStatus = "trial";
          updates.trialStartedAt = new Date().toISOString();
        }
        await updateDoc(userRef, updates).catch(() => { /* keep going */ });
      }

      // Record the purchase request (awaiting payment).
      const id = `enroll_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await setDoc(doc(db, "enrollments", id), {
        id,
        trainingId: packageId,
        trainingTitle: packageTitle,
        trainingType: packageKind === "library" ? "library" : (contentType === "video" ? "video" : "zoom"),
        packageKind,
        contentType,
        fullName: fullName.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        company: withTrial ? firmName.trim() : company.trim(),
        priceEur,
        status: "awaiting_payment",
        createdAt: new Date().toISOString(),
      });

      trackPurchase({
        content_name: packageTitle,
        content_ids: [packageId],
        value: priceEur,
        currency: "EUR",
        num_items: 1,
      });

      setStatus("success");
    } catch (err: any) {
      console.error("Package purchase error:", err);
      setError(err?.message || "Грешка при изпращане на заявката. Опитайте отново.");
      setStatus("error");
    }
  };

  const cleanEmail = email.trim().toLowerCase();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-brand-green to-brand-green/80 text-white p-6 pr-16 flex items-start gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl shrink-0"><Landmark className="h-5 w-5" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">
              {isLoggedIn ? "Заявка за покупка" : "Регистрация и заявка"}
            </div>
            <div className="font-serif text-base sm:text-lg font-bold leading-snug break-words">{packageTitle}</div>
          </div>
          <button
            onClick={close}
            aria-label="Затвори"
            className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer shrink-0"
          ><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {status === "success" ? (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <CheckCircle className="h-14 w-14 text-green-500 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-brand-green">Заявката е приета!</h3>
                <p className="text-sm text-brand-dark/70 leading-relaxed">
                  За да получите достъп до <strong>{packageTitle}</strong>, направете банков превод по сметката по-долу. Заявката вече е добавена в профила Ви.
                </p>
              </div>

              <BankTransferNotice amount={`${priceEur.toFixed(2)} €`} reference={`${cleanEmail} — ${packageTitle}`} />

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-left text-xs text-amber-900 leading-relaxed">
                <strong>Активиране:</strong> До <strong>24 часа</strong> след постъпване на плащането д-р Данка Николова
                активира пакета и той се появява в профила Ви за четене.
              </div>

              {withTrial && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left text-xs text-emerald-900 leading-relaxed">
                  <strong>14 дни безплатно:</strong> Достъпът до системата за дневници е активиран веднага — вижте профила си.
                </div>
              )}

              <Link
                href="/profile"
                className="w-full px-6 py-3 rounded-full bg-brand-green text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-green/90 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                Към профила <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Price */}
              <div className="bg-brand-light/50 rounded-xl p-4 border border-brand-green/5 flex items-center justify-between">
                <span className="text-sm font-bold text-brand-green">Цена за пакета</span>
                <span className="font-serif text-2xl font-bold text-brand-gold whitespace-nowrap ml-3">{priceEur.toFixed(2)} €</span>
              </div>

              {isLoggedIn ? (
                /* Streamlined order summary for LOGGED-IN users — NO registration fields */
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Влезли сте с профил: <strong className="font-mono">{email}</strong></span>
                    </div>
                    <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                      Пакетът <strong>„{packageTitle}“</strong> ще бъде добавен директно към Вашия акаунт след потвърждение на плащането.
                    </p>
                  </div>

                  <div className="space-y-3 bg-brand-light/40 p-4 rounded-2xl border border-brand-green/5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-brand-green/70 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" /> Данни за контакт
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Име и фамилия *</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Вашите имена" className="w-full text-xs px-3 py-2 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Телефон *</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0888123456" className="w-full text-xs px-3 py-2 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" disabled={status === "processing"} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Full registration form for LOGGED-OUT users */
                <>
                  {/* Tabs */}
                  <div className="grid grid-cols-2 gap-1 bg-brand-light/60 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setTab("buy")}
                      className={`py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer border-0 ${tab === "buy" ? "bg-white text-brand-green shadow" : "text-brand-dark/50 hover:text-brand-green"}`}
                    >
                      Само покупка
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab("trial")}
                      className={`py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer border-0 ${tab === "trial" ? "bg-white text-brand-green shadow" : "text-brand-dark/50 hover:text-brand-green"}`}
                    >
                      + 14 дни безплатно
                    </button>
                  </div>

                  {tab === "trial" && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-900 leading-relaxed flex items-start gap-2">
                      <Building2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                      <span>Въведете фирмата си и получавате <strong>14 дни безплатен достъп</strong> до системата за дневници по самоконтрол — успоредно с покупката на пакета.</span>
                    </div>
                  )}

                  {/* Account fields */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-brand-green/70">
                      <User className="h-3.5 w-3.5" /> Данни за акаунт
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Име и фамилия *</label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Иван Петров" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Email *</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Телефон *</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0888123456" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" disabled={status === "processing"} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Парола *</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Мин. 6 символа" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Потвърди парола *</label>
                        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Повтори паролата" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                      </div>
                    </div>

                    {tab === "buy" && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Фирма (по желание)</label>
                        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Ресторант Витоша ЕООД" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                      </div>
                    )}
                  </div>

                  {/* Trial business fields */}
                  {tab === "trial" && (
                    <div className="space-y-3 border-t border-brand-green/5 pt-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                        <Building2 className="h-3.5 w-3.5" /> Данни за фирмата (14 дни тест)
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Име на фирма *</label>
                          <input type="text" value={firmName} onChange={(e) => setFirmName(e.target.value)} placeholder="Ресторант Витоша ЕООД" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">ЕИК</label>
                          <input type="text" value={eik} onChange={(e) => setEik(e.target.value)} placeholder="123456789" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white font-mono" disabled={status === "processing"} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Адрес на обекта</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="гр. София, ул. …" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Тип обект / дейност</label>
                        <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="напр. ресторант, магазин за месо, сладкарница" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white" disabled={status === "processing"} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60">Кратко описание</label>
                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="С какво се занимава обектът" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-brand-green/15 focus:outline-none focus:border-brand-gold bg-white resize-none" disabled={status === "processing"} />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="border-t border-brand-green/5 pt-4 flex items-start gap-2 text-[11px] text-brand-dark/60 leading-relaxed">
                <Landmark className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                <span>Плащането е по банков път. След заявката ще видите данните за превод. Достъпът се активира до 24 часа след постъпване на плащането.</span>
              </div>

              {error && (
                <div className="text-[11px] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">{error}</div>
              )}

              <button
                onClick={submit}
                disabled={status === "processing"}
                className="w-full px-6 py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-brand-dark font-bold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-brand-gold/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === "processing" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Изпращане…</>
                ) : isLoggedIn ? (
                  <>Изпрати заявка за плащане</>
                ) : (
                  <>Създай профил и изпрати заявка</>
                )}
              </button>

              <p className="text-[10px] text-center text-brand-dark/50 leading-relaxed">
                <ShieldCheck className="h-3 w-3 inline text-brand-gold mr-1" />
                {isLoggedIn
                  ? "Заявката за плащане ще се появи веднага в профила Ви."
                  : "Създаваме Ви защитен профил. Пакетът се чете само в профила — без сваляне."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
