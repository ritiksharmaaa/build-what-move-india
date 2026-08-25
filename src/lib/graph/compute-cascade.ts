import type { EvaluatedNode, CascadeImpact } from '../contracts/pathway';

export function computeCascade(
  parameterChanged: string,
  oldNodes: EvaluatedNode[],
  newNodes: EvaluatedNode[],
  locale: 'en' | 'hi' = 'en'
): CascadeImpact {
  const doorsOpened: EvaluatedNode[] = [];
  const doorsClosed: EvaluatedNode[] = [];
  let doorsUnchanged = 0;

  const oldStatusMap = new Map(oldNodes.map((n) => [n.nodeId, n.doorStatus]));

  for (const newNode of newNodes) {
    const oldStatus = oldStatusMap.get(newNode.nodeId);
    if (!oldStatus) continue;

    const wasAvailable = oldStatus === 'open' || oldStatus === 'conditional' || oldStatus === 'harder';
    const isAvailable = newNode.doorStatus === 'open' || newNode.doorStatus === 'conditional' || newNode.doorStatus === 'harder';

    if (!wasAvailable && isAvailable) {
      doorsOpened.push(newNode);
    } else if (wasAvailable && !isAvailable) {
      doorsClosed.push(newNode);
    } else {
      doorsUnchanged++;
    }
  }

  const summaryEn = `Removing this parameter closed ${doorsClosed.length} paths and opened ${doorsOpened.length} new ones.`;
  const summaryHi = `इस पैरामीटर को हटाने से ${doorsClosed.length} मार्ग बंद हो गए और ${doorsOpened.length} नए मार्ग खुल गए।`;

  return {
    parameterChanged,
    doorsOpened,
    doorsClosed,
    doorsUnchanged,
    summaryEn: locale === 'en' ? summaryEn : summaryHi,
    summaryHi
  };
}
