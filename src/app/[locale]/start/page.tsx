import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IntakeForm } from '@/components/intake/intake-form';
import { Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'header' });

  return {
    title: `${locale === 'hi' ? 'करियर मार्ग खोजक' : 'Career Pathway Intake'} — ${t('portalTitle')}`,
    description: t('subtitle'),
  };
}

export default async function StartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative">
      <Link 
        href="/"
        className="absolute top-8 left-4 sm:left-6 flex items-center justify-center w-10 h-10 bg-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-slate-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all z-10"
      >
        <ArrowLeft className="w-5 h-5 text-slate-900" />
      </Link>
      
      <div className="pt-16">
        <Suspense fallback={<div className="p-8 text-center font-mono">Loading Intake System...</div>}>
          <IntakeForm />
        </Suspense>
      </div>
    </div>
  );
}
