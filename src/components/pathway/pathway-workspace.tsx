'use client';

import { useState, useEffect } from 'react';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import type { EvaluatedNode, GraphStatistics } from '@/lib/contracts/pathway';
import { ParameterBar } from './parameter-bar';
import { StatisticsBar } from './statistics-bar';
import { PathwayMapDesktop } from './pathway-map-desktop';
import { PathwayMapMobile } from './pathway-map-mobile';
import { CompareBar } from './compare-bar';
import { CompareModal } from './compare-modal';
import { ActionPlanModal } from './action-plan-modal';
import { AiExplanationModal } from './ai-explanation-modal';

export function PathwayWorkspace({
  initialInput,
  initialNodes,
  initialStats,
  rawGraphData
}: {
  initialInput: StudentDecisionInput;
  initialNodes: EvaluatedNode[];
  initialStats: GraphStatistics;
  rawGraphData: { nodes: any[], edges: any[], sources: any[] };
}) {
  const [input, setInput] = useState<StudentDecisionInput>(initialInput);
  const [nodes, setNodes] = useState<EvaluatedNode[]>(initialNodes);
  const [stats, setStats] = useState<GraphStatistics>(initialStats);
  const [cascadeMsg, setCascadeMsg] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [activeAiNode, setActiveAiNode] = useState<EvaluatedNode | null>(null);

  const handleToggleNode = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) {
        alert("You can compare up to 3 paths at a time.");
        return prev;
      }
      return [...prev, id];
    });
  };

  // When input changes, we should ideally hit an API to re-evaluate or do it on client.
  // For MVP, if we want instantaneous reactive UI, we need the `evaluateGraph` logic on client.
  // Let's assume we fetch a new state from an API route or server action.
  
  const handleParameterChange = async (key: keyof StudentDecisionInput, value: any) => {
    const newInput = { ...input, [key]: value };
    setInput(newInput);
    
    try {
      // In a real Server Actions setup, we'd call the server.
      // Here, we can post to an API route to re-evaluate.
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: newInput, 
          oldNodes: nodes,
          changedKey: key
        })
      });
      if (res.ok) {
        const data = await res.json();
        setNodes(data.nodes);
        setStats(data.stats);
        if (data.cascade?.summaryEn) {
          setCascadeMsg(data.cascade.summaryEn);
          setTimeout(() => setCascadeMsg(null), 5000);
        }
      }
    } catch (e) {
      console.error('Failed to re-evaluate graph', e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <ParameterBar input={input} onChange={handleParameterChange} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Career Map</h1>
            <p className="text-slate-500 mt-1">Showing all paths based on your current constraints.</p>
          </div>
          <StatisticsBar stats={stats} />
        </div>

        {cascadeMsg && (
          <div className="bg-brand-900 text-white px-6 py-3 rounded-xl shadow-xl font-medium animate-toast-in flex items-center justify-between">
            <span>{cascadeMsg}</span>
            <button onClick={() => setCascadeMsg(null)} className="opacity-50 hover:opacity-100">×</button>
          </div>
        )}

        <PathwayMapDesktop nodes={nodes} selectedIds={selectedIds} onToggle={handleToggleNode} onAskAI={setActiveAiNode} />
        <PathwayMapMobile nodes={nodes} selectedIds={selectedIds} onToggle={handleToggleNode} onAskAI={setActiveAiNode} />
      </main>

      <CompareBar 
        selectedCount={selectedIds.length}
        onCompare={() => setShowCompare(true)}
        onActionPlan={() => setShowPlan(true)}
        onClear={() => setSelectedIds([])}
      />

      {showCompare && (
        <CompareModal 
          nodes={nodes.filter(n => selectedIds.includes(n.nodeId))} 
          onClose={() => setShowCompare(false)} 
        />
      )}

      {showPlan && (
        <ActionPlanModal 
          nodes={nodes.filter(n => selectedIds.includes(n.nodeId))} 
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
