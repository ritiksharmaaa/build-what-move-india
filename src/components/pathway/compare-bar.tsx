'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { GitCompare, CalendarCheck, X } from 'lucide-react';

export function CompareBar({
  selectedCount,
  onCompare,
  onActionPlan,
  onClear,
}: {
  selectedCount: number;
  onCompare: () => void;
  onActionPlan: () => void;
  onClear: () => void;
}) {
  const locale = useLocale();

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[70] pointer-events-none">
      <div className="w-full mx-auto px-4 sm:px-8 max-w-[1400px] flex justify-end">
        <div className="inline-flex items-center gap-3 font-sans select-none pointer-events-auto animate-in fade-in slide-in-from-bottom-4 -mr-[13px]">
          {/* Selected Count Indicator */}
          <div className="flex items-center justify-center px-3 h-10 bg-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center font-mono">
              {selectedCount}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">
              {locale === 'hi' ? 'मार्ग चयनित' : 'SELECTED'}
            </span>
            <button 
              onClick={onClear}
              className="text-slate-400 hover:text-red-500 transition-colors ml-1"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Compare Action Button */}
          <button 
            onClick={onCompare}
            disabled={selectedCount < 2}
            className="flex items-center justify-center gap-2 px-4 h-10 bg-slate-900 text-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-slate-800 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0_0_#0f172a]"
          >
            <GitCompare className="w-4 h-4 text-brand-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              {locale === 'hi' ? 'तुलना मैट्रिक्स' : 'COMPARE MATRIX'}
            </span>
          </button>

          {/* Action Plan Button */}
          <button 
            onClick={onActionPlan}
            disabled={selectedCount === 0}
            className="flex items-center justify-center gap-2 px-4 h-10 bg-saffron-500 text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-saffron-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0_0_#0f172a]"
          >
            <CalendarCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              {locale === 'hi' ? 'एक्शन प्लान' : 'GET ACTION PLAN'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
