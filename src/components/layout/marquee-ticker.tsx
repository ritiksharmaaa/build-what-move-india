'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export function MarqueeTicker() {
  const t = useTranslations('ticker');

  const items = [
    t('items.0'),
    t('items.1'),
    t('items.2'),
    t('items.3'),
    t('items.4'),
    t('items.5'),
    t('items.6'),
    t('items.7'),
  ];

  return (
    <div className="w-full bg-slate-900 text-white border-y border-slate-950 overflow-hidden flex items-center shadow-inner">
      {/* Sleek Compact Badge */}
      <div className="shrink-0 bg-saffron-600 text-white px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border-r border-slate-950 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        <span className="hidden sm:inline">{t('liveBadge')}</span>
        <span className="sm:hidden">UPDATES</span>
      </div>

      {/* Compact Marquee Scroller */}
      <div className="flex-1 overflow-hidden py-1 relative flex items-center">
        <div className="flex whitespace-nowrap animate-marquee">
          {items.map((item, idx) => (
            <span
              key={`ticker-1-${idx}`}
              className="inline-flex items-center mx-4 text-xs font-medium tracking-wide text-slate-200"
            >
              {item}
              <span className="ml-4 text-slate-600 font-bold">•</span>
            </span>
          ))}
        </div>
        <div className="flex whitespace-nowrap animate-marquee" aria-hidden="true">
          {items.map((item, idx) => (
            <span
              key={`ticker-2-${idx}`}
              className="inline-flex items-center mx-4 text-xs font-medium tracking-wide text-slate-200"
            >
              {item}
              <span className="ml-4 text-slate-600 font-bold">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
