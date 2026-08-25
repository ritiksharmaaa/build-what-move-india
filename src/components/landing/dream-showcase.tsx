'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { 
  Building2, 
  Atom, 
  Stethoscope, 
  Code2, 
  Scale, 
  Shield, 
  Calculator, 
  GraduationCap, 
  Trophy, 
  Mic2, 
  PenTool, 
  Landmark 
} from 'lucide-react';

export function DreamShowcase() {
  const t = useTranslations('landing.dreams');
  const locale = useLocale();

  const dreams = [
    { key: 'ias', icon: Landmark, goalParam: 'IAS/IPS', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'scientist', icon: Atom, goalParam: 'Scientist', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { key: 'doctor', icon: Stethoscope, goalParam: 'Doctor', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'software', icon: Code2, goalParam: 'Software Engineer', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    { key: 'judge', icon: Scale, goalParam: 'Judge/Advocate', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { key: 'defence', icon: Shield, goalParam: 'Defence Officer', color: 'bg-orange-50 text-orange-800 border-orange-200' },
    { key: 'ca', icon: Calculator, goalParam: 'Chartered Accountant', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'teacher', icon: GraduationCap, goalParam: 'Teacher/Professor', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { key: 'sports', icon: Trophy, goalParam: 'Athlete', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
    { key: 'singer', icon: Mic2, goalParam: 'Musician/Artist', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { key: 'writer', icon: PenTool, goalParam: 'Writer/Journalist', color: 'bg-slate-50 text-slate-700 border-slate-300' },
    { key: 'upsc', icon: Building2, goalParam: 'State Civil Service', color: 'bg-blue-50 text-brand-700 border-blue-300' },
  ];

  return (
    <div className="w-full">
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-saffron-600">
            DREAM CAREER EXPLORER • करियर अन्वेषक
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight mt-1">
            {t('title')}
          </h2>
        </div>
        <p className="text-xs text-slate-600 max-w-md font-devanagari">
          {t('subtitle')}
        </p>
      </div>

      {/* Symmetrical 12-Square Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {dreams.map((d) => {
          const Icon = d.icon;
          const name = t(`items.${d.key}.name`);
          const stream = t(`items.${d.key}.stream`);

          return (
            <Link
              key={d.key}
              href={`/start?goal=${encodeURIComponent(d.goalParam)}`}
              className="bento-box p-4 border-2 border-slate-900 hover:border-brand-600 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between aspect-square group"
            >
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 border flex items-center justify-center font-bold ${d.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-slate-900">
                  →
                </span>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-950 leading-snug group-hover:text-brand-600 transition-colors font-devanagari">
                  {name}
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 font-mono line-clamp-1">
                  {stream}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
