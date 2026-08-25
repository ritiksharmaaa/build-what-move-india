'use client';

import { useLocale } from 'next-intl';

const DISCLAIMER = {
  en: 'This is an independent hackathon prototype, not an official government product. All data is synthetic. Guidance shown is for exploration only — verify with official sources before making decisions.',
  hi: 'यह एक स्वतंत्र हैकथॉन प्रोटोटाइप है, कोई आधिकारिक सरकारी उत्पाद नहीं। सभी डेटा कृत्रिम है। दिखाया गया मार्गदर्शन केवल अन्वेषण के लिए है — निर्णय लेने से पहले आधिकारिक स्रोतों से सत्यापित करें।',
} as const;

export function PrototypeDisclaimer() {
  const locale = useLocale() as 'en' | 'hi';

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-800">
      <span className="inline-flex items-center gap-1">
        <span aria-hidden>⚠</span>
        {DISCLAIMER[locale]}
      </span>
    </div>
  );
}
