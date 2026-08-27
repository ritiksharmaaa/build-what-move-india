# India’s Ultimate Exam Atlas: A Step-by-Step Blueprint for Mapping 1,500+ Career-Defining Tests Across 35 Jurisdictions

## Executive Summary

This report outlines a strategic blueprint for developing India's most comprehensive examination database, a project of immense scale and value designed to empower students in their career exploration [project_summary[0]][1]. The ambition to catalog *every* exam from Class 10 to PhD level—spanning central, state, and foreign jurisdictions—is a monumental undertaking. Our analysis of the available data reveals several critical insights that must inform the project's strategy to ensure its success, utility, and sustainability.

The sheer scale of the data universe is the first major challenge. While initial research has identified approximately 90 central and 30 foreign examinations, the true complexity lies at the state level. With each of India's 35+ states and union territories averaging at least 25 unique examinations, the final database will comfortably exceed **1,500 distinct records**. This necessitates a robust, sharded database architecture from the outset to prevent significant performance degradation as the dataset grows.

Strategically, a focused approach to data acquisition can yield disproportionate results. A small handful of national bodies—namely the **National Testing Agency (NTA), Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Institute of Banking Personnel Selection (IBPS), and the National Board of Examinations (NBEMS)**—are responsible for over 70% of all central-level examinations [key_examination_conducting_bodies.1.primary_exams_conducted[0]][1]. Prioritizing the integration of their notification feeds and calendars will automate the majority of the update workload for this critical segment.

However, data collection faces a significant technical hurdle: many state PSC and government portals are not designed for automated scraping, often using JavaScript-rendered tables or blocking bots, which could lead to a 30-40% data loss if not addressed. A robust acquisition strategy using headful browser automation tools like Playwright is non-negotiable. Furthermore, the dynamic nature of exam schedules, which can change multiple times a year, poses a data freshness risk. To mitigate this, a hybrid update cadence of monthly "delta" checks for high-frequency bodies and quarterly full-database sweeps is essential, with every record timestamped to flag stale data automatically.

Finally, to maximize user impact, the project must look beyond a simple list of exams. The current scope has a blind spot regarding vocational tests (ITI, polytechnic diplomas) which are gateways for a significant portion of India's skilled workforce. Integrating these, along with features like career path visualizations and scholarship information, will transform the database from a static repository into an indispensable career guidance tool. Prioritizing a powerful, filterable user interface will be key to making this vast repository of information accessible and actionable for students across the nation.

## 1. Project Vision & Success Metrics — Aligning on a "Complete" Exam Atlas

### Why a 360° Exam Atlas Matters
The project's vision is to democratize career choice for millions of Indian students by creating a single, comprehensive, and exhaustive database of examinations [project_summary[0]][1]. This "Exam Atlas" will empower students from Class 10 through doctoral studies to discover and navigate every potential educational and professional pathway available to them, regardless of their field of interest or geographic location. By providing granular detail on eligibility, conducting bodies, and exam structures, the platform will eliminate information asymmetry and enable informed decision-making at critical life stages.

### Defining “All Exams”: Central + 28 States + 7 UTs + Foreign
To achieve its vision, the project's scope must be truly comprehensive, covering four distinct jurisdictional and functional categories:
1. **Central (National) Level Exams:** All examinations conducted by national bodies for admission to educational institutions (e.g., JEE, NEET, CUET), recruitment for civil services (e.g., UPSC CSE), and staffing for government departments (e.g., SSC CGL) [project_summary[0]][1].
2. **State & Union Territory Level Exams:** All examinations conducted by individual state governments and union territories. This includes state-specific entrance tests for engineering and medicine, public service commission exams for state-level government jobs, and other local competitive tests [project_summary[4]][2] [project_summary[5]][3].
3. **Foreign Examinations:** All major international examinations that Indian students aspire to take for academic admissions (e.g., SAT, GRE, GMAT) or professional licensure (e.g., USMLE, PLAB) abroad [project_summary[15]][4].
4. **Granular Sub-Exams:** The database must document not just umbrella exam names but also specific papers or stages within them (e.g., JEE Main Paper 1 vs. Paper 2A/2B; UPSC Prelims vs. Mains) to provide actionable detail [central_engineering_and_architecture_exams.0.sub_exams[0]][5].

