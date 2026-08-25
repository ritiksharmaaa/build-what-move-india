import type { GraphStatistics } from '@/lib/contracts/pathway';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function StatisticsBar({ stats }: { stats: GraphStatistics }) {
  const t = useTranslations('map');

  return (
    <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-slate-900 text-white rounded-xl shadow-lg">
      <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
        <div className="text-2xl font-black text-emerald-400">{stats.openPaths}</div>
        <div className="text-xs font-medium text-slate-300 leading-tight w-16 uppercase">{t('statisticsOpen')}</div>
      </div>
      
      <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
        <div className="text-2xl font-black text-rose-400">{stats.closedPaths}</div>
        <div className="text-xs font-medium text-slate-300 leading-tight w-16 uppercase">{t('statisticsClosed')}</div>
      </div>

      {(stats.harderPaths > 0 || stats.conditionalPaths > 0) && (
        <div className="flex items-center gap-2 pr-4 border-r border-slate-700">
          <div className="text-2xl font-black text-orange-400">{stats.harderPaths + stats.conditionalPaths}</div>
          <div className="text-xs font-medium text-slate-300 leading-tight w-16 uppercase">{t('statisticsHard')}</div>
        </div>
      )}

      {stats.recoveryRoutes > 0 && (
        <div className="flex items-center gap-2">
          <div className="text-2xl font-black text-purple-400">{stats.recoveryRoutes}</div>
          <div className="text-xs font-medium text-slate-300 leading-tight w-20 uppercase">{t('statisticsRecovery')}</div>
        </div>
      )}
    </div>
  );
}
