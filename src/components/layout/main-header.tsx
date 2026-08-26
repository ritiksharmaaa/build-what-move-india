'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSwitcher } from './language-switcher';
import { Sparkles, Compass, BookOpen, GitBranch } from 'lucide-react';

export function MainHeader() {
  const t = useTranslations('header');
  const navT = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const handleReplayGreeting = () => {
    sessionStorage.removeItem('pathfinder_greeting_seen');
    window.location.reload();
  };

  const navLinks = [
    { href: '/', label: navT('home'), icon: Compass },
    { href: '/start', label: navT('start'), icon: Sparkles },
    { href: '/map', label: navT('map'), icon: GitBranch },
    { href: '/about', label: navT('mission'), icon: BookOpen },
  ];

  return (
    <header className="border-b-2 border-slate-900 bg-white sticky top-0 z-40 shadow-sm">
      {/* Sleek top micro-bar */}
      <div className="bg-slate-950 text-slate-300 text-[10px] font-mono py-0.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="font-bold text-white tracking-widest uppercase">
              {t('slogan')}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-300 font-medium">
              {locale === 'hi'
                ? '⚠️ स्वतंत्र हैकथॉन प्रोटोटाइप (कोई आधिकारिक सरकारी उत्पाद नहीं)'
                : '⚠️ Independent Hackathon Prototype (Not an Official Government Product)'}
            </span>
          </div>
          <button
            onClick={handleReplayGreeting}
            className="text-slate-400 hover:text-white transition-colors underline decoration-slate-600 text-[9px] uppercase font-mono tracking-wider ml-auto"
          >
            {t('replayGreeting')}
          </button>
        </div>
      </div>

      {/* Main Compact Header Container (h-14 / 56px) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand Emblem & Titles */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-slate-900 text-white flex flex-col items-center justify-center font-mono font-black text-sm border-2 border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
            <span className="text-saffron-400 text-[10px] leading-none">॥</span>
            <span className="text-white text-xs font-bold leading-none">PF</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-950 tracking-tight leading-tight">
                {locale === 'hi' ? 'पाथफाइंडर इंडिया' : 'PathFinder India'}
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono uppercase px-1 py-0 bg-blue-50 border border-blue-200 text-blue-800 font-bold">
                v2.0
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-500 font-devanagari leading-none mt-0.5">
              {t('subtitle')}
            </div>
          </div>
        </Link>

        {/* Symmetrical Navigation Links (Compact) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-0.5 border border-slate-300">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wide uppercase transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:text-slate-950'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Right: Language switcher & mobile CTA */}
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <Link
            href="/start"
            className="hidden sm:flex items-center gap-1 bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border-2 border-brand-800 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Sparkles className="w-3 h-3" />
            <span>{locale === 'hi' ? 'मार्ग खोजें' : 'Start'}</span>
          </Link>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="lg:hidden flex overflow-x-auto border-t border-slate-200 bg-slate-50 px-3 py-1.5 gap-1.5 text-xs">
        {navLinks.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