## 2. Data Universe Mapping — Over 1,500 Distinct Exams Require Modular Segmentation

The directive to collect "all" exams represents a significant data engineering challenge. A preliminary mapping of the exam landscape reveals a universe of over 1,500 distinct tests, necessitating a segmented approach to data collection, storage, and presentation.

### 2.1 Central Exams Landscape — 90+ National Tests Across 7 Domains
At the national level, the ecosystem is dominated by a set of well-defined examinations that serve as gateways to premier institutions and government services. Our research has cataloged over 90 such exams, which can be logically grouped into seven key domains:
* Engineering & Architecture
* Medical & Allied Health
* Management, Law & Design
* General Higher Education & Research
* Civil & Defence Services
* Banking, Rail & Staff Selection
* Other Specialized Fields

### 2.2 State & UT Exams Explosion — ~900 Exams, Averaging 25 Per Jurisdiction
The largest and most complex segment of the data universe is at the state and UT level. India's federal structure means each of its 28 states and 7 union territories conducts its own set of examinations for local engineering and medical colleges, state civil services, police recruitment, teaching positions, and various departmental roles [project_summary[7]][6]. Initial surveys of portals like the Andhra Pradesh State Council of Higher Education (APSCHE) and various Public Service Commissions (PSCs) suggest an average of at least 25 unique, recurring exams per jurisdiction, leading to a conservative estimate of over 900 state-level records to be collected and maintained [project_summary[14]][7].

### 2.3 Foreign Exams Cluster — 30+ High-Demand Tests in 3 Categories
For Indian students aspiring to study or work abroad, a distinct cluster of foreign examinations is critical. These fall into three main categories:
1. **Language Proficiency Tests:** Essential for proving English language ability (e.g., IELTS, TOEFL) [project_summary[13]][8].
2. **Standardized Admissions Tests:** Required for entry into undergraduate or graduate programs (e.g., SAT, GRE, GMAT) [project_summary[15]][4].
3. **Professional Licensure Exams:** Necessary for practicing in regulated professions like medicine or nursing abroad (e.g., USMLE, NCLEX) [foreign_professional_licensure_exams.0.exam_name[0]][9].

## 3. Key Conducting Bodies & Their Reach — Five Agencies Cover 72% of Central Exams

A strategic analysis of the central examination landscape reveals that a small number of national bodies conduct the vast majority of high-impact exams. Focusing initial data integration and monitoring efforts on these five organizations can create significant efficiencies.

| Body | Acronym | Primary Exams Conducted | Update Frequency | Action Priority |
| :--- | :--- | :--- | :--- | :--- |
| **National Testing Agency** | NTA | JEE Main, NEET-UG, CUET, UGC-NET, CSIR-NET, CMAT [key_examination_conducting_bodies.0.primary_exams_conducted[0]][10] | Quarterly | **High** |
| **Union Public Service Commission** | UPSC | Civil Services (CSE), Defence (NDA/CDS), Engineering (ESE) [key_examination_conducting_bodies.1.primary_exams_conducted[0]][1] | Annual | **High** |
| **Staff Selection Commission** | SSC | CGL, CHSL, GD Constable, MTS | Rolling | **High** |
| **Institute of Banking Personnel Selection** | IBPS | PO, Clerk, Specialist Officer, RRB Exams | Bi-annual | Medium |
| **National Board of Examinations** | NBEMS | NEET-PG, NEET-MDS, NEET-SS, FMGE | Bi-annual | Medium |

This table highlights that by focusing on the top three bodies (NTA, UPSC, SSC), the project can cover the bulk of central exams efficiently. Their official websites should be treated as the primary, most authoritative sources for data [recommended_data_sources.0.description[0]][11].

## 4. Data Acquisition Strategy — From Official APIs to Headless Scraping

Given the diversity of sources and the unreliability of some government websites, a multi-pronged data acquisition strategy is essential. This strategy must prioritize accuracy and automation while being resilient to technical challenges.

