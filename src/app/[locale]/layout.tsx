import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { MainHeader } from '@/components/layout/main-header';
import { MainFooter } from '@/components/layout/main-footer';
import { StartupGreeting } from '@/components/layout/startup-greeting';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-latin',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${notoSansDevanagari.variable}`}
    >
      <body
        className={`min-h-screen flex flex-col antialiased bg-[#FAFBFD] text-slate-900 ${
          locale === 'hi' ? 'font-devanagari leading-hindi' : 'font-sans'
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          <StartupGreeting />
          <MainHeader />
          <main className="flex-1 w-full">
            {children}
          </main>
          <MainFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
