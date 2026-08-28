import type { EvaluatedNode } from '@/lib/contracts/pathway';
import type { StudentDecisionInput } from '@/lib/contracts/student';

/**
 * Returns strict language mandate instructions for AI models.
 */
export function getLanguageMandate(locale: 'en' | 'hi' = 'en'): string {
  if (locale === 'hi') {
    return `
[अनिवार्य भाषा निर्देश - MANDATORY LANGUAGE RULE]
आपको अनिवार्य रूप से अपना पूरा उत्तर केवल और केवल शुद्ध एवं सुगम हिन्दी (देवनागरी लिपि) में ही देना है। 
- किसी भी वाक्य या अनुच्छेद को अंग्रेजी में न लिखें।
- केवल तकनीकी शब्दावली, मानक संस्थाओं और परीक्षाओं के आधिकारिक नाम (जैसे UPSC, IIT, NEET, B.Tech, NCERT, UPPSC, AKTU) को कोष्ठक में लिख सकते हैं।
- मुद्रा हमेशा भारतीय रुपये (₹) एवं लाखों (LPA) में व्यक्त करें।
- भाषा प्रेरक, वैधानिक रूप से सटीक और भारतीय छात्रों व अभिभावकों के लिए अत्यंत स्पष्ट होनी चाहिए।
`.trim();
  }

  return `
[CRITICAL LANGUAGE MANDATE]
You MUST respond entirely in clear, professional English tailored to Indian students, parents, and educators. 
- Use standard Indian educational terminology (Class 10, Class 12, Stream PCM/PCB/Commerce, JEE, NEET, UPSC, UPPSC).
- Express all monetary figures in Indian Rupees (₹) and Lakhs per Annum (LPA).
- Keep formatting clean, highly structured, and rich with markdown.
`.trim();
}

/**
 * Builds prompt for deep single pathway node explanation.
 */
export function buildNodeExplanationPrompt(
  node: EvaluatedNode,
  input: StudentDecisionInput,
  locale: 'en' | 'hi' = 'en'
): { systemInstruction: string; userPrompt: string } {
  const languageMandate = getLanguageMandate(locale);

  const systemInstruction = `
You are the Chief Indian Career Strategist and Statutory Educational Counselor at PathFinder India.
${languageMandate}

Your role is to provide deep, authoritative, and practical insights on career pathways in India, taking into account state quotas (specifically Uttar Pradesh and national standards), statutory prerequisites, realistic financial ROI, and genuine job market conditions.
`.trim();

  const isHi = locale === 'hi';
  const nodeName = isHi ? node.nameHi : node.nameEn;
  const statusReason = isHi ? node.doorReasonHi : node.doorReasonEn;

  const userPrompt = `
Analyze the following career pathway node for this student profile:

### Student Profile:
- Current Academic Stage: ${input.stage}
- Stream: ${input.class12Stream || 'Not Selected / General'}
- Annual Budget Band: ${input.budgetBand.toUpperCase()}
- Home State: ${input.stateCode || 'UP (Uttar Pradesh)'}
- Earning Urgency: ${input.earningUrgency || 'Standard'}

### Target Pathway Node:
- Pathway Name: ${nodeName} (English: ${node.nameEn})
- Academic Level/Tier: ${node.tier.toUpperCase()} (${node.family.toUpperCase()} Stream)
- Current Eligibility Status: ${node.doorStatus.toUpperCase()}
- Statutory Door Status Reason: "${statusReason}"
- Program Duration: ${node.durationMonths} months
- Estimated Total Cost: ₹${node.costRange.min.toLocaleString('en-IN')} - ₹${node.costRange.max.toLocaleString('en-IN')} (${node.costRange.type})
- Market Competitiveness: ${node.competitiveness.replace(/_/g, ' ').toUpperCase()}

Please generate a deep, highly structured analysis covering:
1. **Career Role Blueprint & Ground Reality**: What the day-to-day role and actual work entails in the Indian ecosystem.
2. **Statutory Prerequisites & Admission Gateway**: Specific 10th/12th subject eligibility criteria, qualifying exams, and state domicile quota advantages.
3. **Financial ROI & Salary Trajectory**: Realistic starting salary (₹ LPA), 5-year growth horizon, and public vs private sector opportunities.
4. **Immediate 7-Day Action Steps**: 2-3 precise tactical steps the student should execute right now.
5. **Real-Life Inspiration**: A notable Indian personality or role model who achieved success through this route.

Provide a comprehensive, rich response using markdown headings and bullet points.
`.trim();

  return { systemInstruction, userPrompt };
}

/**
 * Builds prompt for deep customized 30-90 day Action Plan protocol.
 */
