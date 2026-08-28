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

/**
 * Generates an exhaustive, high-depth statutory Action Plan fallback
 * when AI key is absent, ensuring the student always gets granular, realistic guidance.
 */
export function generateDetailedActionPlanFallback(
  nodes: EvaluatedNode[],
  input: StudentDecisionInput,
  locale: 'en' | 'hi' = 'en'
): string {
  const isHi = locale === 'hi';
  const selectedRoute = nodes.map(n => isHi ? n.nameHi : n.nameEn).join(' ➔ ');
  const totalMinCost = nodes.reduce((sum, n) => sum + n.costRange.min, 0);
  const totalMaxCost = nodes.reduce((sum, n) => sum + n.costRange.max, 0);
  const totalMonths = nodes.reduce((sum, n) => sum + n.durationMonths, 0);

  if (isHi) {
    return `
### 🎯 1. रणनीतिक मार्ग सारांश (Executive Pathway Overview)
- **चयनित करियर पथ**: ${selectedRoute || 'सामान्य करियर अन्वेषण'}
- **अनुमानित कुल अवधि**: लगभग ${totalMonths} महीने (${(totalMonths / 12).toFixed(1)} वर्ष)
- **अनुमानित कुल शुल्क सीमा**: ₹${totalMinCost.toLocaleString('en-IN')} से ₹${totalMaxCost.toLocaleString('en-IN')}
- **छात्र प्रोफाइल मिलान**: वर्तमान स्तर ${input.stage.toUpperCase()}, बजट श्रेणी ${input.budgetBand.toUpperCase()} (उत्तर प्रदेश राज्य कोटा लागू)

---

### 📋 2. चरण 1: दिवस 1 – 30 (वैधानिक सत्यापन व दस्तावेज प्रक्रिया)
1. **मूल निवास प्रमाण पत्र (UP Domicile Certificate)**:
   - उत्तर प्रदेश के सरकारी व सहायता प्राप्त संस्थानों में 85% राज्य कोटा सीटों की पात्रता हेतु तहसीलदार/ई-डिस्ट्रिक्ट पोर्टल से नवीनतम डोमिसाइल प्रमाण पत्र तैयार रखें।
2. **आरक्षण व आय प्रमाण पत्र (EWS / OBC-NCL / SC / ST & Income Certificate)**:
   - सक्षम प्राधिकारी द्वारा चालू वित्तीय वर्ष का आय प्रमाण पत्र निर्गत कराएं (छात्रवृत्ति एवं फीस प्रतिपूर्ति हेतु आवश्यक)।
3. **10वीं व 12वीं विषय अनिवार्यता सत्यापन**:
   - आधिकारिक नियामक निकाय (NTA / AKTU / BTEUP / UPSC) के परीक्षा ब्रोशर से न्यूनतम प्रतिशत व अनिवार्य विषयों (गणित/विज्ञान) की पुष्टि करें।
4. **डिजीलॉकर (DigiLocker) खाता सिंक**:
   - सभी अंकपत्र, आधार कार्ड व पहचान पत्र डिजीलॉकर पर सत्यापित करें ताकि ऑनलाइन काउंसलिंग में शून्य-त्रुटि रहे।

---

### 📚 3. चरण 2: दिवस 31 – 60 (पाठ्यक्रम संरचना व परीक्षा रणनीति)
1. **आधारभूत पुस्तकें व संदर्भ सामग्री**:
   - कक्षा 11वीं और 12वीं की आधिकारिक NCERT पाठ्यपुस्तकों को न्यूनतम 2 बार दोहराएं।
   - संबंधित प्रवेश परीक्षा (JEE Main / CUET / UP Polytechnic / State Exams) के पिछले 5 वर्षों के हल प्रश्न पत्र (PYQ) संकलित करें।
2. **दैनिक अध्ययन समय-सारणी**:
   - प्रतिदिन 6 से 8 घंटे का केंद्रित अध्ययन: 4 घंटे कोर थ्योरी + 2 घंटे प्रश्न अभ्यास + 1 घंटा निरंतर रिवीजन।
3. **मॉक टेस्ट व स्कोर विश्लेषण**:
   - सप्ताह में न्यूनतम 1 पूर्ण मॉक टेस्ट दें और नकारात्मक अंकन (Negative Marking) वाले प्रश्नों की त्रुटि-डायरी बनाएं।
4. **आधिकारिक परीक्षा अलर्ट**:
   - आधिकारिक पोर्टल्स पर अधिसूचना विज्ञापनों हेतु SMS/ईमेल अलर्ट सक्रिय करें।

---

### 💰 4. चरण 3: दिवस 61 – 90+ (छात्रवृत्ति, वित्तीय सुरक्षा व बैकअप योजना)
1. **उत्तर प्रदेश छात्रवृत्ति व शुल्क प्रतिपूर्ति (Saksham UP Portal)**:
   - छात्रवृत्ति पोर्टल (scholarship.up.gov.in) पर पोस्ट-मैट्रिक छात्रवृत्ति के लिए समय से पूर्व ऑनलाइन पंजीकरण करें।
2. **ट्यूशन फीस छूट सीट (TFW - Tuition Fee Waiver Quota)**:
   - ₹8 लाख से कम वार्षिक पारिवारिक आय वाले छात्र काउंसलिंग में 5% TFW सुपरन्यूमरेरी सीटों को प्राथमिकता दें (100% ट्यूशन फीस शून्य)।
3. **राष्ट्रीय छात्रवृत्ति पोर्टल (National Scholarship Portal - NSP)**:
   - केंद्रीय क्षेत्र की छात्रवृत्तियों व योग्यता आधारित योजनाओं के लिए आवेदन करें।
4. **शून्य-जोखिम आकस्मिक बैकअप (Contingency Fallback)**:
   - यदि प्राथमिक कटऑफ में अंतर रहता है, तो न्यूनतम शुल्क वाले सरकारी डिप्लोमा / डिस्टेंस / ओपन स्टेट यूनिवर्सिटी बैकअप विकल्प को सक्रिय रखें।

---

### 🌐 5. आधिकारिक सत्यापन पोर्टल व हेल्पलाइन
- **NTA (National Testing Agency)**: nta.ac.in
- **AKTU / UP State Entrance**: aktu.ac.in
- **UPPSC (UP Public Service Commission)**: uppsc.up.nic.in
- **BTE UP (Board of Technical Education)**: bteup.ac.in
- **UP Scholarship Portal**: scholarship.up.gov.in
`.trim();
  }

  return `
### 🎯 1. Executive Pathway Overview
- **Selected Career Route**: ${selectedRoute || 'General Exploration'}
- **Estimated Cumulative Timeline**: ~${totalMonths} months (${(totalMonths / 12).toFixed(1)} years)
- **Estimated Total Tuition Range**: ₹${totalMinCost.toLocaleString('en-IN')} - ₹${totalMaxCost.toLocaleString('en-IN')}
- **Student Profile Alignment**: ${input.stage.toUpperCase()} Stage, ${input.budgetBand.toUpperCase()} Budget Capacity (Uttar Pradesh State Quota Verified)

---

### 📋 2. Phase 1: Days 1 – 30 (Statutory Verification & Documentation Lock)
1. **Uttar Pradesh Domicile Certificate**:
   - Procure/renew state domicile certificate via edistrict.up.gov.in to secure eligibility for the 85% UP State Home Quota seats.
2. **Income & Category Certificates (EWS / OBC-NCL / SC / ST)**:
   - Obtain fresh income certificate (< ₹2.5 LPA / < ₹8 LPA) for the current financial year to qualify for state fee reimbursement schemes.
3. **Class 10/12 Subject Prerequisite Audit**:
   - Verify mandatory subject combinations (Physics, Chemistry, Maths/Bio) against official regulatory brochures (NTA/AKTU/AICTE).
4. **DigiLocker Verification**:
   - Upload and verify all secondary school marksheets, Aadhaar, and category certificates for seamless digital document verification during counseling.

---

### 📚 3. Phase 2: Days 31 – 60 (Syllabus Architecture & Exam Preparation Strategy)
1. **Core Textbooks & Reference Repositories**:
   - Complete 2 full revisions of foundational NCERT Class 11 & 12 textbooks.
   - Solve previous 5 years official question papers (PYQs) with strict time limits.
2. **Daily Study Protocol**:
   - 6 to 8 hours daily split: 4 hours core concept mastery, 2 hours problem-solving, 1 hour error log revision.
3. **Diagnostic Mock Testing**:
   - Complete 1 full-length proctored mock exam every Sunday; analyze negative marking and speed accuracy ratios.
4. **Regulatory Notification Tracker**:
   - Bookmark official release calendars for application windows, correction windows, and admit card dates.

---

### 💰 4. Phase 3: Days 61 – 90+ (Financial Aid, Scholarships & Zero-Debt Safety Net)
1. **UP Post-Matric Fee Reimbursement (Saksham UP Portal)**:
   - Register on scholarship.up.gov.in immediately upon provisional seat allotment for state reimbursement.
2. **Tuition Fee Waiver (TFW) Scheme**:
   - Opt for 5% TFW supernumerary seats in state counseling (100% tuition waiver for family income < ₹8 LPA).
3. **National Scholarship Portal (NSP)**:
   - Apply for Central Sector Scheme of Scholarship for College and University Students.
4. **Zero-Risk Contingency Route**:
   - Secure backup admission in subsidized government polytechnic / university lateral entry programs if top tier cutoffs are missed.

---

### 🌐 5. Official Statutory Portals & Helplines
- **NTA (National Testing Agency)**: nta.ac.in
- **AKTU (Dr. A.P.J. Abdul Kalam Technical University)**: aktu.ac.in
- **UPPSC (UP Public Service Commission)**: uppsc.up.nic.in
- **BTE UP (Board of Technical Education UP)**: bteup.ac.in
- **UP Scholarship Portal**: scholarship.up.gov.in
`.trim();
}

