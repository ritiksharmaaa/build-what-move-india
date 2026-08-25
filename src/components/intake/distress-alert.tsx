'use client';

import { useTranslations } from 'next-intl';

export function DistressAlert({ helplines }: { helplines: any[] }) {
  const t = useTranslations('safety');

  return (
    <div className="rounded-lg border-2 border-rose-600 bg-rose-50 p-6 animate-toast-in">
      <h3 className="text-xl font-bold text-rose-900 mb-2 flex items-center gap-2">
        <span aria-hidden>🆘</span>
        {t('distressTitle')}
      </h3>
      <p className="text-rose-800 mb-6 font-medium">
        {t('distressMessage')}
      </p>
      <div className="space-y-4">
        <h4 className="font-semibold text-rose-900">{t('helplines')}</h4>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {helplines.map(h => (
            <div key={h.name} className="bg-white p-4 rounded border border-rose-200 shadow-sm text-center">
              <div className="font-bold text-slate-900 mb-1">{h.name}</div>
              <div className="text-rose-700 font-bold text-lg">{h.number}</div>
              <div className="text-xs text-slate-500 mt-2">{h.hours}</div>
              <a href={`tel:${h.number}`} className="mt-3 block w-full bg-rose-100 hover:bg-rose-200 text-rose-900 py-2 rounded font-semibold transition-colors">
                {t('callNow')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
