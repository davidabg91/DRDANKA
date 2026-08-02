"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, UserCircle2, Zap } from "lucide-react";
import { useAuth, useDankaUsers } from "@/lib/firebaseHooks";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Показваме името на фирмата / потребителя вместо „Вход“, когато е логнат.
  const { user: firebaseUser } = useAuth();
  const { users } = useDankaUsers();
  const myDoc = firebaseUser?.email
    ? users.find((u) => u.email.toLowerCase() === firebaseUser.email!.toLowerCase())
    : undefined;
  const portalLabel = firebaseUser
    ? (myDoc?.firmName?.trim() ||
       myDoc?.contact?.trim() ||
       myDoc?.manager?.trim() ||
       (firebaseUser.email || "").split("@")[0] ||
       "Моят профил")
    : null;
  const portalLabelShort =
    portalLabel && portalLabel.length > 18 ? portalLabel.slice(0, 17) + "…" : portalLabel;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Начало", href: "/" },
    { name: "Услуги", href: "/services" },
    { name: "БАБХ Система", href: "/babh-sistema", badge: "ВИП" },
    { name: "Консултации", href: "/consultations" },
    { name: "Обучения", href: "/training" },
    { name: "За мен", href: "/about" },
    { name: "Блог", href: "/blog" },
    { name: "Контакти", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 print:hidden ${
          isScrolled ? "py-2 shadow-2xl" : "py-3 sm:py-3.5"
        }`}
      >
        {/* Seamless Glassmorphism Background Layer */}
        <div className="absolute inset-0 pointer-events-none -z-10 transition-all duration-500">
          <div className="absolute inset-0 bg-[#0A1F18]/85 backdrop-blur-2xl" />
          <div 
            className={`absolute inset-0 bg-gradient-to-r from-[#061410]/90 via-[#0A1F18]/95 to-[#081712]/90 border-b border-brand-gold/15 transition-opacity duration-300 ${
              isScrolled ? "opacity-100" : "opacity-90"
            }`}
          />
          {/* Subtle bottom glowing accent border line */}
          <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
        </div>
        
        <div className="w-full max-w-[1536px] px-3 sm:px-5 lg:px-6 xl:px-10 relative mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group shrink-0 min-w-0">
              <img
                src="/logo-icon.png"
                alt="Д-р Данка Николова Лого"
                className="h-10 w-10 sm:h-12 sm:w-12 flex-none object-contain rounded-full border border-brand-gold/30 group-hover:border-brand-gold transition-colors duration-300 shadow-md"
              />
              <div className="min-w-0 overflow-hidden">
                <span className="font-logo text-sm sm:text-base lg:text-base xl:text-lg 2xl:text-xl font-bold text-white tracking-wide block leading-none group-hover:text-brand-gold transition-colors whitespace-nowrap">
                  Д-р Данка Николова
                </span>
                <span className="text-[9px] xl:text-[10px] text-brand-gold font-light tracking-wider uppercase hidden xl:block mt-0.5 truncate whitespace-nowrap">
                  Академия сигурен хранителен бизнес
                </span>
              </div>
            </Link>

            {/* Desktop Navigation — spreads across full width at larger screens */}
            <nav className="hidden lg:flex items-center justify-evenly flex-1 min-w-0 overflow-hidden gap-x-0.5 lg:gap-x-1 xl:gap-x-2 px-1 lg:px-2 xl:px-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-[10px] lg:text-[11px] xl:text-[11.5px] 2xl:text-[12px] font-bold tracking-wider transition-all duration-200 uppercase whitespace-nowrap px-2 lg:px-2.5 xl:px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-1 ${
                      isActive
                        ? "text-brand-dark bg-brand-gold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && !isActive && (
                      <span className="text-[7.5px] lg:text-[8px] font-black uppercase px-1 py-0.5 rounded bg-brand-gold/20 text-brand-gold border border-brand-gold/40">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Call to Action Buttons — always visible, never shrink */}
            <div className="hidden lg:flex items-center flex-none">
              {/* Portal/Login CTA */}
              <Link
                href="/profile"
                title={portalLabel || undefined}
                className="inline-flex items-center justify-center gap-1 px-2.5 lg:px-3.5 xl:px-4 py-1.5 text-[10px] lg:text-[11px] xl:text-[12px] font-bold uppercase tracking-wider text-brand-gold rounded-full border border-brand-gold/40 bg-brand-gold/10 backdrop-blur-md hover:bg-brand-gold/20 hover:border-brand-gold transition-all duration-300 shadow-sm whitespace-nowrap cursor-pointer max-w-[130px] lg:max-w-[160px] xl:max-w-[210px]"
              >
                {portalLabelShort ? (
                  <>
                    <UserCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-gold" />
                    <span className="truncate">{portalLabelShort}</span>
                  </>
                ) : (
                  "Вход / Портал"
                )}
              </Link>
            </div>

            {/* Mobile Menu Button — Triggers only on screens smaller than 1024px (lg) */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-brand-gold focus:outline-none p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-brand-gold/10 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`lg:hidden fixed inset-0 top-0 z-40 bg-[#06120E]/98 backdrop-blur-2xl transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 pointer-events-none invisible"
        }`}
      >
        <div className="px-6 pb-8 pt-24 space-y-4 flex flex-col h-full justify-between max-w-md mx-auto">
          <nav className="flex flex-col space-y-2.5 border-t border-brand-gold/15 pt-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-bold tracking-wider py-2 uppercase border-b border-white/5 flex items-center justify-between ${
                    isActive ? "text-brand-gold font-black" : "text-white/80 hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-gold text-brand-dark">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 pb-16">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="w-full text-center flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-brand-gold rounded-xl border border-brand-gold/40 bg-brand-gold/10 backdrop-blur-sm hover:bg-brand-gold/20 transition-all shadow-sm cursor-pointer"
            >
              {portalLabelShort ? (
                <>
                  <UserCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                  <span className="truncate">{portalLabelShort}</span>
                </>
              ) : (
                "Вход / Портал"
              )}
            </Link>
            <Link
              href="/consultations"
              onClick={() => setIsOpen(false)}
              className="relative w-full text-center block overflow-hidden px-6 py-3 text-xs font-black uppercase tracking-wider text-brand-dark bg-brand-gold hover:bg-brand-gold-light rounded-xl shadow-lg transition-all cursor-pointer"
            >
              Заяви консултация
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
