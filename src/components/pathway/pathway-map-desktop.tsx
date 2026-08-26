'use client';

import React from 'react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { PathwayNode } from './pathway-node';
import { useLocale } from 'next-intl';

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
    stepIndex: string,
    titleEn: string, 
    titleHi: string, 
    subtitleEn: string, 
    subtitleHi: string, 
    accentColor: string,
    columnNodes: EvaluatedNode[]
  ) => (
    <div className="flex-1 flex flex-col gap-4 font-sans">
      {/* Calm, Minimalist Column Header */}
      <div className={`bg-white border border-slate-200 p-4 shadow-sm border-t-4 ${accentColor}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
            {stepIndex}
          </span>
          <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 border border-slate-200">
            {columnNodes.length} {locale === 'hi' ? 'मार्ग' : 'routes'}
          </span>
        </div>

        <h2 className="text-base font-bold text-slate-900 tracking-tight font-devanagari">
          {locale === 'hi' ? titleHi : titleEn}
        </h2>
        <p className="text-xs text-slate-500 font-devanagari mt-0.5">
          {locale === 'hi' ? subtitleHi : subtitleEn}
        </p>
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
          <div className="text-xs text-slate-400 italic p-8 border border-dashed border-slate-200 bg-slate-50/50 text-center font-sans">
            {locale === 'hi' ? 'वर्तमान पैरामीटर अनुसार इस स्तर पर कोई मार्ग नहीं।' : 'No pathways in this tier based on current inputs.'}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="hidden lg:grid grid-cols-3 gap-6 items-start w-full max-w-7xl mx-auto">
      {renderColumn(
        'STAGE 01',
        'Foundation & Prerequisites',
        'आरंभिक चरण व आधारशिला',
        'Current stage decisions & board streams',
        'वर्तमान स्तर के निर्णय व संकाय चयन',
        'border-t-brand-600',
        now
      )}
      {renderColumn(
        'STAGE 02',
        'Degrees & Entrance Gateways',
        'मध्यम चरण व प्रवेश द्वार',
        'Qualifying exams, college degrees & training',
        'प्रतियोगी परीक्षाएं, स्नातक डिग्री व प्रशिक्षण',
        'border-t-saffron-500',
        next
      )}
      {renderColumn(
        'STAGE 03',
        'Terminal Career Goals',
        'दीर्घकालिक लक्ष्य व करियर',
        'Government officers & terminal professions',
        'राजपत्रित अधिकारी, न्यायिक सेवा व विशेषज्ञ पद',
        'border-t-emerald-600',
        future
      )}
    </div>
  );
}