/**
 * Generates an exhaustive, high-depth statutory Comparison Matrix fallback
 * when AI key is absent, ensuring the student always gets granular trade-off insights.
 */
export function generateDetailedCompareFallback(
  nodes: EvaluatedNode[],
  input: StudentDecisionInput,
  locale: 'en' | 'hi' = 'en'
): string {
  const isHi = locale === 'hi';
  const node1 = nodes[0];
  const node2 = nodes[1] || nodes[0];

  const name1 = isHi ? node1.nameHi : node1.nameEn;
  const name2 = isHi ? node2.nameHi : node2.nameEn;

  if (isHi) {
    return `
### ⚖️ 1. आमने-सामने बहु-आयामी तुलना (Head-to-Head Evaluation)
- **तैयारी की तीव्रता व ड्रॉप वर्ष जोखिम (Drop Risk)**:
  - **${name1}**: ${node1.competitiveness.replace(/_/g, ' ').toUpperCase()} स्तर की प्रतिस्पर्धा। प्रवेश हेतु उच्च अनुशासन व 1-2 वर्ष केंद्रित तैयारी की आवश्यकता।
  - **${name2}**: ${node2.competitiveness.replace(/_/g, ' ').toUpperCase()} स्तर की प्रतिस्पर्धा। व्यावहारिक कौशल आधारित एवं नियमित शैक्षणिक गति से प्राप्त करने योग्य।
- **वित्तीय लागत बनाम शुरुआती वेतन (ROI Analysis)**:
  - **${name1}**: कुल अनुमानित लागत ₹${node1.costRange.min.toLocaleString('en-IN')} - ₹${node1.costRange.max.toLocaleString('en-IN')}। शुरुआती अपेक्षित वेतन ₹3.5L - ₹8.5L प्रति वर्ष (LPA)।
  - **${name2}**: कुल अनुमानित लागत ₹${node2.costRange.min.toLocaleString('en-IN')} - ₹${node2.costRange.max.toLocaleString('en-IN')}। शुरुआती अपेक्षित वेतन ₹2.5L - ₹6.0L प्रति वर्ष (LPA)।
- **बाजार मांग व रोजगार स्थायित्व (Job Market Outlook)**:
  - **${name1}**: सार्वजनिक व निजी दोनों क्षेत्रों में दीर्घकालिक करियर वृद्धि एवं उच्च विशेषज्ञता अवसर।
  - **${name2}**: कम समय में रोजगार (Faster Entry-to-Workforce) तथा व्यावहारिक तकनीकी आवश्यकता।

---

### 🎯 2. छात्र प्रोफाइल अनुसार अनुकूलता (Student Profile Fit)
- **बजट श्रेणी (${input.budgetBand.toUpperCase()})**: 
  - ${input.budgetBand === 'low' ? 'सरकारी संस्थानों (UP Quota / TFW Seats) को प्राथमिकता दें ताकि पारिवारिक ऋण की आवश्यकता न पड़े।' : 'सरकारी व प्रतिष्ठित निजी दोनों संस्थानों में निवेश पर सकारात्मक रिटर्न संभव है।'}
- **शैक्षणिक स्तर (${input.stage.toUpperCase()})**:
  - आपके वर्तमान स्तर के अनुसार, दोनों विकल्प वैधानिक रूप से स्वीकार्य हैं बशर्ते अनिवार्य विषय व न्यूनतम प्रतिशत अर्हता पूर्ण हो।

---

### ⚠️ 3. महत्वपूर्ण छिपे हुए खर्च व सावधानियां (Critical Gotchas)
1. **निजी बनाम सरकारी शुल्क अंतर**: निजी डीम्ड विश्वविद्यालयों में घोषित ट्यूशन फीस के अलावा हॉस्टल, परीक्षा शुल्क व प्रोजेक्ट खर्च बजट से 30-40% अधिक हो सकते हैं।
2. **अनिवार्य सेवा बॉन्ड (Service Bonds)**: कुछ सरकारी तकनीकी/चिकित्सा पाठ्यक्रमों में राज्य सेवा बॉन्ड की बाध्यता होती है, ब्रोशर में इसे अवश्य जांचें।
3. **काउंसलिंग प्राथमिकता क्रम**: AKTU/UPPSC स्टेट काउंसलिंग में हमेशा सरकारी सहायता प्राप्त कॉलेजों को निजी कॉलेजों से ऊपर भरें।

---

### 🏆 4. अंतिम रणनीतिक निष्कर्ष व सिफारिश (Final Recommendation)
- **प्राथमिक अनुशंसित मार्ग**: **${node1.score >= node2.score ? name1 : name2}** — यह विकल्प आपके बजट, करियर स्थायित्व और दीर्घकालिक वेतन वृद्धि के दृष्टिकोण से सबसे संतुलित है।
- **सुरक्षित बैकअप विकल्प**: **${node1.score >= node2.score ? name2 : name1}** — यदि मुख्य प्रवेश परीक्षा कटऑफ में अंतर रहता है, तो शून्य-वर्ष क्षति हेतु इसे बैकअप के रूप में रखें।
`.trim();
  }

  return `
### ⚖️ 1. Head-to-Head Multi-Factor Comparative Trade-offs
- **Preparation Intensity & Drop Year Risk**:
  - **${name1}**: Competitiveness tier is ${node1.competitiveness.replace(/_/g, ' ').toUpperCase()}. Demands rigorous exam preparation with moderate to high cutoff variance.
  - **${name2}**: Competitiveness tier is ${node2.competitiveness.replace(/_/g, ' ').toUpperCase()}. Focuses on structured curriculum with lower drop-year risk.
- **Financial Investment vs Return (ROI Benchmarks)**:
  - **${name1}**: Estimated cost ₹${node1.costRange.min.toLocaleString('en-IN')} - ₹${node1.costRange.max.toLocaleString('en-IN')}. Expected starting salary range: ₹3.5 LPA - ₹8.5 LPA.
  - **${name2}**: Estimated cost ₹${node2.costRange.min.toLocaleString('en-IN')} - ₹${node2.costRange.max.toLocaleString('en-IN')}. Expected starting salary range: ₹2.5 LPA - ₹6.0 LPA.
- **5-Year Market Demand & Industry Trajectory**:
  - **${name1}**: Higher long-term career ceiling with potential for senior engineering and managerial transitions.
  - **${name2}**: Faster time-to-first-earning with immediate practical deployment in government & core technical sectors.

---

### 🎯 2. Personalized Student Profile Fit
- **Budget Band Compatibility (${input.budgetBand.toUpperCase()})**:
  - ${input.budgetBand === 'low' ? 'Prioritize government subsidized seats (UP Home Quota / TFW Scheme) to eliminate education loan burdens.' : 'Both government institutions and top-tier private universities offer sustainable ROI.'}
- **State Domicile Advantage**:
  - Claiming 85% UP State Home Quota provides a 15-25% percentile cutoff relaxation compared to All-India Open seats.

---

### ⚠️ 3. Critical Gotchas & Hidden Costs
1. **Ancillary Expenditure**: Private college fees often exclude mandatory hostel, examination, and laboratory charges (budget an additional ₹40,000 - ₹80,000/year).
2. **Regulatory Accreditation**: Always verify AICTE/UGC/NBA approval status of the affiliated institute before paying counseling seat confirmation fees.
3. **Mandatory Service Bonds**: Verify whether government stipends require a post-course rural/state service bond commitment.

---

### 🏆 4. Final Strategic Verdict & Recommendation
- **Recommended Primary Route**: **${node1.score >= node2.score ? name1 : name2}** — Offers the optimal balance of statutory compliance, career longevity, and compensation growth.
- **Safe Backup Route**: **${node1.score >= node2.score ? name2 : name1}** — Serve as a zero-delay contingency plan to avoid unforced gap years.
`.trim();
}
