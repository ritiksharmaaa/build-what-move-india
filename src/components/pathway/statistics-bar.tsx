'use client';

import React from 'react';
import type { GraphStatistics } from '@/lib/contracts/pathway';
import { useTranslations, useLocale } from 'next-intl';

export function StatisticsBar({ stats }: { stats: GraphStatistics }) {
  const t = useTranslations('map');
  const locale = useLocale();

  return (
    <div className="flex flex-wrap items-center gap-2 border-2 border-slate-900 bg-slate-900 text-white p-2 shadow-sm font-mono text-xs">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800">
        <div className="text-xl font-black text-emerald-400 leading-none">{stats.openPaths}</div>
        <div className="text-[10px] text-slate-300 uppercase leading-tight font-bold">
          {locale === 'hi' ? 'मार्ग खुले' : 'OPEN'}
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800">
        <div className="text-xl font-black text-red-400 leading-none">{stats.closedPaths}</div>
        <div className="text-[10px] text-slate-300 uppercase leading-tight font-bold">
          {locale === 'hi' ? 'अवरुद्ध' : 'LOCKED'}
        </div>
      </div>

      {(stats.harderPaths > 0 || stats.conditionalPaths > 0) && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800">
          <div className="text-xl font-black text-amber-400 leading-none">
            {stats.harderPaths + stats.conditionalPaths}
          </div>
          <div className="text-[10px] text-slate-300 uppercase leading-tight font-bold">
            {locale === 'hi' ? 'कठिन / शर्त' : 'RISK / WARN'}
          </div>
        </div>
      )}

      {stats.recoveryRoutes > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 border border-slate-800">
          <div className="text-xl font-black text-purple-400 leading-none">{stats.recoveryRoutes}</div>
          <div className="text-[10px] text-slate-300 uppercase leading-tight font-bold">
            {locale === 'hi' ? 'पुनर्प्राप्ति' : 'RECOVERY'}
          </div>
        </div>
      )}
    </div>
  );
}
