'use client';

import type { StudentDecisionInput } from '@/lib/contracts/student';
import { useTranslations } from 'next-intl';

export function ParameterBar({
  input,
  onChange
}: {
  input: StudentDecisionInput;
  onChange: (key: keyof StudentDecisionInput, value: any) => void;
}) {
  const t = useTranslations('map.parameterBar');

  return (
    <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Your Choices</span>
        
        {/* Stage Pill */}
        <select 
          className="bg-slate-100 border border-slate-200 text-sm font-semibold rounded-full px-4 py-1.5 focus:ring-2 focus:ring-brand-500 cursor-pointer hover:bg-slate-200 transition-colors"
          value={input.stage}
          onChange={(e) => onChange('stage', e.target.value)}
        >
          <option value="class_10">Class 10</option>
          <option value="class_12">Class 12</option>
          <option value="graduate">Graduate</option>
          <option value="dropout">Dropped Out</option>
        </select>

        {/* Stream Pill (if applicable) */}
        {(input.stage === 'class_12' || input.stage === 'graduate' || input.stage === 'dropout') && (
          <select 
            className="bg-slate-100 border border-slate-200 text-sm font-semibold rounded-full px-4 py-1.5 focus:ring-2 focus:ring-brand-500 cursor-pointer hover:bg-slate-200 transition-colors"
            value={input.class12Stream || ''}
            onChange={(e) => onChange('class12Stream', e.target.value)}
          >
            <option value="science_with_maths">Science (Maths)</option>
            <option value="science_without_maths">Science (No Maths)</option>
            <option value="commerce_with_maths">Commerce (Maths)</option>
            <option value="commerce_without_maths">Commerce (No Maths)</option>
            <option value="humanities">Humanities</option>
          </select>
        )}

        {/* Budget Pill */}
        <select 
          className="bg-brand-50 border border-brand-200 text-brand-700 text-sm font-semibold rounded-full px-4 py-1.5 focus:ring-2 focus:ring-brand-500 cursor-pointer hover:bg-brand-100 transition-colors"
          value={input.budgetBand}
          onChange={(e) => onChange('budgetBand', e.target.value)}
        >
          <option value="low">Budget: Low (Govt)</option>
          <option value="medium">Budget: Medium</option>
          <option value="high">Budget: High (Private)</option>
        </select>
        
        <div className="flex-1"></div>
        
        <div className="text-xs text-slate-500 italic">
          Try changing a choice to see the map react.
        </div>
      </div>
    </div>
  );
}
