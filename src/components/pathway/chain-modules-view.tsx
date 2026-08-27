'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { ALL_FISSION_NODES, type FissionNode } from '@/lib/data/fission-nodes';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import { 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  MessageCircle, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Info,
  Check
} from 'lucide-react';

interface ChainModulesViewProps {
  studentInput: StudentDecisionInput;
  onSelectNode?: (nodeId: string) => void;
  onAskAI?: (node: FissionNode) => void;
}

export function ChainModulesView({
  studentInput,
  onSelectNode,
  onAskAI,
}: ChainModulesViewProps) {
  const locale = useLocale() as 'en' | 'hi';

  // Selection states across 4 stages
  const [selectedStage1, setSelectedStage1] = useState<string>('stream_pcm');
  const [selectedStage2, setSelectedStage2] = useState<string>('deg_btech_jee');
  const [selectedStage3, setSelectedStage3] = useState<string>('car_ai_scientist');
  const [hoveredNode, setHoveredNode] = useState<FissionNode | null>(null);

  // Verifying state for the "Check Path" interactive pulse
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationText, setVerificationText] = useState<string | null>(null);

  // Sync with studentInput on initial mount
  useEffect(() => {
    if (studentInput.class12Stream === 'science_without_maths') {
      setSelectedStage1('stream_pcb');
      setSelectedStage2('deg_mbbs_neet');
      setSelectedStage3('car_neurosurgeon');
    } else if (
      studentInput.class12Stream === 'commerce_with_maths' ||
      studentInput.class12Stream === 'commerce_without_maths'
    ) {
      setSelectedStage1('stream_commerce');
      setSelectedStage2('deg_ca_foundation');
      setSelectedStage3('car_ca_cfo');
    } else if (studentInput.class12Stream === 'humanities') {
      setSelectedStage1('stream_humanities');
      setSelectedStage2('deg_cuet_graduation');
      setSelectedStage3('car_ias_ips');
    } else if (studentInput.class12Stream === 'vocational') {
      setSelectedStage1('stream_vocational');
      setSelectedStage2('deg_btech_jee');
      setSelectedStage3('car_ai_scientist');
    }
  }, [studentInput.class12Stream]);

  // Node evaluation logic
  const evaluateNodeStatus = (node: FissionNode) => {
    if (node.stage === 0) return { status: 'active', reason: 'Origin' };

    const chosenStream = selectedStage1;

    // Biology prerequisite rule
    if (node.requiresBio && chosenStream !== 'stream_pcb') {
      return {
        status: 'blocked',
        reason: locale === 'hi' 
          ? 'अवरुद्ध 🔒: 12वीं में जीवविज्ञान (PCB) अनिवार्य है। गैर-बायो स्ट्रीम से यह मार्ग संभव नहीं है।' 
          : 'Blocked 🔒: Requires Class 12 Biology (PCB). Non-medical streams are ineligible.',
      };
    }

    // Maths prerequisite rule
    if (node.requiresMaths && chosenStream !== 'stream_pcm' && chosenStream !== 'stream_vocational') {
      return {
        status: 'blocked',
        reason: locale === 'hi' 
          ? 'अवरुद्ध 🔒: 12वीं में गणित (PCM) अनिवार्य है। बिना गणित के इंजीनियरिंग/एनडीए संभव नहीं।'
          : 'Blocked 🔒: Requires Class 12 Mathematics (PCM). Ineligible without Mathematics.',
      };
    }

    // Budget warning check
    const budgetLimit = studentInput.budgetBand === 'low' ? 25000 : studentInput.budgetBand === 'medium' ? 150000 : 1000000;
    if (node.annualFeeINR > budgetLimit) {
      return {
        status: 'warning',
        reason: locale === 'hi' 
          ? `बजट चेतावनी ⚠️: वार्षिक शुल्क (₹${node.annualFeeINR.toLocaleString('en-IN')}) आपके बजट सीमा से अधिक है।`
          : `Budget Warning ⚠️: Annual fee (₹${node.annualFeeINR.toLocaleString('en-IN')}) exceeds your stated budget.`,
      };
    }

    const isActive =
      (node.stage === 1 && node.id === selectedStage1) ||
      (node.stage === 2 && node.id === selectedStage2) ||
      (node.stage === 3 && node.id === selectedStage3);

    if (isActive) return { status: 'active', reason: 'Active Path' };
    return { status: 'unselected', reason: 'Available Alternative' };
  };

  const stage0Nodes = ALL_FISSION_NODES.filter((n) => n.stage === 0);
  const stage1Nodes = ALL_FISSION_NODES.filter((n) => n.stage === 1);
  const stage2Nodes = ALL_FISSION_NODES.filter((n) => n.stage === 2);
  const stage3Nodes = ALL_FISSION_NODES.filter((n) => n.stage === 3);

  const handleNodeClick = (node: FissionNode) => {
    const evalRes = evaluateNodeStatus(node);
    if (evalRes.status === 'blocked') {
      alert(evalRes.reason);
      return;
    }

    // Trigger verification sequence
    setIsVerifying(true);
    setVerificationText(
      locale === 'hi' 
        ? `सत्यापन: ${node.nameHi} मार्ग की गणना जारी...` 
        : `Checking compatibility: ${node.nameEn}...`
    );

    setTimeout(() => {
      setIsVerifying(false);
      setVerificationText(null);
    }, 450);

    if (node.stage === 1) {
      setSelectedStage1(node.id);
      const validChild = stage2Nodes.find((c) => c.parentIds.includes(node.id));
      if (validChild) {
        setSelectedStage2(validChild.id);
        const validGrandchild = stage3Nodes.find((g) => g.parentIds.includes(validChild.id));
        if (validGrandchild) setSelectedStage3(validGrandchild.id);
      }
    } else if (node.stage === 2) {
      setSelectedStage2(node.id);
      const validGrandchild = stage3Nodes.find((g) => g.parentIds.includes(node.id));
      if (validGrandchild) setSelectedStage3(validGrandchild.id);
    } else if (node.stage === 3) {
      setSelectedStage3(node.id);
    }

    onSelectNode?.(node.id);
  };

  return (
    <div className="w-full min-h-full bg-white text-slate-900 font-mono relative overflow-x-auto select-none pt-20 pb-24 px-4 sm:px-8">
      {/* Subtle Dot Grid Pattern Canvas */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* Verification Flash Toast */}
      <AnimatePresence>
        {isVerifying && verificationText && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white border-2 border-emerald-500 px-4 py-2 text-xs font-mono font-bold shadow-xl flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{verificationText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto relative z-10 space-y-6">
        {/* Stage Column Labels */}
        <div className="grid grid-cols-4 gap-6 min-w-[1050px] mb-6 font-sans">
          {/* Column 0 */}
          <div className="bg-indigo-50/60 border border-indigo-100/50 p-3 shadow-sm border-t-4 border-t-cyan-400 rounded-b-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-500 uppercase">STAGE 0</span>
              <span className="text-[10px] font-mono font-semibold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 border border-indigo-200 rounded">{stage0Nodes.length} {locale === 'hi' ? 'मार्ग' : 'routes'}</span>
            </div>
            <h2 className="text-sm font-bold text-indigo-950 tracking-tight font-devanagari">{locale === 'hi' ? 'कक्षा 10 (आरंभ)' : 'Class 10 (Origin)'}</h2>
            <p className="text-[10px] text-indigo-700/80 font-devanagari mt-0.5 uppercase tracking-wide">{locale === 'hi' ? 'मूल शिक्षा' : 'Foundation'}</p>
          </div>
          {/* Column 1 */}
          <div className="bg-indigo-50/60 border border-indigo-100/50 p-3 shadow-sm border-t-4 border-t-blue-400 rounded-b-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-500 uppercase">STAGE 1</span>
              <span className="text-[10px] font-mono font-semibold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 border border-indigo-200 rounded">{stage1Nodes.length} {locale === 'hi' ? 'मार्ग' : 'routes'}</span>
            </div>
            <h2 className="text-sm font-bold text-indigo-950 tracking-tight font-devanagari">{locale === 'hi' ? '12वीं विषय वर्ग' : 'Class 12 Streams'}</h2>
            <p className="text-[10px] text-indigo-700/80 font-devanagari mt-0.5 uppercase tracking-wide">{locale === 'hi' ? 'वर्तमान स्तर के निर्णय' : 'Current stage decisions'}</p>
          </div>
          {/* Column 2 */}
          <div className="bg-indigo-50/60 border border-indigo-100/50 p-3 shadow-sm border-t-4 border-t-violet-500 rounded-b-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-500 uppercase">STAGE 2</span>
              <span className="text-[10px] font-mono font-semibold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 border border-indigo-200 rounded">{stage2Nodes.length} {locale === 'hi' ? 'मार्ग' : 'routes'}</span>
            </div>
            <h2 className="text-sm font-bold text-indigo-950 tracking-tight font-devanagari">{locale === 'hi' ? 'प्रवेश परीक्षा व डिग्री' : 'Exams & Degrees'}</h2>
            <p className="text-[10px] text-indigo-700/80 font-devanagari mt-0.5 uppercase tracking-wide">{locale === 'hi' ? 'प्रतियोगी परीक्षाएं व प्रशिक्षण' : 'Qualifying exams & training'}</p>
          </div>
          {/* Column 3 */}
          <div className="bg-indigo-50/60 border border-indigo-100/50 p-3 shadow-sm border-t-4 border-t-fuchsia-500 rounded-b-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-500 uppercase">STAGE 3</span>
              <span className="text-[10px] font-mono font-semibold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 border border-indigo-200 rounded">{stage3Nodes.length} {locale === 'hi' ? 'मार्ग' : 'routes'}</span>
            </div>
            <h2 className="text-sm font-bold text-indigo-950 tracking-tight font-devanagari">{locale === 'hi' ? 'अंतिम करियर लक्ष्य' : 'Terminal Careers'}</h2>
            <p className="text-[10px] text-indigo-700/80 font-devanagari mt-0.5 uppercase tracking-wide">{locale === 'hi' ? 'विशेषज्ञ पद व नौकरियां' : 'Professional destinations'}</p>
          </div>
        </div>

        {/* 4-Column Connected Modular Flow */}
        <div className="grid grid-cols-4 gap-6 min-w-[1050px] items-start relative">
          {/* Column 0: Class 10 Origin */}
          <div className="flex flex-col gap-4">
            {stage0Nodes.map((node) => {
              const name = locale === 'hi' ? node.nameHi : node.nameEn;
              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="bento-box p-4 border-2 border-emerald-600 bg-emerald-50 text-slate-950 node-active-glow relative flex flex-col justify-between"
                >
                  {/* Right Output Socket */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-600 border-2 border-white rounded-full z-20 shadow-sm" />

                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-emerald-600 text-white">
                      ROOT NUCLEUS
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-black font-devanagari mt-1">{name}</h3>
                  <div className="text-[10px] text-slate-500 mt-2 flex justify-between border-t border-slate-200 pt-1">
                    <span>{node.authority}</span>
                    <span className="font-bold text-slate-700">{node.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 1: Stream Modules */}
          <div className="flex flex-col gap-3">
            {stage1Nodes.map((node) => {
              const evalRes = evaluateNodeStatus(node);
              const isSelected = selectedStage1 === node.id;
              const name = locale === 'hi' ? node.nameHi : node.nameEn;

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`p-3.5 border-2 transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-slate-950 node-active-glow font-bold z-10'
                      : evalRes.status === 'blocked'
                      ? 'bg-red-50 border-red-400 text-slate-800 cursor-not-allowed'
                      : evalRes.status === 'warning'
                      ? 'bg-amber-50 border-amber-400 text-slate-950'
                      : 'border-blue-200 bg-blue-50/30 text-slate-900 hover:border-brand-500 shadow-sm'
                  }`}
                >
                  {/* Left Input Socket */}
                  <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-20 border-2 border-white ${
                    isSelected ? 'bg-emerald-600' : 'bg-slate-400'
                  }`} />

                  {/* Right Output Socket */}
                  <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-20 border-2 border-white ${
                    isSelected ? 'bg-emerald-600' : 'bg-slate-400'
                  }`} />

                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] uppercase font-bold px-1 bg-slate-200 text-slate-800">
                      {(node.streamFamily || 'all').toUpperCase()}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {evalRes.status === 'blocked' && <Lock className="w-3.5 h-3.5 text-red-600" />}
                    {evalRes.status === 'warning' && !isSelected && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </div>

                  <div className="text-xs font-bold font-devanagari leading-snug">{name}</div>
                  
                  <div className="text-[10px] text-slate-500 mt-2 flex justify-between border-t border-slate-100 pt-1">
                    <span>{node.duration}</span>
                    <span>₹{(node.annualFeeINR / 1000).toFixed(0)}k/yr</span>
                  </div>

                  {/* Ask AI Consultation Button */}
                  {isSelected && onAskAI && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAI(node);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-[9px] font-bold uppercase py-1 border border-brand-800 shadow-sm transition-all"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{locale === 'hi' ? 'AI चर्चा करें' : 'Ask AI Pathway'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 2: Qualifying Exam & Degree Modules */}
          <div className="flex flex-col gap-3">
            {stage2Nodes.map((node) => {
              const evalRes = evaluateNodeStatus(node);
              const isSelected = selectedStage2 === node.id;
              const name = locale === 'hi' ? node.nameHi : node.nameEn;

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`p-3.5 border-2 transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-slate-950 node-active-glow font-bold z-10'
                      : evalRes.status === 'blocked'
                      ? 'bg-red-50 border-red-400 text-slate-800 cursor-not-allowed'
                      : evalRes.status === 'warning'
                      ? 'bg-amber-50 border-amber-400 text-slate-950'
                      : 'border-blue-200 bg-blue-50/30 text-slate-900 hover:border-brand-500 shadow-sm'
                  }`}
                >
                  {/* Left Input Socket */}
                  <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-20 border-2 border-white ${
                    isSelected ? 'bg-emerald-600' : 'bg-slate-400'
                  }`} />

                  {/* Right Output Socket */}
                  <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-20 border-2 border-white ${
                    isSelected ? 'bg-emerald-600' : 'bg-slate-400'
                  }`} />

                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500 line-clamp-1">
                      {node.authority}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {evalRes.status === 'blocked' && <Lock className="w-3.5 h-3.5 text-red-600" />}
                    {evalRes.status === 'warning' && !isSelected && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </div>

                  <div className="text-xs font-bold font-devanagari leading-snug">{name}</div>

                  {node.quotaUP && (
                    <div className="text-[9px] text-emerald-800 bg-emerald-100/60 px-1 py-0.5 mt-1">
                      {node.quotaUP}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 mt-2 flex justify-between border-t border-slate-100 pt-1">
                    <span>{node.duration}</span>
                    <span>₹{node.annualFeeINR > 0 ? `${(node.annualFeeINR / 1000).toFixed(0)}k/yr` : 'Free'}</span>
                  </div>

                  {/* Ask AI Consultation Button */}
                  {isSelected && onAskAI && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAI(node);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-[9px] font-bold uppercase py-1 border border-brand-800 shadow-sm transition-all"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{locale === 'hi' ? 'AI चर्चा करें' : 'Ask AI Pathway'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 3: Terminal Career Destination Modules */}
          <div className="flex flex-col gap-3">
            {stage3Nodes.map((node) => {
              const evalRes = evaluateNodeStatus(node);
              const isSelected = selectedStage3 === node.id;
              const name = locale === 'hi' ? node.nameHi : node.nameEn;

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`p-3.5 border-2 transition-all relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-slate-950 node-active-glow font-bold z-10'
                      : evalRes.status === 'blocked'
                      ? 'bg-red-50 border-red-400 text-slate-800 cursor-not-allowed'
                      : evalRes.status === 'warning'
                      ? 'bg-amber-50 border-amber-400 text-slate-950'
                      : 'border-blue-200 bg-blue-50/30 text-slate-900 hover:border-brand-500 shadow-sm'
                  }`}
                >
                  {/* Left Input Socket */}
                  <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-20 border-2 border-white ${
                    isSelected ? 'bg-emerald-600' : 'bg-slate-400'
                  }`} />

                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] uppercase font-bold text-slate-500">
                      DESTINATION
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {evalRes.status === 'blocked' && <Lock className="w-3.5 h-3.5 text-red-600" />}
                    {evalRes.status === 'warning' && !isSelected && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </div>

                  <div className="text-xs font-bold font-devanagari leading-snug">{name}</div>

                  <div className="text-[10px] text-slate-500 mt-2 flex justify-between border-t border-slate-100 pt-1">
                    <span>{node.authority}</span>
                    <span className="text-emerald-700 font-bold">GOVT / LEAD</span>
                  </div>

                  {/* Ask AI Consultation Button */}
                  {isSelected && onAskAI && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAI(node);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-[9px] font-bold uppercase py-1 border border-brand-800 shadow-sm transition-all"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{locale === 'hi' ? 'AI चर्चा करें' : 'Ask AI Pathway'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Node Inspector Box */}
        <div className="bento-box p-4 border-2 border-slate-900 bg-white shadow-sm mt-6">
          {hoveredNode ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 bg-slate-900 text-white">
                    STAGE {hoveredNode.stage} INSPECTOR
                  </span>
                  <span className="text-xs text-slate-500">{hoveredNode.authority}</span>
                </div>
                <h3 className="text-base font-black text-slate-950 font-devanagari">
                  {locale === 'hi' ? hoveredNode.nameHi : hoveredNode.nameEn}
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-devanagari leading-relaxed">
                  {locale === 'hi' ? hoveredNode.descHi : hoveredNode.descEn}
                </p>
              </div>

              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <span className="font-bold text-slate-900">{hoveredNode.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Fee:</span>
                  <span className="font-bold text-slate-900">
                    ₹{hoveredNode.costMinINR.toLocaleString('en-IN')} - ₹{hoveredNode.costMaxINR.toLocaleString('en-IN')}
                  </span>
                </div>
                {hoveredNode.quotaUP && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>UP Quota:</span>
                    <span>{hoveredNode.quotaUP}</span>
                  </div>
                )}
                {hoveredNode.portalUrl && (
                  <a
                    href={hoveredNode.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-brand-600 hover:underline pt-1 text-[11px] font-bold"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-slate-400" />
              <span>
                {locale === 'hi'
                  ? 'किसी भी नोड पर कर्सर ले जाकर विस्तृत विवरण देखें, अथवा मार्ग सक्रिय करने हेतु क्लिक करें।'
                  : 'Hover over any node for statutory details, or click to verify and illuminate the pathway.'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
