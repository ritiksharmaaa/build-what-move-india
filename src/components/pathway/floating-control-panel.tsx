'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import type { GraphStatistics } from '@/lib/contracts/pathway';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Layers,
  GitBranch,
  Network,
  Share2,
  GripHorizontal
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

  const viewOptions: { id: PathwayViewMode; labelEn: string; labelHi: string; icon: React.ElementType }[] = [
    { id: 'chain', labelEn: 'Chain', labelHi: 'श्रृंखला', icon: GitBranch },
    { id: 'neural', labelEn: 'Neural', labelHi: 'न्यूरल', icon: Network },
    { id: 'fission', labelEn: 'Grid', labelHi: 'ग्रिड', icon: Share2 },
    { id: 'detailed', labelEn: 'Nodes', labelHi: 'नोड्स', icon: Layers },
  ];

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: 0, y: 0 }}
      className="fixed bottom-4 left-4 z-[60] font-sans select-none pointer-events-auto cursor-default"
      style={{ touchAction: 'none' }}
    >
      <div className="w-72 sm:w-80 bento-box bg-white border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] transition-all">
        {/* Calm Drag Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900 text-white cursor-grab active:cursor-grabbing border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GripHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold tracking-wide text-slate-100 font-devanagari">
              {locale === 'hi' ? 'पाथफाइंडर विज़ुअलाइज़र' : 'Pathfinder Visualizer'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-slate-400 hover:text-white text-xs px-1 font-bold transition-colors"
              title={isMinimized ? 'Expand' : 'Collapse'}
            >
              {isMinimized ? '+' : '−'}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className="p-3 space-y-3">
            {/* Calm Segmented Tab Pill Switcher */}
            <div className="bg-slate-100 p-1 rounded-md grid grid-cols-4 gap-1 border border-slate-200">
              {viewOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = activeView === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onViewChange(opt.id)}
                    className={`py-1.5 px-1 text-center text-xs font-medium rounded flex flex-col items-center justify-center gap-0.5 transition-all ${
                      isActive
                        ? 'bg-white text-slate-950 font-semibold shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span className="text-[10px] leading-none font-devanagari">
                      {locale === 'hi' ? opt.labelHi : opt.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Collapsible Filter Accordion */}
            <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-50/50">
              <button
                onClick={() => setParamsOpen(!paramsOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                  <span className="font-devanagari">
                    {locale === 'hi' ? 'फ़िल्टर व शैक्षणिक पैरामीटर' : 'Filter Parameters'}
                  </span>
                </div>
                {paramsOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {paramsOpen && (
                <div className="px-3 pb-3 pt-1 space-y-2.5 bg-white border-t border-slate-200 text-xs">
                  {/* Stage */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      {locale === 'hi' ? 'शैक्षणिक स्तर (Stage)' : 'Academic Stage'}
                    </label>
                    <select
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      value={input.stage}
                      onChange={(e) => onParameterChange('stage', e.target.value)}
                    >
                      <option value="class_10">Class 10 (10वीं माध्यमिक)</option>
                      <option value="class_12">Class 12 (12वीं उच्च माध्यमिक)</option>
                      <option value="graduate">Graduate (स्नातक)</option>
                      <option value="dropout">Dropped Out (अन्य)</option>
                    </select>
                  </div>

                  {/* Stream */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      {locale === 'hi' ? '12वीं संकाय (Stream)' : 'Class 12 Stream'}
                    </label>
                    <select
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      value={input.class12Stream || 'science_with_maths'}
                      onChange={(e) => onParameterChange('class12Stream', e.target.value)}
                    >
                      <option value="science_with_maths">Science (PCM with Maths)</option>
                      <option value="science_without_maths">Science (PCB with Biology)</option>
                      <option value="commerce_with_maths">Commerce (with Maths)</option>
                      <option value="commerce_without_maths">Commerce (General)</option>
                      <option value="humanities">Arts & Humanities</option>
                      <option value="vocational">Vocational / Diploma</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      {locale === 'hi' ? 'वार्षिक बजट (Annual Budget)' : 'Annual Budget'}
                    </label>
                    <select
                      className="w-full bg-emerald-50/60 border border-emerald-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={input.budgetBand}
                      onChange={(e) => onParameterChange('budgetBand', e.target.value)}
                    >
                      <option value="low">Low (≤₹25,000 / Govt Only)</option>
                      <option value="medium">Mid (≤₹1.5 Lakh / Affordable)</option>
                      <option value="high">High (Private / Deemed)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Calm Footer with Metrics & Quick Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-900 font-semibold">{stats.openPaths}</span> open
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-slate-900 font-semibold">{stats.closedPaths}</span> locked
                </span>
              </div>

              <div className="flex items-center gap-1">
                {onReset && (
                  <button
                    onClick={onReset}
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded transition-colors"
                    title="Reset Active Selections"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                {onPrint && (
                  <button
                    onClick={onPrint}
                    className="p-1.5 hover:bg-slate-100 text-emerald-700 hover:text-emerald-900 rounded transition-colors"
                    title="Print / Save Career Dossier PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
