'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { GitCompare, CalendarCheck, X } from 'lucide-react';

export function CompareBar({
  selectedCount,
  onCompare,
  onActionPlan,
  onClear
}: {
  selectedCount: number;
  onCompare: () => void;
  onActionPlan: () => void;
  onClear: () => void;
}) {
  const locale = useLocale();

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-slate-950 text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] px-4 py-2.5 flex items-center gap-4 font-sans select-none animate-in fade-in slide-in-from-bottom-4">
      {/* Selected Count Indicator */}
      <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
        <span className="w-6 h-6 bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center font-mono">
          {selectedCount}
        </span>
        <div className="text-xs font-semibold font-devanagari">
          {locale === 'hi' ? 'मार्ग चयनित' : 'Selected Routes'}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button 
          onClick={onCompare}
          disabled={selectedCount < 2}
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold font-devanagari px-3.5 py-2 border border-slate-700 transition-all flex items-center gap-1.5"
        >
          <GitCompare className="w-3.5 h-3.5 text-brand-400" />
          <span>{locale === 'hi' ? 'तुलना मैट्रिक्स' : 'Compare Matrix'}</span>
        </button>

        <button 
          onClick={onActionPlan}
          className="bg-saffron-500 hover:bg-saffron-400 text-slate-950 text-xs font-black font-devanagari px-4 py-2 border border-saffron-600 shadow-sm transition-all flex items-center gap-1.5 active:translate-x-0.5"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>{locale === 'hi' ? 'एक्शन प्लान बनाएं' : 'Get Action Plan'}</span>
        </button>

        <button 
          onClick={onClear}
          className="text-slate-400 hover:text-white p-1.5 transition-colors border border-transparent hover:border-slate-700"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
