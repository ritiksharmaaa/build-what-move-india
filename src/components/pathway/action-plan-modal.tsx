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
  AlertCircle,
  Settings,
  Info
} from 'lucide-react';
import { buildActionPlanPrompt } from '@/lib/ai/prompts';
import { getAIResponse, FallbackError } from '@/lib/ai/client-provider';
import { AISettingsModal } from '../settings/ai-settings-modal';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedNodeIds = nodes.map(n => n.nodeId).sort().join('_');
  const cacheKey = `pf_ai_action_plan_${locale}_${selectedNodeIds || 'empty'}_${input.stage}_${input.budgetBand}_${input.class12Stream || 'gen'}`;

  const fetchActionPlan = async (forceRefresh = false) => {
    if (nodes.length === 0) {
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
          setAiPlan(cached);
          setLoading(false);
          return;
        }
      } catch (e) {}
    }

    // 2. Build deep action plan prompt
    const { systemInstruction, userPrompt } = buildActionPlanPrompt(nodes, input, locale);

    // 3. Load user settings if any
    let userSettings = null;
    try {
      const saved = localStorage.getItem('pathfinder_ai_settings');
      if (saved) userSettings = JSON.parse(saved);
    } catch (e) {}

    try {
      const planText = await getAIResponse(userPrompt, systemInstruction, userSettings, locale);
      setAiPlan(planText);
      try {
        sessionStorage.setItem(cacheKey, planText);
      } catch (e) {}
    } catch (err: any) {
      console.error('Action Plan AI Generation Error:', err);
      if (err instanceof FallbackError || err?.message?.includes('quota') || err?.message?.includes('key')) {
        setErrorMsg(err.message || (locale === 'hi' ? 'AI सर्वर व्यस्त है। कृपया अपनी स्वयं की API Key दर्ज करें।' : 'Server AI limit reached. Please configure your own API key.'));
        setShowConfig(true);
      } else {
        setErrorMsg(err?.message || (locale === 'hi' ? 'एक्शन प्लान लोड करने में त्रुटि हुई।' : 'Failed to generate Action Plan.'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActionPlan();
  }, [selectedNodeIds, locale, input.stage, input.budgetBand]);

  const selectedNames = nodes.map((n) => (locale === 'en' ? n.nameEn : n.nameHi));

  // WhatsApp share link text
  const waText = encodeURIComponent(
    locale === 'hi'
      ? `🎯 मेरा पाथफाइंडर इंडिया करियर एक्शन प्लान (${selectedNames.join(' ➔ ')})\n\nविस्तृत रोडमैप देखें: https://pathfinder-india-hackathon.vercel.app`
      : `🚀 My PathFinder India Action Plan for: ${selectedNames.join(' ➔ ')}\n\nExplore the roadmap at: https://pathfinder-india-hackathon.vercel.app`
  );

  const copyRoadmap = () => {
    if (!aiPlan) return;
    navigator.clipboard.writeText(aiPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const printPlan = () => {
    window.print();
  };

  return (
    <>
      <AISettingsModal 
        isOpen={showConfig}
        initialMessage={errorMsg || undefined}
        onClose={() => { 
          setShowConfig(false); 
          if (!aiPlan) onClose(); 
          else fetchActionPlan(true); // Retry
        }}
      />

      <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-sans select-none animate-in fade-in zoom-in-95">
        <div className="bg-white border-2 border-slate-900 shadow-[8px_8px_0_0_#0f172a] w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
          
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
                    ? 'AI द्वारा तैयार वैधानिक, शैक्षणिक व वित्तीय मील के पत्थर'
                    : 'Statutory, examination, and zero-debt execution roadmap synthesized by PathFinder AI.'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchActionPlan(true)}
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-3 py-1.5 text-xs font-bold font-devanagari flex items-center gap-1.5 transition-colors disabled:opacity-50"
                title={locale === 'hi' ? 'नया विश्लेषण प्राप्त करें' : 'Regenerate Plan'}
              >
                <RotateCw className={`w-3.5 h-3.5 text-saffron-400 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{locale === 'hi' ? 'पुनः जनरेट करें' : 'Regenerate Plan'}</span>
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
          <div className="bg-emerald-50 border-b-2 border-slate-900 px-5 sm:px-6 py-2.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-950 font-devanagari shrink-0">
            <span className="font-bold text-emerald-800 uppercase font-mono text-[10px] bg-emerald-100 px-1.5 py-0.5 border border-emerald-300">
              {locale === 'hi' ? 'चयनित मार्ग' : 'Route:'}
            </span>
            {nodes.length > 0 ? (
              nodes.map((node, i) => (
                <React.Fragment key={node.nodeId}>
                  <span className="px-2 py-0.5 bg-white border border-emerald-300 shadow-xs font-bold">
                    {locale === 'en' ? node.nameEn : node.nameHi}
                  </span>
                  {i < nodes.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </React.Fragment>
              ))
            ) : (
              <span className="text-slate-500 italic">
                {locale === 'hi' ? 'कोई नोड चयनित नहीं है (सामान्य मार्ग)' : 'No specific nodes selected'}
              </span>
            )}
          </div>

          {/* Action Plan Content Body */}
          <div className="p-5 sm:p-8 overflow-y-auto grow custom-scrollbar bg-slate-50 relative">
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
                    {locale === 'hi' ? 'NCERT पाठ्यक्रम, राज्य आरक्षण व परीक्षा समय-सारणी का मिलान किया जा रहा है' : 'Evaluating entrance cutoffs, state quota criteria, and zero-debt safety routes.'}
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
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-rose-600 space-y-3 bg-white border-2 border-slate-900 p-8">
                <AlertCircle className="w-10 h-10" />
                <p className="font-bold text-sm font-devanagari">
                  {errorMsg || (locale === 'hi' ? 'एक्शन प्लान जनरेट करने में विफलता।' : 'Failed to generate Action Plan.')}
                </p>
                <button
                  onClick={() => setShowConfig(true)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider border border-slate-950 flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  {locale === 'hi' ? 'API सेटिंग्स खोलें' : 'Configure API Key'}
                </button>
              </div>
            )}
          </div>

          {/* Footer with Share & Export buttons */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-slate-900 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
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
