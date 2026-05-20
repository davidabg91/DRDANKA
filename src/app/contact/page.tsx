import ContactForm from "@/components/ContactForm";
import { Mail, Clock, MapPin, ShieldCheck, HelpCircle } from "lucide-react";

export default function Contact() {
  const contactDetails = [
    {
      title: "Имейл адрес",
      info: "d.nikolova.haccp@gmail.com",
      sub: "Отговаряме до 24 часа",
      icon: Mail,
      link: "mailto:d.nikolova.haccp@gmail.com",
    },
    {
      title: "Адрес на офиса",
      info: "гр. Плевен, ул. „Данаил Попов“ 12, ет. 2",
      sub: "Консултации за цяла България",
      icon: MapPin,
      link: null,
    },
  ];

  return (
    <div className="bg-brand-light pb-24">
      {/* Page Header */}
      <section className="bg-brand-green py-20 text-center relative overflow-hidden border-b border-brand-gold/15">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-gold/5 via-transparent to-transparent opacity-75 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase text-brand-gold tracking-widest block">
            СВЪРЖЕТЕ СЕ С НАШИЯ ЕКИП
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Контакти и Консултации
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Свържете се с д-р Данка Николова за бърз отговор на Вашите запитвания по безопасност и контрол на храните.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Info */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact details list */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase text-brand-gold tracking-wider block mb-2">
                БЪРЗ КОНТАКТ
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-green">
                Винаги на разположение за бизнеса
              </h2>
              <p className="text-sm text-brand-dark/70 leading-relaxed mt-4">
                Изпратете ни запитване през формата за оферта или резервирайте онлайн консултация за бърза реакция при спешни случаи (БАБХ предписания или проверки).
              </p>
            </div>

            <div className="space-y-6">
              {contactDetails.map((detail, i) => {
                const Icon = detail.icon;
                return (
                  <div
                    key={i}
                    className="bg-white border border-brand-green/5 rounded-xl p-5 shadow-sm flex items-center space-x-4 hover:border-brand-gold/25 transition-all duration-300"
                  >
                    <div className="bg-brand-green/5 p-3 rounded-lg border border-brand-green/10 text-brand-green shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/45">
                        {detail.title}
                      </h3>
                      {detail.link ? (
                        <a
                          href={detail.link}
                          className="text-sm font-serif font-bold text-brand-green hover:text-brand-gold transition-colors block mt-0.5"
                        >
                          {detail.info}
                        </a>
                      ) : (
                        <span className="text-sm font-serif font-bold text-brand-green block mt-0.5">
                          {detail.info}
                        </span>
                      )}
                      <span className="text-xs text-brand-dark/60 block mt-0.5">
                        {detail.sub}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Office hours and registry card */}
            <div className="bg-brand-dark/5 border border-brand-green/5 rounded-xl p-6 text-xs space-y-4">
              <h4 className="font-bold text-brand-green uppercase tracking-wider flex items-center">
                <Clock className="h-4 w-4 text-brand-gold mr-2" />
                Работно време и Обслужване
              </h4>
              <p className="text-brand-dark/80 leading-relaxed">
                Работим с клиенти от цялата страна. Онлайн консултации и обмен на документи се извършват в рамките на официалното работно време.
              </p>
              <div className="border-t border-brand-green/5 pt-3 text-[10px] text-brand-dark/60 flex items-center justify-between">
                <span>ЕИК/Булстат: BG123456789</span>
                <span className="flex items-center text-brand-green font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-gold mr-1" />
                  Регистриран консултант
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>

        {/* Interactive Google Map with Coverage Info */}
        <div className="mt-20 border border-brand-green/10 rounded-2xl overflow-hidden bg-white shadow-lg p-3 relative">
          <div className="relative w-full h-[450px] rounded-xl overflow-hidden border border-brand-green/5">
            {/* Real Google Map Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2907.8247942767223!2d24.6166160767175!3d43.412260271114945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a9f3e4b78fa5d5%3A0xbd8f8f8b89e7a9b0!2z0YPQuy4g00LDQvdCw0LjQuyDQn9C-0L_QvtCyIDEyLCA1ODAwINCf0LvQtdCy0LXQvSwg0QsdC-0LvQs9Cw0YDQuNGP!5e0!3m2!1sbg!2sbg!4v1716200000000!5m2!1sbg!2sbg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[20%] opacity-95 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            ></iframe>

            {/* Floating Info Overlay for Desktop */}
            <div className="hidden md:block absolute top-6 left-6 z-10 max-w-sm bg-white/95 backdrop-blur border border-brand-green/10 rounded-xl p-6 shadow-2xl space-y-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-brand-gold/10 border border-brand-gold/30 text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                ЦЕНТРАЛЕН ОФИС
              </span>
              <div>
                <h3 className="font-serif text-base font-bold text-brand-green flex items-center">
                  <MapPin className="h-4.5 w-4.5 text-brand-gold mr-2 shrink-0" />
                  гр. Плевен
                </h3>
                <p className="text-xs text-brand-dark/80 mt-1 pl-6.5">
                  ул. „Данаил Попов“ 12, ет. 2
                </p>
              </div>
              <div className="border-t border-brand-green/5 pt-3">
                <h4 className="text-[10px] font-bold text-brand-green uppercase tracking-wider mb-1">
                  Национално покритие за цяла България
                </h4>
                <p className="text-[11px] text-brand-dark/75 leading-relaxed">
                  Изготвяме документация, поддържаме абонаменти и извършваме одити онлайн за София, Пловдив, Варна, Бургас, Русе, Стара Загора, Благоевград и цялата страна.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Info Card (Visible only on mobile/tablet) */}
          <div className="md:hidden mt-4 bg-brand-light/50 border border-brand-green/5 rounded-xl p-5 space-y-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/30 text-[10px] font-bold text-brand-gold uppercase tracking-wider">
              ЦЕНТРАЛЕН ОФИС
            </span>
            <div>
              <h3 className="font-serif text-sm font-bold text-brand-green flex items-center">
                <MapPin className="h-4 w-4 text-brand-gold mr-2 shrink-0" />
                гр. Плевен
              </h3>
              <p className="text-xs text-brand-dark/85 mt-0.5 pl-6">
                ул. „Данаил Попов“ 12, ет. 2
              </p>
            </div>
            <div className="border-t border-brand-green/5 pt-2">
              <h4 className="text-[10px] font-bold text-brand-green uppercase tracking-wider mb-1">
                Национално покритие:
              </h4>
              <p className="text-xs text-brand-dark/75 leading-relaxed">
                Изготвяме документация, поддържаме абонаменти и извършваме одити онлайн за София, Пловдив, Варна, Бургас, Русе, Стара Загора, Благоевград и цялата страна.
              </p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
