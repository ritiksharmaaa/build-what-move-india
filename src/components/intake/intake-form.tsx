'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { StudentDecisionSchema, type StudentDecisionFormData } from '@/lib/validation/student-input';
import { detectDistress, type DistressResult } from '@/lib/safety/distress-detector';
import { DistressAlert } from './distress-alert';
import { 
  GraduationCap, 
  Banknote, 
  MapPin, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  Check, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export function IntakeForm() {
  const t = useTranslations('intake');
  const commonT = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<Partial<StudentDecisionFormData>>({
    stage: 'class_10',
    class12Stream: 'science_with_maths',
    budgetBand: 'medium',
    earningUrgency: 'long_term',
    stateCode: 'UP',
    goals: [],
    interests: [],
    preferredLanguage: (locale === 'hi' ? 'hi' : 'en') as 'en' | 'hi',
  });

  const [distress, setDistress] = useState<DistressResult | null>(null);
  const [goalInput, setGoalInput] = useState('');

  // Read initial goal from URL query if available
  useEffect(() => {
    const goalParam = searchParams.get('goal');
    if (goalParam) {
      setFormData((prev) => ({
        ...prev,
        goals: Array.from(new Set([...(prev.goals || []), goalParam])),
      }));
    }
  }, [searchParams]);

  const quickGoals = [
    'IAS/IPS',
    'Scientist (ISRO)',
    'Doctor (MBBS)',
    'Software Engineer',
    'Judge / Advocate',
    'Defence Officer (NDA)',
    'Chartered Accountant',
    'Government Teacher (TET)',
  ];

  const handleGoalAdd = (customGoal?: string) => {
    const goalToAdd = (customGoal || goalInput).trim();
    if (!goalToAdd) return;

    // Safety distress check
    const distressCheck = detectDistress(goalToAdd);
    if (distressCheck.detected) {
      setDistress(distressCheck);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      goals: Array.from(new Set([...(prev.goals || []), goalToAdd])),
    }));
    if (!customGoal) setGoalInput('');
  };

  const handleGoalRemove = (goalToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals?.filter((g) => g !== goalToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const valid = StudentDecisionSchema.parse(formData);
      const params = new URLSearchParams();
      params.set('stage', valid.stage);
      if (valid.class12Stream) params.set('stream', valid.class12Stream);
      params.set('budget', valid.budgetBand);
      params.set('state', valid.stateCode);
      if (valid.goals.length) params.set('goals', valid.goals.join(','));

      router.push(`/map?${params.toString()}`);
    } catch (err) {
      console.error('Validation error', err);
      alert('Please fill out all required fields.');
    }
  };

  if (distress?.detected) {
    return <DistressAlert helplines={distress.helplines} />;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      {/* Form Header Bento */}
      <div className="bento-box p-6 sm:p-8 border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-brand-600 mb-2">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
          <span>{t('badge')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-devanagari">
          {t('title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-devanagari">
          {t('subtitle')}
        </p>
      </div>

      {/* Symmetrical Grid: Section 1 (Stage & Stream) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: Educational Stage */}
        <div className="bento-box p-6 border-2 border-slate-900 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <GraduationCap className="w-4 h-4 text-brand-700" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-devanagari">
                {t('stageQuestion')}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(['class_10', 'class_12', 'graduate', 'dropout'] as const).map((stage) => {
                const isSelected = formData.stage === stage;
                return (
                  <label
                    key={stage}
                    className={`cursor-pointer p-4 border-2 transition-all flex flex-col justify-between aspect-[4/3] ${
                      isSelected
                        ? 'border-slate-900 bg-brand-50 text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                        : 'border-slate-300 hover:border-slate-500 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="stage"
                      value={stage}
                      checked={isSelected}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stage: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                        {stage.replace('_', ' ')}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-brand-600" />}
                    </div>
                    <span className="text-xs sm:text-sm font-bold font-devanagari">
                      {t(`stages.${stage}`)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Box 2: Stream Selection */}
        <div className="bento-box p-6 border-2 border-slate-900 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-devanagari">
                {t('streamQuestion')}
              </h2>
            </div>

            <div className="space-y-2">
              {[
                { key: 'science_with_maths', label: t('streams.science_with_maths'), tag: 'PCM' },
                { key: 'science_without_maths', label: t('streams.science_without_maths'), tag: 'PCB' },
                { key: 'commerce_with_maths', label: t('streams.commerce_with_maths'), tag: 'COMMERCE+M' },
                { key: 'commerce_without_maths', label: t('streams.commerce_without_maths'), tag: 'COMMERCE' },
                { key: 'humanities', label: t('streams.humanities'), tag: 'ARTS' },
                { key: 'vocational', label: t('streams.vocational'), tag: 'DIPLOMA' },
              ].map((stream) => {
                const isSelected = formData.class12Stream === stream.key;
                return (
                  <label
                    key={stream.key}
                    className={`cursor-pointer p-3 border-2 transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'border-slate-900 bg-saffron-50 text-slate-950 font-bold shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                        : 'border-slate-300 hover:border-slate-500 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="class12Stream"
                      value={stream.key}
                      checked={isSelected}
                      onChange={(e) => setFormData((prev) => ({ ...prev, class12Stream: e.target.value as any }))}
                      className="sr-only"
                    />
                    <span className="font-devanagari">{stream.label}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-200 border border-slate-300 text-slate-800">
                      {stream.tag}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Symmetrical Grid: Section 2 (State & PROMINENT BUDGET) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Box 3: State Focus (4 cols) */}
        <div className="md:col-span-4 bento-box p-6 border-2 border-slate-900 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-devanagari">
                {t('stateQuestion')}
              </h2>
            </div>

            <div className="space-y-2">
              {[
                { key: 'UP', label: t('states.UP'), isDefault: true },
                { key: 'BR', label: t('states.BR'), isDefault: false },
                { key: 'MP', label: t('states.MP'), isDefault: false },
                { key: 'DL', label: t('states.DL'), isDefault: false },
                { key: 'OTHER', label: t('states.OTHER'), isDefault: false },
              ].map((st) => {
                const isSelected = formData.stateCode === st.key;
                return (
                  <label
                    key={st.key}
                    className={`cursor-pointer p-3 border-2 transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'border-slate-900 bg-emerald-50 text-slate-950 font-bold shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                        : 'border-slate-300 hover:border-slate-500 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="stateCode"
                      value={st.key}
                      checked={isSelected}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stateCode: e.target.value }))}
                      className="sr-only"
                    />
                    <span className="font-devanagari">{st.label}</span>
                    {st.isDefault && (
                      <span className="text-[9px] font-mono uppercase bg-emerald-600 text-white px-1.5 py-0.5 font-bold">
                        DEFAULT
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Box 4: PROMINENT ANNUAL BUDGET SELECTOR (8 cols) */}
        <div className="md:col-span-8 bento-box p-6 border-2 border-slate-900 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-devanagari">
                  {t('budgetQuestion')}
                </h2>
              </div>
              <span className="text-[10px] font-mono uppercase bg-saffron-100 text-saffron-800 px-2 py-0.5 border border-saffron-300 font-bold">
                MANDATORY FILTER
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 font-devanagari">
              {t('budgetWarningNote')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { 
                  band: 'low', 
                  range: '₹0 - ₹25,000 / yr', 
                  title: locale === 'hi' ? 'सरकारी / फ्री' : 'Government / Free',
                  desc: locale === 'hi' ? 'आईआईटी, सरकारी मेडिकल व केंद्रीय वि.वि. (सब्सिडी)' : 'Govt colleges, state univs, scholarships'
                },
                { 
                  band: 'medium', 
                  range: '₹25K - ₹1.5L / yr', 
                  title: locale === 'hi' ? 'मध्यम श्रेणी' : 'Mid-Tier / Subsidized',
                  desc: locale === 'hi' ? 'राज्य इंजीनियरिंग, बी.कॉम, बीएड, नर्सिंग' : 'State engineering, private aided, professional'
                },
                { 
                  band: 'high', 
                  range: '₹1.5L - ₹10L+ / yr', 
                  title: locale === 'hi' ? 'उच्च / निजी' : 'Private / Unsubsidized',
                  desc: locale === 'hi' ? 'प्रीमियम प्राइवेट इंजीनियरिंग व मेडिकल कॉलेज' : 'Private academies, deemed universities, aviation'
                },
              ].map((item) => {
                const isSelected = formData.budgetBand === item.band;
                return (
                  <label
                    key={item.band}
                    className={`cursor-pointer p-4 border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-slate-900 bg-brand-50 text-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] font-bold'
                        : 'border-slate-300 hover:border-slate-500 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="budgetBand"
                      value={item.band}
                      checked={isSelected}
                      onChange={(e) => setFormData((prev) => ({ ...prev, budgetBand: e.target.value as any }))}
                      className="sr-only"
                    />
                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-slate-500 mb-1">
                        {item.range}
                      </div>
                      <div className="text-sm font-bold text-slate-950 font-devanagari">
                        {item.title}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 font-devanagari leading-snug">
                      {item.desc}
                    </p>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Symmetrical Grid: Section 3 (Goals & Dream Aspirations) */}
      <div className="bento-box p-6 border-2 border-slate-900 bg-white space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-devanagari">
            {t('goalsQuestion')}
          </h2>
        </div>

        {/* Quick Goal Badges */}
        <div className="flex flex-wrap gap-2">
          {quickGoals.map((qg) => {
            const isAlreadyAdded = formData.goals?.includes(qg);
            return (
              <button
                key={qg}
                type="button"
                onClick={() => (isAlreadyAdded ? handleGoalRemove(qg) : handleGoalAdd(qg))}
                className={`px-3 py-1.5 text-xs font-bold border transition-all flex items-center gap-1.5 ${
                  isAlreadyAdded
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                {isAlreadyAdded && <Check className="w-3 h-3 text-emerald-400" />}
                <span>{qg}</span>
              </button>
            );
          })}
        </div>

        {/* Custom Goal Input */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 border-2 border-slate-300 focus:border-slate-900 focus:outline-none text-xs sm:text-sm font-devanagari"
            placeholder={locale === 'hi' ? 'या अपना अन्य लक्ष्य लिखें (उदा. ISRO वैज्ञानिक, सब इंस्पेक्टर, सीए)...' : 'Or type a custom career goal...'}
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleGoalAdd())}
          />
          <button
            type="button"
            onClick={() => handleGoalAdd()}
            className="bg-slate-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            {locale === 'hi' ? '+ जोड़ें' : '+ Add'}
          </button>
        </div>

        {/* Selected Goals Display */}
        {formData.goals && formData.goals.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.goals.map((g) => (
              <span
                key={g}
                className="bg-brand-50 border-2 border-brand-600 text-brand-900 px-3 py-1 text-xs font-bold flex items-center gap-2"
              >
                <span>🎯 {g}</span>
                <button
                  type="button"
                  onClick={() => handleGoalRemove(g)}
                  className="text-brand-600 hover:text-red-600 font-mono text-sm leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Symmetrical Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-4 px-8 text-base uppercase tracking-wider border-2 border-brand-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-3 font-devanagari"
        >
          <span>{t('submitButton')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}
