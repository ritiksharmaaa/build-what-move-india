'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { StudentDecisionSchema, type StudentDecisionFormData } from '@/lib/validation/student-input';
import { detectDistress, type DistressResult } from '@/lib/safety/distress-detector';
import { DistressAlert } from './distress-alert';

export function IntakeForm() {
  const t = useTranslations('intake');
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<StudentDecisionFormData>>({
    stage: 'class_10',
    budgetBand: 'medium',
    earningUrgency: 'long_term',
    stateCode: 'UP',
    goals: [],
    interests: []
  });

  const [distress, setDistress] = useState<DistressResult | null>(null);
  const [goalInput, setGoalInput] = useState('');

  const handleGoalAdd = () => {
    if (!goalInput.trim()) return;
    
    // Check distress
    const distressCheck = detectDistress(goalInput);
    if (distressCheck.detected) {
      setDistress(distressCheck);
      return;
    }

    setFormData(prev => ({
      ...prev,
      goals: [...(prev.goals || []), goalInput.trim()]
    }));
    setGoalInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const valid = StudentDecisionSchema.parse(formData);
      // In a real app, save to state/context or encode in URL
      const params = new URLSearchParams();
      params.set('stage', valid.stage);
      if (valid.class12Stream) params.set('stream', valid.class12Stream);
      params.set('budget', valid.budgetBand);
      if (valid.goals.length) params.set('goals', valid.goals.join(','));
      
      router.push(`/map?${params.toString()}`);
    } catch (err) {
      console.error(err);
      alert('Please fill out all required fields.');
    }
  };

  if (distress?.detected) {
    return <DistressAlert helplines={distress.helplines} />;
  }

  const needsHistory = formData.stage === 'graduate' || formData.stage === 'dropout';

  return (
    <form onSubmit={handleSubmit} className="space-y-10 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      {/* Stage Selector */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">{t('stageQuestion')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['class_10', 'class_12', 'graduate', 'dropout'] as const).map(stage => (
            <label
              key={stage}
              className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                formData.stage === stage 
                  ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold' 
                  : 'border-slate-200 hover:border-brand-300 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="stage"
                value={stage}
                checked={formData.stage === stage}
                onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value as any }))}
                className="sr-only"
              />
              {t(`stages.${stage}`)}
            </label>
          ))}
        </div>
      </section>

      {/* History Selector (Only for Graduate/Dropout) */}
      {needsHistory && (
        <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 animate-slide-in">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{t('historyQuestion')}</h2>
          <select
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            value={formData.class12Stream || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, class12Stream: e.target.value as any }))}
          >
            <option value="" disabled>Select your Class 12 Stream...</option>
            <option value="science_with_maths">Science (with Maths)</option>
            <option value="science_without_maths">Science (without Maths)</option>
            <option value="commerce_with_maths">Commerce (with Maths)</option>
            <option value="commerce_without_maths">Commerce (without Maths)</option>
            <option value="humanities">Arts / Humanities</option>
            <option value="vocational">Vocational</option>
          </select>
        </section>
      )}

      {/* Budget Slider */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">{t('budgetQuestion')}</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {(['low', 'medium', 'high'] as const).map(band => (
            <label
              key={band}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                formData.budgetBand === band 
                  ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-sm ring-1 ring-brand-600' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="budgetBand"
                value={band}
                checked={formData.budgetBand === band}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetBand: e.target.value as any }))}
                className="sr-only"
              />
              <div className="font-semibold mb-1">{t(`budgetLabels.${band}`)}</div>
            </label>
          ))}
        </div>
      </section>

      {/* Goals / Interests */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4">{t('goalsQuestion')}</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="flex-1 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
            placeholder="e.g. Doctor, Software Engineer, CA..."
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleGoalAdd())}
          />
          <button
            type="button"
            onClick={handleGoalAdd}
            className="bg-slate-900 text-white px-6 rounded-lg font-medium hover:bg-slate-800"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.goals?.map(g => (
            <span key={g} className="bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              {g}
              <button 
                type="button"
                className="text-brand-600 hover:text-brand-900"
                onClick={() => setFormData(prev => ({ ...prev, goals: prev.goals?.filter(x => x !== g) }))}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      <button
        type="submit"
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-sm"
      >
        See My Options
      </button>
    </form>
  );
}
