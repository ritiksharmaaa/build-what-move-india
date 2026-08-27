'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Network,
  Cpu,
  Zap,
  Info,
  ExternalLink
} from 'lucide-react';

interface NeuralGraphViewProps {
  studentInput: StudentDecisionInput;
  onSelectNode?: (nodeId: string) => void;
  onAskAI?: (node: FissionNode) => void;
}

export function NeuralGraphView({
  studentInput,
  onSelectNode,
  onAskAI,
}: NeuralGraphViewProps) {
  const locale = useLocale() as 'en' | 'hi';

  const [selectedStage1, setSelectedStage1] = useState<string>('stream_pcm');
  const [selectedStage2, setSelectedStage2] = useState<string>('deg_btech_jee');
  const [selectedStage3, setSelectedStage3] = useState<string>('car_ai_scientist');
  const [hoveredNode, setHoveredNode] = useState<FissionNode | null>(null);

  // Sync with initial stream from studentInput
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

  const evaluateNodeStatus = (node: FissionNode) => {
    if (node.stage === 0) return { status: 'active', reason: 'Origin' };
    const chosenStream = selectedStage1;

    if (node.requiresBio && chosenStream !== 'stream_pcb') {
      return {
        status: 'blocked',
        reason: locale === 'hi' 
          ? 'अवरुद्ध 🔒: 12वीं में जीवविज्ञान (PCB) अनिवार्य है।' 
          : 'Blocked 🔒: Requires Class 12 Biology (PCB).',
      };
    }

    if (node.requiresMaths && chosenStream !== 'stream_pcm' && chosenStream !== 'stream_vocational') {
      return {
        status: 'blocked',
        reason: locale === 'hi' 
          ? 'अवरुद्ध 🔒: 12वीं में गणित (PCM) अनिवार्य है।' 
          : 'Blocked 🔒: Requires Class 12 Mathematics (PCM).',
      };
    }

    const budgetLimit = studentInput.budgetBand === 'low' ? 25000 : studentInput.budgetBand === 'medium' ? 150000 : 1000000;
    if (node.annualFeeINR > budgetLimit) {
      return {
        status: 'warning',
        reason: locale === 'hi' 
          ? `बजट चेतावनी ⚠️: वार्षिक शुल्क अधिक है।` 
          : `Budget Warning ⚠️: Annual fee exceeds budget.`,
      };
    }

    const isActive =
      (node.stage === 1 && node.id === selectedStage1) ||
      (node.stage === 2 && node.id === selectedStage2) ||
      (node.stage === 3 && node.id === selectedStage3);

    if (isActive) return { status: 'active', reason: 'Active Path' };
    return { status: 'unselected', reason: 'Available Synapse' };
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
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-mono relative overflow-x-auto select-none pt-16 pb-24 px-4 sm:px-8">
      {/* Dark Neural Network Matrix Canvas Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: '28px 28px'
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10 space-y-6">
        {/* Layer Topology Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              {locale === 'hi' ? 'न्यूरल पाथवे नेटवर्क (Synaptic Decision Topology)' : 'Neural Pathway Network Topology'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Synaptic Active Laser</span>
            </span>
            <span>•</span>
            <span className="text-slate-500">n8n Flow Canvas</span>
          </div>
        </div>

        {/* 4 Neural Network Layers */}
        <div className="grid grid-cols-4 gap-6 min-w-[1050px] items-start relative">
          {/* Layer 0: Input Layer */}
          <div className="flex flex-col gap-4">
            <div className="text-[10px] font-bold uppercase text-slate-400 bg-slate-900 border border-slate-800 border-t-2 border-t-sky-400 px-2.5 py-1 flex items-center justify-between">
              <span>Input Nucleus</span>
              <span className="text-emerald-400">L0</span>
            </div>

            {stage0Nodes.map((node) => {
              const name = locale === 'hi' ? node.nameHi : node.nameEn;
              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="p-4 border-2 border-emerald-500 bg-slate-900/90 text-white rounded shadow-[0_0_15px_rgba(16,185,129,0.3)] relative"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-600 text-white rounded">
                      ROOT ORIGIN
                    </span>
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-black font-devanagari mt-1">{name}</h3>
                  <div className="text-[10px] text-slate-400 mt-2 flex justify-between border-t border-slate-800 pt-1">
                    <span>{node.authority}</span>
                    <span className="text-emerald-400 font-bold">{node.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer 1: Stream Hidden Synapses */}
          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-bold uppercase text-slate-400 bg-slate-900 border border-slate-800 border-t-2 border-t-indigo-400 px-2.5 py-1 flex items-center justify-between">
              <span>Stream Layer</span>
              <span className="text-brand-400">L1</span>
            </div>

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
                  className={`p-3.5 border-2 rounded transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-emerald-500 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white font-bold'
                      : evalRes.status === 'blocked'
                      ? 'border-red-900/50 bg-slate-950/80 text-slate-500 opacity-50 cursor-not-allowed'
                      : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] uppercase font-bold px-1 bg-slate-800 text-slate-300 rounded">
                      {(node.streamFamily || 'all').toUpperCase()}
                    </span>
                    {isSelected && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                    {evalRes.status === 'blocked' && <Lock className="w-3.5 h-3.5 text-red-500" />}
                  </div>

                  <div className="text-xs font-bold font-devanagari leading-snug">{name}</div>

                  <div className="text-[10px] text-slate-400 mt-2 flex justify-between border-t border-slate-800 pt-1">
                    <span>{node.duration}</span>
                    <span>₹{(node.annualFeeINR / 1000).toFixed(0)}k/yr</span>
                  </div>

                  {/* AI discussion button */}
                  {isSelected && onAskAI && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAI(node);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-[9px] font-bold uppercase py-1 rounded transition-all shadow"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{locale === 'hi' ? 'AI चर्चा करें' : 'Ask AI'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Layer 2: Examination & Degree Gateways */}
          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-bold uppercase text-slate-400 bg-slate-900 border border-slate-800 border-t-2 border-t-purple-400 px-2.5 py-1 flex items-center justify-between">
              <span>Gateway Layer</span>
              <span className="text-amber-400">L2</span>
            </div>

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
                  className={`p-3.5 border-2 rounded transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-emerald-500 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white font-bold'
                      : evalRes.status === 'blocked'
                      ? 'border-red-900/50 bg-slate-950/80 text-slate-500 opacity-50 cursor-not-allowed'
                      : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400 line-clamp-1">
                      {node.authority}
                    </span>
                    {isSelected && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                    {evalRes.status === 'blocked' && <Lock className="w-3.5 h-3.5 text-red-500" />}
                  </div>

                  <div className="text-xs font-bold font-devanagari leading-snug">{name}</div>

                  {node.quotaUP && (
                    <div className="text-[9px] text-emerald-300 bg-emerald-950/60 px-1 py-0.5 mt-1 border border-emerald-800/50 rounded">
                      {node.quotaUP}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 mt-2 flex justify-between border-t border-slate-800 pt-1">
                    <span>{node.duration}</span>
                    <span>₹{node.annualFeeINR > 0 ? `${(node.annualFeeINR / 1000).toFixed(0)}k` : 'Free'}</span>
                  </div>

                  {/* AI discussion button */}
                  {isSelected && onAskAI && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAI(node);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-[9px] font-bold uppercase py-1 rounded transition-all shadow"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{locale === 'hi' ? 'AI चर्चा करें' : 'Ask AI'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Layer 3: Terminal Output */}
          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-bold uppercase text-slate-400 bg-slate-900 border border-slate-800 border-t-2 border-t-fuchsia-400 px-2.5 py-1 flex items-center justify-between">
              <span>Terminal Layer</span>
              <span className="text-fuchsia-400">L3</span>
            </div>

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
                  className={`p-3.5 border-2 rounded transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-emerald-500 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.4)] text-white font-bold'
                      : evalRes.status === 'blocked'
                      ? 'border-red-900/50 bg-slate-950/80 text-slate-500 opacity-50 cursor-not-allowed'
                      : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] uppercase font-bold text-slate-400">
                      TARGET NODE
                    </span>
                    {isSelected && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
                    {evalRes.status === 'blocked' && <Lock className="w-3.5 h-3.5 text-red-500" />}
                  </div>

                  <div className="text-xs font-bold font-devanagari leading-snug">{name}</div>

                  <div className="text-[10px] text-slate-400 mt-2 flex justify-between border-t border-slate-800 pt-1">
                    <span>{node.authority}</span>
                    <span className="text-emerald-400 font-bold">GOVT / LEAD</span>
                  </div>

                  {/* AI discussion button */}
                  {isSelected && onAskAI && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAI(node);
                      }}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-[9px] font-bold uppercase py-1 rounded transition-all shadow"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>{locale === 'hi' ? 'AI चर्चा करें' : 'Ask AI'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Neural Synapse Inspector Box (Fixed Bottom Left) */}
        <div className="fixed bottom-6 left-0 right-0 z-[60] pointer-events-none">
          <div className="w-full mx-auto px-4 sm:px-8 max-w-[1400px] flex justify-start">
            <div className="pointer-events-auto max-w-2xl w-full -ml-[35px]">
              <div className="p-3 border border-slate-800 !border-l-8 !border-l-cyan-500 bg-slate-900/95 backdrop-blur shadow-lg rounded text-xs">
                {hoveredNode ? (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-8">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-800 text-emerald-400 rounded">
                          LAYER {hoveredNode.stage} SYNAPSE
                        </span>
                        <span className="text-slate-400">{hoveredNode.authority}</span>
                      </div>
                      <h3 className="text-base font-black text-white font-devanagari">
                        {locale === 'hi' ? hoveredNode.nameHi : hoveredNode.nameEn}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 font-devanagari">
                        {locale === 'hi' ? hoveredNode.descHi : hoveredNode.descEn}
                      </p>
                    </div>

                    <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4 space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration:</span>
                        <span className="font-bold text-white">{hoveredNode.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Est. Fee:</span>
                        <span className="font-bold text-emerald-400">
                          ₹{hoveredNode.costMinINR.toLocaleString('en-IN')} - ₹{hoveredNode.costMaxINR.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {hoveredNode.portalUrl && (
                        <a
                          href={hoveredNode.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:underline pt-1 text-[11px]"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Info className="w-4 h-4 text-slate-500" />
                    <span>
                      {locale === 'hi'
                        ? 'न्यूरल नोड पर कर्सर ले जाकर सिनैप्टिक विवरण देखें, अथवा सक्रिय मार्ग चुनने के लिए क्लिक करें।'
                        : 'Hover over neural nodes to view synaptic parameters, or click to activate decision paths.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

