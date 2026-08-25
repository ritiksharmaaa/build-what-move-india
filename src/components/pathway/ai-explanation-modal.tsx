'use client';

import { useState, useEffect } from 'react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import { ApiKeyModal, type AiConfig } from './api-key-modal';

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

  const fetchExplanation = async (customConfig?: AiConfig) => {
    setLoading(true);
    setErrorMsg(null);
    setShowConfig(false);
    
    let configToUse = customConfig;
    if (!configToUse) {
      const saved = localStorage.getItem('pathfinder_ai_config');
      if (saved) {
        try { configToUse = JSON.parse(saved); } catch (e) {}
      }
    }

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node, input, config: configToUse })
      });

      if (res.status === 401 || res.status === 403) {
        // Auth error - needs config
        setErrorMsg("API Key missing or invalid.");
        setShowConfig(true);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.message || 'Failed to fetch explanation from AI provider.');
        setShowConfig(true); // Maybe their config is wrong
        setLoading(false);
        return;
      }

      const data = await res.json();
      setExplanation(data.explanation);
    } catch (e) {
      setErrorMsg("Network error trying to reach AI endpoint.");
      setShowConfig(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExplanation();
  }, [node.nodeId]);

  return (
    <>
      {showConfig && (
        <ApiKeyModal 
          initialError={errorMsg || undefined}
          onClose={() => { setShowConfig(false); if(!explanation) onClose(); }}
          onSave={(cfg) => fetchExplanation(cfg)}
        />
      )}

      {!showConfig && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-purple-50 to-brand-50 rounded-t-2xl">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <span className="text-purple-600">✨</span> AI Guide: {node.nameEn}
              </h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold text-xl">✕</button>
            </div>
            
            <div className="p-6 min-h-[200px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-purple-600">
                  <div className="w-8 h-8 border-4 border-current border-r-transparent rounded-full animate-spin"></div>
                  <p className="font-semibold animate-pulse">Analyzing pathway constraints...</p>
                </div>
              ) : explanation ? (
                <div className="prose prose-slate prose-purple max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                    {explanation}
                  </div>
                </div>
              ) : (
                <div className="text-rose-600 font-medium text-center">
                  Failed to load explanation.
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center text-xs text-slate-500">
              <p>AI can make mistakes. Verify critical dates and fees with official sources.</p>
              <button onClick={() => setShowConfig(true)} className="hover:text-purple-600 underline">⚙️ AI Settings</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
