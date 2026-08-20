"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS } from "@/data/faq";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`border rounded-xl transition-all duration-300 backdrop-blur-sm ${
              isOpen
                ? "border-brand-gold/50 bg-white/[0.08] shadow-lg"
                : "border-white/10 bg-white/[0.05] hover:border-white/25 hover:bg-white/[0.07]"
            }`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
            >
              <span className="flex items-center text-sm sm:text-base font-serif font-bold text-brand-light pr-4">
                <HelpCircle className="h-5 w-5 text-brand-gold mr-3 shrink-0" />
                {faq.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-brand-gold transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-96 opacity-100 border-t border-white/10" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-5 text-sm text-brand-light/75 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
