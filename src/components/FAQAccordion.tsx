"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Какво представлява HACCP системата и задължителна ли е за моя бизнес?",
    answer: "Да, съгласно българското законодателство (Закона за храните) и европейския Регламент (ЕО) № 852/2004, HACCP системата е абсолютно задължителна за всеки обект, който борави с храни – заведения, ресторанти, магазини, пекарни, складове, кетъринг компании и производствени предприятия.",
  },
  {
    question: "Колко време отнема разработването на НАССР документация?",
    answer: "Стандартните НАССР системи и Системи за самоконтрол се разработват в рамките на 5 до 10 работни дни след провеждане на първоначалния одит на обекта. За големи производствени предприятия с комплексни линии срокът се договаря индивидуално.",
  },
  {
    question: "Какви са санкциите при липса на работещи Системи за самоконтрол?",
    answer: "При инспекция от БАБХ (Българска агенция по безопасност на храните) и констатиране на липса на НАССР документация или неработеща система, имуществените санкции за юридически лица започват от 1,000 € (около 2,000 лв.) и могат да достигнат до временно затваряне на обекта.",
  },
  {
    question: "Може ли консултацията и подготовката на документи да се извършат онлайн?",
    answer: "Да, напълно. Чрез онлайн консултации, видеовръзка и електронен обмен на данни можем да съставим, актуализираме и внедрим системи за безопасност за обекти в цяла България. Това пести време и средства за пътни разходи.",
  },
  {
    question: "Какво включва актуализацията на една съществуваща НАССР система?",
    answer: "Актуализацията е необходима при промяна в менюто/асортимента, инсталиране на ново оборудване, промяна в технологичния поток или промени в нормативната уредба. Тя включва преглед на настоящите процедури, отстраняване на предписания от БАБХ и добавяне на нови мониторингови форми.",
  },
];

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
            className={`border rounded-xl transition-all duration-300 ${
              isOpen
                ? "border-brand-gold bg-brand-gold/5 shadow-md"
                : "border-brand-green/10 bg-white hover:border-brand-green/20"
            }`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
            >
              <span className="flex items-center text-sm sm:text-base font-serif font-bold text-brand-green pr-4">
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
                isOpen ? "max-h-96 opacity-100 border-t border-brand-green/5" : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-5 text-sm text-brand-dark/80 leading-relaxed bg-white/50">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
