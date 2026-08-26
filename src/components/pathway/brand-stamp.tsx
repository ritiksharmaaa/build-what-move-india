'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export function BrandStamp() {
  const locale = useLocale();

  return (
    <div className="fixed top-3 left-3 z-[60] flex items-center gap-2 pointer-events-auto">
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-slate-900 text-white flex flex-col items-center justify-center font-mono font-black text-xs border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform">
          <span className="text-saffron-400 text-[8px] leading-none">॥</span>
          <span className="text-white text-[10px] font-bold leading-none">PF</span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 border border-slate-300 shadow-sm hidden sm:flex flex-col">
          <span className="text-[11px] font-black text-slate-950 tracking-tight leading-none">
            {locale === 'hi' ? 'पाथफाइंडर' : 'PathFinder'}
          </span>
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none mt-0.5">
            One Nation • One Portal
          </span>
        </div>
      </Link>
    </div>
  );
}
