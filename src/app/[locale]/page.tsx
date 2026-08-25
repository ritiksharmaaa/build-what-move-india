import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { MarqueeTicker } from '@/components/layout/marquee-ticker';
import { MetricsBento } from '@/components/landing/metrics-bento';
import { DreamShowcase } from '@/components/landing/dream-showcase';
import { Sparkles, GitBranch, ArrowRight, ShieldCheck, MapPin, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'header' });

  return {
    title: `${t('portalTitle')} — ${t('slogan')}`,
    description: t('subtitle'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        hi: '/hi',
      },
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('landing');
  const commonT = await getTranslations('common');

  return (
    <div className="w-full flex flex-col space-y-10 pb-16">
      {/* 1. Full-Width Marquee Ticker */}
      <div className="w-full">
        <MarqueeTicker />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        {/* 2. Hero Bento Box (Strict Boxy Symmetry) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Hero Bento Card (8 Cols) */}
          <div className="lg:col-span-8 bento-box p-8 sm:p-10 border-2 border-slate-900 bg-white flex flex-col justify-between relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-saffron-50 border border-saffron-300 text-saffron-800 text-[11px] font-mono font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-saffron-500 animate-pulse" />
                <span>{t('badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15] text-balance font-devanagari">
                {t('heroTitle')}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-devanagari">
                {t('heroSubtitle')}
              </p>
            </div>

            {/* CTA & State Focus Box */}
            <div className="mt-8 pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/start"
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3.5 text-sm uppercase tracking-wider border-2 border-brand-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('ctaStart')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/map"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold px-5 py-3.5 text-sm uppercase tracking-wider border-2 border-slate-900 transition-all"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>{t('ctaExplore')}</span>
                </Link>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-700 bg-slate-100 px-3 py-2 border border-slate-300">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>{t('stateFocusNotice')}</span>
              </div>
            </div>
          </div>

          {/* Right Symmetrical Side Bento Card (4 Cols) - Live Interactive Visual Indicator */}
          <div className="lg:col-span-4 bento-box p-6 sm:p-8 border-2 border-slate-900 bg-slate-900 text-white flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  CASCADE PROTOCOL
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  ACTIVE
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 font-devanagari">
                {locale === 'hi' ? 'निर्णय विखंडन का प्रभाव' : 'Decision Fission Engine'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-devanagari">
                {locale === 'hi'
                  ? 'गणितीय रूप से देखें कि एक चुनाव बदलने पर कितने नए द्वार खुलते हैं और कौन से बंद होते हैं।'
                  : 'Instantly simulate how adjusting a subject or budget threshold alters the entire career matrix.'}
              </p>

              {/* Mini visual state representation */}
              <div className="mt-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-800 border border-slate-700 text-emerald-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Route: Science PCM</span>
                  </div>
                  <span className="text-[10px] font-bold">OPEN</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800 border border-slate-700 text-red-400">
                  <div className="flex items-center gap-2">
                    <span>🔒</span>
                    <span>MBBS (Needs PCB Prereq)</span>
                  </div>
                  <span className="text-[10px] font-bold">LOCKED</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-800 border border-slate-700 text-amber-400">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Private Aviation (₹25L)</span>
                  </div>
                  <span className="text-[10px] font-bold">BUDGET</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>ZERO COMMERCIAL ADS</span>
              <span>100% UNBIASED</span>
            </div>
          </div>
        </section>

        {/* 3. Symmetrical Bento Metrics */}
        <section>
          <MetricsBento />
        </section>

        {/* 4. Dream Showcase in 12 Equal Symmetrical Squares */}
        <section>
          <DreamShowcase />
        </section>

        {/* 5. Symmetrical 3-Column Architectural Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bento-box p-6 border-2 border-slate-900 bg-white">
            <div className="w-10 h-10 bg-blue-100 text-brand-700 border border-blue-300 flex items-center justify-center font-bold mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2 font-devanagari">
              {locale === 'hi' ? 'परमाणु विखंडन विश्लेषण' : 'Nuclear Fission Visualizer'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
              {locale === 'hi'
                ? 'कक्षा 10 से शुरू होकर हर विषय के आधार पर शाखाओं में बंटती हुई संपूर्ण संभावनाओं की श्रृंखला।'
                : 'Interactive horizontal node graph branching from Class 10 into streams, degrees, and government postings.'}
            </p>
          </div>

          <div className="bento-box p-6 border-2 border-slate-900 bg-white">
            <div className="w-10 h-10 bg-orange-100 text-orange-700 border border-orange-300 flex items-center justify-center font-bold mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2 font-devanagari">
              {locale === 'hi' ? 'उत्तर प्रदेश व केंद्रीय डेटासेट' : 'UP & Central Statues'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
              {locale === 'hi'
                ? 'UPPSC, UP Police, AKTU, UPSC, NTA और गजट नियमों का सटीक और अद्यतन संकलन।'
                : 'Direct mapping of state quotas, age limits, and statutory eligibility criteria for UP and national exams.'}
            </p>
          </div>

          <div className="bento-box p-6 border-2 border-slate-900 bg-white">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center font-bold mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2 font-devanagari">
              {locale === 'hi' ? 'पारदर्शी बजट फिल्टर' : 'Transparent Budget Logic'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
              {locale === 'hi'
                ? '₹0 से लेकर ₹25L+ तक की सटीक लागत ताकि कोई भी छात्र छिपे हुए खर्चों के जाल में न फंसे।'
                : 'Exact annual fee bracket calculations showing friction warnings when private fees exceed family capacity.'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
