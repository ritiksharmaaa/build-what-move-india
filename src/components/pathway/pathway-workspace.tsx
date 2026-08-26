'use client';

import React, { useState } from 'react';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import type { EvaluatedNode, GraphStatistics } from '@/lib/contracts/pathway';
import { ParameterBar } from './parameter-bar';
import { StatisticsBar } from './statistics-bar';
import { FissionPathwayGraph } from './fission-pathway-graph';
import { PathwayMapDesktop } from './pathway-map-desktop';
import { PathwayMapMobile } from './pathway-map-mobile';
import { CompareBar } from './compare-bar';
import { CompareModal } from './compare-modal';
import { ActionPlanModal } from './action-plan-modal';
import { AiExplanationModal } from './ai-explanation-modal';
import { useLocale } from 'next-intl';
import { Sparkles, Layers, GitBranch, ShieldCheck } from 'lucide-react';

export function PathwayWorkspace({
  initialInput,
  initialNodes,
  initialStats,
  rawGraphData,
}: {
  initialInput: StudentDecisionInput;
  initialNodes: EvaluatedNode[];
  initialStats: GraphStatistics;
  rawGraphData: { nodes: any[]; edges: any[]; sources: any[] };
}) {
  const [input, setInput] = useState<StudentDecisionInput>(initialInput);
  const [nodes, setNodes] = useState<EvaluatedNode[]>(initialNodes);
  const [stats, setStats] = useState<GraphStatistics>(initialStats);
  const [cascadeMsg, setCascadeMsg] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [activeAiNode, setActiveAiNode] = useState<EvaluatedNode | null>(null);
  const [activeTab, setActiveTab] = useState<'fission' | 'detailed'>('fission');

  const locale = useLocale();

  const handleToggleNode = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        alert('You can compare up to 3 paths at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleParameterChange = async (key: keyof StudentDecisionInput, value: any) => {
    const newInput = { ...input, [key]: value };
    setInput(newInput);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: newInput,
          oldNodes: nodes,
          changedKey: key,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setNodes(data.nodes);
        setStats(data.stats);
        if (data.cascade?.summaryEn) {
          setCascadeMsg(locale === 'hi' ? (data.cascade.summaryHi || data.cascade.summaryEn) : data.cascade.summaryEn);
          setTimeout(() => setCascadeMsg(null), 5000);
        }
      }
    } catch (e) {
      console.error('Failed to re-evaluate graph', e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBFD]">
      {/* Symmetrical Parameter Bar */}
      <ParameterBar input={input} onChange={handleParameterChange} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-5">
        {/* Symmetrical Header Box */}
        <div className="bento-box p-4 sm:p-5 border-2 border-slate-900 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                DECISION TOPOLOGY • उत्तर प्रदेश व केंद्रीय
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight font-devanagari mt-0.5">
              {locale === 'hi' ? 'आपका व्यक्तिगत करियर मानचित्र' : 'Your Personal Career Map'}
            </h1>
            <p className="text-xs text-slate-500 font-devanagari">
              {locale === 'hi'
                ? 'आपके वर्तमान स्तर, स्ट्रीम और बजट के आधार पर वास्तविक संभावनाएं'
                : 'Live cascade topology calculated against statutory prerequisites and budget constraints.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <StatisticsBar stats={stats} />
          </div>
        </div>

        {/* View Switcher Tabs (Symmetrical Bento Buttons) */}
        <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-2">
          <button
            onClick={() => setActiveTab('fission')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
              activeTab === 'fission'
                ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
            }`}
          >
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>{locale === 'hi' ? '⚛️ परमाणु विखंडन श्रृंखला (Fission Graph)' : '⚛️ Nuclear Fission Chain'}</span>
          </button>

          <button
            onClick={() => setActiveTab('detailed')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-2 transition-all ${
              activeTab === 'detailed'
                ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-brand-400" />
            <span>{locale === 'hi' ? 'विस्तृत नोड मैट्रिक्स (Tiered Nodes)' : 'Detailed Tiered Nodes'}</span>
          </button>
        </div>

        {/* Toast Notification for Cascade Changes */}
        {cascadeMsg && (
          <div className="bg-slate-950 text-white border-2 border-brand-500 px-6 py-3.5 shadow-xl font-mono text-xs flex items-center justify-between animate-toast-in">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{cascadeMsg}</span>
            </div>
            <button
              onClick={() => setCascadeMsg(null)}
              className="text-slate-400 hover:text-white font-mono text-sm pl-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dynamic Visualizer View */}
        {activeTab === 'fission' ? (
          <FissionPathwayGraph studentInput={input} onSelectNode={handleToggleNode} />
        ) : (
          <div className="space-y-6">
            <PathwayMapDesktop
              nodes={nodes}
              selectedIds={selectedIds}
              onToggle={handleToggleNode}
              onAskAI={setActiveAiNode}
            />
            <PathwayMapMobile
              nodes={nodes}
              selectedIds={selectedIds}
              onToggle={handleToggleNode}
              onAskAI={setActiveAiNode}
            />
          </div>
        )}
      </main>

      {/* Floating Compare Action Bar */}
      <CompareBar
        selectedCount={selectedIds.length}
        onCompare={() => setShowCompare(true)}
        onActionPlan={() => setShowPlan(true)}
        onClear={() => setSelectedIds([])}
      />

      {/* Modals */}
      {showCompare && (
        <CompareModal
          nodes={nodes.filter((n) => selectedIds.includes(n.nodeId))}
          onClose={() => setShowCompare(false)}
        />
      )}

      {showPlan && (
        <ActionPlanModal
          nodes={nodes.filter((n) => selectedIds.includes(n.nodeId))}
          onClose={() => setShowPlan(false)}
        />
      )}

      {activeAiNode && (
        <AiExplanationModal
          node={activeAiNode}
          input={input}
          onClose={() => setActiveAiNode(null)}
        />
      )}
    </div>
  );
}
