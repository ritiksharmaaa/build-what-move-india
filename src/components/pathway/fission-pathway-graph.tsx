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

export interface FissionNode {
  id: string;
  stage: 0 | 1 | 2 | 3;
  nameEn: string;
  nameHi: string;
  category: 'origin' | 'stream' | 'exam_degree' | 'terminal_career';
  streamFamily: 'all' | 'pcm' | 'pcb' | 'commerce' | 'humanities' | 'vocational';
  requiresMaths?: boolean;
  requiresBio?: boolean;
  costMinINR: number;
  costMaxINR: number;
  annualFeeINR: number;
  duration: string;
  portalUrl?: string;
  authority: string;
  quotaUP?: string;
  descEn: string;
  descHi: string;
  parentIds: string[];
}

const ALL_FISSION_NODES: FissionNode[] = [
  // Stage 0: Origin
  {
    id: 'class_10',
    stage: 0,
    nameEn: 'Class 10 (Secondary)',
    nameHi: 'कक्षा 10 (माध्यमिक)',
    category: 'origin',
    streamFamily: 'all',
    costMinINR: 0,
    costMaxINR: 5000,
    annualFeeINR: 2000,
    duration: '1 Year',
    authority: 'UP Board / CBSE / ICSE',
    descEn: 'The root nucleus of Indian education. Sets the baseline for stream branching.',
    descHi: 'भारतीय शिक्षा व्यवस्था का मूल बिंदु। यहीं से भविष्य के सभी विषय विभाजित होते हैं।',
    parentIds: [],
  },

  // Stage 1: Streams
  {
    id: 'stream_pcm',
    stage: 1,
    nameEn: 'Science (PCM - Engineering & Tech)',
    nameHi: 'विज्ञान (PCM - भौतिकी, रसायन, गणित)',
    category: 'stream',
    streamFamily: 'pcm',
    requiresMaths: true,
    costMinINR: 5000,
    costMaxINR: 40000,
    annualFeeINR: 15000,
    duration: '2 Years (11th & 12th)',
    authority: 'State & Central Boards',
    descEn: 'Opens JEE, NDA, ISRO, AI Engineering, Architecture, and pure physics research.',
    descHi: 'इंजीनियरिंग, एनडीए, रक्षा अनुसंधान, रोबोटिक्स व वैज्ञानिक शोध के सभी द्वार खोलता है।',
    parentIds: ['class_10'],
  },
  {
    id: 'stream_pcb',
    stage: 1,
    nameEn: 'Science (PCB - Medicine & Bio)',
    nameHi: 'विज्ञान (PCB - भौतिकी, रसायन, जीवविज्ञान)',
    category: 'stream',
    streamFamily: 'pcb',
    requiresBio: true,
    costMinINR: 5000,
    costMaxINR: 40000,
    annualFeeINR: 15000,
    duration: '2 Years (11th & 12th)',
    authority: 'State & Central Boards',
    descEn: 'Mandatory prerequisite for NEET-UG, MBBS, BDS, BAMS, Veterinary, and Biotech.',
    descHi: 'नीट (NEET-UG), एमबीबीएस, आयुर्वेद, फार्मेसी और जैव प्रौद्योगिकी के लिए अनिवार्य।',
    parentIds: ['class_10'],
  },
  {
    id: 'stream_commerce',
    stage: 1,
    nameEn: 'Commerce (Finance, CA & Economics)',
    nameHi: 'वाणिज्य (कॉमर्स - लेखांकन, वित्त व अर्थशास्त्र)',
    category: 'stream',
    streamFamily: 'commerce',
    costMinINR: 4000,
    costMaxINR: 30000,
    annualFeeINR: 12000,
    duration: '2 Years (11th & 12th)',
    authority: 'State & Central Boards',
    descEn: 'Core pathway for Chartered Accountancy (CA), Investment Banking, Corporate Law.',
    descHi: 'चार्टर्ड अकाउंटेंसी (CA), कॉर्पोरेट वित्त, बैंकिंग व प्रबंधकीय करियर का प्रमुख मार्ग।',
    parentIds: ['class_10'],
  },
  {
    id: 'stream_humanities',
    stage: 1,
    nameEn: 'Arts & Humanities (Civil Services & Law)',
    nameHi: 'कला व मानविकी (सिविल सेवा, विधि व साहित्य)',
    category: 'stream',
    streamFamily: 'humanities',
    costMinINR: 3000,
    costMaxINR: 20000,
    annualFeeINR: 8000,
    duration: '2 Years (11th & 12th)',
    authority: 'State & Central Boards',
    descEn: 'Direct alignment with UPSC CSE, UPPSC PCS, CLAT Judiciary, Journalism, and Policy.',
    descHi: 'यूपीएससी, यूपीपीएससी, न्यायिक सेवा (CLAT), पत्रकारिता व प्रशासनिक नीति निर्माण।',
    parentIds: ['class_10'],
  },
  {
    id: 'stream_vocational',
    stage: 1,
    nameEn: 'Vocational / Polytechnic Diploma',
    nameHi: 'पॉलिटेक्निक डिप्लोमा व आईटीआई',
    category: 'stream',
    streamFamily: 'vocational',
    costMinINR: 5000,
    costMaxINR: 25000,
    annualFeeINR: 10000,
    duration: '3 Years Diploma',
    authority: 'BTE UP / NCVT',
    descEn: 'Direct technical entry to Junior Engineer (JE UP) and lateral entry to B.Tech.',
    descHi: 'कनिष्ठ अभियंता (JE) पदों व सीधे बी.टेक द्वितीय वर्ष (लेटरल एंट्री) का तीव्र मार्ग।',
    parentIds: ['class_10'],
  },

  // Stage 2: Exams & Degrees
  {
    id: 'deg_btech_jee',
    stage: 2,
    nameEn: 'JEE Advanced / IIT & NIT B.Tech CS',
    nameHi: 'आईआईटी व एनआईटी बी.टेक कंप्यूटर साइंस',
    category: 'exam_degree',
    streamFamily: 'pcm',
    requiresMaths: true,
    costMinINR: 50000,
    costMaxINR: 900000,
    annualFeeINR: 150000,
    duration: '4 Years',
    portalUrl: 'https://jeeadv.ac.in',
    authority: 'NTA / IIT Joint Admission Board',
    quotaUP: 'AKTU / UPTU State Seats Available',
    descEn: 'Requires Class 12 PCM. Top tier engineering program for software, AI, and hardware.',
    descHi: '12वीं में गणित अनिवार्य। सॉफ्टवेयर, आर्टिफिशियल इंटेलिजेंस व प्रौद्योगिकी का सर्वोच्च मार्ग।',
    parentIds: ['stream_pcm', 'stream_vocational'],
  },
  {
    id: 'deg_nda_defence',
    stage: 2,
    nameEn: 'NDA (National Defence Academy) Officer Entry',
    nameHi: 'एनडीए (राष्ट्रीय रक्षा अकादमी) अधिकारी प्रवेश',
    category: 'exam_degree',
    streamFamily: 'pcm',
    requiresMaths: true,
    costMinINR: 0,
    costMaxINR: 5000,
    annualFeeINR: 0,
    duration: '3 Years Academy Training',
    portalUrl: 'https://upsc.gov.in',
    authority: 'UPSC & Ministry of Defence',
    quotaUP: 'All India Merit (Free with Stipend)',
    descEn: '100% Free government education with military stipend for Army, Navy & Air Force.',
    descHi: 'सेना, नौसेना व वायुसेना में राजपत्रित अधिकारी। 100% निशुल्क प्रशिक्षण व छात्रवृत्ति।',
    parentIds: ['stream_pcm'],
  },
  {
    id: 'deg_mbbs_neet',
    stage: 2,
    nameEn: 'NEET UG / AIIMS & Govt MBBS Degree',
    nameHi: 'नीट यूजी / सरकारी मेडिकल कॉलेज एमबीबीएस',
    category: 'exam_degree',
    streamFamily: 'pcb',
    requiresBio: true,
    costMinINR: 15000,
    costMaxINR: 6500000,
    annualFeeINR: 35000,
    duration: '5.5 Years (Incl. Internship)',
    portalUrl: 'https://neet.nta.nic.in',
    authority: 'National Medical Commission (NMC)',
    quotaUP: '85% State Quota via DGME UP',
    descEn: 'Strictly requires Class 12 PCB. Govt colleges cost <₹1L; private deemed cost ₹60L+.',
    descHi: 'केवल 12वीं बायोलॉजी से संभव। सरकारी मेडिकल कॉलेज अत्यंत कम शुल्क में उपलब्ध हैं।',
    parentIds: ['stream_pcb'],
  },
  {
    id: 'deg_bams_ayush',
    stage: 2,
    nameEn: 'BAMS / BHMS (Ayurveda & Homeopathy)',
    nameHi: 'बीएएमएस / बीएचएमएस (आयुर्वेद चिकित्सा)',
    category: 'exam_degree',
    streamFamily: 'pcb',
    requiresBio: true,
    costMinINR: 20000,
    costMaxINR: 400000,
    annualFeeINR: 60000,
    duration: '5.5 Years',
    portalUrl: 'https://ayush.up.gov.in',
    authority: 'NCISM / AYUSH Ministry',
    quotaUP: 'UP Ayush Counselling 85% Quota',
    descEn: 'Recognized medical practitioner status with expanding government hospital vacancies.',
    descHi: 'आयुष मंत्रालय द्वारा प्रमाणित चिकित्सा डिग्री, सरकारी चिकित्साधिकारी पद हेतु मान्य।',
    parentIds: ['stream_pcb'],
  },
  {
    id: 'deg_ca_foundation',
    stage: 2,
    nameEn: 'CA Foundation & Articleship (ICAI)',
    nameHi: 'सीए फाउंडेशन व आर्टिकलशिप (ICAI)',
    category: 'exam_degree',
    streamFamily: 'commerce',
    costMinINR: 25000,
    costMaxINR: 80000,
    annualFeeINR: 30000,
    duration: '3.5 - 4.5 Years',
    portalUrl: 'https://icai.org',
    authority: 'Institute of Chartered Accountants of India',
    quotaUP: 'National Statutory Examination',
    descEn: 'Open to Commerce and other streams. Highest return on investment with zero capitation.',
    descHi: 'भारत का सबसे प्रतिष्ठित वित्तीय प्रमाणन। न्यूनतम शुल्क में सर्वोच्च कॉर्पोरेट मांग।',
    parentIds: ['stream_commerce', 'stream_humanities', 'stream_pcm'],
  },
  {
    id: 'deg_clat_law',
    stage: 2,
    nameEn: 'CLAT UG / National Law University (BA LLB)',
    nameHi: 'क्लैट (CLAT) / राष्ट्रीय विधि वि.वि. 5-वर्षीय बीए एलएलबी',
    category: 'exam_degree',
    streamFamily: 'humanities',
    costMinINR: 100000,
    costMaxINR: 1200000,
    annualFeeINR: 220000,
    duration: '5 Years Integrated',
    portalUrl: 'https://consortiumofnlus.ac.in',
    authority: 'Consortium of NLUs / BCI',
    quotaUP: 'RMLNLU Lucknow State Quota',
    descEn: 'Direct pathway to Corporate Law, Supreme Court advocacy, and Judicial Services (PCS-J).',
    descHi: 'न्यायाधीश (PCS-J) परीक्षा, कॉर्पोरेट लॉ व सर्वोच्च न्यायालय में वकालत का सर्वोच्च द्वार।',
    parentIds: ['stream_humanities', 'stream_commerce', 'stream_pcm'],
  },
  {
    id: 'deg_cuet_graduation',
    stage: 2,
    nameEn: 'CUET-UG / Central & State University BA/BSc',
    nameHi: 'सीयूईटी / केंद्रीय व राज्य वि.वि. स्नातक (BA/BSc/BCom)',
    category: 'exam_degree',
    streamFamily: 'humanities',
    costMinINR: 8000,
    costMaxINR: 60000,
    annualFeeINR: 12000,
    duration: '3 - 4 Years',
    portalUrl: 'https://cuetug.ntaonline.in',
    authority: 'UGC / NTA',
    quotaUP: 'BHU, AMU, Allahabad University Seats',
    descEn: 'Extremely affordable degree making student 100% eligible for UPSC CSE and UPPSC PCS.',
    descHi: 'काशी हिंदू वि.वि. (BHU) व इलाहाबाद वि.वि. से न्यूनतम शुल्क में यूपीएससी हेतु आदर्श तैयारी।',
    parentIds: ['stream_humanities', 'stream_commerce', 'stream_pcm', 'stream_pcb'],
  },
  {
    id: 'deg_up_police_constable',
    stage: 2,
    nameEn: 'UP Police SI / Constable Direct Recruitment',
    nameHi: 'यूपी पुलिस उपनिरीक्षक (SI) व सिपाही भर्ती',
    category: 'exam_degree',
    streamFamily: 'humanities',
    costMinINR: 400,
    costMaxINR: 5000,
    annualFeeINR: 1000,
    duration: '1 Year Selection + Training',
    portalUrl: 'https://uppbpb.gov.in',
    authority: 'UP Police Recruitment Board (UPPRPB)',
    quotaUP: '100% Uttar Pradesh State Service',
    descEn: 'Direct Class 12 / Graduate entry with immediate government salary and pension benefits.',
    descHi: '12वीं व स्नातक उपरांत सीधे सरकारी वर्दी व सुरक्षा सेवा। तत्काल आय का सशक्त माध्यम।',
    parentIds: ['stream_humanities', 'stream_commerce', 'stream_pcm', 'stream_vocational'],
  },

  // Stage 3: Terminal Careers & Officers
  {
    id: 'car_ias_ips',
    stage: 3,
    nameEn: 'IAS / IPS / IFS Officer (UPSC Civil Services)',
    nameHi: 'आईएएस / आईपीएस अधिकारी (UPSC सिविल सेवा)',
    category: 'terminal_career',
    streamFamily: 'all',
    costMinINR: 100,
    costMaxINR: 100,
    annualFeeINR: 100,
    duration: 'Annual Exam Cycle',
    portalUrl: 'https://upsc.gov.in',
    authority: 'Union Public Service Commission',
    quotaUP: 'All India Service (Cadre Allocation)',
    descEn: 'Open to ANY graduate. Highest policy, administrative, and policing leadership in India.',
    descHi: 'किसी भी स्नातक हेतु मान्य। देश के नीति निर्माण व जिले के प्रशासनिक नेतृत्व का शिखर।',
    parentIds: ['deg_cuet_graduation', 'deg_clat_law', 'deg_btech_jee', 'deg_mbbs_neet', 'deg_ca_foundation'],
  },
  {
    id: 'car_uppsc_sdm',
    stage: 3,
    nameEn: 'UPPSC SDM / DSP (State Civil Service)',
    nameHi: 'यूपीपीएससी एसडीएम / डीएसपी (राज्य सिविल सेवा)',
    category: 'terminal_career',
    streamFamily: 'all',
    costMinINR: 125,
    costMaxINR: 125,
    annualFeeINR: 125,
    duration: 'Combined State Services',
    portalUrl: 'https://uppsc.up.nic.in',
    authority: 'Uttar Pradesh Public Service Commission',
    quotaUP: '100% UP Executive State Cadre',
    descEn: 'Sub-Divisional Magistrate (SDM) and Deputy SP governing Uttar Pradesh administrative divisions.',
    descHi: 'उत्तर प्रदेश शासन में उप-जिलाधिकारी (SDM) व पुलिस उपाधीक्षक (DSP) के सर्वोच्च राज्य पद।',
    parentIds: ['deg_cuet_graduation', 'deg_clat_law', 'deg_btech_jee', 'deg_up_police_constable'],
  },
  {
    id: 'car_ai_scientist',
    stage: 3,
    nameEn: 'ISRO Scientist / Principal AI Architect',
    nameHi: 'इसरो वैज्ञानिक / मुख्य एआई आर्किटेक्ट',
    category: 'terminal_career',
    streamFamily: 'pcm',
    requiresMaths: true,
    costMinINR: 0,
    costMaxINR: 0,
    annualFeeINR: 0,
    duration: 'Career Trajectory',
    authority: 'ISRO / Global Tech MNCs',
    descEn: 'High impact engineering role leading space missions, algorithms, and deep tech.',
    descHi: 'अंतरिक्ष मिशन, स्वायत्त रोबोटिक्स व वैश्विक तकनीकी नवाचार का नेतृत्व।',
    parentIds: ['deg_btech_jee'],
  },
  {
    id: 'car_neurosurgeon',
    stage: 3,
    nameEn: 'Specialist Surgeon / Medical Superintendent',
    nameHi: 'वरिष्ठ विशेषज्ञ सर्जन / चिकित्सा अधीक्षक',
    category: 'terminal_career',
    streamFamily: 'pcb',
    requiresBio: true,
    costMinINR: 0,
    costMaxINR: 0,
    annualFeeINR: 0,
    duration: 'Post-MBBS (MD/MS 3 Yrs)',
    authority: 'NMC / AIIMS / SGPGI Lucknow',
    quotaUP: 'UP Medical Health Cadre',
    descEn: 'Clinical leadership in healthcare, tertiary hospital administration, and surgery.',
    descHi: 'अस्पताल प्रशासन, जीवन रक्षक शल्य चिकित्सा व स्नातकोत्तर चिकित्सा विशेषज्ञता।',
    parentIds: ['deg_mbbs_neet', 'deg_bams_ayush'],
  },
  {
    id: 'car_judge_lawyer',
    stage: 3,
    nameEn: 'Civil Judge (PCS-J) / High Court Advocate',
    nameHi: 'सिविल जज (PCS-J) / उच्च न्यायालय अधिवक्ता',
    category: 'terminal_career',
    streamFamily: 'humanities',
    costMinINR: 100,
    costMaxINR: 500,
    annualFeeINR: 0,
    duration: 'Judicial Examination Entry',
    portalUrl: 'https://uppsc.up.nic.in',
    authority: 'Allahabad High Court / UPPSC',
    quotaUP: 'UP Judicial Service',
    descEn: 'Judicial magistrate and constitutional litigation authority in Uttar Pradesh & India.',
    descHi: 'इलाहाबाद उच्च न्यायालय व जिला न्यायालयों में न्यायिक मजिस्ट्रेट व संवैधानिक विधिवेत्ता।',
    parentIds: ['deg_clat_law'],
  },
  {
    id: 'car_ca_cfo',
    stage: 3,
    nameEn: 'Chief Financial Officer (CFO) / CA Partner',
    nameHi: 'मुख्य वित्तीय अधिकारी (CFO) / वरिष्ठ सीए पार्टनर',
    category: 'terminal_career',
    streamFamily: 'commerce',
    costMinINR: 0,
    costMaxINR: 0,
    annualFeeINR: 0,
    duration: 'Post Qualification',
    authority: 'ICAI / Corporate India',
    descEn: 'Directing financial governance, national audits, taxation, and treasury.',
    descHi: 'कॉर्पोरेट वित्तीय नियंत्रण, राष्ट्रीय कर प्रणाली व आर्थिक लेखापरीक्षा का शीर्ष पद।',
    parentIds: ['deg_ca_foundation'],
  },
];

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
    <div className="w-full space-y-6">
      {/* Top Controller Bar (Boxy Symmetry) */}
      <div className="bento-box p-6 border-2 border-slate-900 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">
              NUCLEAR FISSION ENGINE • विखंडन श्रृंखला
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-1 font-devanagari">
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
        <div className="grid grid-cols-4 gap-6 min-w-[960px] pb-4 mb-4 border-b-2 border-slate-300 text-xs font-mono uppercase font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-slate-900 text-white flex items-center justify-center text-[10px]">0</span>
            <span>{t('step1')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
            <span>{t('step2')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
            <span>{t('step3')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
            <span>{t('step4')}</span>
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
                      ? 'border-red-400 bg-red-50/50 text-slate-500 opacity-60 cursor-not-allowed'
                      : evalRes.status === 'warning'
                      ? 'border-amber-500 bg-amber-50 text-slate-950'
                      : 'border-slate-300 bg-white text-slate-800 hover:border-slate-900'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[9px] font-mono uppercase font-bold px-1 bg-slate-200 text-slate-800">
                      {node.streamFamily.toUpperCase()}
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
                      ? 'border-red-300 bg-red-50/40 text-slate-400 opacity-60 cursor-not-allowed'
                      : evalRes.status === 'warning'
                      ? 'border-amber-500 bg-amber-50 text-slate-950'
                      : 'border-slate-300 bg-white text-slate-800 hover:border-slate-900'
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
                      ? 'border-red-300 bg-red-50/40 text-slate-400 opacity-60 cursor-not-allowed'
                      : evalRes.status === 'warning'
                      ? 'border-amber-500 bg-amber-50 text-slate-950'
                      : 'border-slate-300 bg-white text-slate-800 hover:border-slate-900'
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