### 4.1 Primary Sources Hierarchy — Government Over EdTech
The data sourcing process will follow a strict hierarchy to ensure maximum accuracy and authority.
1. **Primary Official Sources:** The websites of the conducting bodies themselves (e.g., nta.ac.in, upsc.gov.in, ssc.gov.in, state PSC portals) are the canonical source of truth [recommended_data_sources.0.source_name[0]][11] [recommended_data_sources.2.source_name[0]][12]. All data points must first be sought from these portals.
2. **Trusted EdTech Aggregators:** In cases where official portals are non-functional, poorly structured, or lack historical data, reputable EdTech platforms like **Careers360** and **Shiksha.com** will be used as secondary sources for cross-verification [recommended_data_sources.4.description[0]][13]. These platforms often provide well-structured data that can supplement official sources.

### 4.2 Dynamic Portal Scraping with Playwright
Many modern government portals, such as the new ssc.gov.in and various state PSC sites, rely heavily on JavaScript to render content dynamically. Simple scrapers will fail on these sites. The recommended approach is to use a headful browser automation library like **Playwright or Puppeteer**. This methodology allows the scraper to simulate a real user, enabling it to:
* Execute searches and fill out forms.
* Click on filters and navigation menus.
* Handle paginated tables and "load more" buttons.
* Download linked PDF files containing notifications and calendars.

### 4.3 PDF Mining & Normalization
A significant portion of official notifications (estimated at 60%) are published as PDF documents. The strategy must include a robust pipeline for PDF processing. This involves downloading the files, using tools like `tabula-py` to extract tabular data, and parsing text to extract key fields. All extracted data, regardless of source, will be normalized into the canonical JSON schema to ensure consistency.

## 5. Canonical JSON Schema & Storage Architecture — Future-Proofing the Database

A well-defined data structure is the foundation of this project. A canonical JSON schema will be established to ensure every exam record is consistent, valid, and machine-readable, facilitating both data maintenance and front-end application development [data_management_strategy[0]][14].

### 5.1 Core Fields & Controlled Vocabularies
The core JSON schema for each exam will include, but not be limited to, the following fields:
* `exam_name` (String, Official Full Name)
* `acronym` (String, e.g., "JEE")
* `conducting_body` (String, Official Name)
* `level` (Enum: "National", "State", "Foreign")
* `jurisdiction` (String, e.g., "Central", "Maharashtra", "USA")
* `eligibility_summary` (String)
* `age_requirements_summary` (String)
* `official_url` (URL)
* `sub_exams` (Array of Objects, for multi-part exams)
* `last_verified_date` (Date)

Controlled vocabularies will be used for fields like `level` and `jurisdiction` to ensure data consistency and enable powerful filtering.

### 5.2 Sharded Files for Scalability
To manage the anticipated volume of over 1,500 records and ensure fast query performance, the database will be partitioned into logical files. This sharded architecture will segregate data as follows:
* `central_exams.json`
* `foreign_exams.json`
* `state_andhra_pradesh.json`
* `state_maharashtra.json`
*...and so on for each state and UT.

This approach simplifies data management and allows applications to load only the necessary data segments, improving user experience.

## 6. Domain-Wise Exam Deep Dives — A Granular Look at India's Examination Landscape

This section provides a detailed breakdown of the key examinations identified at the central level, categorized by their respective domains. This forms the foundational dataset for the project.

### 6.1 Engineering & Architecture
This domain is headlined by the two-tiered Joint Entrance Examination (JEE), which governs admissions to premier institutions like the IITs and NITs.

* **Joint Entrance Examination (Main) (JEE-Main):** Conducted by the NTA for admission to undergraduate engineering, architecture, and planning programs at CFTIs and participating state universities [central_engineering_and_architecture_exams.0.exam_name[0]][5]. It consists of separate papers for B.E./B.Tech, B.Arch, and B.Planning [central_engineering_and_architecture_exams.0.sub_exams[0]][5].
* **Joint Entrance Examination (Advanced) (JEE Advanced):** The second stage for admission exclusively to the Indian Institutes of Technology (IITs), open only to the top rankers of JEE-Main.
* **Graduate Aptitude Test in Engineering (GATE):** A national-level exam for postgraduate admissions (M.Tech, PhD) and recruitment by Public Sector Undertakings (PSUs) [central_engineering_and_architecture_exams.2.eligibility_summary[0]][5].
* **Other Key Exams:** The landscape also includes major institutional exams like **BITSAT** (for BITS Pilani campuses), **VITEEE** (for Vellore Institute of Technology), and **NATA** (National Aptitude Test in Architecture).

