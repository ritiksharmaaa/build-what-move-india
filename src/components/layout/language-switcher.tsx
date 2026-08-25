'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';
import { type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (nextLocale: Locale) => {
    if (nextLocale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-sm font-medium">
      <button
        type="button"
        onClick={() => handleToggle('en')}
        disabled={isPending}
        className={cn(
          'rounded-md px-3 py-1.5 transition-all',
          currentLocale === 'en'
            ? 'bg-white text-brand-800 shadow-sm font-semibold'
            : 'text-slate-500 hover:text-slate-800'
        )}
        aria-label="Switch to English"
        aria-pressed={currentLocale === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleToggle('hi')}
        disabled={isPending}
        className={cn(
          'rounded-md px-3 py-1.5 font-devanagari transition-all',
          currentLocale === 'hi'
            ? 'bg-white text-brand-800 shadow-sm font-semibold'
            : 'text-slate-500 hover:text-slate-800'
        )}
        aria-label="हिन्दी में बदलें"
        aria-pressed={currentLocale === 'hi'}
      >
        हिं
      </button>
    </div>
  );
}
