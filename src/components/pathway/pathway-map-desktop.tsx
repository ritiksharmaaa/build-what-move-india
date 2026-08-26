'use client';

import React from 'react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { PathwayNode } from './pathway-node';
import { useLocale } from 'next-intl';
import { Sparkles, Layers, Target, Compass } from 'lucide-react';

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

  const renderColumn = (
    titleEn: string, 
    titleHi: string, 
    subtitleEn: string, 
    subtitleHi: string, 
    badgeText: string, 
    Icon: React.ElementType,
    columnNodes: EvaluatedNode[]
  ) => (
    <div className="flex-1 flex flex-col gap-4 font-mono">
      {/* Boxy Tier Column Header with Proper Semantic Titles */}
      <div className="bento-box p-3.5 border-2 border-slate-900 bg-slate-900 text-white flex flex-col gap-1.5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-saffron-400" />
            <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-slate-800 text-saffron-300 border border-slate-700">
              {badgeText}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 bg-slate-950 border border-slate-800">
            {columnNodes.length} NODES
          </span>
        </div>

        <div>
          <h2 className="text-sm font-black text-white font-devanagari tracking-tight">
            {locale === 'hi' ? titleHi : titleEn}
          </h2>
          <p className="text-[10px] text-slate-400 font-devanagari leading-tight">
            {locale === 'hi' ? subtitleHi : subtitleEn}
          </p>
        </div>
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
      {renderColumn(
        'Immediate Steps & Foundation',
        'आरंभिक चरण व आधारशिला',
        'Current stage decisions & prerequisites',
        'वर्तमान स्तर के निर्णय व अनिवार्य पूर्व-शर्तें',
        'PHASE 1 • NOW',
        Compass,
        now
      )}
      {renderColumn(
        'Next Phase & Gateways',
        'मध्यम चरण व प्रवेश द्वार',
        'Qualifying exams, degrees & training',
        'प्रतियोगी परीक्षाएं, स्नातक डिग्री व प्रशिक्षण',
        'PHASE 2 • NEXT',
        Layers,
        next
      )}
      {renderColumn(
        'Future Goals & Destinations',
        'दीर्घकालिक लक्ष्य व करियर',
        'Government officers & terminal professions',
        'राजपत्रित अधिकारी, न्यायिक सेवा व विशेषज्ञ पद',
        'PHASE 3 • FUTURE',
        Target,
        future
      )}
    </div>
  );
}