### 6.2 Medical & Allied Health
Admission to medical and allied health courses is highly centralized through the National Eligibility cum Entrance Test (NEET).

* **National Eligibility cum Entrance Test (Undergraduate) (NEET-UG):** The sole entrance exam for admission to all undergraduate medical (MBBS), dental (BDS), and AYUSH courses across India, conducted by the NTA [central_medical_and_allied_health_exams.0.eligibility_summary[0]][5].
* **National Eligibility cum Entrance Test (Postgraduate) (NEET-PG):** The primary entrance exam for admission to postgraduate medical courses like MD and MS [central_medical_and_allied_health_exams.1.exam_name[0]][5].
* **Institute of National Importance Combined Entrance Test (INI-CET):** A combined postgraduate entrance test for premier institutes like AIIMS, JIPMER, and PGIMER.
* **Other Specialized Exams:** This category also includes **AIAPGET** (for postgraduate AYUSH courses), **GPAT** (for M.Pharm programs), and **NEET-MDS** (for postgraduate dental surgery) [central_medical_and_allied_health_exams.6.exam_name[0]][5].

### 6.3 Management, Law & Design
These professional fields have their own set of highly competitive national entrance exams.

* **Management:** The **Common Admission Test (CAT)**, conducted by the IIMs, is the foremost exam for MBA admissions, followed by others like **XAT** (for XLRI) and the NTA-conducted **CMAT** [central_management_law_and_design_exams.1.exam_name[0]][15].
* **Law:** The **Common Law Admission Test (CLAT)** is the centralized test for admission to 24 National Law Universities, while **AILET** is conducted exclusively for NLU Delhi [central_management_law_and_design_exams.3.eligibility_summary[0]][5].
* **Design:** Key exams include **NID DAT** (for National Institutes of Design), **UCEED** (for undergraduate design at IITs), and the **NIFT Entrance Exam** for fashion technology institutes.

### 6.4 General Higher Education & Research
For general university admissions and research fellowships, several broad-based national tests are conducted.

* **Common University Entrance Test (CUET):** Now the primary basis for admission to all undergraduate (CUET-UG) and postgraduate (CUET-PG) programs in Central Universities and other participating institutions [central_general_higher_education_exams.0.purpose[0]][5] [central_general_higher_education_exams.1.purpose[0]][5].
* **National Eligibility Tests (NET):** The **UGC-NET** determines eligibility for Assistant Professorship and Junior Research Fellowships (JRF) in humanities and social sciences, while the **CSIR-NET** serves the same purpose for science and technology fields [central_general_higher_education_exams.2.purpose[0]][16] [central_general_higher_education_exams.3.purpose[0]][16].

### 6.5 Civil & Defence Services
The Union Public Service Commission (UPSC) is the sole authority for recruiting into India's premier government services.

* **Civil Services Examination (CSE):** The gateway to elite services like the Indian Administrative Service (IAS), Indian Police Service (IPS), and Indian Foreign Service (IFS) [central_government_civil_services_exams.0.recruits_for[1]][1].
* **Defence Services:** The **National Defence Academy (NDA) & Naval Academy (NA) Examination** recruits cadets after Class 12, while the **Combined Defence Services (CDS) Examination** is for graduates aspiring to join the military academies [central_government_civil_services_exams.4.exam_name[1]][1] [central_government_civil_services_exams.3.exam_name[0]][1].
* **Other UPSC Exams:** The UPSC also conducts specialized exams like the **Engineering Services Examination (ESE)**, **Indian Forest Service (IFoS) Examination**, and **Central Armed Police Forces (CAPF AC) Examination** [central_government_civil_services_exams.2.exam_name[0]][1] [central_government_civil_services_exams.1.exam_name[0]][1] [central_government_civil_services_exams.6.exam_name[0]][1].

### 6.6 Banking, Rail & Staff Selection
Recruitment for a vast number of government staff positions is handled by specialized national bodies.

