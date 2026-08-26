'use client';

import React, { useState } from 'react';
import type { EvaluatedNode } from '@/lib/contracts/pathway';
import { useLocale, useTranslations } from 'next-intl';
import { 
  CalendarCheck, 
  X, 
  CheckSquare, 
  Square, 
  Share2, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  BookOpen, 
  Coins, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export function ActionPlanModal({
  nodes,
  onClose,
}: {
  nodes: EvaluatedNode[];
  onClose: () => void;
}) {
  const locale = useLocale() as 'en' | 'hi';
  const t = useTranslations('plan');

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const selectedNames = nodes.map((n) => (locale === 'en' ? n.nameEn : n.nameHi));

  // WhatsApp share link text
  const waText = encodeURIComponent(
    `🚀 My PathFinder India Action Plan for: ${selectedNames.join(', ')}\n\nCheck out my roadmap at: https://pathfinder-india-hackathon.vercel.app`
  );

  const copyRoadmap = () => {
    const text = `PATHFINDER INDIA ACTION PROTOCOL\nSelected Pathway: ${selectedNames.join(' -> ')}\n\n1. Phase 1 (Day 1-30): Verify statutory prerequisites, domicile certificate & NCERT books.\n2. Phase 2 (Day 31-90): Complete mock exam calendar & official notification registrations.\n3. Phase 3 (Day 90+): Apply for state scholarship (Saksham UP / NSP) & verify zero-cost fallback routes.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const printPlan = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 font-sans select-none">
      <div className="bg-white border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b-2 border-slate-900 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CalendarCheck className="w-5 h-5 text-saffron-400" />
            <div>
              <h2 className="text-lg font-black tracking-tight font-devanagari">
                {locale === 'hi' ? '30-90 दिवसीय व्यक्तिगत करियर एक्शन प्लान' : '30-90 Day Career Action Protocol'}
              </h2>
              <p className="text-xs text-slate-400 font-devanagari">
                {locale === 'hi' 
                  ? 'चयनित मार्गों के आधार पर आधिकारिक व व्यावहारिक कार्य योजना'
                  : 'Practical, statutory roadmap customized to your selected career path.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Roadmap Strip */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-950 font-devanagari">
          <span className="font-bold text-emerald-800 uppercase font-mono text-[10px]">
            {locale === 'hi' ? 'चयनित मार्ग:' : 'Selected Route:'}
          </span>
          {nodes.map((node, i) => (
            <React.Fragment key={node.nodeId}>
              <span className="px-2 py-0.5 bg-white border border-emerald-300 rounded-sm">
                {locale === 'en' ? node.nameEn : node.nameHi}
              </span>
              {i < nodes.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {/* Action Items Body */}
        <div className="p-6 overflow-auto custom-scrollbar space-y-6">
          {/* Phase 1: Days 1-30 */}
          <div className="border-2 border-slate-900 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <h3 className="font-black text-sm text-slate-950 font-devanagari uppercase">
                  {locale === 'hi' ? 'चरण 1: दिवस 1 - 30 (वैधानिक सत्यापन व दस्तावेज)' : 'Phase 1: Days 1 - 30 (Statutory Verification)'}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-brand-50 text-brand-700 px-2 py-0.5 border border-brand-200">
                CRITICAL
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 font-devanagari">
              <label 
                onClick={() => toggleTask('task-1')}
                className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors"
              >
                {completedTasks['task-1'] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className={completedTasks['task-1'] ? 'line-through text-slate-400' : ''}>
                  {locale === 'hi'
                    ? '10वीं / 12वीं में गणित व जीवविज्ञान विषय अनिवार्यता की आधिकारिक परीक्षा ब्रोशर से पुष्टि करें।'
                    : 'Verify Class 10/12 subject prerequisites (Mathematics or Biology) against official regulatory guidelines.'}
                </span>
              </label>

              <label 
                onClick={() => toggleTask('task-2')}
                className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors"
              >
                {completedTasks['task-2'] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className={completedTasks['task-2'] ? 'line-through text-slate-400' : ''}>
                  {locale === 'hi'
                    ? 'उत्तर प्रदेश मूल निवास (Domicile) व जाति/EWS प्रमाण पत्र तहसील से समय से पूर्व नवीनीकृत कराएं।'
                    : 'Procure/renew Uttar Pradesh Domicile certificate and EWS/OBC/SC/ST certificates for 85% state quota eligibility.'}
                </span>
              </label>
            </div>
          </div>

          {/* Phase 2: Days 31-90 */}
          <div className="border-2 border-slate-900 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-saffron-600" />
                <h3 className="font-black text-sm text-slate-950 font-devanagari uppercase">
                  {locale === 'hi' ? 'चरण 2: दिवस 31 - 90 (पाठ्यक्रम तैयारी व मॉक कैलेंडर)' : 'Phase 2: Days 31 - 90 (Preparation & Exam Calendar)'}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-saffron-50 text-saffron-800 px-2 py-0.5 border border-saffron-200">
                TIMELINE
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 font-devanagari">
              <label 
                onClick={() => toggleTask('task-3')}
                className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors"
              >
                {completedTasks['task-3'] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className={completedTasks['task-3'] ? 'line-through text-slate-400' : ''}>
                  {locale === 'hi'
                    ? 'NCERT आधारभूत पुस्तकों व पिछले 5 वर्षों के प्रश्न पत्रों (PYQ) का अभ्यास आरंभ करें।'
                    : 'Download official NCERT syllabi and previous 5 years solved examination papers.'}
                </span>
              </label>

              <label 
                onClick={() => toggleTask('task-4')}
                className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors"
              >
                {completedTasks['task-4'] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className={completedTasks['task-4'] ? 'line-through text-slate-400' : ''}>
                  {locale === 'hi'
                    ? 'आधिकारिक पोर्टल (NTA / UPSC / UPPSC / BTE UP) पर नोटिफिकेशन अलर्ट सेट करें।'
                    : 'Set up calendar alerts for notification release dates on official authorities.'}
                </span>
              </label>
            </div>
          </div>

          {/* Phase 3: Financial & Scholarships */}
          <div className="border-2 border-slate-900 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-sm text-slate-950 font-devanagari uppercase">
                  {locale === 'hi' ? 'चरण 3: छात्रवृत्ति व वित्तीय सुरक्षा योजना' : 'Phase 3: Financial Aid & Zero-Debt Safety'}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 border border-emerald-200">
                ZERO-DEBT
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 font-devanagari">
              <label 
                onClick={() => toggleTask('task-5')}
                className="flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors"
              >
                {completedTasks['task-5'] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className={completedTasks['task-5'] ? 'line-through text-slate-400' : ''}>
                  {locale === 'hi'
                    ? 'राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) व यूपी छात्रवृत्ति पोर्टल (Saksham UP) पर आवेदन की तैयारी रखें।'
                    : 'Prepare income certificates for National Scholarship Portal (NSP) and UP Post-Matric fee reimbursement.'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer with Share & Export buttons */}
        <div className="px-6 py-3.5 border-t-2 border-slate-900 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={copyRoadmap}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold font-devanagari flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (locale === 'hi' ? 'कॉपी हो गया!' : 'Copied!') : (locale === 'hi' ? 'रोडमैप कॉपी करें' : 'Copy Plan')}</span>
            </button>

            <button
              onClick={printPlan}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold font-devanagari flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>{locale === 'hi' ? 'प्रिंट / PDF' : 'Print PDF'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <a 
              href={`https://wa.me/?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-black font-devanagari px-4 py-2 border border-emerald-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex items-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{locale === 'hi' ? 'व्हाट्सएप पर साझा करें' : 'Share on WhatsApp'}</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-devanagari border border-slate-950 transition-colors"
            >
              {locale === 'hi' ? 'पूर्ण' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
