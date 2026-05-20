import Link from "next/link";
import { ShieldCheck, Mail, Clock, MapPin } from "lucide-react";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white border-t border-brand-gold/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/logo-icon.png"
                alt="Д-р Данка Николова Лого"
                className="h-10 w-10 object-contain rounded-full border border-brand-gold/20 shadow-sm"
              />
              <div>
                <span className="font-serif text-lg font-bold text-white block leading-none">
                  Д-р Данка Николова
                </span>
                <span className="text-[10px] text-brand-gold font-light tracking-widest uppercase block mt-1">
                  Хранителен контрол
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Вече 27 години помагаме на хранителния бизнес в България да работи сигурно, законно и безпроблемно при инспекции от БАБХ.
            </p>
            <div className="flex space-x-3">
              <span className="inline-block text-[10px] font-semibold tracking-wider text-brand-gold border border-brand-gold/30 px-2 py-1 rounded bg-brand-gold/5 uppercase">
                HACCP
              </span>
              <span className="inline-block text-[10px] font-semibold tracking-wider text-brand-gold border border-brand-gold/30 px-2 py-1 rounded bg-brand-gold/5 uppercase">
                ISO 22000
              </span>
              <span className="inline-block text-[10px] font-semibold tracking-wider text-brand-gold border border-brand-gold/30 px-2 py-1 rounded bg-brand-gold/5 uppercase">
                IFS
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white tracking-wider uppercase border-b border-brand-gold/20 pb-3 mb-6">
              Бързи връзки
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-white/70 hover:text-brand-gold transition-colors duration-200">
                  Начало
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white/70 hover:text-brand-gold transition-colors duration-200">
                  Услуги по безопасност
                </Link>
              </li>
              <li>
                <Link href="/consultations" className="text-white/70 hover:text-brand-gold transition-colors duration-200">
                  Онлайн консултации
                </Link>
              </li>
              <li>
                <Link href="/training" className="text-white/70 hover:text-brand-gold transition-colors duration-200">
                  Обучения за персонала
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-brand-gold transition-colors duration-200">
                  За д-р Николова
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/70 hover:text-brand-gold transition-colors duration-200">
                  Блог и статии
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-brand-gold transition-colors duration-200">
                  Контакти
                </Link>
              </li>
            </ul>
          </div>

          {/* Core Services Summary */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white tracking-wider uppercase border-b border-brand-gold/20 pb-3 mb-6">
              Основни услуги
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li>Разработване на НАССР системи</li>
              <li>Внедряване на ISO 22000 & IFS</li>
              <li>Технологични карти и рецептури</li>
              <li>Мониторингови процедури (GMP)</li>
              <li>Подготовка за проверки от БАБХ</li>
              <li>Аудит и актуализация на документи</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-serif text-base font-semibold text-white tracking-wider uppercase border-b border-brand-gold/20 pb-3 mb-6">
              Контакти
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-gold mr-3 shrink-0 mt-0.5" />
                <span className="text-white/75">
                  гр. Плевен, ул. „Данаил Попов“ 12<br />(Консултации за цяла България)
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-brand-gold mr-3 shrink-0" />
                <a href="mailto:d.nikolova.haccp@gmail.com" className="text-white/75 hover:text-brand-gold transition-colors">
                  d.nikolova.haccp@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 text-brand-gold mr-3 shrink-0" />
                <span className="text-white/75">
                  Пон - Пет: 09:00 - 18:00 ч.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} Д-р Данка Николова. Всички права запазени.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-brand-gold transition-colors">
              Поверителност
            </Link>
            <Link href="/terms" className="hover:text-brand-gold transition-colors">
              Условия за ползване
            </Link>
            <span>
              Разработка за безопасност на храните
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
