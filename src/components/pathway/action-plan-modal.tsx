'use client';

import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { useLocale, useTranslations } from 'next-intl';

export function ActionPlanModal({
  nodes,
  onClose
}: {
  nodes: EvaluatedNode[];
  onClose: () => void;
}) {
  const locale = useLocale() as 'en' | 'hi';
  const t = useTranslations('plan');

  const selectedNames = nodes.map(n => locale === 'en' ? n.nameEn : n.nameHi);

  // Generate WA share link text
  const waText = encodeURIComponent(
    `Here is my PathFinder Action Plan for: ${selectedNames.join(', ')}.\n\nCheck out my roadmap at: https://pathfinder-india-hackathon.vercel.app`
  );

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-brand-50 rounded-t-2xl">
          <h2 className="text-2xl font-black text-brand-900">{t('title')}</h2>
          <button onClick={onClose} className="text-brand-900/50 hover:text-brand-900 font-bold text-xl">✕</button>
        </div>
        
        <div className="p-6 overflow-auto space-y-8">
          
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-3">{t('actionItems')}</h3>
            <ul className="space-y-3">
              {nodes.map((node, i) => (
                <li key={node.nodeId} className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <span className="font-semibold">{locale === 'en' ? node.nameEn : node.nameHi}: </span>
                    <span className="text-slate-600">Research officially recognized institutions and verify minimum eligibility criteria from official state counseling websites.</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2">{t('questionsToAsk')}</h3>
            <ul className="list-disc list-inside text-amber-800 space-y-1">
              <li>Are there any state-specific quotas available?</li>
              <li>What is the actual out-of-pocket cost after scholarships?</li>
              <li>Does the institution hold valid {nodes[0]?.sources?.[0]?.sourceName || 'regulatory'} accreditation?</li>
            </ul>
          </section>

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <a 
              href={`https://wa.me/?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-xl text-center transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              {t('shareWhatsApp')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