export function buildActionPlanPrompt(
  nodes: EvaluatedNode[],
  input: StudentDecisionInput,
  locale: 'en' | 'hi' = 'en'
): { systemInstruction: string; userPrompt: string } {
  const languageMandate = getLanguageMandate(locale);

  const systemInstruction = `
You are the Chief Execution Strategist at PathFinder India, specializing in actionable 30-90 day career protocols for Indian students.
${languageMandate}

Generate an exhaustive, realistic, and statutory-compliant Action Plan based on the student's selected milestone pathway and background.
`.trim();

  const isHi = locale === 'hi';
  const pathwayNames = nodes.map(n => isHi ? `${n.nameHi} (${n.nameEn})` : n.nameEn).join(' ➔ ');
  const totalMinCost = nodes.reduce((sum, n) => sum + n.costRange.min, 0);
  const totalMaxCost = nodes.reduce((sum, n) => sum + n.costRange.max, 0);
  const totalMonths = nodes.reduce((sum, n) => sum + n.durationMonths, 0);

  const userPrompt = `
Generate an in-depth 30-90 Day Career Action Protocol for the following selected pathway:

### Student Profile:
- Current Academic Stage: ${input.stage}
- Stream / Background: ${input.class12Stream || 'General'}
- Annual Budget Capacity: ${input.budgetBand.toUpperCase()}
- Home State: ${input.stateCode || 'UP (Uttar Pradesh)'}
- Career Goals: ${input.goals?.join(', ') || 'Professional Growth'}

### Selected Career Route (${nodes.length} Key Milestones):
${pathwayNames}
- Total Cumulative Duration: ~${totalMonths} months (${(totalMonths / 12).toFixed(1)} years)
- Total Estimated Fee Range: ₹${totalMinCost.toLocaleString('en-IN')} - ₹${totalMaxCost.toLocaleString('en-IN')}

Please generate a detailed, granular execution protocol organized into:

### 1. 🎯 Executive Roadmap Summary
Strategic overview of the journey, primary career exit milestones, and key competitive targets.

### 2. 📋 Phase 1: Days 1 – 30 (Statutory Verification & Documentation Lock)
- Exact document procurement (Domicile certificate, Caste/EWS certificates for 85% state quota, Class 10/12 marksheets).
- Prerequisite subject validation against official regulatory brochures.
- Identification of mandatory registration deadlines.

### 3. 📚 Phase 2: Days 31 – 60 (Syllabus Architecture & Exam Preparation Strategy)
- Official syllabus breakdown and high-yield topic prioritization.
- Essential reference material and books (NCERT, PYQ banks, standard author textbooks).
- Notification alert setup on official testing authority portals.
- Mock test schedule and benchmark scoring targets.

### 4. 💰 Phase 3: Days 61 – 90+ (Financial Aid, Scholarships & Zero-Debt Safety Net)
- State scholarship applications (UP Post-Matric / Saksham UP Portal, National Scholarship Portal - NSP).
- Tuition Fee Waiver (TFW) seats and government subsidized college options.
- Contingency backup options if primary cutoffs are missed.

### 5. 🌐 Official Verification Portals & Helplines
List the exact official government authority portals (e.g. NTA, UPSC, UPPSC, AKTU, AICTE) for application and verification.

Make the response rich, thorough, and highly actionable.
`.trim();

  return { systemInstruction, userPrompt };
}

/**
 * Builds prompt for deep multi-dimensional Pathway Comparison Matrix.
 */
export function buildCompareAnalysisPrompt(
  nodes: EvaluatedNode[],
  input: StudentDecisionInput,
  locale: 'en' | 'hi' = 'en'
): { systemInstruction: string; userPrompt: string } {
  const languageMandate = getLanguageMandate(locale);

  const systemInstruction = `
You are the Chief Evaluation Officer at PathFinder India, an expert in educational differential analysis and Indian workforce economics.
${languageMandate}

Provide a rigorous, transparent, and multi-dimensional comparative breakdown of the selected career paths, giving direct verdicts without generic fluff.
`.trim();

  const isHi = locale === 'hi';
  const nodesDetail = nodes.map((node, i) => `
Option ${i + 1}: ${isHi ? node.nameHi : node.nameEn} (${node.nameEn})
- Category/Family: ${node.family} (Tier: ${node.tier})
- Duration: ${node.durationMonths} months
- Cost Range: ₹${node.costRange.min.toLocaleString('en-IN')} - ₹${node.costRange.max.toLocaleString('en-IN')} (${node.costRange.type})
- Competitiveness: ${node.competitiveness}
- Prerequisites Status: ${node.doorStatus} (${isHi ? node.doorReasonHi : node.doorReasonEn})
`).join('\n');

  const userPrompt = `
Conduct an exhaustive comparative analysis of the following career pathways for this student:

### Student Context:
- Academic Stage: ${input.stage}
- Stream: ${input.class12Stream || 'General'}
- Budget Band: ${input.budgetBand.toUpperCase()}
- Home State: ${input.stateCode || 'UP (Uttar Pradesh)'}

### Competing Options to Compare:
${nodesDetail}

Please provide a deep comparative evaluation structured as follows:

### 1. ⚖️ Head-to-Head Multi-Factor Comparison
Compare the options side-by-side across:
- **Preparation Intensity & Drop Year Risk**: Entrance exam difficulty and time required before first earning.
- **Financial Investment vs Return (ROI)**: Total cost vs realistic starting salaries in India (₹ LPA).
- **Market Demand & Saturation**: Job security, government vs private hiring trends, and 5-year outlook.
- **Career Growth Ceiling**: Long-term career peak potential and flexibility to switch domains.

### 2. 🎯 Personalized Student-Profile Fit
Analyze which option best aligns with the student's specific budget (${input.budgetBand}), academic stage (${input.stage}), and home state advantage.

### 3. ⚠️ Critical Gotchas & Hidden Costs
Highlight hidden expenses (e.g. mandatory coaching, exam form fees, private college capitation, bond obligations) and regulatory traps.

### 4. 🏆 Final AI Verdict & Recommended Roadmap
Give an unambiguous, justified verdict:
- **Recommended Primary Route**: Which path the student should commit to and why.
- **Safe Backup Route**: The optimal zero-risk safety net if entrance cutoffs are not met.

Provide a comprehensive, high-depth synthesis using markdown.
`.trim();

  return { systemInstruction, userPrompt };
}
