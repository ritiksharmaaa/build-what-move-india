'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { CheckCircle2, Lock, AlertTriangle, HelpCircle, Info } from 'lucide-react';

const STATUS_ITEMS = [
  {
    id: 'active',
    dotClass: 'bg-emerald-500 shadow-[0_0_8px_#22c55e]',
    badge: 'ACTIVE',
    labelEn: 'Verified active route',
    labelHi: 'सत्यापित चयनित मार्ग',
    textColor: 'text-emerald-700',
    fullDescEn: 'Selected active route matching all academic & budget prerequisites.',
    fullDescHi: 'शैक्षणिक योग्यता व बजट के अनुकूल सत्यापित सक्रिय मार्ग।',
  },
  {
    id: 'available',
    dotClass: 'bg-slate-400',
    badge: 'AVAILABLE',
    labelEn: 'Alternative option',
    labelHi: 'उपलब्ध विकल्प',
    textColor: 'text-slate-600',
    fullDescEn: 'Open alternative route that can be chosen at any time.',
    fullDescHi: 'खुला वैकल्पिक मार्ग जिसे कभी भी चुना जा सकता है।',
  },
  {
    id: 'blocked',
    dotClass: 'bg-red-600',
    badge: 'HARD STOP 🔒',
    labelEn: 'Prerequisite blocked',
    labelHi: 'अवरुद्ध (शर्त नियम)',
    textColor: 'text-red-700',
    fullDescEn: 'Mathematically blocked (Requires Class 12 Maths or Biology).',
    fullDescHi: 'गणित या जीवविज्ञान अनिवार्यता के कारण अवरुद्ध मार्ग।',
  },
  {
    id: 'warning',
    dotClass: 'bg-amber-500',
    badge: 'BUDGET ⚠️',
    labelEn: 'Budget exceeded',
    labelHi: 'बजट चेतावनी',
    textColor: 'text-amber-700',
    fullDescEn: 'Fee exceeds stated annual budget limit (Scholarship or loan needed).',
    fullDescHi: 'वार्षिक शुल्क बजट सीमा से अधिक (छात्रवृत्ति आवश्यक)।',
  },
];

export function FloatingLegend() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const locale = useLocale();

  // Continuously cycle through statuses every 2.8 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STATUS_ITEMS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isHovered]);

  const current = STATUS_ITEMS[currentIndex];

  return (
    <div 
      className="fixed top-3 right-3 z-[55] font-mono select-none pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sleek, Compact Rotating Indicator Pill (Fixed Size, No Jump) */}
      <div className="w-56 bg-white/95 backdrop-blur-sm border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] px-2.5 py-1 flex items-center gap-2 cursor-pointer transition-all hover:border-brand-600">
        <span className={`w-2 h-2 rounded-full shrink-0 ${current.dotClass}`} />
        
        <div className="flex-1 overflow-hidden h-4 relative flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex items-center gap-1.5 whitespace-nowrap text-[10px] w-full"
            >
              <span className={`font-black uppercase tracking-wider ${current.textColor}`}>
                {current.badge}:
              </span>
              <span className="text-slate-600 font-medium font-devanagari truncate">
                {locale === 'hi' ? current.labelHi : current.labelEn}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <Info className="w-3 h-3 text-slate-400 shrink-0" />
      </div>

      {/* Floating Hover Card Showing Full Status Guide */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1.5 w-72 bg-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-3 text-[10px] space-y-2.5 pointer-events-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-1 text-[10px] font-black uppercase text-slate-900">
              <span>{locale === 'hi' ? 'मार्ग रंग संकेतक विवरण' : 'Route Status Legend Guide'}</span>
              <span className="text-slate-400 font-mono text-[9px]">LIVE</span>
            </div>

            <div className="space-y-2">
              {STATUS_ITEMS.map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${item.dotClass}`} />
                  <div>
                    <div className={`font-black uppercase text-[10px] leading-tight ${item.textColor}`}>
                      {item.badge}
                    </div>
                    <div className="text-slate-600 font-devanagari leading-snug mt-0.5">
                      {locale === 'hi' ? item.fullDescHi : item.fullDescEn}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-1.5 text-[9px] text-slate-400 font-devanagari text-center">
              {locale === 'hi' ? 'रंगों का अर्थ समझने हेतु कर्सर यहां रखें' : 'Hover anywhere to inspect all indicators'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
