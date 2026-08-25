'use client';

import React from 'react';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import { useTranslations, useLocale } from 'next-intl';
import { Filter, SlidersHorizontal, MapPin } from 'lucide-react';

export function ParameterBar({
  input,
  onChange,
}: {
  input: StudentDecisionInput;
  onChange: (key: keyof StudentDecisionInput, value: any) => void;
}) {
  const t = useTranslations('map.parameterBar');
  const locale = useLocale();

  return (
    <div className="sticky top-28 z-30 bg-white border-b-2 border-slate-900 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mr-2 bg-slate-100 px-2.5 py-1 border border-slate-300">
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
          <span>{locale === 'hi' ? 'त्वरित पैरामीटर' : 'Live Filter'}</span>
        </div>

        {/* Stage Box */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Stage:</span>
          <select
            className="bg-slate-50 border-2 border-slate-900 text-xs font-bold px-3 py-1.5 focus:outline-none focus:bg-brand-50 cursor-pointer"
            value={input.stage}
            onChange={(e) => onChange('stage', e.target.value)}
          >
            <option value="class_10">Class 10 (10वीं)</option>
            <option value="class_12">Class 12 (12वीं)</option>
            <option value="graduate">Graduate (स्नातक)</option>
            <option value="dropout">Dropped Out (ड्रॉपआउट)</option>
          </select>
        </div>

        {/* Stream Box */}
        {(input.stage === 'class_12' || input.stage === 'graduate' || input.stage === 'dropout') && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Stream:</span>
            <select
              className="bg-slate-50 border-2 border-slate-900 text-xs font-bold px-3 py-1.5 focus:outline-none focus:bg-saffron-50 cursor-pointer"
              value={input.class12Stream || 'science_with_maths'}
              onChange={(e) => onChange('class12Stream', e.target.value)}
            >
              <option value="science_with_maths">Science (PCM)</option>
              <option value="science_without_maths">Science (PCB)</option>
              <option value="commerce_with_maths">Commerce (Maths)</option>
              <option value="commerce_without_maths">Commerce (No Maths)</option>
              <option value="humanities">Arts / Humanities</option>
              <option value="vocational">Vocational / Diploma</option>
            </select>
          </div>
        )}

        {/* Budget Box */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Budget:</span>
          <select
            className="bg-emerald-50 border-2 border-slate-900 text-xs font-bold text-slate-950 px-3 py-1.5 focus:outline-none cursor-pointer"
            value={input.budgetBand}
            onChange={(e) => onChange('budgetBand', e.target.value)}
          >
            <option value="low">Budget: Low (≤₹25k)</option>
            <option value="medium">Budget: Mid (≤₹1.5L)</option>
            <option value="high">Budget: High (Private)</option>
          </select>
        </div>

        {/* State Tag */}
        <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-1">
          <MapPin className="w-3 h-3 text-brand-600" />
          <span>State: UP (85% Quota)</span>
        </div>

        <div className="flex-1 hidden md:block" />

        <div className="text-[11px] font-mono text-slate-400 hidden lg:block">
          ⚛️ Real-time cascade recomputation
        </div>
      </div>
    </div>
  );
}
