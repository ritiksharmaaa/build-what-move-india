import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { PrototypeDisclaimer } from '@/components/prototype-disclaimer';
import { Link } from '@/i18n/navigation';
import '@/app/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-latin',
  display: 'swap',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  weight: ['400', '500', '600', '700'],
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
        className={`min-h-screen flex flex-col antialiased ${
          locale === 'hi' ? 'font-devanagari leading-hindi' : 'font-sans'
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  P
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900 tracking-tight">
                    {messages.header ? (messages.header as any).portalTitle : 'PathFinder India'}
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    {messages.header ? (messages.header as any).subtitle : 'Student Career Route Planner'}
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-6">
                <LanguageSwitcher />
              </div>
            </div>
            <PrototypeDisclaimer />
          </header>

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
