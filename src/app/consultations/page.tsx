import BookingCalendar from "@/components/BookingCalendar";
import { Laptop, Clock, ShieldCheck, HelpCircle } from "lucide-react";

export default function Consultations() {
  const benefits = [
    {
      title: "Спестявате време и пътни разходи",
      desc: "Няма нужда от физически срещи или пътуване. Получавате същите професионални съвети и насоки директно през Google Meet или телефон.",
      icon: Laptop,
    },
    {
      title: "Бърза реакция при кризисни проверки",
      desc: "Предстои Ви спешен одит или имате предписание от БАБХ? Намерете бърз свободен слот за съвет как да реагирате правилно.",
      icon: Clock,
    },
    {
      title: "Индивидуален писмен доклад",
      desc: "След всяка консултация получавате синтезиран имейл с конкретни стъпки, списък с нужни документи или образци за попълване.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-brand-light pb-24">
      {/* Page Header */}
      <section className="bg-brand-green py-20 text-center relative overflow-hidden border-b border-brand-gold/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-75 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase text-brand-gold tracking-widest block">
            ДИСТАНЦИОННО СЪДЕЙСТВИЕ
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Онлайн Консултации в цяла България
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Резервирайте Вашата виртуална среща с д-р Данка Николова за бърз, сигурен и законосъобразен отговор на Вашите въпроси.
          </p>
        </div>
      </section>

      {/* Benefits Showcase */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={i}
                className="bg-white border border-brand-green/5 rounded-xl p-6 shadow-sm flex items-start space-x-4 hover:border-brand-gold/30 transition-all duration-300"
              >
                <div className="bg-brand-gold/10 p-3 rounded-lg border border-brand-gold/25 text-brand-green shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-brand-green mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-dark/70 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Booking Calendar Integration */}
        <div id="booking" className="space-y-6 scroll-mt-32">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
              Изберете ден и час за среща
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/60 leading-relaxed">
              Всички консултации се извършват лично от д-р Данка Николова в защитена онлайн среда.
            </p>
          </div>
          
          <BookingCalendar />
        </div>

        {/* FAQ mini block */}
        <div className="max-w-3xl mx-auto mt-20 p-6 sm:p-10 bg-white border border-brand-green/5 rounded-2xl shadow-sm">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-green mb-6 flex items-center">
            <HelpCircle className="h-5.5 w-5.5 text-brand-gold mr-3 shrink-0" />
            Как протича една онлайн консултация?
          </h3>
          <div className="space-y-4 text-xs sm:text-sm text-brand-dark/80 leading-relaxed">
            <p>
              <strong className="text-brand-green">1. Резервация:</strong> Изберете пакет и свободен час от формата по-горе. Веднага ще получите потвърждение с детайли за срещата.
            </p>
            <p>
              <strong className="text-brand-green">2. Подготовка:</strong> Преди срещата можете да изпратите Ваши документи, скици или снимки на обекта, за да може д-р Николова да се запознае с тях предварително.
            </p>
            <p>
              <strong className="text-brand-green">3. Среща:</strong> Свързваме се по видеовръзка (Google Meet) или телефон. Анализираме казуса Ви, тълкуваме конкретни разпоредби на БАБХ и набелязваме план за действие.
            </p>
            <p>
              <strong className="text-brand-green">4. Резултати:</strong> До 24 часа след срещата получавате писмен опис с насоки, чек-листове или образци, нужни за коректното функциониране на бизнеса Ви.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
