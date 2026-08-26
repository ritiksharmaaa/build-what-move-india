'use client';

import React from 'react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { formatCostRange } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { GitCompare, X, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign, Clock, Award, Building2 } from 'lucide-react';

export function CompareModal({
  nodes,
  onClose,
  onGetActionPlan,
}: {
  nodes: EvaluatedNode[];
  onClose: () => void;
  onGetActionPlan?: () => void;
}) {
  const locale = useLocale() as 'en' | 'hi';
  const t = useTranslations('compare');

  // Find lowest cost node for differential highlighting
  const lowestCostNodeId = nodes.reduce((prev, curr) => {
    return (curr.costRange.min < prev.costRange.min) ? curr : prev;
  }, nodes[0])?.nodeId;

  // Find shortest duration node
  const shortestDurationNodeId = nodes.reduce((prev, curr) => {
    return (curr.durationMonths < prev.durationMonths) ? curr : prev;
  }, nodes[0])?.nodeId;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] w-full max-w-5xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-slate-900 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <GitCompare className="w-5 h-5 text-saffron-400" />
            <div>
              <h2 className="text-lg font-black tracking-tight font-devanagari">
                {locale === 'hi' ? 'करियर मार्ग तुलना मैट्रिक्स' : 'Career Pathway Comparison Matrix'}
              </h2>
              <p className="text-xs text-slate-400 font-devanagari">
                {locale === 'hi' 
                  ? 'चयनित मार्गों का शैक्षणिक, वित्तीय व वैधानिक तुलनात्मक विश्लेषण'
                  : 'Direct differential analysis of statutory prerequisites, financial ROI, and timelines.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Comparison Table / Matrix */}
        <div className="p-6 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse border-2 border-slate-900">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-900">
                <th className="p-3.5 border-r-2 border-slate-900 text-xs font-mono font-bold uppercase text-slate-700 w-1/4">
                  {locale === 'hi' ? 'तुलनात्मक मापदंड' : 'Evaluation Criteria'}
                </th>
                {nodes.map((node) => {
                  const name = locale === 'en' ? node.nameEn : node.nameHi;
                  const isLowestCost = node.nodeId === lowestCostNodeId;
                  const isShortest = node.nodeId === shortestDurationNodeId;

                  return (
                    <th key={node.nodeId} className="p-3.5 border-r-2 last:border-r-0 border-slate-900 bg-white font-bold text-slate-950 align-top">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-1">
                          {isLowestCost && (
                            <span className="text-[9px] font-mono font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300">
                              LOWEST COST
                            </span>
                          )}
                          {isShortest && (
                            <span className="text-[9px] font-mono font-black px-1.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-300">
                              FASTEST TIMELINE
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black font-devanagari leading-snug">
                          {name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block">
                          {node.family.toUpperCase()} • {node.tier.toUpperCase()}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-sans">
              {/* Row 1: Estimated Cost */}
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 border-r-2 border-slate-900 font-bold text-slate-700 font-devanagari flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{locale === 'hi' ? 'अनुमानित कुल लागत' : 'Estimated Cost'}</span>
                </td>
                {nodes.map((node) => (
                  <td key={node.nodeId} className="p-3.5 border-r-2 last:border-r-0 border-slate-900 font-mono font-bold text-slate-950">
                    {node.costRange.max > 0 ? formatCostRange(node.costRange.min, node.costRange.max, locale) : '₹0 (Free / Govt Stipend)'}
                  </td>
                ))}
              </tr>

              {/* Row 2: Duration */}
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 border-r-2 border-slate-900 font-bold text-slate-700 font-devanagari flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{locale === 'hi' ? 'पाठ्यक्रम अवधि' : 'Program Duration'}</span>
                </td>
                {nodes.map((node) => (
                  <td key={node.nodeId} className="p-3.5 border-r-2 last:border-r-0 border-slate-900 font-mono font-semibold text-slate-900">
                    {node.durationMonths} {locale === 'hi' ? 'महीने' : 'months'}
                  </td>
                ))}
              </tr>

              {/* Row 3: Statutory Prerequisite */}
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 border-r-2 border-slate-900 font-bold text-slate-700 font-devanagari flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{locale === 'hi' ? 'वैधानिक पूर्व-शर्तें' : 'Prerequisites & Rules'}</span>
                </td>
                {nodes.map((node) => (
                  <td key={node.nodeId} className="p-3.5 border-r-2 last:border-r-0 border-slate-900 font-devanagari text-slate-700 leading-relaxed">
                    {locale === 'en' ? node.doorReasonEn : node.doorReasonHi}
                  </td>
                ))}
              </tr>

              {/* Row 4: Institution Type */}
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 border-r-2 border-slate-900 font-bold text-slate-700 font-devanagari flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{locale === 'hi' ? 'संस्थान प्रकार' : 'Institution Type'}</span>
                </td>
                {nodes.map((node) => (
                  <td key={node.nodeId} className="p-3.5 border-r-2 last:border-r-0 border-slate-900 font-devanagari text-slate-800">
                    {node.costRange.type === 'government' 
                      ? (locale === 'hi' ? '🏛️ सरकारी संस्थान (न्यूनतम शुल्क)' : '🏛️ Government College (Subsidized)')
                      : node.costRange.type === 'private'
                      ? (locale === 'hi' ? '🏢 निजी संस्थान (स्व-वित्तपोषित)' : '🏢 Private Deemed Institution')
                      : (locale === 'hi' ? '🏛️ सरकारी व निजी दोनों उपलब्ध' : '🏛️ Both Govt & Private Options Available')}
                  </td>
                ))}
              </tr>

              {/* Row 5: Competitiveness */}
              <tr className="hover:bg-slate-50/80">
                <td className="p-3.5 border-r-2 border-slate-900 font-bold text-slate-700 font-devanagari flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{locale === 'hi' ? 'प्रतिस्पर्धा स्तर' : 'Competitiveness'}</span>
                </td>
                {nodes.map((node) => (
                  <td key={node.nodeId} className="p-3.5 border-r-2 last:border-r-0 border-slate-900 font-mono text-slate-800">
                    <span className="font-black px-2 py-0.5 bg-slate-100 border border-slate-300 text-[10px] uppercase">
                      {node.competitiveness.replace(/_/g, ' ')}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t-2 border-slate-900 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-devanagari">
            {locale === 'hi' ? 'किसी भी विकल्प का विस्तृत 30-दिवसीय एक्शन प्लान तैयार करें।' : 'Ready to proceed with this pathway roadmap?'}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-semibold font-devanagari transition-colors"
            >
              {locale === 'hi' ? 'बंद करें' : 'Close'}
            </button>
            {onGetActionPlan && (
              <button
                onClick={() => {
                  onClose();
                  onGetActionPlan();
                }}
                className="px-5 py-2 bg-saffron-500 hover:bg-saffron-400 text-slate-950 text-xs font-black font-devanagari border border-saffron-600 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 transition-all"
              >
                {locale === 'hi' ? 'एक्शन प्लान देखें →' : 'Generate Action Plan →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
