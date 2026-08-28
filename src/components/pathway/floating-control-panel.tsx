'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import type { GraphStatistics } from '@/lib/contracts/pathway';
import { RotateCcw, Download, GitBranch, Network, Share2, Layers } from 'lucide-react';

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

  const handleToggleView = () => {
    const modes: PathwayViewMode[] = ['chain', 'neural', 'fission', 'detailed'];
    const currentIndex = modes.indexOf(activeView);
    onViewChange(modes[(currentIndex + 1) % modes.length]);
  };

  return (
    <div className="flex flex-row items-center gap-2 font-sans select-none pointer-events-auto">
      
      {/* 1. Actions (Retake / Download) moved to left */}
      <div className="flex items-center gap-2">
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 w-10 h-10 bg-slate-900 text-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-slate-800 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            title="Reset Active Selections"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
        {onPrint && (
          <button
            onClick={onPrint}
            className="flex items-center justify-center gap-1.5 w-10 h-10 bg-brand-500 text-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-brand-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            title="Print / Save Career Dossier PDF"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Open / Locked Stats (Ultra Compact) */}
      <div className="flex items-center justify-center px-3 h-10 bg-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] gap-2">
        <div className="flex items-center gap-1.5" title="Open Paths">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900" />
          <span className="text-xs font-black text-slate-900">{stats.openPaths}</span>
        </div>
        <div className="flex items-center gap-1.5" title="Locked Paths">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-slate-900" />
          <span className="text-xs font-black text-slate-900">{stats.closedPaths}</span>
        </div>
      </div>

      {/* 3. Filters (Native selects with short labels and arrows) */}
      <div className="flex items-center h-10 bg-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] divide-x-2 divide-slate-900">
        <select
          className="bg-transparent text-[10px] font-black uppercase text-slate-900 focus:outline-none cursor-pointer pl-3 pr-1 h-full"
          value={input.stage}
          onChange={(e) => onParameterChange('stage', e.target.value)}
        >
          <option value="class_10">STAGE: 10TH</option>
          <option value="class_12">STAGE: 12TH</option>
          <option value="graduate">STAGE: GRAD</option>
          <option value="dropout">STAGE: DROP</option>
        </select>

        <select
          className="bg-transparent text-[10px] font-black uppercase text-slate-900 focus:outline-none cursor-pointer pl-3 pr-1 h-full"
          value={input.class12Stream || 'science_with_maths'}
          onChange={(e) => onParameterChange('class12Stream', e.target.value)}
        >
          <option value="science_with_maths">STREAM: PCM</option>
          <option value="science_without_maths">STREAM: PCB</option>
          <option value="commerce_with_maths">STREAM: COMM+</option>
          <option value="commerce_without_maths">STREAM: COMM</option>
          <option value="humanities">STREAM: ARTS</option>
          <option value="vocational">STREAM: VOC</option>
        </select>

        <select
          className="bg-transparent text-[10px] font-black uppercase text-brand-600 focus:outline-none cursor-pointer pl-3 pr-1 h-full"
          value={input.budgetBand}
          onChange={(e) => onParameterChange('budgetBand', e.target.value)}
        >
          <option value="low">BUDGET: LOW</option>
          <option value="medium">BUDGET: MID</option>
          <option value="high">BUDGET: HIGH</option>
        </select>
      </div>

      {/* 4. Original Mode Toggle Button */}
      <button 
        onClick={handleToggleView}
        className="flex items-center justify-center gap-2 px-4 h-10 bg-white text-slate-950 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-slate-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
      >
        {activeView === 'chain' && <GitBranch className="w-4 h-4 text-brand-600" />}
        {activeView === 'neural' && <Network className="w-4 h-4 text-brand-600" />}
        {activeView === 'fission' && <Share2 className="w-4 h-4 text-brand-600" />}
        {activeView === 'detailed' && <Layers className="w-4 h-4 text-brand-600" />}
        
        <span className="text-[10px] font-black uppercase tracking-wider">
          {activeView === 'chain' ? (locale === 'hi' ? 'श्रृंखला दृश्य' : 'CHAIN MODE') :
           activeView === 'neural' ? (locale === 'hi' ? 'न्यूरल दृश्य' : 'NEURAL MODE') :
           activeView === 'fission' ? (locale === 'hi' ? 'ग्रिड दृश्य' : 'GRID MODE') :
           (locale === 'hi' ? 'नोड्स दृश्य' : 'NODES MODE')}
        </span>
      </button>

    </div>
  );
}
