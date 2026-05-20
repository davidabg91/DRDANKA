"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

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

  // Pre-populate message if service query param is present
  useEffect(() => {
    if (serviceParam) {
      setFormData((prev) => ({
        ...prev,
        message: prev.message || `Здравейте, интересувам се от оферта за услугата: „${serviceParam}“.`,
      }));
    }
  }, [serviceParam]);

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

    // Simulate API request (Firebase integration ready)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        businessType: "restaurant",
        message: "",
        agreeToTerms: false,
      });
    } catch {
      setStatus("error");
      setErrorMessage("Възникна грешка при изпращането. Моля, опитайте отново.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white border border-brand-gold/30 rounded-xl p-8 text-center shadow-lg max-w-xl mx-auto my-6">
        <CheckCircle2 className="h-16 w-16 text-brand-gold mx-auto mb-4" />
        <h3 className="font-serif text-2xl font-bold text-brand-green mb-2">
          Запитването е изпратено!
        </h3>
        <p className="text-brand-dark/80 text-sm mb-6 leading-relaxed">
          Благодарим Ви, че се свързахте с нас. Д-р Данка Николова или член на нашия екип ще се свърже с Вас в рамките на следващите 24 часа.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2.5 bg-brand-green text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-brand-green/90 transition-colors"
        >
          Ново запитване
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
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Опишете Вашия казус (напр. нужда от нова HACCP система, актуализация на документи, подготовка за одит...)"
          className="w-full bg-brand-light/50 border border-brand-green/10 rounded px-4 py-3 text-sm focus:border-brand-gold focus:bg-white focus:outline-none transition-all resize-none"
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
