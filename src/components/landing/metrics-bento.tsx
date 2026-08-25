'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Database, ShieldCheck, Banknote, Layers, Sparkles, Compass } from 'lucide-react';

export function MetricsBento() {
  const t = useTranslations('landing.metrics');
  const locale = useLocale();

  const metrics = [
    {
      key: 'nodes',
      value: t('nodes.value'),
      label: t('nodes.label'),
      desc: t('nodes.desc'),
      icon: Layers,
      color: 'border-l-4 border-l-blue-600',
    },
    {
      key: 'exams',
      value: t('exams.value'),
      label: t('exams.label'),
      desc: t('exams.desc'),
      icon: Database,
      color: 'border-l-4 border-l-orange-500',
    },
    {
      key: 'budget',
      value: t('budget.value'),
      label: t('budget.label'),
      desc: t('budget.desc'),
      icon: Banknote,
      color: 'border-l-4 border-l-emerald-600',
    },
    {
      key: 'accuracy',
      value: t('accuracy.value'),
      label: t('accuracy.label'),
      desc: t('accuracy.desc'),
      icon: ShieldCheck,
      color: 'border-l-4 border-l-purple-600',
    },
  ];

  return (
    <div className="w-full">
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-600">
            SYSTEM METRICS • पोर्टल आँकड़े
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight mt-1">
            {t('title')}
          </h2>
        </div>
        <p className="text-xs text-slate-600 max-w-md font-devanagari">
          {t('subtitle')}
        </p>
      </div>

      {/* Symmetrical 4-Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.key}
              className={`bento-box p-6 border-2 border-slate-900 bg-white ${m.color} flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono tracking-tight">
                  {m.value}
                </span>
                <div className="w-9 h-9 bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 font-devanagari">
                  {m.label}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
