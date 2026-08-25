import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IntakeForm } from '@/components/intake/intake-form';
import { Suspense } from 'react';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Suspense fallback={<div className="p-8 text-center font-mono">Loading Intake System...</div>}>
        <IntakeForm />
      </Suspense>
    </div>
  );
}
