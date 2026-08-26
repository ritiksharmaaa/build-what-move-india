'use client';

import React from 'react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { PathwayNode } from './pathway-node';
import { useLocale } from 'next-intl';
import { Layers, ArrowRight } from 'lucide-react';

export function PathwayMapDesktop({ 
  nodes,
  selectedIds = [],
  onToggle,
  onAskAI
}: { 
  nodes: EvaluatedNode[];
  selectedIds?: string[];
  onToggle?: (id: string) => void;
  onAskAI?: (node: EvaluatedNode) => void;
}) {
  const locale = useLocale();

  const now = nodes.filter(n => n.tier === 'now');
  const next = nodes.filter(n => n.tier === 'next');
  const future = nodes.filter(n => n.tier === 'future');

  const renderColumn = (titleEn: string, titleHi: string, stepNumber: string, columnNodes: EvaluatedNode[]) => (
    <div className="flex-1 flex flex-col gap-4 font-mono">
      {/* Boxy Tier Column Header */}
      <div className="bento-box p-3 border-2 border-slate-900 bg-slate-900 text-white flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-saffron-500 text-slate-950 flex items-center justify-center text-[11px] font-black">
            {stepNumber}
          </span>
          <span className="text-xs font-black uppercase tracking-wider">
            {locale === 'hi' ? titleHi : titleEn}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5 bg-slate-800 border border-slate-700">
          {columnNodes.length} NODES
        </span>
      </div>

      {/* Nodes List */}
      <div className="flex flex-col gap-3.5">
        {columnNodes.length > 0 ? (
          columnNodes.map(node => (
            <PathwayNode 
              key={node.nodeId} 
              node={node} 
              selected={selectedIds.includes(node.nodeId)}
              onToggle={onToggle}
              onAskAI={onAskAI}
            />
          ))
        ) : (
          <div className="text-xs text-slate-500 italic p-6 border-2 border-dashed border-slate-300 bg-slate-50 text-center font-mono">
            {locale === 'hi' ? 'वर्तमान पैरामीटर अनुसार इस स्तर पर कोई मार्ग नहीं।' : 'No pathways in this tier based on current inputs.'}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="hidden lg:grid grid-cols-3 gap-6 items-start w-full max-w-7xl mx-auto">
      {renderColumn('Immediate Steps (Now)', 'तात्कालिक कदम (अब)', '1', now)}
      {renderColumn('Next Phase (Degree / Exams)', 'मध्यम चरण (डिग्री / परीक्षा)', '2', next)}
      {renderColumn('Future Careers (Terminal)', 'दीर्घकालिक लक्ष्य (करियर)', '3', future)}
    </div>
  );
}