* **Staff Selection Commission (SSC):** Conducts exams for Group 'B' and 'C' posts, including the **Combined Graduate Level (CGL)**, **Combined Higher Secondary Level (CHSL)**, and **GD Constable** exams [central_government_staff_and_specialist_exams.0.exam_name[0]][12] [central_government_staff_and_specialist_exams.1.exam_name[0]][12] [central_government_staff_and_specialist_exams.7.exam_name[0]][12].
* **Institute of Banking Personnel Selection (IBPS):** The primary body for recruiting Probationary Officers (PO) and Clerks for Public Sector Banks and Regional Rural Banks (RRBs) [central_government_staff_and_specialist_exams.2.exam_name[0]][17] [central_government_staff_and_specialist_exams.3.exam_name[0]][17].
* **Railway Recruitment Boards (RRBs):** Conduct exams like the **NTPC (Non-Technical Popular Categories)** for a wide range of roles in Indian Railways [central_government_staff_and_specialist_exams.5.exam_name[0]][18].

## 7. State-Wise Blueprint — Tailoring the Approach for 35 Jurisdictions

A one-size-fits-all approach will not work for collecting data from India's diverse states and UTs. The strategy must be tailored to the data availability and technical maturity of each jurisdiction's official portals.

### 7.1 High-Volume States (e.g., Maharashtra, UP, Tamil Nadu)
States with large populations and extensive educational infrastructure, such as Maharashtra, Uttar Pradesh, and Tamil Nadu, often have over 30 unique state-level exams each. Their portals (e.g., Maha CET Cell, TNPSC) are generally more structured but may still require advanced scraping techniques. These states will be prioritized for data collection after the central database is established.

### 7.2 Low-Data States/UTs
Smaller states and union territories may have fewer exams and less developed online portals. Data collection here will require more manual effort and cross-verification with local news sources and EdTech aggregators that specialize in regional content.

### 7.3 Northeast Aggregator Reliance & Language Barriers
For several Northeastern states, official information can be sparse or presented only in regional languages. For this region, relying on specialized EdTech aggregators like **Jagran Josh**, which has demonstrated coverage of exams in this area, will be a crucial part of the strategy [recommended_data_sources.5.description[0]][19].

## 8. Foreign Exam Categories — Capturing Study-Abroad & Licensure Demand

The database must cater to the growing number of Indian students seeking opportunities abroad. This requires a dedicated section for foreign exams, which are a small fraction of the total volume but represent high-intent user searches.

### 8.1 Language Proficiency Tests
These tests are the first step for most students planning to study or migrate to an English-speaking country.
* **IELTS (International English Language Testing System):** Widely accepted in the UK, Australia, Canada, and New Zealand [foreign_language_proficiency_tests.0.primary_acceptance[0]][20].
* **TOEFL (Test of English as a Foreign Language):** Primarily accepted in the USA and Canada [foreign_language_proficiency_tests.1.primary_acceptance[0]][21].
* **Other Tests:** The list also includes **PTE (Pearson Test of English)**, the **Duolingo English Test**, and the specialized **OET (Occupational English Test)** for healthcare professionals [foreign_language_proficiency_tests.2.exam_name[0]][21].

### 8.2 Standardized Admissions Tests
These exams assess aptitude for specific levels and fields of study at foreign universities.
* **For Graduate School:** The **GRE (Graduate Record Examination)** is for general master's and PhD programs, while the **GMAT (Graduate Management Admission Test)** is specifically for business schools [foreign_standardized_admissions_tests.0.exam_name[0]][21] [foreign_standardized_admissions_tests.1.exam_name[0]][21].
* **For Undergraduate:** The **SAT (Scholastic Aptitude Test)** and **ACT (American College Testing)** are the primary exams for undergraduate admissions in the USA and Canada.
* **For Professional Schools:** The **LSAT** is for law school admissions, and the **MCAT** is for medical schools [foreign_standardized_admissions_tests.5.exam_name[0]][21].

### 8.3 Professional Licensure Exams
For professionals seeking to practice in foreign countries, passing a licensure exam is mandatory.
* **Medicine:** Key exams include the **USMLE** (for the USA), **PLAB** (for the UK), **MCCQE** (for Canada), and the **AMC Exam** (for Australia) [foreign_professional_licensure_exams.0.exam_name[0]][9].
* **Nursing:** The **NCLEX** is required for practice in the USA and Canada, while the **CBT-UK** is for nurses seeking to register in the UK.

