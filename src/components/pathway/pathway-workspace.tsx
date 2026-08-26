'use client';

import React, { useState } from 'react';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import type { EvaluatedNode, GraphStatistics } from '@/lib/contracts/pathway';
import { type FissionNode } from '@/lib/data/fission-nodes';
import { BrandStamp } from './brand-stamp';
import { FloatingControlPanel, type PathwayViewMode } from './floating-control-panel';
import { FloatingLegend } from './floating-legend';
import { ChainModulesView } from './chain-modules-view';
import { NeuralGraphView } from './neural-graph-view';
import { FissionPathwayGraph } from './fission-pathway-graph';
import { PathwayMapDesktop } from './pathway-map-desktop';
import { PathwayMapMobile } from './pathway-map-mobile';
import { CompareBar } from './compare-bar';
import { CompareModal } from './compare-modal';
import { ActionPlanModal } from './action-plan-modal';
import { AiExplanationModal } from './ai-explanation-modal';
import { useLocale } from 'next-intl';
import { Sparkles } from 'lucide-react';

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
  
  // Default to the new Chain-of-Modules visualization view
  const [activeView, setActiveView] = useState<PathwayViewMode>('chain');

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

  const handleFissionAskAI = (fissionNode: FissionNode) => {
    const existing = nodes.find((n) => n.nodeId === fissionNode.id);
    if (existing) {
      setActiveAiNode(existing);
    } else {
      const adapter: EvaluatedNode = {
        nodeId: fissionNode.id,
        nameEn: fissionNode.nameEn,
        nameHi: fissionNode.nameHi,
        family: fissionNode.streamFamily === 'pcm' ? 'science' 
               : fissionNode.streamFamily === 'pcb' ? 'healthcare'
               : fissionNode.streamFamily === 'commerce' ? 'commerce'
               : fissionNode.streamFamily === 'humanities' ? 'government'
               : fissionNode.streamFamily === 'vocational' ? 'vocational'
               : 'flexible',
        tier: fissionNode.stage === 1 ? 'now' : fissionNode.stage === 2 ? 'next' : 'future',
        doorStatus: 'open',
        doorReasonEn: fissionNode.descEn,
        doorReasonHi: fissionNode.descHi,
        costRange: {
          min: fissionNode.costMinINR,
          max: fissionNode.costMaxINR,
          type: fissionNode.annualFeeINR === 0 ? 'government' : 'both',
        },
        durationMonths: 12,
        competitiveness: 'moderate',
        futureDoorsOpened: 3,
        futurePathIds: [],
        sources: [],
        score: 95,
      };
      setActiveAiNode(adapter);
    }
  };

  const handleResetPath = () => {
    setInput(initialInput);
    setSelectedIds([]);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto select-none">
      {/* Brand Stamp in Top Left */}
      <BrandStamp />

      {/* Floating Corner Control Panel in Top Right */}
      <FloatingControlPanel
        activeView={activeView}
        onViewChange={setActiveView}
        input={input}
        onParameterChange={handleParameterChange}
        stats={stats}
        onReset={handleResetPath}
        onPrint={handlePrintDossier}
      />

      {/* Floating Status Indicator Legend in Top Right */}
      <FloatingLegend />

      {/* Main Canvas Views */}
      <div className="w-full h-full">
        {activeView === 'chain' && (
          <ChainModulesView
            studentInput={input}
            onSelectNode={handleToggleNode}
            onAskAI={handleFissionAskAI}
          />
        )}

        {activeView === 'neural' && (
          <NeuralGraphView
            studentInput={input}
            onSelectNode={handleToggleNode}
            onAskAI={handleFissionAskAI}
          />
        )}

        {activeView === 'fission' && (
          <div className="w-full min-h-screen bg-[#FAFBFD] pt-16 pb-20 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
              <FissionPathwayGraph
                studentInput={input}
                onSelectNode={handleToggleNode}
              />
            </div>
          </div>
        )}

        {activeView === 'detailed' && (
          <div className="w-full min-h-screen bg-[#FAFBFD] pt-16 pb-20 px-4 sm:px-8 space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">
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
          </div>
        )}
      </div>

      {/* Toast Notification for Real-Time Cascade Changes */}
      {cascadeMsg && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[70] bg-slate-950 text-white border-2 border-emerald-500 px-5 py-2.5 shadow-2xl font-mono text-xs flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{cascadeMsg}</span>
          <button
            onClick={() => setCascadeMsg(null)}
            className="text-slate-400 hover:text-white font-mono text-sm pl-2"
          >
            ✕
          </button>
        </div>
      )}

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
