'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Key, X, Check, ShieldAlert, Cpu } from 'lucide-react';
import type { AIProviderOptions } from '@/lib/ai/client-provider';

export function AISettingsModal({
  isOpen,
  onClose,
  initialMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}) {
  const [provider, setProvider] = useState<'google' | 'openai'>('google');
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('pathfinder_ai_settings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as AIProviderOptions;
          if (parsed.provider) setProvider(parsed.provider);
          if (parsed.apiKey) setApiKey(parsed.apiKey);
        } catch (e) {
          // ignore parsing error
        }
      }
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(
        'pathfinder_ai_settings',
        JSON.stringify({ provider, apiKey: apiKey.trim() })
      );
    } else {
      localStorage.removeItem('pathfinder_ai_settings');
    }
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('pathfinder_ai_settings');
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none animate-in fade-in zoom-in-95">
      <div className="bg-slate-50 border-2 border-slate-900 shadow-[8px_8px_0_0_#0f172a] w-full max-w-md flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 bg-brand-400 border-b-2 border-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-3 text-slate-900">
            <Cpu className="w-5 h-5" />
            <h2 className="text-sm font-black tracking-widest uppercase">
              API Settings
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="bg-white border-2 border-slate-900 p-1 hover:bg-slate-100 transition-colors shadow-[2px_2px_0_0_#0f172a] active:shadow-[0_0_0_0_#0f172a] active:translate-y-[2px] active:translate-x-[2px]"
          >
            <X className="w-4 h-4 text-slate-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-white">
          {initialMessage && (
            <div className="bg-amber-300 border-2 border-slate-900 text-slate-900 p-3 text-xs font-bold flex items-start gap-2.5 shadow-[4px_4px_0_0_#0f172a]">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{initialMessage}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-widest block">
              AI Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProvider('google')}
                className={`py-2 px-3 border-2 border-slate-900 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0_0_#0f172a] active:shadow-[0_0_0_0_#0f172a] active:translate-y-[2px] active:translate-x-[2px] ${
                  provider === 'google'
                    ? 'bg-brand-400 text-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                Google
              </button>
              <button
                onClick={() => setProvider('openai')}
                className={`py-2 px-3 border-2 border-slate-900 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0_0_#0f172a] active:shadow-[0_0_0_0_#0f172a] active:translate-y-[2px] active:translate-x-[2px] ${
                  provider === 'openai'
                    ? 'bg-emerald-400 text-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                OpenAI
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Key className="w-4 h-4" />
              Your API Key
            </label>
            <input
              type="password"
              placeholder={`Enter ${provider === 'google' ? 'Google AI Studio' : 'OpenAI'} API Key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full border-2 border-slate-900 bg-slate-50 px-3 py-2 text-sm font-medium focus:outline-none focus:bg-white shadow-[2px_2px_0_0_#0f172a] focus:shadow-[4px_4px_0_0_#0f172a] transition-all"
            />
            <p className="text-[10px] text-slate-600 font-bold leading-relaxed mt-2 border-l-2 border-brand-400 pl-2">
              Keys are stored securely in your browser's localStorage. Never sent to our servers.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t-2 border-slate-900 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs font-black text-rose-600 hover:text-rose-700 transition-colors uppercase tracking-widest underline decoration-2 underline-offset-4"
          >
            Clear Key
          </button>
          
          <button
            onClick={handleSave}
            className={`px-5 py-2 border-2 border-slate-900 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[4px_4px_0_0_#0f172a] active:shadow-[0_0_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] ${
              saved 
                ? 'bg-emerald-400 text-slate-900' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
