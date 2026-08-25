'use client';

import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { formatCostRange } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';

export function CompareModal({
  nodes,
  onClose
}: {
  nodes: EvaluatedNode[];
  onClose: () => void;
}) {
  const locale = useLocale() as 'en' | 'hi';
  const t = useTranslations('compare');

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900">{t('title')}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
        </div>
        
        <div className="p-6 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b-2 border-slate-200 bg-slate-50 w-1/4">Feature</th>
                {nodes.map(node => (
                  <th key={node.nodeId} className="p-4 border-b-2 border-slate-200 bg-slate-50 font-bold text-slate-900">
                    {locale === 'en' ? node.nameEn : node.nameHi}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-medium text-slate-600">{t('costColumn')}</td>
                {nodes.map(node => (
                  <td key={node.nodeId} className="p-4 text-slate-900 font-semibold">
                    {formatCostRange(node.costRange.min, node.costRange.max, locale)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-600">{t('durationColumn')}</td>
                {nodes.map(node => (
                  <td key={node.nodeId} className="p-4 text-slate-900">
                    {node.durationMonths} months
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-600">{t('institutionComparison')}</td>
                {nodes.map(node => (
                  <td key={node.nodeId} className="p-4 text-slate-900">
                    {node.costRange.type === 'government' ? t('govtOption') 
                      : node.costRange.type === 'private' ? t('privateOption') 
                      : `${t('govtOption')} & ${t('privateOption')}`}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
