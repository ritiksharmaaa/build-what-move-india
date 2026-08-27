'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Info } from 'lucide-react';

const STATUS_ITEMS = [
  {
    id: 'active',
    dotClass: 'bg-emerald-500 shadow-[0_0_8px_#22c55e]',
    badge: 'ACTIVE',
    labelEn: 'Verified active route',
    labelHi: 'सत्यापित चयनित मार्ग',
    textColor: 'text-emerald-400',
    fullDescEn: 'Selected active route matching all academic & budget prerequisites.',
    fullDescHi: 'शैक्षणिक योग्यता व बजट के अनुकूल सत्यापित सक्रिय मार्ग।',
  },
  {
    id: 'available',
    dotClass: 'bg-slate-400',
    badge: 'AVAILABLE',
    labelEn: 'Alternative option',
    labelHi: 'उपलब्ध विकल्प',
    textColor: 'text-slate-300',
    fullDescEn: 'Open alternative route that can be chosen at any time.',
    fullDescHi: 'खुला वैकल्पिक मार्ग जिसे कभी भी चुना जा सकता है।',
  },
  {
    id: 'blocked',
    dotClass: 'bg-red-500',
    badge: 'HARD STOP 🔒',
    labelEn: 'Prerequisite blocked',
    labelHi: 'अवरुद्ध (शर्त नियम)',
    textColor: 'text-red-400',
    fullDescEn: 'Mathematically blocked (Requires Class 12 Maths or Biology).',
    fullDescHi: 'गणित या जीवविज्ञान अनिवार्यता के कारण अवरुद्ध मार्ग।',
  },
  {
    id: 'warning',
    dotClass: 'bg-amber-500',
    badge: 'BUDGET ⚠️',
    labelEn: 'Budget exceeded',
    labelHi: 'बजट चेतावनी',
    textColor: 'text-amber-400',
    fullDescEn: 'Fee exceeds stated annual budget limit (Scholarship or loan needed).',
    fullDescHi: 'वार्षिक शुल्क बजट सीमा से अधिक (छात्रवृत्ति आवश्यक)।',
  },
];

export function MapCornerBadge() {
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
      className="font-sans select-none pointer-events-auto flex items-center gap-3"
    >
      {/* 1. Back Button */}
      <Link 
        href="/" 
        className="flex items-center justify-center w-10 h-10 bg-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-slate-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        title={locale === 'hi' ? 'वापस जाएं' : 'Go Back'}
      >
        <ArrowLeft className="w-5 h-5 text-slate-900" />
      </Link>

      {/* 2. Brand Logo ("PF") */}
      <Link 
        href="/" 
        className="flex items-center justify-center w-10 h-10 bg-slate-900 border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] hover:bg-slate-800 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        title="Pathfinder"
      >
        <div className="flex flex-col items-center justify-center">
          <span className="text-saffron-400 text-[8px] leading-none">॥</span>
          <span className="text-white text-[10px] font-black font-mono leading-none">PF</span>
        </div>
      </Link>

      {/* 3. Rotating Indicator */}
      <div 
        className="flex items-center gap-2 px-3 h-10 font-mono bg-white border-2 border-slate-900 shadow-[2px_2px_0_0_#0f172a] cursor-help w-56 hover:bg-slate-50 transition-colors relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 border border-slate-900 ${current.dotClass}`} />
        
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

        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        {/* Hover Dropdown */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-72 bg-white border-2 border-slate-900 shadow-[4px_4px_0_0_#0f172a] p-3 text-[10px] space-y-2.5 z-50 pointer-events-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-1 text-[10px] font-black uppercase text-slate-900">
                <span>{locale === 'hi' ? 'मार्ग रंग संकेतक विवरण' : 'Route Status Legend Guide'}</span>
                <span className="text-slate-400 font-mono text-[9px]">LIVE</span>
              </div>

              <div className="space-y-2">
                {STATUS_ITEMS.map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 border border-slate-900 ${item.dotClass}`} />
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
