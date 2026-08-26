'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { ArrowLeft } from 'lucide-react';

export function BrandStamp() {
  const locale = useLocale();

  return (
    <div className="fixed top-3 left-3 z-[60] flex items-center gap-2 pointer-events-auto font-sans select-none">
      {/* Emblem & Portal Brand */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-slate-900 text-white flex flex-col items-center justify-center font-mono font-black text-xs border border-slate-900 shadow-sm group-hover:scale-105 transition-transform">
          <span className="text-saffron-400 text-[8px] leading-none">॥</span>
          <span className="text-white text-[10px] font-bold leading-none">PF</span>
        </div>
        <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 border border-slate-200 shadow-sm hidden sm:flex flex-col">
          <span className="text-xs font-bold text-slate-950 tracking-tight leading-none font-devanagari">
            {locale === 'hi' ? 'पाथफाइंडर' : 'PathFinder'}
          </span>
          <span className="text-[9px] text-slate-500 font-mono leading-none mt-0.5">
            One Nation • One Portal
          </span>
        </div>
      </Link>

      {/* Back to Home Button immediately following logo */}
      <Link
        href="/"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-xs font-medium border border-slate-300 shadow-sm transition-all active:scale-95"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
        <span className="font-devanagari font-semibold text-[11px]">
          {locale === 'hi' ? 'पोर्टल पर वापस' : 'Back to Home'}
        </span>
      </Link>
    </div>
  );
}
