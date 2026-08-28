# PathFinder India - 2-Minute Hackathon Demo Script

**Demo story:** A fictional Class 12 student from Uttar Pradesh wants to become a civil servant, an engineer, and a scientist at ISRO. The student has a low budget and is unsure which first decision keeps the most doors open.

**Recording rule:** Your face must remain visible throughout the video. Use OBS with a webcam source in a small corner overlay while the app remains the main screen.

## Before Recording

- Open the public deployed link in a clean browser window.
- Use only the fictional demo profile and synthetic pathway data.
- Keep your webcam visible in OBS from the first frame to the last frame.
- Keep the independent-prototype disclaimer visible at the beginning or end.
- Do not show an admin panel, database, terminal, API key, government login, or development console.
- Rehearse the exact clicks before recording. The video must be no longer than two minutes.

## Minute 1 - Citizen Journey

### 0:00-0:08 - Introduce the problem

**Screen:** Landing page with your webcam visible in the top-right corner.

**Say:**

> "After Class 12, a student may want to become a civil servant, an engineer, or a scientist at ISRO, but the information is scattered across different education, exam, scholarship, and government-job websites. Students often choose a path without seeing what it opens or closes."

### 0:08-0:18 - Start without sign-up

**Action:** Click `Start Your Journey`. Select `Class 12`, `Uttar Pradesh`, `Low budget`, `Long-term earning`, and `English`.

**Say:**

> "PathFinder starts without forced sign-up. It asks only the information needed to compare routes. This is a fictional profile, so no Aadhaar, marksheet, certificate, phone number, or OTP is required."

### 0:18-0:28 - Select all three goals

**Action:** Select `Civil Services`, `Engineering`, and `Scientist / ISRO`.

**Say:**

> "The student can choose multiple dreams. The system looks for the safest first route that preserves the largest number of future options, instead of blindly giving one career name."

### 0:28-0:40 - Show the route map

**Action:** Submit the form. Point to the three route families on the map:

- Engineering through the relevant science and mathematics route
- Science and research routes leading toward a scientist career
- Graduation followed by Civil Services or UPPSC/state-service preparation

**Say:**

> "The answer is a visual route map. It shows the next subject or education step, future degrees, exams, government routes, Uttar Pradesh options, estimated cost, time to earning, and fallback choices."

### 0:40-0:50 - Demonstrate the important choice

**Action:** Remove Mathematics from the current subject selection using the visible control.

**Say:**

> "Now we change one important decision. The graph recalculates immediately. Mathematics may be required or strongly useful for some engineering, physics, technical, and research routes, so those connections change state. The student can see the consequence before making the decision."

### 0:50-0:57 - Show green and red routes

**Action:** Point to the colour legend and open one red or yellow route.

**Say:**

> "Green means available from the current position. Yellow means another requirement is needed. Red means not available from this current combination, not impossible forever. The student sees the recovery route, such as a recognised subject-completion or alternate study route, when one is available."

### 0:57-1:00 - Finish the citizen task

**Action:** Open `Compare`, then `30-Day Action Plan`.

**Say:**

> "The student compares the civil-service, engineering, and scientist routes, sees the cost timeline, and receives practical next actions and official sources to verify."

## Minute 2 - How It Was Built

### 1:00-1:10 - Explain the public-service problem

**Screen:** Show the source drawer while keeping your face visible.

**Say:**

> "This is a redesign of a fragmented public-service journey. NCS, NIOS, NCERT career guidance, scholarship portals, UPSC, and UPPSC each provide useful information, but a student has to connect the pieces alone. PathFinder puts that journey in one simple place. It is an independent prototype, not an official government product."

### 1:10-1:22 - Explain the researched data

**Screen:** Show one route card with its source link.

**Say:**

> "The data is organised as a source-backed graph. Nodes represent Class 12 choices, degrees, exams, careers, jobs, services, and recovery actions. Connections represent progression, requirements, alternatives, and re-entry. Costs are ranges, and every verified claim has a source or a clear estimate label."

### 1:22-1:34 - Explain the live decision effect

**Screen:** Return to the map and change Mathematics or budget again.

**Say:**

> "A deterministic rules engine evaluates the current subjects, goals, state, budget, and urgency. It searches forward and updates the green, yellow, and red routes. This is why the interface visibly changes when the student changes a decision."

### 1:34-1:45 - Explain the AI boundary

**Screen:** Open the AI explanation panel.

**Say:**

> "AI does not invent eligibility or decide the student’s future. It receives the calculated route result and approved source claims, then explains the trade-offs in simple language. Unsupported AI claims are rejected, and a rules-based explanation works even if the AI service is unavailable."

### 1:45-1:54 - Explain safety and mock data

**Screen:** Show the prototype disclaimer or mock-data disclosure.

**Say:**

> "The demo uses synthetic student data and simulated integrations. It does not use live government systems or collect Aadhaar, PAN, certificates, passwords, OTPs, payments, or real marksheets. Requirements and fees can change, so the student is directed to official sources before a final decision."

### 1:54-2:00 - Close with what works

**Screen:** Return to the completed action plan with your webcam still visible.

**Say:**

> "What works today is the complete citizen journey: intake, route calculation, door-impact map, Civil Services versus Engineering versus ISRO scientist comparison, costs, state and national options, recovery routes, sources, AI explanation, and action plan."

## OBS Recording Setup

1. Add `Display Capture` or `Window Capture` for the browser.
2. Add `Video Capture Device` for your webcam.
3. Place the webcam in the top-right corner, large enough to clearly show your face without covering route cards or buttons.
4. Keep the browser as the main content and your face as a persistent picture-in-picture overlay.
5. Record at 1080p if the computer remains smooth; otherwise use 720p.
6. Record microphone audio and check that your voice is clear before the final take.
7. Keep the webcam visible from 0:00 through 2:00. Do not hide it during the technical explanation.
8. Review the final recording for the public link, readable text, visible face, and total duration under two minutes.

## Final Hackathon Checks

- First minute shows a complete citizen journey from start to action plan.
- Second minute explains the data graph, deterministic rules, AI boundary, mock data, and limitations.
- Civil Services, Engineering, and Scientist / ISRO are all selected in the same journey.
- The Mathematics choice visibly changes route availability.
- National and Uttar Pradesh routes are shown together.
- Costs, sources, and recovery paths are visible.
- Your face remains visible for the full recording.
- No live government login, sensitive data, private API, admin panel, or misleading official branding appears.
- The public link opens without requesting access.
