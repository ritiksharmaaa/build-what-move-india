import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { PathwayNode } from './pathway-node';

export function PathwayMapMobile({ nodes }: { nodes: EvaluatedNode[] }) {
  return (
    <div className="lg:hidden flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-3">
        {nodes.map(node => (
          <PathwayNode key={node.nodeId} node={node} />
        ))}
      </div>
    </div>
  );
}
