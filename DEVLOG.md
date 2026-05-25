# DEVLOG

## Day 1 — 2026-05-20

**Hours worked:** 6

### What I did

- Read the Credex assignment carefully and listed the MVP requirements.
- Planned the product around a simple workflow:
  1. user enters AI tools
  2. generate audit
  3. show recommendations + savings
  4. allow sharing
- Created a new Next.js project with:
  - App Router
  - TypeScript
  - Tailwind CSS
- Selected component setup:
  - Radix
  - Nova preset
  - Geist font
- Set up project folder structure:
  - `src/app`
  - `src/components`
  - `src/lib`
  - `src/data`
- Created initial pricing dataset:
  - Cursor
  - ChatGPT
  - Claude
- Built first landing page.
- Built first version of audit form.

### What I learned

- The assignment values product thinking as much as engineering.
- Keeping one clean Next.js codebase is easier than splitting frontend/backend.

### Blockers / what I got stuck on

- Deciding whether to use an LLM API from day 1 or keep recommendations rule-based.
- Understanding best project structure for App Router.

### Plan for tomorrow

- Build audit engine
- Store pricing data
- Submit form and generate results
- Integrate Firebase

---

## Day 2 — 2026-05-21

**Hours worked:** 7

### What I did

- Built first version of audit engine:
  - current spend
  - optimized spend
  - savings
- Expanded pricing data:
  - Cursor
  - ChatGPT
  - Claude
  - Gemini
  - GitHub Copilot
- Integrated Firebase Firestore
- Created:
  - `firebase.ts`
  - `firebase-admin.ts`
- Stored audit documents
- Built dynamic audit page:
  `/audit/[id]`
- Added:
  - seat count
  - monthly spend
  - company info
- Connected form to `/api/audit`
- Built results page:
  - total spend
  - optimized spend
  - recommendation cards
- Added loading state.

### What I learned

- Firebase client + admin SDK must be separated clearly.
- Rule-based pricing recommendations are easier to debug than AI-generated ones.
- Input validation matters a lot when handling multiple tools.

### Blockers

- Form submit reset unexpectedly.
- Numeric fields were hard to edit.

### Fixes

- Controlled form inputs
- Better submit handling

### Plan

- polish UI
- add charts

---

## Day 3 — 2026-05-22

**Hours worked:** 6

### What I did

- Added charts using Recharts:
  - current vs optimized spend
- Integrated Gemini Flash for personalized audit summaries
- Improved results UI:
  - recommendation cards
  - badges
  - savings highlights
- Added:
  - copy share link button
  - audit loading overlay
- Fixed responsive layout:
  - mobile stacking
  - chart sizing
  - buttons

### What I learned

- Small UI alignment issues take longer than expected.
- Good charts improve readability a lot.

### Blockers

- SSR error:
  `window is not defined`

### Fix

- Removed direct `window.innerWidth` usage from chart

### Plan

- backend persistence
- deployment prep

---

## Day 4 — 2026-05-23

**Hours worked:** 7

### What I did

- Added:
  - email capture
  - lead/company info
- Added Resend email integration
- Added public shareable report URL

### What I learned

- Email Gate functionality using Resend.

### Blockers

- Firestore invalid document path
- Firebase analytics warning
- Vercel 500 errors

### Fixes

- corrected Firestore path
- removed analytics from server
- used env-based admin credentials

### Plan

- Gemini summary
- export
- polish

---

## Day 5 — 2026-05-24

**Hours worked:** 6

### What I did

- Improved share button UI
- Updated pricing dataset with more plans:
  - enterprise
  - API
  - additional tiers
- Improved audit engine:
  - avoid fake savings
  - valid plan recommendations
  - better cross-tool alternatives
- Added company name in:
  - results page
  - email

### What I learned

- Pricing logic needs real-world constraints.

### Blockers

- Gemini 503 under heavy load
- html2canvas PDF issue

### Fixes

- fallback summary
- browser print export

### Plan

- final responsiveness
- docs

---

## Day 6 — 2026-05-25

**Hours worked:** 6

### What I did

- Added benchmark mode:
  - spend per developer
  - compare with team averages
- Added fallback summary when Gemini API fails
- Added PDF export
- Final UI polish:
  - responsive charts
  - buttons
  - fonts
  - spacing
- Fixed remaining audit engine edge cases
- Verified deployed app end-to-end
- Wrote docs:
  - README
  - ARCHITECTURE
  - PRICING_DATA
  - PROMPTS
  - USER_INTERVIEWS
  - METRICS
- Final testing:
  - landing page
  - form
  - results
  - Firestore
  - email
  - sharing
  - benchmark
- Testing using Jest
  - Test file creation
  - Github Workflow CI integration

### What I learned

- LLM APIs need graceful fallback.
- End-to-end polish takes as much effort as building MVP.
- Writing documentation forces better architecture thinking.
- Testing the app through JEST and integrating Github Actions


### Overall progress

By end of Day 6:

Working MVP  
Deployed publicly  
Firestore storage  
Gemini summaries  
Email capture  
Benchmark mode  
Shareable audit pages  
Responsive UI  
Documentation
Testing through Jest