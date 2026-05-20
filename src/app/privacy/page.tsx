import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="bg-brand-light min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-brand-green/5 rounded-2xl p-8 sm:p-12 shadow-sm">
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-brand-green/10">
          <ShieldCheck className="h-8 w-8 text-brand-gold" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
            Политика за поверителност
          </h1>
        </div>

        <div className="space-y-6 text-sm text-brand-dark/80 leading-relaxed">
          <p>
            Последна промяна: 20 май 2026 г.
          </p>
          <p>
            Настоящата Политика за поверителност описва как събираме, използваме и съхраняваме Вашите лични данни, когато посещавате нашия уебсайт или използвате формите ни за контакт и резервация.
          </p>

          <h2 className="font-serif text-lg font-bold text-brand-green mt-8">
            1. Данни, които събираме
          </h2>
          <p>
            Когато изпращате запитване или правите резервация за онлайн консултация, ние събираме следните данни:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Име и фамилия</li>
            <li>Телефонен номер</li>
            <li>Имейл адрес</li>
            <li>Тип на Вашия бизнес</li>
            <li>Всяка допълнителна информация, която изберете да споделите в съобщението си</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-brand-green mt-8">
            2. Цел на обработката на данните
          </h2>
          <p>
            Ние обработваме събраните данни единствено за следните цели:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>За да отговорим на Вашето запитване за услуги</li>
            <li>За да планираме и проведем резервираната онлайн консултация</li>
            <li>За издаване на счетоводни документи при заплащане на услуги</li>
            <li>За изпращане на сертификати за завършено обучение</li>
          </ul>

          <h2 className="font-serif text-lg font-bold text-brand-green mt-8">
            3. Съхранение и сигурност
          </h2>
          <p>
            Ние не споделяме Вашите данни с трети лица, освен ако това не е изискано по закон. Данните се съхраняват в защитени системи с ограничен достъп съгласно изискванията на Регламент (ЕС) 2016/679 (GDPR).
          </p>

          <h2 className="font-serif text-lg font-bold text-brand-green mt-8">
            4. Вашите права
          </h2>
          <p>
            Имате право по всяко време да поискате достъп до Вашите лични данни, тяхното коригиране или пълно изтриване от нашите системи. За целта се свържете с нас на имейл: <a href="mailto:d.nikolova.haccp@gmail.com" className="text-brand-gold hover:underline font-semibold">d.nikolova.haccp@gmail.com</a>.
          </p>

          <div className="pt-8 border-t border-brand-green/10 mt-8">
            <Link
              href="/"
              className="text-xs font-bold text-brand-green hover:text-brand-gold uppercase tracking-wider transition-colors"
            >
              &larr; Обратно към началната страница
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
