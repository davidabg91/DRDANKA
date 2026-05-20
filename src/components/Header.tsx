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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isOpen
          ? "bg-brand-green py-3 border-b border-brand-gold/20"
          : isScrolled
          ? "bg-brand-green/95 backdrop-blur-md shadow-lg py-3 border-b border-brand-gold/20"
          : "bg-brand-green py-5 border-b border-brand-gold/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="bg-brand-gold/10 p-2 rounded-lg border border-brand-gold/30 group-hover:border-brand-gold transition-colors duration-300">
              <ShieldCheck className="h-8 w-8 text-brand-gold" />
            </div>
            <div>
              <span className="font-serif text-lg lg:text-xl xl:text-2xl font-bold text-white tracking-wide block leading-none">
                Д-р Данка Николова
              </span>
              <span className="text-[10px] xl:text-xs text-brand-gold font-light tracking-widest uppercase block mt-1">
                Хранителен контрол & Сигурност
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center md:space-x-4 lg:space-x-5 xl:space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`md:text-xs lg:text-[13px] xl:text-sm font-medium tracking-wide transition-colors duration-200 uppercase whitespace-nowrap ${
                    isActive
                      ? "text-brand-gold border-b-2 border-brand-gold pb-1"
                      : "text-white/80 hover:text-brand-gold"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Call to Action */}
          <div className="hidden lg:flex items-center shrink-0">
            <Link
              href="/consultations"
              className="relative inline-flex items-center justify-center lg:px-4 xl:px-6 py-2.5 text-[11px] xl:text-xs font-semibold uppercase tracking-wider text-brand-dark bg-brand-gold hover:bg-brand-gold-light transition-all duration-300 rounded shadow-md hover:shadow-brand-gold/25 whitespace-nowrap"
            >
              Заяви консултация
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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

      {/* Mobile Drawer Navigation */}
      <div
        className={`md:hidden fixed inset-0 top-0 z-40 bg-brand-green transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
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

          <div className="space-y-4 pb-20">
            <Link
              href="/consultations"
              onClick={() => setIsOpen(false)}
              className="w-full text-center block px-6 py-3 text-sm font-semibold uppercase tracking-wider text-brand-dark bg-brand-gold hover:bg-brand-gold-light transition-colors duration-300 rounded shadow-md"
            >
              Заяви консултация
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
