import Link from "next/link";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="bg-brand-light min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border border-brand-green/5 rounded-2xl p-8 sm:p-12 shadow-sm">
        <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-brand-green/10">
          <FileText className="h-8 w-8 text-brand-gold" />
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
            Условия за ползване
          </h1>
        </div>

        <div className="space-y-6 text-sm text-brand-dark/80 leading-relaxed">
          <p>
            Последна промяна: 20 май 2026 г.
          </p>
          <p>
            Добре дошли в уебсайта на д-р Данка Николова. Моля, прочетете внимателно настоящите Условия за ползване, преди да използвате услугите на сайта.
          </p>

          <h2 className="font-serif text-lg font-bold text-brand-green mt-8">
            1. Използване на сайта
          </h2>
          <p>
            Този сайт предоставя информация за услугите, предлагани от д-р Данка Николова в областта на безопасността и контрола на храните. Информацията на сайта има общ информационен характер и не заменя професионалната индивидуална консултация за специфичен обект.
          </p>

          <h2 className="font-serif text-lg font-bold text-brand-green mt-8">
            2. Резервации и плащания
          </h2>
          <p>
            Резервацията на часове за онлайн консултации през сайта представлява предварително запитване. Часът се счита за окончателно потвърден след свързване с клиента по имейл или телефон и уточняване на детайлите по плащането.
          </p>

          <h2 className="font-serif text-lg font-bold text-brand-green mt-8">
            3. Отговорност
          </h2>
          <p>
            Разработването на HACCP и ISO системи изисква предоставяне на точна информация от страна на клиента относно сградата, технологичното оборудване и персонала на обекта. Ние не носим отговорност за несъответствия, възникнали вследствие на предоставени неточни или непълни данни.
          </p>

          <h2 className="font-serif text-lg font-bold text-brand-green mt-8">
            4. Интелектуална собственост
          </h2>
          <p>
            Всички текстове, графики, лога и концепции на сайта са собственост на д-р Данка Николова и са защитени от Закона за авторското право и сродните му права. Използването им без изрично писмено съгласие е забранено.
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
