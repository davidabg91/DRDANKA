"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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
          isOpen || isScrolled ? "py-3 shadow-xl" : "py-5"
        }`}
      >
        {/* Background Layers for smooth transition */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Scrolled glassmorphism backdrop (Base layer) */}
          <div className="absolute inset-0 bg-[#0A1F18]/90 backdrop-blur-xl border-b border-brand-gold/20" />
          
          {/* Base gradient (Fades out when scrolled, unless menu is open) */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-[#0A1F18] via-[#0D2B1C] to-[#081410] border-b transition-all duration-300 ${
              isOpen || !isScrolled ? "opacity-100 border-brand-gold/10" : "opacity-0 border-brand-gold/20"
            }`}
          />
          {/* Subtle mesh pattern for texture */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px), repeating-linear-gradient(-45deg, #ffffff 0, #ffffff 1px, transparent 1px, transparent 20px)"
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group shrink-0">
              <img
                src="/logo-icon.png"
                alt="Д-р Данка Николова Лого"
                className="h-14 w-14 object-contain rounded-full border border-brand-gold/30 group-hover:border-brand-gold transition-colors duration-300 shadow-md"
              />
              <div>
                <span className="font-logo text-lg lg:text-xl xl:text-2xl font-bold text-white tracking-wide block leading-none">
                  Д-р Данка Николова
                </span>
                <span className="text-[10px] xl:text-xs text-brand-gold font-light tracking-widest uppercase block mt-1">
                  Академия сигурен хранителен бизнес
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center flex-grow gap-x-1 xl:gap-x-2 px-4 xl:px-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative lg:text-[11px] xl:text-[12px] font-semibold tracking-wider transition-all duration-200 uppercase whitespace-nowrap px-3 py-1.5 rounded-full cursor-pointer ${
                      isActive
                        ? "text-brand-dark bg-brand-gold shadow-sm"
                        : "text-white/75 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Call to Action */}
            <div className="hidden lg:flex items-center shrink-0 space-x-2.5">
              {/* Primary CTA — gold pill with shimmer */}
              <Link
                href="/consultations"
                className="relative inline-flex items-center justify-center overflow-hidden xl:px-5 lg:px-3.5 py-2 text-[11px] xl:text-[12px] font-bold uppercase tracking-wider text-brand-dark bg-brand-gold hover:bg-brand-gold-light rounded-full shadow-md hover:shadow-lg hover:shadow-brand-gold/30 transition-all duration-300 whitespace-nowrap cursor-pointer group"
              >
                {/* shimmer sweep */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
                Заяви консултация
              </Link>
              {/* Secondary CTA — glass pill */}
              <Link
                href="/profile"
                className="inline-flex items-center justify-center xl:px-5 lg:px-3.5 py-2 text-[11px] xl:text-[12px] font-bold uppercase tracking-wider text-brand-gold rounded-full border border-brand-gold/40 bg-brand-gold/5 backdrop-blur-sm hover:bg-brand-gold/15 hover:border-brand-gold/80 transition-all duration-300 shadow-sm whitespace-nowrap cursor-pointer"
              >
                Вход / Портал
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-brand-gold focus:outline-none p-1.5 rounded-lg hover:bg-brand-gold/10 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`lg:hidden fixed inset-0 top-0 z-40 bg-brand-green transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10 pointer-events-none invisible"
        }`}
      >
        <div className="px-4 pb-8 pt-24 space-y-4 flex flex-col h-full justify-between">
          <nav className="flex flex-col space-y-4 border-t border-brand-gold/15 pt-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium tracking-wide py-2 uppercase border-b border-white/5 ${
                    isActive ? "text-brand-gold font-semibold" : "text-white/80"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 pb-20">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="w-full text-center block px-6 py-3 text-sm font-bold uppercase tracking-wider text-brand-gold rounded-full border border-brand-gold/40 bg-brand-gold/5 backdrop-blur-sm hover:bg-brand-gold/15 hover:border-brand-gold/80 transition-all duration-300 shadow-sm cursor-pointer"
            >
              Вход / Портал
            </Link>
            <Link
              href="/consultations"
              onClick={() => setIsOpen(false)}
              className="relative w-full text-center block overflow-hidden px-6 py-3 text-sm font-bold uppercase tracking-wider text-brand-dark bg-brand-gold hover:bg-brand-gold-light rounded-full shadow-md hover:shadow-lg hover:shadow-brand-gold/30 transition-all duration-300 cursor-pointer group"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
              Заяви консултация
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
