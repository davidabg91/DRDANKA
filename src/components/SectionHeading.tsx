import React from 'react';

interface SectionHeadingProps {
  badgeText: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  lightText?: boolean;
  className?: string;
}

export default function SectionHeading({
  badgeText,
  title,
  subtitle,
  align = 'center',
  lightText = false,
  className = '',
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  const textColor = lightText ? 'text-white' : 'text-brand-green';
  const subtitleColor = lightText ? 'text-white/80' : 'text-brand-dark/75';

  return (
    <div className={`${isCenter ? 'text-center mx-auto' : 'text-left'} max-w-4xl relative group z-10 ${className}`}>
      {/* Modern Eyebrow / Badge */}
      <div className={`flex items-center ${isCenter ? 'justify-center' : 'justify-start'} gap-4 mb-5 sm:mb-6`}>
        {/* Left Line */}
        {isCenter && <div className={`h-[1px] w-8 sm:w-16 bg-gradient-to-r ${lightText ? 'from-transparent to-brand-gold/80' : 'from-transparent to-brand-gold/60'}`}></div>}
        {!isCenter && <div className={`h-[2px] w-8 sm:w-12 bg-brand-gold`}></div>}
        
        {/* The Text */}
        <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r ${lightText ? 'from-brand-gold via-[#FFF4E0] to-brand-gold' : 'from-brand-green via-[#1A5C4A] to-brand-gold'} drop-shadow-sm`}>
          {badgeText}
        </span>
        
        {/* Right Line */}
        {isCenter && <div className={`h-[1px] w-8 sm:w-16 bg-gradient-to-l ${lightText ? 'from-transparent to-brand-gold/80' : 'from-transparent to-brand-gold/60'}`}></div>}
      </div>
      
      {/* Main Title with Premium Font */}
      <h2 className={`font-logo text-4xl sm:text-5xl lg:text-[3.2rem] font-bold leading-[1.05] tracking-tight ${textColor} mb-6`}>
        {title}
      </h2>
      
      {/* Subtitle */}
      {subtitle && (
        <p className={`text-sm sm:text-base lg:text-lg leading-relaxed ${subtitleColor} max-w-2xl font-medium ${isCenter ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
