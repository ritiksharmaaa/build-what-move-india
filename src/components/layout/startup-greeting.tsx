'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GREETINGS = [
  { text: 'नमस्ते', lang: 'Hindi • हिन्दी', script: 'Devanagari' },
  { text: 'Hello', lang: 'English', script: 'Latin' },
  { text: 'வணக்கம்', lang: 'Tamil • தமிழ்', script: 'Tamil' },
  { text: 'నమస్కారం', lang: 'Telugu • తెలుగు', script: 'Telugu' },
  { text: 'নমস্কার', lang: 'Bengali • বাংলা', script: 'Bengali' },
  { text: 'नमस्कार', lang: 'Marathi • मराठी', script: 'Devanagari' },
  { text: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ', lang: 'Punjabi • ਪੰਜਾਬੀ', script: 'Gurmukhi' },
  { text: 'سلام', lang: 'Urdu • اردو', script: 'Nastaliq' },
  { text: 'નમસ્તે', lang: 'Gujarati • ગુજરાતી', script: 'Gujarati' },
  { text: 'ನಮಸ್ಕಾರ', lang: 'Kannada • ಕನ್ನಡ', script: 'Kannada' },
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

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= GREETINGS.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            sessionStorage.setItem('pathfinder_greeting_seen', 'true');
            onComplete?.();
          }, 450);
          return prev;
        }
        return prev + 1;
      });
    }, 280); // Sweet spot: ~280ms per greeting, smooth rhythm

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
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center select-none"
        >
          {/* Subtle geometric grid background */}
          <div className="absolute inset-0 grid-pattern opacity-40" />

          {/* Symmetrical Center Frame */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-lg w-full px-6">
            <div className="w-full bento-box p-10 md:p-12 text-center border-2 border-slate-900 shadow-2xl relative">
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500" />

              {/* Emblem */}
              <div className="w-12 h-12 mx-auto mb-6 bg-slate-900 text-white flex items-center justify-center font-bold text-xl tracking-tighter">
                🇮🇳
              </div>

              {/* Greeting Text with smooth cross-fade */}
              <div className="h-20 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="text-center"
                  >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-devanagari">
                      {GREETINGS[index].text}
                    </h1>
                    <p className="text-xs uppercase tracking-widest font-mono text-slate-500 mt-2 font-medium">
                      {GREETINGS[index].lang}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slogan */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col items-center gap-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  ONE NATION • ONE CAREER PORTAL
                </span>
                <span className="text-xs font-devanagari font-bold text-slate-800">
                  एक राष्ट्र • एक करियर पोर्टल
                </span>
              </div>
            </div>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="mt-6 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors py-1.5 px-4 rounded border border-transparent hover:border-slate-300"
            >
              Skip (आगे बढ़ें) ↵
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
