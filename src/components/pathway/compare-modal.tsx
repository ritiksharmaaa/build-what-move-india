'use client';

import React, { useState, useEffect } from 'react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import { formatCostRange } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { 
  GitCompare, 
  X, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Award, 
  Building2, 
  Sparkles, 
  RotateCw, 
  AlertCircle, 
  Settings, 
  Info,
  ArrowRight
} from 'lucide-react';
import { buildCompareAnalysisPrompt } from '@/lib/ai/prompts';
import { getAIResponse, FallbackError } from '@/lib/ai/client-provider';
import { AISettingsModal } from '../settings/ai-settings-modal';

export function CompareModal({
  nodes,
  input,
  onClose,
  onGetActionPlan,
}: {
  nodes: EvaluatedNode[];
  input: StudentDecisionInput;
  onClose: () => void;
  onGetActionPlan?: () => void;
}) {
  const locale = (useLocale() as 'en' | 'hi') || 'en';

  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const selectedNodeIds = nodes.map(n => n.nodeId).sort().join('_');
  const cacheKey = `pf_ai_compare_${locale}_${selectedNodeIds || 'empty'}_${input.stage}_${input.budgetBand}_${input.class12Stream || 'gen'}`;

  const fetchComparisonAnalysis = async (forceRefresh = false) => {
    if (nodes.length < 2) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setShowConfig(false);

    // 1. Check Session Cache
    if (!forceRefresh) {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setAiAnalysis(cached);
          setLoading(false);
          return;
        }
      } catch (e) {}
    }

    // 2. Build deep compare prompt
    const { systemInstruction, userPrompt } = buildCompareAnalysisPrompt(nodes, input, locale);

    // 3. Load user settings if any
    let userSettings = null;
    try {
      const saved = localStorage.getItem('pathfinder_ai_settings');
      if (saved) userSettings = JSON.parse(saved);
    } catch (e) {}

    try {
      const analysisText = await getAIResponse(userPrompt, systemInstruction, userSettings, locale);
      setAiAnalysis(analysisText);
      try {
        sessionStorage.setItem(cacheKey, analysisText);
      } catch (e) {}
    } catch (err: any) {
      console.error('Compare AI Analysis Generation Error:', err);
      if (err instanceof FallbackError || err?.message?.includes('quota') || err?.message?.includes('key')) {
        setErrorMsg(err.message || (locale === 'hi' ? 'AI सर्वर व्यस्त है। कृपया अपनी स्वयं की API Key दर्ज करें।' : 'Server AI limit reached. Please configure your own API key.'));
        setShowConfig(true);
      } else {
        setErrorMsg(err?.message || (locale === 'hi' ? 'तुलनात्मक विश्लेषण लोड करने में त्रुटि हुई।' : 'Failed to generate Comparison Analysis.'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisonAnalysis();
  }, [selectedNodeIds, locale, input.stage, input.budgetBand]);

  // Find lowest cost node for differential highlighting
  const lowestCostNodeId = nodes.reduce((prev, curr) => {
    return (curr.costRange.min < prev.costRange.min) ? curr : prev;
  }, nodes[0])?.nodeId;

  // Find shortest duration node
  const shortestDurationNodeId = nodes.reduce((prev, curr) => {
    return (curr.durationMonths < prev.durationMonths) ? curr : prev;
  }, nodes[0])?.nodeId;

  return (
    <>
      <AISettingsModal 
        isOpen={showConfig}
        initialMessage={errorMsg || undefined}
        onClose={() => { 
          setShowConfig(false); 
          if (!aiAnalysis) onClose(); 
          else fetchComparisonAnalysis(true); // Retry
        }}
      />

      <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-sans select-none animate-in fade-in zoom-in-95">
        <div className="bg-white border-2 border-slate-900 shadow-[8px_8px_0_0_#0f172a] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 border-b-2 border-slate-900 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-saffron-500 text-slate-950 flex items-center justify-center border border-saffron-400 font-bold shrink-0">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight font-devanagari flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-saffron-400" />
                  {locale === 'hi' ? 'गहन करियर मार्ग तुलना व AI निर्णय मैट्रिक्स' : 'Deep Career Pathway Comparison & AI Decision Matrix'}
                </h2>
                <p className="text-xs text-slate-400 font-devanagari">
                  {locale === 'hi' 
                    ? 'वैधानिक पूर्व-शर्तें, वास्तविक वित्तीय ROI और करियर वृद्धि का AI तुलनात्मक संश्लेषण'
                    : 'Statutory prerequisites, starting salary benchmarks, and tailored AI synthesis.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchComparisonAnalysis(true)}
                disabled={loading || nodes.length < 2}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3 py-1.5 text-xs font-bold font-devanagari flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title={locale === 'hi' ? 'नया तुलनात्मक विश्लेषण प्राप्त करें' : 'Refresh Comparison'}
              >
                <RotateCw className={`w-3.5 h-3.5 text-saffron-400 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{locale === 'hi' ? 'पुनः विश्लेषण करें' : 'Refresh AI'}</span>
              </button>

              <button 
                onClick={onClose} 
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Scrollable Container */}
          <div className="p-5 sm:p-8 overflow-y-auto grow custom-scrollbar bg-slate-50 space-y-8">
            
            {/* Section 1: Structured Fast Metadata Comparison Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-700 bg-slate-200 px-2 py-0.5 border border-slate-300">
                  {locale === 'hi' ? 'मापदंड तुलना तालिका' : 'STATUTORY METRICS TABLE'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {nodes.length} {locale === 'hi' ? 'विकल्प' : 'Pathways Compared'}
                </span>
              </div>

              <div className="overflow-x-auto border-2 border-slate-900 bg-white shadow-[3px_3px_0_0_#0f172a]">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-900">
                      <th className="p-3 border-r-2 border-slate-900 text-xs font-mono font-bold uppercase text-slate-700 w-1/4">
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
                                    FASTEST
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-black font-devanagari leading-snug">
                                {name}
                              </h3>
                              <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">
                                {node.family.toUpperCase()} • {node.tier.toUpperCase()}
                              </span>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-900 text-xs font-sans">
                    {/* Row 1: Estimated Cost */}
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 border-r-2 border-slate-900 font-bold text-slate-800 font-devanagari flex items-center gap-1.5">
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
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 border-r-2 border-slate-900 font-bold text-slate-800 font-devanagari flex items-center gap-1.5">
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
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 border-r-2 border-slate-900 font-bold text-slate-800 font-devanagari flex items-center gap-1.5">
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
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 border-r-2 border-slate-900 font-bold text-slate-800 font-devanagari flex items-center gap-1.5">
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
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 border-r-2 border-slate-900 font-bold text-slate-800 font-devanagari flex items-center gap-1.5">
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
            </div>

            {/* Section 2: Deep AI Comparative Synthesis & Strategic Verdict */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-white bg-slate-900 px-2.5 py-0.5 border border-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
                  {locale === 'hi' ? 'गहन AI तुलनात्मक विश्लेषण व अंतिम निर्णय' : 'AI DEEP COMPARATIVE SYNTHESIS & VERDICT'}
                </span>
              </div>

              {loading ? (
                <div className="bento-box p-8 border-2 border-slate-900 bg-white flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="w-10 h-10 border-4 border-slate-900 border-t-brand-500 rounded-full animate-spin"></div>
                  <div className="text-center space-y-1">
                    <p className="font-bold text-sm text-slate-900 animate-pulse font-devanagari">
                      {locale === 'hi' 
                        ? 'AI चयनित विकल्पों का वेतन (ROI), तैयारी कठिनाई व जोखिम विश्लेषण कर रहा है...' 
                        : 'AI is evaluating salary trajectories, preparation drop risk, and budget alignment...'}
                    </p>
                  </div>
                </div>
              ) : aiAnalysis ? (
                <div className="bento-box p-6 sm:p-8 border-2 border-slate-900 bg-white shadow-[4px_4px_0_0_#0f172a]">
                  <div className={`prose prose-slate max-w-none text-slate-900 ${locale === 'hi' ? 'font-devanagari leading-hindi' : ''}`}>
                    <div className="whitespace-pre-wrap font-normal leading-relaxed text-sm sm:text-[15px] space-y-4">
                      {aiAnalysis}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bento-box p-6 border-2 border-slate-900 bg-white text-center py-10 space-y-3">
                  <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                  <p className="text-sm font-bold font-devanagari text-slate-800">
                    {errorMsg || (locale === 'hi' ? 'तुलनात्मक AI विश्लेषण लोड नहीं हो सका।' : 'Could not generate AI comparison synthesis.')}
                  </p>
                  <button
                    onClick={() => setShowConfig(true)}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider border border-slate-950 inline-flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    {locale === 'hi' ? 'API सेटिंग्स खोलें' : 'Configure API Key'}
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Footer Actions */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-slate-900 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-slate-600 font-devanagari flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-500 shrink-0" />
              <span>{locale === 'hi' ? 'तुलना के आधार पर अपना 30-90 दिवसीय एक्शन प्लान तैयार करें।' : 'Ready to proceed? Generate your 30-90 Day Action Plan.'}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="px-4 py-2 border-2 border-slate-900 hover:bg-slate-100 text-slate-900 text-xs font-bold font-devanagari transition-colors shadow-[2px_2px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5"
              >
                {locale === 'hi' ? 'बंद करें' : 'Close'}
              </button>
              
              {onGetActionPlan && (
                <button
                  onClick={() => {
                    onClose();
                    onGetActionPlan();
                  }}
                  className="px-5 py-2 bg-saffron-500 hover:bg-saffron-400 text-slate-950 text-xs font-black font-devanagari border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
                >
                  <span>{locale === 'hi' ? 'एक्शन प्लान देखें' : 'Generate Action Plan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
