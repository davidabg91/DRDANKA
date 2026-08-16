"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import BankTransferNotice from "@/components/BankTransferNotice";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams ? searchParams.get("service") : null;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    businessType: "restaurant",
    message: "",
    agreeToTerms: false,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.agreeToTerms) {
      setStatus("error");
      setErrorMessage("Моля, попълнете всички задължителни полета и се съгласете с условията.");
      return;
    }

    setStatus("loading");

    const cleanEmail = formData.email.trim().toLowerCase();
    const cleanName = formData.name.trim();
    const cleanPhone = formData.phone.trim();
    const cleanMessage = formData.message.trim();
    const businessTypeLabel =
      formData.businessType === "restaurant" ? "Ресторант / Заведение" :
      formData.businessType === "production" ? "Хранително производство / Цех" :
      formData.businessType === "bakery" ? "Пекарна / Сладкарница" :
      formData.businessType === "store" ? "Магазин за храни" :
      formData.businessType === "catering" ? "Кетъринг фирма" : "Друг обект";

    const serviceTitle = serviceParam ? `Запитване за оферта: ${serviceParam}` : "Запитване за индивидуална оферта";
    const fullNote = `[Обект: ${businessTypeLabel}] ${cleanMessage}`;
    const bookingId = `offer_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const enrollId = `enroll_offer_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const nowIso = new Date().toISOString();

    const isAuditService = serviceTitle.includes("Проверка преди проверката");
    const servicePriceEur = isAuditService ? 600 : 0;
    const servicePriceLabel = isAuditService ? "600 €" : "По запитване";

    const payload = {
      id: bookingId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      note: fullNote,
      packageId: isAuditService ? "proverka-predi-proverkata" : "offer-inquiry",
      packageName: serviceTitle,
      duration: isAuditService ? "Одит на място" : "Индивидуална оферта",
      price: servicePriceLabel,
      priceEur: servicePriceEur,
      date: new Date().toISOString().split("T")[0],
      time: "За връзка",
      mode: "offer",
      status: "pending",
      createdAt: nowIso,
    };

    try {
      // 1. Dispatch to server-side API (Admin SDK save + Email notification to Dr. Danka)
      fetch("/api/notify-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((e) => console.warn("Background notify-booking call warning:", e));

      // 2. Direct client Firestore write to /enrollments
      await setDoc(doc(db, "enrollments", enrollId), {
        id: enrollId,
        trainingId: isAuditService ? "proverka-predi-proverkata" : "offer-inquiry",
        trainingTitle: serviceTitle,
        trainingType: "consultation",
        packageKind: "consultation",
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        company: businessTypeLabel,
        priceEur: servicePriceEur,
        duration: isAuditService ? "Одит на място" : "Индивидуална оферта",
        date: new Date().toISOString().split("T")[0],
        time: "За връзка",
        note: fullNote,
        status: "pending",
        createdAt: nowIso,
      }).catch((e) => console.warn("Client enrollments save warning:", e));

      // 3. Direct client Firestore write to /bookings
      await setDoc(doc(db, "bookings", bookingId), payload).catch((e) =>
        console.warn("Client bookings save warning:", e)
      );

      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        businessType: "restaurant",
        message: "",
        agreeToTerms: false,
      });
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      setStatus("error");
      setErrorMessage("Възникна грешка при изпращането. Моля, опитайте отново.");
    }
  };

  const isAudit = serviceParam?.includes("Проверка преди проверката");

  if (status === "success") {
    return (
      <div className="bg-white border border-brand-gold/30 rounded-2xl p-6 sm:p-8 text-center shadow-xl max-w-xl mx-auto my-6 space-y-6">
        <CheckCircle2 className="h-16 w-16 text-brand-gold mx-auto" />
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold text-brand-green">
            {isAudit ? "Заявката за одит е приета успешно!" : "Запитването е изпратено!"}
          </h3>
          <p className="text-brand-dark/80 text-sm leading-relaxed max-w-md mx-auto">
            {isAudit ? (
              <>
                Вашата заявка за <strong className="text-brand-green">„Проверка преди проверката“</strong> е записана. За да потвърдите датата за одит на място, направете банков превод по сметката по-долу:
              </>
            ) : (
              <>
                Благодарим Ви, че се свързахте с нас. Д-р Данка Николова ще се свърже с Вас в рамките на следващите 24 часа.
              </>
            )}
          </p>
        </div>

        {isAudit && (
          <BankTransferNotice
            amount="600 €"
            reference="Проверка преди проверката"
            variant="dark"
          />
        )}

        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2.5 bg-brand-green text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-brand-green/90 transition-colors cursor-pointer"
        >
          {isAudit ? "Нова заявка" : "Ново запитване"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-black/5 rounded-2xl p-6 sm:p-10 shadow-xl shadow-brand-green/5 max-w-2xl mx-auto"
    >
      <h3 className="font-serif text-2xl font-bold text-brand-green mb-2">
        Свържете се с д-р Данка Николова
      </h3>
      <p className="text-xs text-brand-dark/60 uppercase tracking-widest font-semibold mb-8">
        Защитете бизнеса си преди следващата проверка от БАБХ
      </p>

      {serviceParam && (
        <div className="bg-brand-gold/10 border border-brand-gold/25 rounded-xl p-4 mb-8 text-brand-dark/95 text-xs flex flex-wrap items-center gap-2">
          <span className="font-bold text-brand-green">Избрана услуга за запитване:</span>
          <span className="bg-brand-green/10 text-brand-green font-semibold px-2 py-0.5 rounded border border-brand-green/5">{serviceParam}</span>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r flex items-start text-sm">
          <AlertCircle className="h-5 w-5 mr-3 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
            Име и фамилия <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Иван Петров"
            className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
            Телефонен номер <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+359 888 123 456"
            className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
            Имейл адрес <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="office@example.com"
            className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all"
            required
          />
        </div>

        <div>
          <label htmlFor="businessType" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
            Тип на бизнеса
          </label>
          <select
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all"
          >
            <option value="restaurant">Ресторант / Заведение</option>
            <option value="production">Хранително производство / Цех</option>
            <option value="bakery">Пекарна / Сладкарница</option>
            <option value="store">Магазин за храни</option>
            <option value="catering">Кетъринг фирма</option>
            <option value="other">Друг хранителен обект</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
          Как можем да Ви помогнем?
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={formData.message}
          onChange={handleChange}
          placeholder={`Моля, опишете Вашия обект и казус. За по-точна оферта е полезно да посочите:
• Населено място (град/село)
• Приблизителна площ на обекта и дейност (напр. ресторант, склад, магазин)
• Брой служители
• Имате ли вече съществуващи HACCP документи или предписания от БАБХ
• Желан срок за изготвяне на документите`}
          className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all resize-y min-h-[140px]"
        ></textarea>
      </div>

      <div className="mb-8">
        <label className="flex items-start text-xs text-brand-dark/70 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="mt-0.5 mr-3 h-4 w-4 rounded border-brand-green/20 text-brand-gold focus:ring-brand-gold"
            required
          />
          <span>
            Съгласявам се личните ми данни да бъдат обработвани за целите на отговор на това запитване съгласно{" "}
            <a href="/privacy" className="text-brand-gold hover:underline font-semibold">
              Политиката за поверителност
            </a>
            . <span className="text-red-500">*</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 px-6 bg-brand-green text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-green/95 transition-all duration-300 rounded shadow-md flex items-center justify-center space-x-2 disabled:bg-brand-green/50 cursor-pointer"
      >
        {status === "loading" ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
            Изпращане...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 text-brand-gold mr-1" />
            Изпрати Запитване
          </>
        )}
      </button>
    </form>
  );
}
