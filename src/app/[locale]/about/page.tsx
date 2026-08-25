import React from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { 
  BookOpen, 
  Target, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight,
  TrendingUp,
  Landmark,
  Scale
} from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'mission' });
  const headerT = await getTranslations({ locale, namespace: 'header' });

  return {
    title: `${t('title')} — ${headerT('portalTitle')}`,
    description: t('subtitle'),
  };
}

export default async function MissionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('mission');
  const commonT = await getTranslations('common');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Symmetrical Mission Header Bento */}
      <section className="bento-box p-8 sm:p-12 border-2 border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 border border-brand-300 text-brand-800 text-[11px] font-mono font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span>{t('badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight font-devanagari">
            {t('title')}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-devanagari">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-saffron-600" />
            <span>GROUND ZERO: UTTAR PRADESH & ALL-INDIA</span>
          </div>
          <div>ESTABLISHED 2026 • OPEN INNOVATION</div>
        </div>
      </section>

      {/* 2. The Crisis in Numbers (Symmetrical 3-Grid) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bento-box p-6 border-2 border-slate-900 bg-red-50/60 border-l-8 border-l-red-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-black text-slate-950 font-mono">4.5 Crore</span>
            <AlertOctagon className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-devanagari">
            {locale === 'hi' ? 'छात्र हर वर्ष निर्णय लेते हैं' : 'Students Transition Annually'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-devanagari">
            {locale === 'hi'
              ? 'बिना किसी प्रमाणित परामर्श के केवल पड़ोसियों व विज्ञापनों के दबाव में विषय चुनते हैं।'
              : 'Decide lifelong streams based on peer hearsay and misleading coaching billboards.'}
          </p>
        </div>

        <div className="bento-box p-6 border-2 border-slate-900 bg-amber-50/60 border-l-8 border-l-amber-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-black text-slate-950 font-mono">₹15,000 Cr</span>
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-devanagari">
            {locale === 'hi' ? 'निजी कोचिंग का अनियंत्रित बाजार' : 'Predatory Coaching Economy'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-devanagari">
            {locale === 'hi'
              ? 'गरीब परिवारों की गाढ़ी कमाई उन परीक्षाओं के लिए वसूली जाती है जिनकी तैयारी शून्य लागत में संभव है।'
              : 'Middle-class families pushed into crushing debt for exams that require disciplined self-study.'}
          </p>
        </div>

        <div className="bento-box p-6 border-2 border-slate-900 bg-blue-50/60 border-l-8 border-l-blue-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl font-black text-slate-950 font-mono">68%</span>
            <Scale className="w-6 h-6 text-brand-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 font-devanagari">
            {locale === 'hi' ? 'डेडलाइन व कोटा की अनभिज्ञता' : 'Unclaimed State Quotas'}
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-devanagari">
            {locale === 'hi'
              ? 'उत्तर प्रदेश के 85% राज्य कोटे और सरकारी छात्रवृत्तियों की जानकारी समय पर नहीं मिल पाती।'
              : 'Students miss state reservation windows and fee-waiver schemes due to information blackout.'}
          </p>
        </div>
      </section>

      {/* 3. Structured Narrative: "Riya's Story" (Symmetrical 2-Column Bento Layout) */}
      <section className="bento-box p-8 sm:p-10 border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-8">
        <div className="border-b-2 border-slate-900 pb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-bold text-base">
            01
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-saffron-600">
              USER CASE STUDY • केस स्टडी
            </span>
            <h2 className="text-2xl font-black text-slate-950 font-devanagari tracking-tight">
              {t('storyTitle')}
            </h2>
          </div>
        </div>

        {/* Narrative Bento Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chapter 1: Aspiration */}
          <div className="bento-box p-6 border-2 border-slate-900 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-brand-700">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-bold text-xs uppercase tracking-wider font-mono">
                  Phase 1 • Varanasi High School
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-devanagari">
                {t('storyP1')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] font-mono text-slate-500">
              Score: 92% (UP Board Class 10)
            </div>
          </div>

          {/* Chapter 2: The Coaching Trap */}
          <div className="bento-box p-6 border-2 border-slate-900 bg-amber-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-amber-700">
                <AlertOctagon className="w-4 h-4" />
                <h4 className="font-bold text-xs uppercase tracking-wider font-mono">
                  Phase 2 • The Misinformation Fog
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-devanagari">
                {t('storyP2')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] font-mono text-amber-800 font-bold">
              Pressure: ₹5,00,000 Coaching Debt
            </div>
          </div>

          {/* Chapter 3: The PathFinder Clarity */}
          <div className="bento-box p-6 border-2 border-slate-900 bg-emerald-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="font-bold text-xs uppercase tracking-wider font-mono">
                  Phase 3 • Mathematical Certainty
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-devanagari">
                {t('storyP3')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] font-mono text-emerald-800 font-bold">
              Solution: ₹0 Public Data Matrix
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our 4 Pillars of Integrity (Symmetrical 4-Grid) */}
      <section className="space-y-6">
        <div className="border-b-2 border-slate-900 pb-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-600">
            SYSTEM FOUNDATION • बुनियादी सिद्धांत
          </span>
          <h2 className="text-2xl font-black text-slate-950 font-devanagari mt-0.5">
            {locale === 'hi' ? 'पाथफाइंडर इंडिया के चार अटूट स्तंभ' : 'The 4 Pillars of PathFinder India'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bento-box p-6 border-2 border-slate-900 bg-white shadow-sm">
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-bold mb-4 font-mono">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-950 mb-2 font-devanagari">
              {t('pillars.p1Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
              {t('pillars.p1Desc')}
            </p>
          </div>

          <div className="bento-box p-6 border-2 border-slate-900 bg-white shadow-sm">
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-bold mb-4 font-mono">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-950 mb-2 font-devanagari">
              {t('pillars.p2Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
              {t('pillars.p2Desc')}
            </p>
          </div>

          <div className="bento-box p-6 border-2 border-slate-900 bg-white shadow-sm">
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-bold mb-4 font-mono">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-950 mb-2 font-devanagari">
              {t('pillars.p3Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
              {t('pillars.p3Desc')}
            </p>
          </div>

          <div className="bento-box p-6 border-2 border-slate-900 bg-white shadow-sm">
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-bold mb-4 font-mono">
              04
            </div>
            <h3 className="text-sm font-bold text-slate-950 mb-2 font-devanagari">
              {t('pillars.p4Title')}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
              {t('pillars.p4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Call to Action Bento */}
      <section className="bento-box p-8 border-2 border-slate-900 bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
            ONE NATION • ONE CAREER PORTAL
          </span>
          <h2 className="text-2xl font-black font-devanagari mt-1">
            {locale === 'hi' ? 'अपने सपनों का सटीक मार्ग आज ही खोजें' : 'Calculate Your Exact Pathway Today'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-devanagari">
            {locale === 'hi'
              ? 'उत्तर प्रदेश व केंद्रीय परीक्षाओं के लिए 100% निशुल्क और पारदर्शी निर्णय मानचित्र।'
              : 'Zero registration fee • Powered by verified state and central gazettes.'}
          </p>
        </div>

        <Link
          href="/start"
          className="shrink-0 inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-3.5 text-xs uppercase tracking-wider border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          <span>{locale === 'hi' ? 'करियर खोजें' : 'Start Journey'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
