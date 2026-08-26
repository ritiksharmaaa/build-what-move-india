'use client';

import React from 'react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { formatCostRange } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle2, Lock, AlertTriangle, Sparkles, RefreshCw, MessageCircle } from 'lucide-react';

export function PathwayNode({ 
  node, 
  selected = false,
  onToggle,
  onAskAI
}: { 
  node: EvaluatedNode;
  selected?: boolean;
  onToggle?: (id: string) => void;
  onAskAI?: (node: EvaluatedNode) => void;
}) {
  const locale = useLocale() as 'en' | 'hi';
  const t = useTranslations('doorStatus');

  const name = locale === 'en' ? node.nameEn : node.nameHi;
  const reason = locale === 'en' ? node.doorReasonEn : node.doorReasonHi;

  const isClosed = node.doorStatus === 'closed';
  const isOpen = node.doorStatus === 'open';
  const isWarning = node.doorStatus === 'conditional' || node.doorStatus === 'harder';
  const isRecovery = node.doorStatus === 'reopenable';

  return (
    <div
      className={`p-4 border-2 transition-all relative flex flex-col justify-between font-mono ${
        selected
          ? 'border-emerald-600 bg-emerald-50 text-slate-950 node-active-glow shadow-[3px_3px_0px_0px_rgba(22,163,74,1)]'
          : isClosed
          ? 'border-red-300 bg-red-50/40 text-slate-400 opacity-60 shadow-sm'
          : isWarning
          ? 'border-amber-500 bg-amber-50 text-slate-950 shadow-[2px_2px_0px_0px_rgba(245,158,11,1)]'
          : isRecovery
          ? 'border-blue-500 bg-blue-50 text-slate-950 shadow-[2px_2px_0px_0px_rgba(59,130,246,1)]'
          : 'border-slate-900 bg-white text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:translate-x-0.5 hover:translate-y-0.5'
      }`}
    >
      {/* Top Status & Selection Row */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <span
          className={`text-[9px] font-mono uppercase font-black px-2 py-0.5 border flex items-center gap-1 ${
            isOpen
              ? 'bg-emerald-600 text-white border-emerald-700'
              : isClosed
              ? 'bg-red-600 text-white border-red-700'
              : isWarning
              ? 'bg-amber-500 text-slate-950 border-amber-600'
              : isRecovery
              ? 'bg-blue-600 text-white border-blue-700'
              : 'bg-slate-200 text-slate-800 border-slate-400'
          }`}
        >
          {isOpen && <CheckCircle2 className="w-2.5 h-2.5" />}
          {isClosed && <Lock className="w-2.5 h-2.5" />}
          {isWarning && <AlertTriangle className="w-2.5 h-2.5" />}
          {isRecovery && <RefreshCw className="w-2.5 h-2.5" />}
          <span>{t(node.doorStatus)}</span>
        </span>

        {onToggle && !isClosed && (
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={selected}
              onChange={() => onToggle(node.nodeId)}
              className="w-4 h-4 border-2 border-slate-900 text-emerald-600 focus:ring-0 cursor-pointer accent-emerald-600"
            />
            <span className="text-[9px] uppercase font-bold text-slate-500 hidden sm:inline">Compare</span>
          </label>
        )}
      </div>

      {/* Node Title */}
      <h3 className="font-black text-sm text-slate-950 leading-snug font-devanagari mb-1">
        {name}
      </h3>

      {/* Authority / Category */}
      <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mb-2 line-clamp-1">
        {node.family.toUpperCase()} • {node.competitiveness.replace('_', ' ').toUpperCase()}
      </div>

      {/* Status Reason */}
      <p className="text-xs text-slate-600 font-devanagari leading-relaxed mb-3 line-clamp-2 border-l-2 border-slate-300 pl-2">
        {reason}
      </p>

      {/* Cost & Recovery Bottom Bar */}
      <div className="border-t border-slate-200 pt-2 mt-auto text-[11px] font-mono flex items-center justify-between text-slate-700">
        <span className="text-slate-500">Est. Cost:</span>
        <span className="font-bold text-slate-950">
          {node.costRange.max > 0 ? formatCostRange(node.costRange.min, node.costRange.max, locale) : '₹0 (Free / Govt)'}
        </span>
      </div>

      {/* Recovery Route Pill */}
      {node.doorStatus === 'reopenable' && node.recoveryRoute && (
        <div className="mt-2 text-[10px] font-bold text-blue-900 bg-blue-100/80 border border-blue-300 p-1.5 flex items-center gap-1">
          <RefreshCw className="w-3 h-3 text-blue-700 shrink-0 animate-spin" />
          <span className="line-clamp-1">
            {locale === 'en' ? node.recoveryRoute.steps[0].action : 'वैकल्पिक पुनर्प्राप्ति मार्ग उपलब्ध'}
          </span>
        </div>
      )}

      {/* Boxy AI Guidance Button */}
      {onAskAI && (
        <button 
          onClick={() => onAskAI(node)}
          className="mt-3 w-full py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-[10px] font-mono font-bold uppercase tracking-wider border-2 border-brand-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-saffron-300" />
          <span>{locale === 'hi' ? 'AI से सलाह लें' : 'Consult AI Advisor'}</span>
        </button>
      )}
    </div>
  );
}
