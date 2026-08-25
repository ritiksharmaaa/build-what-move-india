'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ShieldCheck, Database, Scale, Globe } from 'lucide-react';

export function MainFooter() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <footer className="mt-20 border-t-2 border-slate-900 bg-white text-slate-900">
      {/* Symmetrical Bento Grid Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Box 1: Brand & Slogan */}
          <div className="bento-box p-6 border-2 border-slate-900 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  PF
                </div>
                <span className="font-black text-lg text-slate-950">
                  {locale === 'hi' ? 'पाथफाइंडर इंडिया' : 'PathFinder India'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
                {locale === 'hi' 
                  ? 'एक राष्ट्र, एक करियर पोर्टल — भारत के 4.5 करोड़ विद्यार्थियों के लिए गणितीय व पारदर्शी करियर सिम्युलेटर।'
                  : 'One Nation, One Career Portal — A mathematical, transparent decision simulator for 4.5 crore Indian students.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-300 text-[11px] font-mono uppercase text-slate-500">
              State Core: Uttar Pradesh (UP)
            </div>
          </div>

          {/* Box 2: Verified Regulatory Sources */}
          <div className="bento-box p-6 border-2 border-slate-900 bg-white">
            <div className="flex items-center gap-2 mb-3 text-brand-700">
              <Database className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                {locale === 'hi' ? 'सत्यापित स्रोत' : 'Statutory Sources'}
              </h4>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 font-mono">
              <li>• UPPSC & UPSC Official Gazettes</li>
              <li>• AICTE / UGC Norms 2025-26</li>
              <li>• NTA JEE & NEET Information Bulletins</li>
              <li>• Bar Council of India (BCI)</li>
              <li>• National Career Service (NCS)</li>
            </ul>
          </div>

          {/* Box 3: Quick Navigation */}
          <div className="bento-box p-6 border-2 border-slate-900 bg-white">
            <div className="flex items-center gap-2 mb-3 text-emerald-700">
              <Globe className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                {locale === 'hi' ? 'महत्वपूर्ण पृष्ठ' : 'Quick Navigation'}
              </h4>
            </div>
            <ul className="text-xs text-slate-700 space-y-2 font-medium">
              <li>
                <Link href="/" className="hover:text-brand-600 hover:underline">
                  {locale === 'hi' ? '→ मुख्य पृष्ठ (Home)' : '→ Home Page'}
                </Link>
              </li>
              <li>
                <Link href="/start" className="hover:text-brand-600 hover:underline">
                  {locale === 'hi' ? '→ करियर खोजक (Intake Flow)' : '→ Career Pathway Finder'}
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-brand-600 hover:underline">
                  {locale === 'hi' ? '→ परमाणु विखंडन मानचित्र (Fission Chain)' : '→ Nuclear Fission Visualizer'}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 hover:underline">
                  {locale === 'hi' ? '→ हमारा मिशन: रिया की कहानी (Mission)' : "→ Mission: Riya's Story"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Box 4: Integrity & Disclaimer */}
          <div className="bento-box p-6 border-2 border-slate-900 bg-slate-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-saffron-700">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  {locale === 'hi' ? 'शून्य पूर्वाग्रह' : 'Zero Commercial Bias'}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-devanagari">
                {t('disclaimer')}
              </p>
            </div>
            <div className="mt-4 text-[10px] font-mono text-slate-500">
              NO SPONSORED ADS • NO DATA SALE
            </div>
          </div>
        </div>

        {/* Bottom Symmetrical Copyright Bar */}
        <div className="mt-8 pt-6 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div className="font-mono">
            © 2026 PathFinder India. Build for India Open Prototype.
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span>🇮🇳 Dedicated to the youth of Bharat</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