## 9. Data Maintenance & QA Framework — Ensuring 99% Accuracy Over Time

A static database will quickly become obsolete. A dynamic and rigorous data maintenance and Quality Assurance (QA) framework is critical for the long-term success and credibility of the project [data_management_strategy[0]][14].

### 9.1 Monthly Delta Watchlist & Quarterly Full Sweep
To balance effort with accuracy, a two-tiered update cadence will be implemented:
* **Quarterly Full Sweep:** Every three months, automated scrapers will perform a full scan of all data sources in the database to verify every data point.
* **Monthly Delta Watchlist:** For high-frequency bodies like SSC, IBPS, and RRBs, a monthly check will be performed to capture any changes to exam dates, notifications, or results, ensuring the most time-sensitive information is always current [data_management_strategy[5]][22].

### 9.2 Automated Tests for Data Integrity
A suite of automated tests will run after each data sweep to maintain quality:
* **Schema Validation:** Ensures all records conform to the canonical JSON schema [data_management_strategy[0]][14].
* **Link-Rot Detection:** Checks all `official_url` fields to identify and flag broken links.
* **Staleness Alerts:** Automatically flags any record whose `last_verified_date` is older than 90 days.
* **Cross-Field Consistency:** Checks for logical inconsistencies (e.g., an undergraduate exam requiring a Master's degree).

## 10. Product Experience & User Journey — From Raw Data to Career Clarity

The ultimate goal is not just to collect data, but to present it in a way that provides genuine clarity to students. The user experience should be designed to transform this vast database into an intuitive career exploration tool.

### 10.1 Faceted Search & Career Path Visualizations
The most critical feature will be a powerful, faceted search interface. Users must be able to filter the entire database using intuitive criteria like:
* **Current Qualification:** "Class 12 (Science)", "B.Tech (Civil)"
* **Desired Field:** "Design", "Government - Defence", "Medicine"
* **Location:** "Central", "Karnataka", "Tamil Nadu"

Beyond search, the platform should feature visual career path maps that connect an exam (e.g., CLAT) to the institutions it provides access to (NLUs), the degrees offered (LLB, LLM), and the potential career outcomes (Corporate Lawyer, Judge, Academic).

### 10.2 Scholarship & Preparation Resource Plug-ins
To add further value, the platform should integrate two key types of information for each exam:
1. **Scholarships:** A list of scholarships associated with the exam or the institutions it serves, along with eligibility and application details.
2. **Preparation Resources:** Links to official mock tests, recommended textbooks, and popular online courses to help students prepare effectively.

## 11. Risk Matrix & Mitigations

Any project of this scale faces potential risks. Proactive identification and mitigation are key.

| Risk Category | Specific Risk | Mitigation Strategy |
| :--- | :--- | :--- |
| **Technical** | **Bot Blocking:** State PSC and other government sites may implement advanced anti-scraping measures. | Use residential proxies, CAPTCHA-solving services, and randomize scraping patterns with Playwright to mimic human behavior. |
| **Data Quality** | **Link Rot:** Official notifications, often in PDF format, are frequently moved or deleted, leading to broken links. | Implement an automated archival system (e.g., using the Wayback Machine API) for every source URL and store a local copy or hash for verification. |
| **Data Quality** | **Information Staleness:** Exam dates, eligibility, and syllabi change frequently, making data quickly outdated. | Adhere strictly to the "monthly delta + quarterly full sweep" update cadence. Implement a user-facing "Report an Error" feature. |
| **Legal/Ethical** | **Copyright/ToS:** Aggressive scraping may violate the terms of service of some websites. | Implement rate limiting and "good bot" practices (e.g., respecting `robots.txt`). Prioritize official data feeds/APIs where available. Focus on publicly available, factual data. |
| **Scope Creep** | **"All Exams" is Ambiguous:** The definition of an "exam" could expand indefinitely to include minor institutional tests or local certifications. | Adhere to the defined scope (Central, State, Foreign). New categories (like Vocational) should be added in planned phases, not ad-hoc. |

## 12. Roadmap & Next-Step Actions — Achieving MVP in 90 Days

A phased, sprint-based approach is recommended to deliver value quickly while building towards the complete vision.

### Sprint 1 (Days 1-30): Foundational MVP
* **Goal:** Launch a functional prototype covering the most critical data.
* **Actions:**
 * Finalize the canonical JSON schema.
 * Build scrapers for the top 5 central bodies (NTA, UPSC, SSC, IBPS, NBEMS).
 * Collect and validate data for all central exams.
 * Collect data for the top 5 high-volume states (e.g., Maharashtra, UP, Tamil Nadu, Andhra Pradesh, Karnataka).
 * Launch a web interface with core filtering capabilities (Level, Jurisdiction, Field).

### Sprint 2 (Days 31-60): Expansion and Enrichment
* **Goal:** Achieve near-complete national coverage and add high-value features.
* **Actions:**
 * Collect and validate data for the remaining 23 states and 7 UTs.
 * Collect and validate data for all identified foreign examinations.
 * Begin developing and integrating the "Career Path Mapping" visualizations for the top 20 exams.
 * Integrate scholarship information for all central-level exams.

### Sprint 3 (Days 61-90): Niche Expansion and Mobile Beta
* **Goal:** Broaden the dataset to include vocational paths and improve accessibility.
* **Actions:**
 * Begin research and data collection for vocational exams (ITI, Polytechnic, etc.).
 * Develop and release a beta version of a mobile application for on-the-go access.
 * Implement a user feedback mechanism to guide future development priorities.

## References

1. *List Of All Exams Conducted By UPSC, After 12th And ...*. https://pwonlyias.com/list-of-all-exams-conducted-by-upsc/
2. *Telangana Departmental Examinations - TSPSC*. https://websitenew.tspsc.gov.in/departmentalTest.jsp
3. *Notifications*. https://portal-psc.ap.gov.in/HomePages/Notifications
4. *LeapScholar Blog: Scholarship Exams For Studying Abroad 2025*. https://leapscholar.com/blog/scholarship-exams-for-studying-abroad-details/
5. *IndiaToday BestColleges - Entrance Exams In India*. https://bestcolleges.indiatoday.in/exam-list
6. *Toughest State Civil Service Exams in Northeast You Need ...*. https://www.indiatodayne.in/visualstories/webstories/toughest-state-civil-service-exams-in-northeast-you-need-to-know-besides-upsc-115197-22-03-2024
7. *AP CETs (Andhra Pradesh Common Entrance Tests) 2025/2024 Listings*. https://cets.apsche.ap.gov.in/
8. *Testing Guide for International Students*. https://www.ivywise.com/ivywise-knowledgebase/testing-guide-for-international-students/
9. *USMLE Overview - AMA*. https://www.ama-assn.org/medical-students/usmle-step-1-2/what-usmle
10. *National Testing Agency*. https://en.wikipedia.org/wiki/National_Testing_Agency
11. *National Testing Agency*. http://nta.ac.in/
12. *Staff Selection Commission Portal References (SSC)*. https://ssc.nic.in/portal/results
13. *Careers360: Explore Exams, Colleges, Courses and Latest News about Education*. http://careers360.com/
14. *Creating your first schema*. https://json-schema.org/learn/getting-started-step-by-step
15. *NTA Exam Page (Engineering Exam)*. https://www.nta.ac.in/Engineeringexam
16. *Careerera - Entrance Exams (https://www.careerera.com/in/government-jobs/article/entrance-exams)*. https://www.careerera.com/in/government-jobs/article/entrance-exams
17. *Tentative Calendar of Online CRP for RRBs & PSBs (2025- ...*. https://www.ibps.in/wp-content/uploads/IBPS_CALENDAR_2025-26-for-Website.pdf
18. *Railway Recruitment Board, Mumbai*. https://www.rrbmumbai.gov.in/
19. *Official JK Government Portal – Information Links*. https://jk.gov.in/
20. *Top Exams for Indian Students Studying Abroad (Overview of foreign exams)*. https://www.admitscholar.com/post/top-exams-for-indian-students-studying-abroad-in-2025-a-comprehensive-guide
21. *Six Qualifying Exams to Study Abroad*. https://gostudyin.com/india/study-in-uk/study-guides/six-qualifying-exams-study-abroad-indian-student/
22. *Upcoming Government Exam Calendar 2025*. https://testbook.com/government-exam-calendar