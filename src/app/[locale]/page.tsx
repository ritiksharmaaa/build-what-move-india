import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'header' });

  return {
    title: t('portalTitle'),
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

  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight text-balance">
          {t('heroTitle')}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-balance">
          {t('heroSubtitle')}
        </p>
        <div className="pt-8">
          <Link
            href="/start"
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {t('ctaButton')}
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="w-12 h-12 bg-blue-100 text-brand-600 rounded-lg flex items-center justify-center mb-6 text-xl">
            🔗
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t('features.linked.title')}</h3>
          <p className="text-slate-600">{t('features.linked.desc')}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6 text-xl">
            🏛️
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t('features.source.title')}</h3>
          <p className="text-slate-600">{t('features.source.desc')}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6 text-xl">
            🇮🇳
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{t('features.language.title')}</h3>
          <p className="text-slate-600">{t('features.language.desc')}</p>
        </div>
      </section>
    </div>
  );
}
