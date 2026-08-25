import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { cn, formatCostRange } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

export function PathwayNode({ node }: { node: EvaluatedNode }) {
  const locale = useLocale() as 'en' | 'hi';
  const t = useTranslations('doorStatus');

  const name = locale === 'en' ? node.nameEn : node.nameHi;
  const reason = locale === 'en' ? node.doorReasonEn : node.doorReasonHi;

  const bgClasses = {
    open: 'bg-emerald-50 border-emerald-200',
    conditional: 'bg-yellow-50 border-yellow-200',
    harder: 'bg-orange-50 border-orange-200',
    closed: 'bg-slate-100 border-slate-200 opacity-70 grayscale-[50%]',
    reopenable: 'bg-purple-50 border-purple-200',
    unverified: 'bg-slate-50 border-slate-200'
  };

  const badgeClasses = {
    open: 'bg-emerald-100 text-emerald-800',
    conditional: 'bg-yellow-100 text-yellow-800',
    harder: 'bg-orange-100 text-orange-800',
    closed: 'bg-slate-200 text-slate-700',
    reopenable: 'bg-purple-100 text-purple-800',
    unverified: 'bg-slate-200 text-slate-700'
  };

  return (
    <div className={cn("p-4 rounded-xl border shadow-sm transition-all hover:shadow-md", bgClasses[node.doorStatus])}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-900 leading-tight">{name}</h3>
        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider", badgeClasses[node.doorStatus])}>
          {t(node.doorStatus)}
        </span>
      </div>
      
      <p className="text-xs text-slate-600 mb-3 line-clamp-2">
        {reason}
      </p>

      {node.doorStatus !== 'closed' && node.costRange.max > 0 && (
        <div className="flex items-center justify-between text-xs font-medium border-t pt-2 border-black/5">
          <span className="text-slate-500">Cost</span>
          <span className="text-slate-900">{formatCostRange(node.costRange.min, node.costRange.max, locale)}</span>
        </div>
      )}
      
      {node.doorStatus === 'reopenable' && node.recoveryRoute && (
        <div className="mt-2 text-xs font-semibold text-purple-700 bg-purple-100/50 p-2 rounded">
          Recovery: {locale === 'en' ? node.recoveryRoute.steps[0].action : 'वैकल्पिक मार्ग उपलब्ध'}
        </div>
      )}
    </div>
  );
}
