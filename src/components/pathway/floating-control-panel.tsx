'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import type { GraphStatistics } from '@/lib/contracts/pathway';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  RotateCcw, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Layers,
  GitBranch,
  Network,
  Share2
} from 'lucide-react';

export type PathwayViewMode = 'chain' | 'neural' | 'fission' | 'detailed';

interface FloatingControlPanelProps {
  activeView: PathwayViewMode;
  onViewChange: (view: PathwayViewMode) => void;
  input: StudentDecisionInput;
  onParameterChange: (key: keyof StudentDecisionInput, value: any) => void;
  stats: GraphStatistics;
  onReset?: () => void;
  onPrint?: () => void;
}

export function FloatingControlPanel({
  activeView,
  onViewChange,
  input,
  onParameterChange,
  stats,
  onReset,
  onPrint,
}: FloatingControlPanelProps) {
  const locale = useLocale();
  const [paramsOpen, setParamsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const viewOptions: { id: PathwayViewMode; label: string; icon: React.ElementType }[] = [
    { id: 'chain', label: locale === 'hi' ? 'श्रृंखला' : 'Chain', icon: GitBranch },
    { id: 'neural', label: locale === 'hi' ? 'न्यूरल' : 'Neural', icon: Network },
    { id: 'fission', label: locale === 'hi' ? 'ग्रिड' : 'Grid', icon: Share2 },
    { id: 'detailed', label: locale === 'hi' ? 'मैट्रिक्स' : 'Nodes', icon: Layers },
  ];

  return (
    <div className="fixed top-3 right-3 z-[60] font-mono select-none pointer-events-auto">
      <div className="w-72 bg-white border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {locale === 'hi' ? 'मानचित्र नियंत्रण' : 'Pathfinder Engine'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors underline decoration-slate-600"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>{locale === 'hi' ? 'पोर्टल' : 'Home'}</span>
            </Link>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-slate-400 hover:text-white text-xs pl-1 font-bold"
              title={isMinimized ? 'Expand' : 'Collapse'}
            >
              {isMinimized ? '+' : '−'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* View Switcher Tabs (4 Boxy Options) */}
            <div className="grid grid-cols-4 border-b-2 border-slate-900 bg-slate-100">
              {viewOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = activeView === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onViewChange(opt.id)}
                    className={`py-1.5 px-1 text-center text-[10px] font-bold uppercase flex flex-col items-center justify-center gap-0.5 border-r last:border-r-0 border-slate-300 transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-inner'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Collapsible Live Parameters Accordion */}
            <div className="border-b border-slate-200">
              <button
                onClick={() => setParamsOpen(!paramsOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3 h-3 text-brand-600" />
                  <span>{locale === 'hi' ? 'त्वरित पैरामीटर' : 'Live Filter Matrix'}</span>
                </div>
                {paramsOpen ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
              </button>

              {paramsOpen && (
                <div className="px-3 pb-2.5 pt-1 space-y-2 bg-slate-50 border-t border-slate-200 text-[11px]">
                  {/* Stage */}
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">
                      Stage (स्तर):
                    </label>
                    <select
                      className="w-full bg-white border border-slate-400 font-bold px-2 py-1 text-xs focus:outline-none"
                      value={input.stage}
                      onChange={(e) => onParameterChange('stage', e.target.value)}
                    >
                      <option value="class_10">Class 10 (10वीं)</option>
                      <option value="class_12">Class 12 (12वीं)</option>
                      <option value="graduate">Graduate (स्नातक)</option>
                      <option value="dropout">Dropped Out</option>
                    </select>
                  </div>

                  {/* Stream */}
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">
                      Stream (वर्ग):
                    </label>
                    <select
                      className="w-full bg-white border border-slate-400 font-bold px-2 py-1 text-xs focus:outline-none"
                      value={input.class12Stream || 'science_with_maths'}
                      onChange={(e) => onParameterChange('class12Stream', e.target.value)}
                    >
                      <option value="science_with_maths">Science (PCM)</option>
                      <option value="science_without_maths">Science (PCB)</option>
                      <option value="commerce_with_maths">Commerce (Maths)</option>
                      <option value="commerce_without_maths">Commerce (No Maths)</option>
                      <option value="humanities">Arts / Humanities</option>
                      <option value="vocational">Vocational / Diploma</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">
                      Budget (वार्षिक बजट):
                    </label>
                    <select
                      className="w-full bg-emerald-50 border border-slate-400 font-bold px-2 py-1 text-xs focus:outline-none"
                      value={input.budgetBand}
                      onChange={(e) => onParameterChange('budgetBand', e.target.value)}
                    >
                      <option value="low">Low (≤₹25k Govt Only)</option>
                      <option value="medium">Mid (≤₹1.5L Affordable)</option>
                      <option value="high">High (Private Deemed)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons & Mini Stats */}
            <div className="px-3 py-2 flex items-center justify-between text-[10px] bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">{stats.openPaths} OPEN</span>
                <span className="text-slate-500">•</span>
                <span className="text-red-400 font-bold">{stats.closedPaths} LOCK</span>
              </div>

              <div className="flex items-center gap-1.5">
                {onReset && (
                  <button
                    onClick={onReset}
                    className="p-1 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    title="Reset Active Path Selection"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
                {onPrint && (
                  <button
                    onClick={onPrint}
                    className="p-1 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors"
                    title="Print / Save Career Dossier PDF"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
