import { getTranslations, setRequestLocale } from 'next-intl/server';
import { IntakeForm } from '@/components/intake/intake-form';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });

  return {
    title: t('start'),
  };
}

export default async function StartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-3xl mx-auto">
      <IntakeForm />
    </div>
  );
}
