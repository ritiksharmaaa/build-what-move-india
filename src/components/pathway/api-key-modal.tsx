'use client';

import { useState, useEffect } from 'react';

export type AiConfig = {
  apiKey: string;
  endpoint: string;
  model: string;
};

export function ApiKeyModal({
  onSave,
  onClose,
  initialError
}: {
  onSave: (config: AiConfig) => void;
  onClose: () => void;
  initialError?: string;
}) {
  const [config, setConfig] = useState<AiConfig>({
    apiKey: '',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini'
  });

  useEffect(() => {
    const saved = localStorage.getItem('pathfinder_ai_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pathfinder_ai_config', JSON.stringify(config));
    onSave(config);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>⚙️</span> API Configuration
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            The server's AI quota is exhausted or missing. Please provide your own API key to continue using AI features.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {initialError && (
            <div className="bg-rose-50 text-rose-700 p-3 rounded-lg text-sm font-medium border border-rose-200">
              {initialError}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Provider Endpoint</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500"
              value={config.endpoint}
              onChange={e => setConfig({...config, endpoint: e.target.value})}
              required
            />
            <p className="text-xs text-slate-500 mt-1">Supports OpenAI format (e.g. OpenRouter, Groq, Together)</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Model Name</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500"
              value={config.model}
              onChange={e => setConfig({...config, model: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">API Key</label>
            <input 
              type="password" 
              className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500"
              value={config.apiKey}
              onChange={e => setConfig({...config, apiKey: e.target.value})}
              required
              placeholder="sk-..."
            />
            <p className="text-xs text-slate-500 mt-1">Stored locally in your browser. Never sent anywhere except the endpoint.</p>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-bold transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-lg font-bold transition-colors">
              Save & Retry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
