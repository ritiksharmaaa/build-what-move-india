'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { CheckCircle2, Lock, AlertTriangle, HelpCircle } from 'lucide-react';

const STATUS_ITEMS = [
  {
    id: 'active',
    colorBox: 'bg-emerald-500 border border-emerald-300 shadow-[0_0_10px_#22c55e]',
    badge: 'ACTIVE ROUTE',
    labelEn: 'Selected Active Pathway',
    labelHi: 'सत्यापित चयनित करियर मार्ग',
    textColor: 'text-emerald-800',
    icon: CheckCircle2,
  },
  {
    id: 'available',
    colorBox: 'bg-slate-300 border border-slate-400',
    badge: 'AVAILABLE',
    labelEn: 'Valid Alternative Options',
    labelHi: 'अन्य उपलब्ध वैकल्पिक विकल्प',
    textColor: 'text-slate-700',
    icon: HelpCircle,
  },
  {
    id: 'blocked',
    colorBox: 'bg-red-600 border border-red-400 text-white flex items-center justify-center text-[9px]',
    badge: 'HARD STOP 🔒',
    labelEn: 'Blocked (Maths / Biology Prerequisite)',
    labelHi: 'अवरुद्ध 🔒 (गणित / बायो अनिवार्यता नियम)',
    textColor: 'text-red-700',
    icon: Lock,
  },
  {
    id: 'warning',
    colorBox: 'bg-amber-500 border border-amber-300 text-white flex items-center justify-center text-[9px]',
    badge: 'BUDGET RISK ⚠️',
    labelEn: 'Exceeds Family Budget (Scholarship Needed)',
    labelHi: 'बजट चेतावनी ⚠️ (छात्रवृत्ति / ऋण आवश्यक)',
    textColor: 'text-amber-800',
    icon: AlertTriangle,
  },
];

export function FloatingLegend() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const locale = useLocale();

  // Continuously cycle through statuses every 2.6 seconds
  useEffect(() => {
    if (isExpanded) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STATUS_ITEMS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [isExpanded]);

  const current = STATUS_ITEMS[currentIndex];
  const Icon = current.icon;

  return (
    <div className="fixed top-3 right-3 z-[55] font-mono select-none pointer-events-auto">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white/95 backdrop-blur-sm border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] px-3 py-1.5 cursor-pointer hover:border-brand-600 transition-colors"
        title="Click to view all status indicators"
      >
        {!isExpanded ? (
          /* Rotating single status badge ticker */
          <div className="flex items-center gap-2.5 h-6">
            <div className={`w-3 h-3 shrink-0 ${current.colorBox}`} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex items-center gap-1.5 whitespace-nowrap text-[10px]"
              >
                <span className={`font-black uppercase tracking-wider ${current.textColor}`}>
                  {current.badge}:
                </span>
                <span className="text-slate-700 font-medium font-devanagari">
                  {locale === 'hi' ? current.labelHi : current.labelEn}
                </span>
              </motion.div>
            </AnimatePresence>

            <span className="text-[9px] text-slate-400 ml-1">▼</span>
          </div>
        ) : (
          /* Expanded full list */
          <div className="space-y-2 py-1">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-900 border-b border-slate-200 pb-1">
              <span>{locale === 'hi' ? 'मार्ग संकेतक मार्गदर्शिका' : 'Status Indicators Guide'}</span>
              <span className="text-[9px] text-slate-400">▲</span>
            </div>
            {STATUS_ITEMS.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-[10px]">
                <div className={`w-3 h-3 shrink-0 ${item.colorBox}`} />
                <span className={`font-bold ${item.textColor}`}>{item.badge}:</span>
                <span className="text-slate-600 font-devanagari">
                  {locale === 'hi' ? item.labelHi : item.labelEn}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
