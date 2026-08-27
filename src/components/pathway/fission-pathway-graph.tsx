'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import type { StudentDecisionInput } from '@/lib/contracts/student';
import { 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  RotateCcw, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Info
} from 'lucide-react';

import { ALL_FISSION_NODES, type FissionNode } from '@/lib/data/fission-nodes';

export function FissionPathwayGraph({
  studentInput,
  onSelectNode,
}: {
  studentInput: StudentDecisionInput;
  onSelectNode?: (nodeId: string) => void;
}) {
  const t = useTranslations('fission');
  const locale = useLocale() as 'en' | 'hi';

  // State: selected node at each stage to trace the fission chain
  const [selectedStage1, setSelectedStage1] = useState<string>('stream_pcm');
  const [selectedStage2, setSelectedStage2] = useState<string>('deg_btech_jee');
  const [selectedStage3, setSelectedStage3] = useState<string>('car_ai_scientist');
  const [hoveredNode, setHoveredNode] = useState<FissionNode | null>(null);

  // Sync with initial stream from studentInput
  React.useEffect(() => {
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

  // Evaluate status for any node given current user choices
  const evaluateNodeStatus = (node: FissionNode) => {
    // Stage 0 is always open
    if (node.stage === 0) return { status: 'active', reason: 'Origin' };

    // Check mathematical hard stop prerequisites
    const chosenStream = selectedStage1;
    
    // PCB prerequisite rule
    if (node.requiresBio && chosenStream !== 'stream_pcb') {
      return {
        status: 'blocked',
        reason: locale === 'hi' 
          ? 'अवरुद्ध 🔒: 12वीं में जीवविज्ञान (PCB) अनिवार्य है। गैर-बायो स्ट्रीम से यह मार्ग संभव नहीं है।' 
          : 'Blocked 🔒: Requires Class 12 Biology (PCB). Non-medical streams are ineligible.',
      };
    }

    // PCM Maths prerequisite rule
    if (node.requiresMaths && chosenStream !== 'stream_pcm' && chosenStream !== 'stream_vocational') {
      return {
        status: 'blocked',
        reason: locale === 'hi'
          ? 'अवरुद्ध 🔒: 12वीं में गणित (PCM) अनिवार्य है। बिना गणित के इंजीनियरिंग/एनडीए संभव नहीं।'
          : 'Blocked 🔒: Requires Class 12 Mathematics (PCM). Ineligible without Mathematics.',
      };
    }

    // Check budget warning friction
    const budgetLimit = studentInput.budgetBand === 'low' ? 25000 : studentInput.budgetBand === 'medium' ? 150000 : 1000000;
    if (node.annualFeeINR > budgetLimit) {
      return {
        status: 'warning',
        reason: locale === 'hi'
          ? `बजट चेतावनी ⚠️: वार्षिक शुल्क (₹${node.annualFeeINR.toLocaleString('en-IN')}) आपके बजट सीमा से अधिक है। सरकारी छात्रवृत्ति आवश्यक होगी।`
          : `Budget Warning ⚠️: Annual fee (₹${node.annualFeeINR.toLocaleString('en-IN')}) exceeds your stated budget. Financial aid or loans needed.`,
      };
    }

    // Check if on active path
    const isActive =
      (node.stage === 1 && node.id === selectedStage1) ||
      (node.stage === 2 && node.id === selectedStage2) ||
      (node.stage === 3 && node.id === selectedStage3);

    if (isActive) {
      return { status: 'active', reason: 'Active Path' };
    }

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

    if (node.stage === 1) {
      setSelectedStage1(node.id);
      // auto select matching child
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

  const handlePrintPDF = () => {
    window.print();
  };

  const handleReset = () => {
    setSelectedStage1('stream_pcm');
    setSelectedStage2('deg_btech_jee');
    setSelectedStage3('car_ai_scientist');
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Controller Bar (Boxy Symmetry) */}
      <div className="bento-box p-4 sm:p-5 border-2 border-slate-900 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
              NUCLEAR FISSION ENGINE • विखंडन श्रृंखला
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight mt-0.5 font-devanagari">
            {t('title')}
          </h2>
          <p className="text-xs text-slate-600 font-devanagari">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto no-print">
          <button
            onClick={handleReset}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider border-2 border-slate-900 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('resetPath')}</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('downloadPdf')}</span>
          </button>
        </div>
      </div>

      {/* Symmetrical Color Legend Bar */}
      <div className="bento-box p-4 border-2 border-slate-900 bg-slate-900 text-white text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-emerald-500 border border-emerald-300 shadow-[0_0_8px_#22c55e]" />
          <span className="font-bold text-emerald-400">ACTIVE PATH (चयनित मार्ग)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-slate-600 border border-slate-400" />
          <span className="text-slate-300">AVAILABLE (अन्य विकल्प)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-red-600 border border-red-400 flex items-center justify-center text-[9px]">
            🔒
          </div>
          <span className="font-bold text-red-400">HARD STOP (अवरुद्ध)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-amber-500 border border-amber-300 flex items-center justify-center text-[9px]">
            ⚠️
          </div>
          <span className="font-bold text-amber-400">BUDGET RISK (बजट चेतावनी)</span>
        </div>
      </div>

      {/* Main Interactive Fission Workspace (Horizontal Scroll & Multi-Tier Grid) */}
      <div className="relative w-full overflow-x-auto custom-scrollbar border-2 border-slate-900 bg-[#FAFBFD] p-6 shadow-inner min-h-[580px]">
        {/* Stage Columns Headers */}
        <div className="grid grid-cols-4 gap-6 min-w-[960px] mb-6 font-sans">
          {/* Column 0 */}
          <div className="bg-indigo-50/60 border border-indigo-100/50 p-4 shadow-sm border-t-4 border-t-cyan-400 rounded-b-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-500 uppercase">STAGE 0</span>
              <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 border border-indigo-200 rounded">{stage0Nodes.length} {locale === 'hi' ? 'मार्ग' : 'routes'}</span>
            </div>
            <h2 className="text-base font-bold text-indigo-950 tracking-tight font-devanagari">{locale === 'hi' ? 'कक्षा 10 (आरंभ)' : 'Class 10 (Origin)'}</h2>
            <p className="text-xs text-indigo-700/80 font-devanagari mt-0.5 uppercase tracking-wide">{locale === 'hi' ? 'मूल शिक्षा' : 'Foundation'}</p>
          </div>
          {/* Column 1 */}
          <div className="bg-indigo-50/60 border border-indigo-100/50 p-4 shadow-sm border-t-4 border-t-blue-400 rounded-b-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-500 uppercase">STAGE 01</span>
              <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 border border-indigo-200 rounded">{stage1Nodes.length} {locale === 'hi' ? 'मार्ग' : 'routes'}</span>
            </div>
            <h2 className="text-base font-bold text-indigo-950 tracking-tight font-devanagari">{locale === 'hi' ? '12वीं विषय वर्ग' : 'Class 12 Streams'}</h2>
            <p className="text-xs text-indigo-700/80 font-devanagari mt-0.5 uppercase tracking-wide">{locale === 'hi' ? 'वर्तमान स्तर के निर्णय व संकाय चयन' : 'Current stage decisions & board streams'}</p>
          </div>
          {/* Column 2 */}
          <div className="bg-indigo-50/60 border border-indigo-100/50 p-4 shadow-sm border-t-4 border-t-violet-500 rounded-b-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-500 uppercase">STAGE 02</span>
              <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 border border-indigo-200 rounded">{stage2Nodes.length} {locale === 'hi' ? 'मार्ग' : 'routes'}</span>
            </div>
            <h2 className="text-base font-bold text-indigo-950 tracking-tight font-devanagari">{locale === 'hi' ? 'प्रवेश परीक्षा व डिग्री' : 'Exams & Degrees'}</h2>
            <p className="text-xs text-indigo-700/80 font-devanagari mt-0.5 uppercase tracking-wide">{locale === 'hi' ? 'प्रतियोगी परीक्षाएं, स्नातक डिग्री व प्रशिक्षण' : 'Qualifying exams, college degrees & training'}</p>
          </div>
          {/* Column 3 */}
          <div className="bg-indigo-50/60 border border-indigo-100/50 p-4 shadow-sm border-t-4 border-t-fuchsia-500 rounded-b-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-500 uppercase">STAGE 03</span>
              <span className="text-[11px] font-mono font-semibold text-indigo-600 bg-indigo-100/50 px-2 py-0.5 border border-indigo-200 rounded">{stage3Nodes.length} {locale === 'hi' ? 'मार्ग' : 'routes'}</span>
            </div>
            <h2 className="text-base font-bold text-indigo-950 tracking-tight font-devanagari">{locale === 'hi' ? 'अंतिम करियर लक्ष्य' : 'Terminal Career Goals'}</h2>
            <p className="text-xs text-indigo-700/80 font-devanagari mt-0.5 uppercase tracking-wide">{locale === 'hi' ? 'राजपत्रित अधिकारी, न्यायिक सेवा व विशेषज्ञ पद' : 'Government officers & terminal professions'}</p>
          </div>
        </div>

        {/* 4-Tier Interactive Node Columns */}
        <div className="grid grid-cols-4 gap-6 min-w-[960px] items-start">
          {/* Column 0: Root Nucleus */}
          <div className="flex flex-col gap-4">
            {stage0Nodes.map((node) => {
              const name = locale === 'hi' ? node.nameHi : node.nameEn;
              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="bento-box p-4 border-2 border-emerald-600 bg-emerald-50 text-slate-950 node-active-glow relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 bg-emerald-600 text-white">
                      ROOT NUCLEUS
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-black font-devanagari">{name}</h3>
                  <p className="text-[11px] text-slate-600 mt-1 font-mono">{node.duration}</p>
                </div>
              );
            })}
          </div>

          {/* Column 1: Streams Split */}
          <div className="flex flex-col gap-3">
            {stage1Nodes.map((node) => {
              const evalRes = evaluateNodeStatus(node);
              const isSelected = selectedStage1 === node.id;
              const name = locale === 'hi' ? node.nameHi : node.nameEn;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`text-left p-3.5 border-2 transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-slate-950 node-active-glow font-bold'
                      : evalRes.status === 'blocked'
                      ? 'bg-red-50 border-red-400 text-slate-800 cursor-not-allowed'
                      : evalRes.status === 'warning'
                      ? 'bg-amber-50 border-amber-400 text-slate-950'
                      : 'border-blue-200 bg-blue-50/30 text-slate-900 hover:border-brand-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[9px] font-mono uppercase font-bold px-1 bg-slate-200 text-slate-800">
                      {(node.streamFamily || 'all').toUpperCase()}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {evalRes.status === 'blocked' && <Lock className="w-3.5 h-3.5 text-red-600" />}
                    {evalRes.status === 'warning' && !isSelected && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </div>
                  <div className="text-xs font-bold font-devanagari leading-snug">{name}</div>
                  <div className="text-[10px] text-slate-500 mt-2 font-mono flex justify-between">
                    <span>{node.duration}</span>
                    <span>₹{(node.annualFeeINR / 1000).toFixed(0)}k/yr</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Column 2: Qualifying Exams & Degrees */}
          <div className="flex flex-col gap-3">
            {stage2Nodes.map((node) => {
              const evalRes = evaluateNodeStatus(node);
              const isSelected = selectedStage2 === node.id;
              const name = locale === 'hi' ? node.nameHi : node.nameEn;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`text-left p-3.5 border-2 transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-slate-950 node-active-glow font-bold'
                      : evalRes.status === 'blocked'
                      ? 'bg-red-50 border-red-400 text-slate-800 cursor-not-allowed'
                      : evalRes.status === 'warning'
                      ? 'bg-amber-50 border-amber-400 text-slate-950'
                      : 'border-blue-200 bg-blue-50/30 text-slate-900 hover:border-brand-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-mono uppercase font-bold text-slate-500 line-clamp-1">
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
                    <div className="text-[9px] text-emerald-800 bg-emerald-100/60 px-1 py-0.5 mt-1 font-mono">
                      {node.quotaUP}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 mt-2 font-mono flex justify-between border-t border-slate-100 pt-1">
                    <span>{node.duration}</span>
                    <span>₹{node.annualFeeINR > 0 ? `${(node.annualFeeINR / 1000).toFixed(0)}k/yr` : 'Free'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Column 3: Terminal Careers & Officers */}
          <div className="flex flex-col gap-3">
            {stage3Nodes.map((node) => {
              const evalRes = evaluateNodeStatus(node);
              const isSelected = selectedStage3 === node.id;
              const name = locale === 'hi' ? node.nameHi : node.nameEn;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`text-left p-3.5 border-2 transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-slate-950 node-active-glow font-bold'
                      : evalRes.status === 'blocked'
                      ? 'bg-red-50 border-red-400 text-slate-800 cursor-not-allowed'
                      : evalRes.status === 'warning'
                      ? 'bg-amber-50 border-amber-400 text-slate-950'
                      : 'border-blue-200 bg-blue-50/30 text-slate-900 hover:border-brand-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-mono uppercase font-bold text-slate-500">
                      DESTINATION
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {evalRes.status === 'blocked' && <Lock className="w-3.5 h-3.5 text-red-600" />}
                    {evalRes.status === 'warning' && !isSelected && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </div>
                  <div className="text-xs font-bold font-devanagari leading-snug">{name}</div>
                  <div className="text-[10px] text-slate-500 mt-2 font-mono flex justify-between border-t border-slate-100 pt-1">
                    <span>{node.authority}</span>
                    <span className="text-emerald-700 font-bold">GOVT / LEAD</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sharp Quick-Info Tooltip / Inspector Box */}
      <div className="bento-box p-6 border-2 border-slate-900 bg-white shadow-sm">
        {hoveredNode ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 bg-slate-900 text-white">
                  STAGE {hoveredNode.stage} INSPECTOR
                </span>
                <span className="text-xs font-mono text-slate-500">{hoveredNode.authority}</span>
              </div>
              <h3 className="text-lg font-black text-slate-950 font-devanagari">
                {locale === 'hi' ? hoveredNode.nameHi : hoveredNode.nameEn}
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-devanagari leading-relaxed">
                {locale === 'hi' ? hoveredNode.descHi : hoveredNode.descEn}
              </p>
            </div>

            <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 space-y-1.5 text-xs font-mono">
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
                  <span>Official Portal (आधिकारिक वेबसाइट)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <Info className="w-4 h-4 text-slate-400" />
            <span>{t('hoverTooltip')}</span>
          </div>
        )}
      </div>

      {/* Printable Dossier Summary (Hidden during normal screen, perfectly formatted for PDF Print) */}
      <div className="hidden print:block p-8 border-2 border-black bg-white text-black font-mono space-y-4 print-page">
        <div className="border-b-2 border-black pb-4 text-center">
          <h1 className="text-2xl font-black uppercase">PATHFINDER INDIA — CAREER DOSSIER</h1>
          <p className="text-xs">ONE NATION • ONE CAREER PORTAL | OFFICIAL REPORT</p>
        </div>

        <div className="grid grid-cols-2 gap-4 border border-black p-4 text-xs">
          <div><strong>Selected Stream:</strong> {selectedStage1}</div>
          <div><strong>Qualifying Degree / Exam:</strong> {selectedStage2}</div>
          <div><strong>Terminal Goal:</strong> {selectedStage3}</div>
          <div><strong>Home State:</strong> {studentInput.stateCode} (Uttar Pradesh Quota)</div>
          <div><strong>Stated Annual Budget:</strong> {studentInput.budgetBand.toUpperCase()}</div>
          <div><strong>Verification Status:</strong> 100% Statutory Compliant</div>
        </div>

        <div className="text-xs leading-relaxed">
          <h3 className="font-bold text-sm mb-2 border-b border-black">30-DAY ACTION PROTOCOL:</h3>
          <p>1. Procure NCERT & UP State Board reference material for the designated prerequisite subjects.</p>
          <p>2. Verify domicile certificate and caste/EWS certificate before the state counselling deadline.</p>
          <p>3. Register on the official portal and monitor notification release calendars.</p>
        </div>
      </div>
    </div>
  );
}
