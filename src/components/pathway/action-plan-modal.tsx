'use client';

import React, { useState, useEffect } from 'react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import { useLocale } from 'next-intl';
import { 
  CalendarCheck, 
  X, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  ArrowRight,
  RotateCw,
  Sparkles,
  Settings
} from 'lucide-react';
import { buildActionPlanPrompt, generateDetailedActionPlanFallback } from '@/lib/ai/prompts';
import { getAIResponse } from '@/lib/ai/client-provider';
import { AISettingsModal } from '../settings/ai-settings-modal';
import { printFormattedDocument } from '@/lib/utils/print-document';

export function ActionPlanModal({
  nodes,
  input,
  onClose,
}: {
  nodes: EvaluatedNode[];
  input: StudentDecisionInput;
  onClose: () => void;
}) {
  const locale = (useLocale() as 'en' | 'hi') || 'en';

  const [loading, setLoading] = useState(true);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [isAiLive, setIsAiLive] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [copied, setCopied] = useState(false);

  const validNodes = (nodes || []).filter(Boolean);
  const selectedNodeIds = validNodes.map(n => n.nodeId).sort().join('_');
  const cacheKey = `pf_ai_action_plan_${locale}_${selectedNodeIds || 'empty'}_${input?.stage || 'class_10'}_${input?.budgetBand || 'medium'}_${input?.class12Stream || 'gen'}`;

  const fetchActionPlan = async (forceRefresh = false) => {
    setLoading(true);

    // 1. Check Session Cache if not forcing refresh
    if (!forceRefresh) {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setAiPlan(cached);
          setIsAiLive(sessionStorage.getItem(`${cacheKey}_live`) === 'true');
          setLoading(false);
          return;
        }
      } catch (e) {}
    }

    // 2. Load user settings if any
    let userSettings = null;
    try {
      const saved = localStorage.getItem('pathfinder_ai_settings');
      if (saved) userSettings = JSON.parse(saved);
    } catch (e) {}

    // 3. Build deep action plan prompt
    const { systemInstruction, userPrompt } = buildActionPlanPrompt(validNodes, input, locale);

    try {
      const planText = await getAIResponse(userPrompt, systemInstruction, userSettings, locale);
      setAiPlan(planText);
      setIsAiLive(true);
      try {
        sessionStorage.setItem(cacheKey, planText);
        sessionStorage.setItem(`${cacheKey}_live`, 'true');
      } catch (e) {}
    } catch (err: any) {
      console.warn('AI Action Plan Live Synthesis failed, using high-detail statutory fallback:', err?.message);
      const fallbackPlan = generateDetailedActionPlanFallback(validNodes, input, locale);
      setAiPlan(fallbackPlan);
      setIsAiLive(false);
      try {
        sessionStorage.setItem(cacheKey, fallbackPlan);
        sessionStorage.setItem(`${cacheKey}_live`, 'false');
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActionPlan();
  }, [selectedNodeIds, locale, input?.stage, input?.budgetBand]);

  const selectedNames = validNodes.map((n) => (locale === 'en' ? (n?.nameEn || 'Pathway') : (n?.nameHi || n?.nameEn || 'Pathway')));

  // WhatsApp share link text
  const waText = encodeURIComponent(
    locale === 'hi'
      ? `🎯 मेरा पाथफाइंडर इंडिया करियर एक्शन प्लान (${selectedNames.join(' ➔ ')})\n\nविस्तृत 30-90 दिवसीय रोडमैप देखें: https://pathfinder-india-hackathon.vercel.app`
      : `🚀 My PathFinder India Action Plan for: ${selectedNames.join(' ➔ ')}\n\nExplore the roadmap at: https://pathfinder-india-hackathon.vercel.app`
  );

  const copyRoadmap = () => {
    if (!aiPlan) return;
    navigator.clipboard.writeText(aiPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const printPlan = () => {
    if (!aiPlan) return;
    printFormattedDocument({
      title: locale === 'hi' ? '30-90 दिवसीय व्यक्तिगत करियर एक्शन प्रोटोकॉल' : '30-90 Day Personalized Career Action Protocol',
      subtitle: locale === 'hi' ? 'चयनित करियर मार्ग के आधार पर वैधानिक व शैक्षणिक मील के पत्थर' : 'Statutory, examination, and zero-debt execution roadmap.',
      badge: 'ACTION PROTOCOL',
      routeBreadcrumb: selectedNames.join(' ➔ '),
      contentMarkdown: aiPlan,
      locale,
    });
  };

  return (
    <>
      <AISettingsModal 
        isOpen={showConfig}
        onClose={() => { 
          setShowConfig(false); 
          fetchActionPlan(true); // Re-run with new key
        }}
      />

      <div className="print-modal-container fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-sans select-none animate-in fade-in zoom-in-95">
        <div className="print-modal-card bg-white border-2 border-slate-900 shadow-[8px_8px_0_0_#0f172a] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 border-b-2 border-slate-900 bg-slate-900 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-saffron-500 text-slate-950 flex items-center justify-center border border-saffron-400 font-bold shrink-0">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black tracking-tight font-devanagari flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-saffron-400" />
                  {locale === 'hi' ? '30-90 दिवसीय व्यक्तिगत करियर एक्शन प्रोटोकॉल' : '30-90 Day Personalized Career Action Protocol'}
                </h2>
                <p className="text-xs text-slate-400 font-devanagari">
                  {locale === 'hi' 
                    ? 'वैधानिक, शैक्षणिक व वित्तीय मील के पत्थर'
                    : 'Statutory, examination, and zero-debt execution roadmap synthesized by PathFinder India.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 no-print">
              <button
                onClick={() => fetchActionPlan(true)}
                disabled={loading}
                className="bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 px-3 py-1.5 text-xs font-black font-devanagari flex items-center gap-1.5 shadow-[2px_2px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
                title={locale === 'hi' ? 'नया विश्लेषण प्राप्त करें' : 'Regenerate Plan'}
              >
                <RotateCw className={`w-3.5 h-3.5 text-slate-900 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{locale === 'hi' ? 'पुनः जनरेट करें' : 'Regenerate'}</span>
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

          {/* Selected Roadmap Breadcrumb Strip */}
          <div className="bg-emerald-50 border-b-2 border-slate-900 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-emerald-950 font-devanagari shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-emerald-800 uppercase font-mono text-[10px] bg-emerald-100 px-1.5 py-0.5 border border-emerald-300">
                {locale === 'hi' ? 'चयनित मार्ग' : 'Route:'}
              </span>
              {validNodes.length > 0 ? (
                validNodes.map((node, i) => (
                  <React.Fragment key={node?.nodeId || Math.random()}>
                    <span className="px-2 py-0.5 bg-white border border-emerald-300 shadow-xs font-bold">
                      {locale === 'en' ? (node?.nameEn || 'Node') : (node?.nameHi || node?.nameEn || 'नोड')}
                    </span>
                    {i < validNodes.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </React.Fragment>
                ))
              ) : (
                <span className="text-slate-500 italic">
                  {locale === 'hi' ? 'सामान्य करियर अन्वेषण मार्ग' : 'General Career Pathway'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 no-print">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-slate-900 text-white border border-slate-900">
                {isAiLive ? '⚡ LIVE GEMINI 3.6' : '📋 STATUTORY PROTOCOL'}
              </span>
            </div>
          </div>

          {/* Action Plan Content Body */}
          <div className="print-modal-content p-5 sm:p-8 overflow-y-auto grow custom-scrollbar bg-slate-50 relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 border-4 border-slate-900 border-t-saffron-500 rounded-full animate-spin"></div>
                <div className="text-center space-y-1">
                  <p className="font-bold text-sm text-slate-900 animate-pulse font-devanagari">
                    {locale === 'hi' 
                      ? 'AI आपके लिए 30-90 दिवसीय रणनीतिक एक्शन प्लान तैयार कर रहा है...' 
                      : 'Synthesizing your 30-90 Day Action Protocol with statutory rules & scholarship checks...'}
                  </p>
                  <p className="text-xs text-slate-500 font-devanagari">
                    {locale === 'hi' ? 'NCERT पाठ्यक्रम, राज्य आरक्षण व परीक्षा समय-सारणी का मिलान किया जा रहा है' : 'Evaluating entrance cutoffs, state quota criteria, and zero-debt safety routes with Gemini 3.6.'}
                  </p>
                </div>
              </div>
            ) : aiPlan ? (
              <div className="space-y-6">
                <div className="bento-box p-6 sm:p-8 border-2 border-slate-900 bg-white shadow-[4px_4px_0_0_#0f172a]">
                  <div className={`prose prose-slate max-w-none text-slate-900 ${locale === 'hi' ? 'font-devanagari leading-hindi' : ''}`}>
                    <div className="whitespace-pre-wrap font-normal leading-relaxed text-sm sm:text-[15px] space-y-4">
                      {aiPlan}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer with Share & Export buttons */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-slate-900 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0 no-print">
            <div className="flex items-center gap-2">
              <button
                onClick={copyRoadmap}
                disabled={!aiPlan}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 text-xs font-bold font-devanagari flex items-center gap-1.5 shadow-[2px_2px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (locale === 'hi' ? 'कॉपी हो गया!' : 'Copied!') : (locale === 'hi' ? 'रोडमैप कॉपी करें' : 'Copy Plan')}</span>
              </button>

              <button
                onClick={printPlan}
                disabled={!aiPlan}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border-2 border-slate-900 text-slate-900 text-xs font-bold font-devanagari flex items-center gap-1.5 shadow-[2px_2px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
              >
                <Printer className="w-3.5 h-3.5 text-slate-700" />
                <span>{locale === 'hi' ? 'प्रिंट / PDF' : 'Print PDF'}</span>
              </button>

              <button
                onClick={() => setShowConfig(true)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-900 text-slate-900 text-xs font-bold font-devanagari flex items-center gap-1.5 shadow-[2px_2px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                title="API Settings"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-mono text-[10px]">API KEY</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <a 
                href={`https://wa.me/?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-black font-devanagari px-4 py-2 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{locale === 'hi' ? 'व्हाट्सएप पर साझा करें' : 'Share on WhatsApp'}</span>
              </a>

              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black font-devanagari border-2 border-slate-950 shadow-[2px_2px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                {locale === 'hi' ? 'पूर्ण (Done)' : 'Done'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
