'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Sparkles, User, Info, AlertCircle, ArrowRight } from 'lucide-react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import { AISettingsModal } from '../settings/ai-settings-modal';
import type { AIProviderOptions } from '@/lib/ai/client-provider';

export function AiExplanationModal({
  node,
  input,
  onClose
}: {
  node: EvaluatedNode;
  input: StudentDecisionInput;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const fetchExplanation = async () => {
    setLoading(true);
    setErrorMsg(null);
    setShowConfig(false);
    
    // 1. Check for local client-side configuration
    const saved = localStorage.getItem('pathfinder_ai_settings');
    let customConfig: AIProviderOptions | null = null;
    if (saved) {
      try { customConfig = JSON.parse(saved); } catch (e) {}
    }

    const systemPrompt = `You are an Indian career counselor. Student: ${input.stage}, ${input.class12Stream || 'N/A'}, Budget: ${input.budgetBand}. Pathway: "${node.nameEn}" (Status: "${node.doorStatus}").
Respond briefly (max 120 words) with:
1. Famous Path-Taker: Name a famous Indian who took a similar path.
2. Status Reason: Why this is "${node.doorStatus}" for the student.
3. Next Steps: 1-2 concrete actions.
Use markdown bullets. Be extremely concise to save tokens.`;

    const userPrompt = 'Explain this pathway.';

    try {
      if (customConfig && customConfig.apiKey && customConfig.apiKey.trim() !== '') {
        if (customConfig.provider === 'google') {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${customConfig.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: { text: systemPrompt } },
              contents: [{ parts: [{ text: userPrompt }] }]
            })
          });
          if (!res.ok) throw new Error('Google API Error');
          const data = await res.json();
          setExplanation(data.candidates[0].content.parts[0].text);
        } else if (customConfig.provider === 'openai') {
          const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${customConfig.apiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ]
            })
          });
          if (!res.ok) throw new Error('OpenAI API Error');
          const data = await res.json();
          setExplanation(data.choices[0].message.content);
        }
        setLoading(false);
        return;
      }

      // 3. Fallback to Server API
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node, input })
      });

      const data = await res.json();

      if (res.status === 429 || res.status === 503 || res.status === 401) {
        setErrorMsg(data.message || "Server AI quota exceeded. Please configure your own API key.");
        setShowConfig(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setErrorMsg(data.message || 'Failed to fetch explanation.');
        setShowConfig(true);
        setLoading(false);
        return;
      }

      setExplanation(data.explanation);
    } catch (e: any) {
      setErrorMsg(e.message || "Network error.");
      setShowConfig(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExplanation();
  }, [node.nodeId]);

  return (
    <>
      <AISettingsModal 
        isOpen={showConfig}
        initialMessage={errorMsg || undefined}
        onClose={() => { 
          setShowConfig(false); 
          if (!explanation) onClose(); 
          else fetchExplanation(); // Retry
        }}
      />

      {!showConfig && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in-95 font-sans">
          
          <div className="bg-slate-50 border-2 border-slate-900 shadow-[8px_8px_0_0_#0f172a] w-full max-w-2xl flex flex-col max-h-[90vh]">
            
            {/* Header - Boxy Symmetry */}
            <div className="bg-brand-400 border-b-2 border-slate-900 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={onClose}
                  className="bg-white border-2 border-slate-900 p-1.5 hover:bg-slate-100 transition-colors shadow-[2px_2px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[2px] active:translate-x-[2px]"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-900" />
                </button>
                <div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> 
                    AI Insight
                  </h2>
                  <p className="text-xs font-bold text-slate-800">{node.nameEn}</p>
                </div>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-6 md:p-8 overflow-y-auto grow bg-white relative">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <div className="w-10 h-10 border-4 border-brand-500 border-r-transparent rounded-full animate-spin"></div>
                  <p className="font-bold text-sm text-slate-600 animate-pulse tracking-wide">Synthesizing data vectors...</p>
                </div>
              ) : explanation ? (
                <div className="prose prose-slate max-w-none text-slate-800">
                  <div className="whitespace-pre-wrap font-medium leading-relaxed text-[15px]">
                    {explanation}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-rose-600 space-y-3">
                  <AlertCircle className="w-10 h-10" />
                  <p className="font-bold">Failed to load insight.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t-2 border-slate-900 bg-slate-100 p-4 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Info className="w-4 h-4" />
                <span>AI may make mistakes. Verify official info.</span>
              </div>
              <button 
                onClick={() => setShowConfig(true)} 
                className="flex items-center gap-2 bg-white border-2 border-slate-900 px-3 py-1.5 text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-[2px_2px_0_0_#0f172a] active:shadow-[0_0_0_0_#0f172a] active:translate-y-[2px] active:translate-x-[2px]"
              >
                <Settings className="w-4 h-4" />
                API Settings
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
