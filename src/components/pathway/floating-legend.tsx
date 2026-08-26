'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function FloatingLegend() {
  const [isOpen, setIsOpen] = useState(true);
  const locale = useLocale();

  return (
    <div className="fixed bottom-3 right-3 z-[60] font-mono select-none pointer-events-auto">
      <div className="bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] p-2.5 text-[10px] w-64">
        <div className="flex items-center justify-between font-bold uppercase text-slate-700 pb-1 border-b border-slate-200">
          <span>{locale === 'hi' ? 'मार्ग संकेतक (Legend)' : 'Status Indicators'}</span>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-slate-900"
          >
            {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 border border-emerald-400 shadow-[0_0_8px_#22c55e]" />
              <span className="font-bold text-emerald-800">
                {locale === 'hi' ? 'सक्रिय मार्ग (Active Chain)' : 'Active Verified Route'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-300 border border-slate-400" />
              <span className="text-slate-600">
                {locale === 'hi' ? 'उपलब्ध विकल्प (Available)' : 'Alternative Options'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 text-white flex items-center justify-center text-[8px] font-bold">
                🔒
              </div>
              <span className="font-bold text-red-700">
                {locale === 'hi' ? 'अवरुद्ध (Hard Stop / Math-Bio)' : 'Hard Stop (Prerequisites)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 text-white flex items-center justify-center text-[8px] font-bold">
                ⚠️
              </div>
              <span className="font-bold text-amber-700">
                {locale === 'hi' ? 'बजट जोखिम (Budget Risk)' : 'Budget Warning / Loans'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
