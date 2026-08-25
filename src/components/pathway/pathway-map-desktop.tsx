import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { PathwayNode } from './pathway-node';

export function PathwayMapDesktop({ 
  nodes,
  selectedIds = [],
  onToggle
}: { 
  nodes: EvaluatedNode[];
  selectedIds?: string[];
  onToggle?: (id: string) => void;
}) {
  const now = nodes.filter(n => n.tier === 'now');
  const next = nodes.filter(n => n.tier === 'next');
  const future = nodes.filter(n => n.tier === 'future');

  const renderColumn = (title: string, columnNodes: EvaluatedNode[]) => (
    <div className="flex-1 flex flex-col gap-4">
      <h2 className="font-bold text-slate-400 uppercase tracking-widest text-sm mb-2">{title}</h2>
      <div className="flex flex-col gap-3">
        {columnNodes.length > 0 ? (
          columnNodes.map(node => (
            <PathwayNode 
              key={node.nodeId} 
              node={node} 
              selected={selectedIds.includes(node.nodeId)}
              onToggle={onToggle}
            />
          ))
        ) : (
          <div className="text-sm text-slate-400 italic p-4 border border-dashed rounded-xl text-center">
            No pathways in this tier based on current inputs.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="hidden lg:flex gap-8 items-start w-full max-w-7xl mx-auto p-6 bg-slate-50/50 rounded-2xl border border-slate-200">
      {renderColumn('Immediate Steps', now)}
      <div className="w-8 shrink-0 flex flex-col items-center justify-center opacity-20">
        {/* Visual connector placeholder */}
        <div className="h-full w-px bg-slate-400"></div>
      </div>
      {renderColumn('Next Phase', next)}
      <div className="w-8 shrink-0 flex flex-col items-center justify-center opacity-20">
        <div className="h-full w-px bg-slate-400"></div>
      </div>
      {renderColumn('Future Goals', future)}
    </div>
  );
}
