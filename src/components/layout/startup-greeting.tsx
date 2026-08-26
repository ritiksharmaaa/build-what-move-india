'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GREETINGS = [
  { text: 'नमस्ते', lang: 'Hindi • हिन्दी' },
  { text: 'Hello', lang: 'English' },
  { text: 'வணக்கம்', lang: 'Tamil • தமிழ்' },
  { text: 'నమస్కారం', lang: 'Telugu • తెలుగు' },
  { text: 'নমস্কার', lang: 'Bengali • বাংলা' },
  { text: 'नमस्कार', lang: 'Marathi • मराठी' },
  { text: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ', lang: 'Punjabi • ਪੰਜਾਬੀ' },
  { text: 'سلام', lang: 'Urdu • اردو' },
  { text: 'નમસ્તે', lang: 'Gujarati • ગુજરાતી' },
  { text: 'ನಮಸ್ಕಾರ', lang: 'Kannada • ಕನ್ನಡ' },
];

export function StartupGreeting({ onComplete }: { onComplete?: () => void }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only run on client
    const hasSeenGreeting = sessionStorage.getItem('pathfinder_greeting_seen');
    if (hasSeenGreeting) {
      setVisible(false);
      onComplete?.();
      return;
    }

    // Pacing: 850ms per greeting for smooth, calm, readable transitions
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= GREETINGS.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            sessionStorage.setItem('pathfinder_greeting_seen', 'true');
            onComplete?.();
          }, 900);
          return prev;
        }
        return prev + 1;
      });
    }, 850);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setVisible(false);
    sessionStorage.setItem('pathfinder_greeting_seen', 'true');
    onComplete?.();
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center select-none"
        >
          {/* Pure White Minimalist Center Container */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-lg">
            <div className="h-32 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex flex-col items-center"
                >
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-slate-950 font-devanagari">
                    {GREETINGS[index].text}
                  </h1>
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-4">
                    {GREETINGS[index].lang}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Skip Option */}
            <button
              onClick={handleSkip}
              className="mt-16 text-[11px] font-mono uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors py-1 px-3 border border-transparent hover:border-slate-300"
            >
              Continue ↵
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
