'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Sparkles, Info, AlertCircle, RotateCw } from 'lucide-react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import { AISettingsModal } from '../settings/ai-settings-modal';
import type { AIProviderOptions } from '@/lib/ai/client-provider';
import { useLocale } from 'next-intl';
import { buildNodeExplanationPrompt } from '@/lib/ai/prompts';
import { getAIResponse, FallbackError } from '@/lib/ai/client-provider';

export function AiExplanationModal({
  node,
  input,
  onClose
}: {
  node: EvaluatedNode;
  input: StudentDecisionInput;
  onClose: () => void;
}) {
  const locale = (useLocale() as 'en' | 'hi') || 'en';
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const cacheKey = `pf_ai_insight_${node.nodeId}_${locale}_${input.stage}_${input.budgetBand}_${input.class12Stream || 'gen'}`;

  const fetchExplanation = async (forceRefresh = false) => {
    setLoading(true);
    setErrorMsg(null);
    setShowConfig(false);

    // 1. Check Session Cache if not forcing refresh
    if (!forceRefresh) {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setExplanation(cached);
          setLoading(false);
          return;
        }
      } catch (e) {}
    }

    // 2. Load user custom settings if configured in browser
    let customConfig: AIProviderOptions | null = null;
    try {
      const saved = localStorage.getItem('pathfinder_ai_settings');
      if (saved) customConfig = JSON.parse(saved);
    } catch (e) {}

    const { systemInstruction, userPrompt } = buildNodeExplanationPrompt(node, input, locale);

    try {
      const text = await getAIResponse(userPrompt, systemInstruction, customConfig, locale);
      setExplanation(text);
      try {
        sessionStorage.setItem(cacheKey, text);
      } catch (e) {}
    } catch (e: any) {
      console.error('AI Explanation Error:', e);
      if (e instanceof FallbackError || e?.message?.includes('quota') || e?.message?.includes('key')) {
        setErrorMsg(e.message || (locale === 'hi' ? 'सर्वर AI कोटा समाप्त हो गया है। कृपया सेटिंग्स में अपनी API Key दर्ज करें।' : 'Server AI quota exceeded. Please configure your own API key.'));
        setShowConfig(true);
      } else {
        setErrorMsg(e.message || (locale === 'hi' ? 'विवरण लोड करने में त्रुटि हुई।' : 'Failed to fetch explanation.'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation();
  }, [node.nodeId, locale]);

  return (
    <>
      <AISettingsModal 
        isOpen={showConfig}
        initialMessage={errorMsg || undefined}
        onClose={() => { 
          setShowConfig(false); 
          if (!explanation) onClose(); 
          else fetchExplanation(true); // Retry
        }}
      />

      {!showConfig && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 font-sans select-none">
          
          <div className="bg-slate-50 border-2 border-slate-900 shadow-[8px_8px_0_0_#0f172a] w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header - Brutalist Top Bar */}
            <div className="bg-brand-400 border-b-2 border-slate-900 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={onClose}
                  className="bg-white border-2 border-slate-900 p-1.5 hover:bg-slate-100 transition-colors shadow-[2px_2px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[2px] active:translate-x-[2px]"
                  title={locale === 'hi' ? 'वापस जाएं' : 'Back'}
                >
                  <ArrowLeft className="w-5 h-5 text-slate-900" />
                </button>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 font-devanagari">
                    <Sparkles className="w-5 h-5 text-slate-950" /> 
                    {locale === 'hi' ? 'गहन AI करियर विश्लेषण' : 'Deep AI Pathway Insight'}
                  </h2>
                  <p className="text-xs font-bold text-slate-900 font-devanagari">
                    {locale === 'hi' ? node.nameHi : node.nameEn} • {node.tier.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchExplanation(true)}
                  disabled={loading}
                  className="bg-white hover:bg-slate-100 border-2 border-slate-900 px-2.5 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0_0_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
                  title={locale === 'hi' ? 'पुनः विश्लेषण करें' : 'Regenerate Analysis'}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline font-devanagari">{locale === 'hi' ? 'रीफ्रेश' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-6 md:p-8 overflow-y-auto grow bg-white relative custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-slate-900 border-t-brand-500 rounded-full animate-spin"></div>
                  <p className="font-bold text-sm text-slate-800 animate-pulse tracking-wide font-devanagari">
                    {locale === 'hi' ? 'AI विश्लेषक डेटा संश्लेषित कर रहा है...' : 'Synthesizing statutory data vectors & market benchmarks (Gemini 3.6)...'}
                  </p>
                </div>
              ) : explanation ? (
                <div className={`prose prose-slate max-w-none text-slate-900 ${locale === 'hi' ? 'font-devanagari leading-hindi' : ''}`}>
                  <div className="whitespace-pre-wrap font-normal leading-relaxed text-sm sm:text-[15px] space-y-4">
                    {explanation}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-rose-600 space-y-3">
                  <AlertCircle className="w-10 h-10" />
                  <p className="font-bold font-devanagari text-sm">
                    {errorMsg || (locale === 'hi' ? 'विश्लेषण लोड करने में विफलता।' : 'Failed to load insight.')}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t-2 border-slate-900 bg-slate-100 p-4 shrink-0 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 font-devanagari">
                <Info className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{locale === 'hi' ? 'AI द्वारा जनरेटेड। कृपया आधिकारिक पोर्टल से विवरण अवश्य सत्यापित करें।' : 'AI generated advisory. Always verify with official regulatory notifications.'}</span>
              </div>
              <button 
                onClick={() => setShowConfig(true)} 
                className="flex items-center gap-1.5 bg-white border-2 border-slate-900 px-3 py-1.5 text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-[2px_2px_0_0_#0f172a] active:translate-y-[2px] active:translate-x-[2px]"
              >
                <Settings className="w-3.5 h-3.5" />
                API Settings
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
