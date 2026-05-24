import BookingCalendar from "@/components/BookingCalendar";
import { Laptop, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ConsultationStepsWidget from "@/remotion/ConsultationStepsWidget";

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

      {/* Sticky Navigation */}
      <div className="sticky top-[85px] z-30 w-full flex justify-center -mt-6 mb-6 px-2 sm:px-4 pointer-events-none transition-all duration-300">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 bg-brand-green/90 backdrop-blur-md py-1.5 px-2 sm:py-2.5 sm:px-6 rounded-2xl border border-brand-gold/20 shadow-xl shadow-black/20 pointer-events-auto">
          <a href="#info" className="px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-xl border border-white/20 text-white text-[9px] sm:text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all shadow-sm">
            Информация
          </a>
          <a href="#booking" className="px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-xl bg-brand-gold hover:bg-brand-gold-light text-brand-dark text-[9px] sm:text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-brand-gold/20 flex items-center gap-1 sm:gap-2">
            Резервирайте <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </a>
        </div>
      </div>

      {/* Benefits Showcase */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <SectionHeading
            badgeText="КАЛЕНДАР"
            title="Изберете ден и час за среща"
            subtitle="Всички консултации се извършват лично от д-р Данка Николова в защитена онлайн среда."
          />
          
          <BookingCalendar />
        </div>

        {/* FAQ mini block */}
        <div id="info" className="scroll-mt-32">
          <ConsultationStepsWidget />
        </div>
      </section>
    </div>
  );
}
