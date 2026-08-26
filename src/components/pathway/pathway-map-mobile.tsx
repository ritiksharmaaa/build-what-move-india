'use client';

import React from 'react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { PathwayNode } from './pathway-node';

export function PathwayMapMobile({ 
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
  return (
    <div className="lg:hidden flex flex-col gap-4 p-2 font-mono">
      <div className="flex flex-col gap-3.5">
        {nodes.map(node => (
          <PathwayNode 
            key={node.nodeId} 
            node={node} 
            selected={selectedIds.includes(node.nodeId)}
            onToggle={onToggle}
            onAskAI={onAskAI}
          />
        ))}
      </div>
    </div>
  );
}
