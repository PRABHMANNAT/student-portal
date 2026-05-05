# Antigravity IDE Agent Prompt — Fix Columbus Search UI, Left Rail Sizing, Animation, and Mock Data

You are editing an existing React/Vite frontend experience for a product section that behaves like an AI job-search workspace named **Columbus**.

The current screen has three primary areas:

1. **Left vertical navigation**
2. **Left assistant / prompt rail**
3. **Main artifact area** for job results and selected job details

The current implementation has several UI and UX issues that need to be fixed.

---

## Main Goal

Refactor this experience so it feels **world-class, premium, deliberate, and production-grade**.

The final result should feel like:
- a premium AI recruiter / job discovery workspace
- calm and elegant
- minimal but highly intentional
- strong typography
- clean cards
- better information hierarchy
- much better motion design
- much better use of space
- richer, more believable mock data
- polished, recruiter-quality interaction design

This is still a **frontend mock demo only**.

### Important constraint
- **Do not add a backend**
- **Do not add real APIs**
- **Do not introduce database logic**
- **Do not call real search endpoints**
- **Use local mock data and state-driven behavior only**
- Keep implementation clean and realistic

---

# Problems to Fix

## 1. Left assistant section sizing is off
The current left section feels awkward:
- too narrow in some places
- spacing feels uneven
- internal elements feel cramped
- the scroll region is ugly
- the input bar feels detached
- the empty state is not premium
- the conversation bubbles and avatar placements are not as refined as they should be

### Fix this by:
- making the assistant rail a clearly defined premium panel
- giving it a better width and proportion
- improving spacing and layout rhythm
- making it feel like a real AI control surface, not a rough sidebar

### Suggested sizing
Desktop:
- left vertical nav: keep compact, approx `88px`
- assistant rail: `360px` to `400px`
- main content: remaining width

Large desktop:
- assistant rail can grow up to `420px` if layout supports it

Tablet:
- assistant rail can reduce to around `320px`

Mobile:
- stack appropriately or use a drawer/section-first layout if needed

### Layout structure
Use:
```txt
| nav | columbus rail | main artifact content |
```

The assistant rail should be visually distinct with:
- subtle right divider
- warm off-white surface
- soft shadow or depth separation
- clearer internal zones

---

## 2. Fix the left rail visual structure

The left rail should have these zones:

### Top zone
- Columbus avatar / orb / identity mark
- small green active dot
- thin divider line
- heading:
  `Who's the one you're searching for?`

### Middle zone
Scrollable conversation transcript:
- assistant messages
- user messages
- tool/search status messages
- suggestion prompts
- loading/search states

### Bottom zone
Sticky input composer:
- rounded input
- subtle shadow
- placeholder text
- send button integrated elegantly
- optional quick suggestion chips above the composer

### Improve the scroll area
The current scroll bar feels ugly and default-like.

Create a cleaner custom scroll experience:
- thinner scrollbar
- softer track
- matching theme
- elegant thumb
- only visible strongly on hover if easy to implement

---

## 3. Upgrade Columbus “searching / thinking” animation to a world-class animation

This is the biggest UX improvement required.

The current loading/search/thinking visuals are not good enough.

I want a premium **AI search orchestration animation** that feels like a real product.

## Requirements for Columbus animation

Create a beautiful state-driven animation system for Columbus with at least these states:

### A. Idle
Shown when nothing is happening.
- gentle breathing pulse on Columbus orb
- soft glow halo
- active green status dot lightly pulsing
- subtle ambient motion, not distracting

### B. Listening / input ready
When input is focused:
- soft ring glow
- tiny motion emphasis on the input composer
- suggestion chips animate in smoothly

### C. Searching the web
When the user submits a query:
- Columbus orb transitions into an active search state
- dots/orbiting particles move with intent
- small scanning sweep or radial scan effect
- assistant transcript shows staged search messages
- artifact area shows skeleton states or search preparation states

### D. Thinking / synthesizing
This should be the strongest animation moment.

Do **not** use a generic spinner.

Instead create something like:
- orbiting dots
- flowing node connections
- path drawing
- softly animated “signal routing”
- tiny card fragments appearing and fading
- elegant pulse waves
- sequential progress labels

This animation should feel like:
- "AI is collecting signals, ranking results, and assembling output"

### E. Results ready
When results load:
- animation resolves smoothly
- cards enter with stagger
- selected job panel fades/slides in
- progress state disappears elegantly
- transcript updates with final summary

---

## 4. Use better iconography for job search states and cards

The current job/search icons need improvement.

Replace rough or generic icons with a clean, cohesive icon system.

## Icon direction
Use icons that feel premium and modern:
- clean stroke icons
- consistent line weight
- slightly rounded geometry
- not overly playful
- not cartoonish
- not random mismatched icons

Use a single icon family if one already exists in the project (for example lucide-react or similar).

### For the left nav
Use clean icons for:
- Home / Overview
- Map / Roadmaps
- Jobs / Columbus
- Notes / Documents
- Saved / Bookmark

### For search states
Use refined icons for:
- search / scan
- briefcase / jobs
- remote / globe
- building / company
- tags / skills
- apply / external link
- saved / bookmark
- match score / signal / fit

### For empty state
Use a polished illustration or icon composition:
- signal node graphic
- graph / search abstraction
- not a low-detail placeholder

---

## 5. Refactor the main Columbus results experience

The main area currently has:
- filters
- heading
- result cards
- selected job detail panel

This should remain, but become much more polished.

### Improve:
- spacing
- grid balance
- card hierarchy
- selected detail panel structure
- readability
- animation when selecting a card
- responsiveness

---

# Design Direction

Preserve the existing product family and current aesthetic:
- light mode only
- cream / warm neutral background
- soft white surfaces
- mint accents
- subtle orange accent for Columbus
- black typography
- muted secondary text
- soft borders
- rounded corners
- premium minimal UI

### Do not make it:
- neon
- dark mode
- cyberpunk
- over-glassy
- cluttered

### Theme suggestion
Use or stay close to:

```ts
const theme = {
  background: "#F5F2EA",
  railSurface: "#F2EEE3",
  canvas: "#FAF9F5",
  card: "#FFFFFF",
  border: "#E8E1D4",
  textPrimary: "#111111",
  textSecondary: "#7C786F",
  mint: "#BFEFE8",
  mintStrong: "#14C8B5",
  orange: "#F39A43",
  orangeSoft: "#FFE5CC",
  purple: "#8D73F6",
  purpleSoft: "#EEE8FF",
  green: "#38C172",
  shadowSoft: "0 16px 40px rgba(19, 18, 14, 0.06)",
  shadowMedium: "0 20px 50px rgba(19, 18, 14, 0.10)"
}
```

---

# Left Rail Detailed Requirements

## Top identity block
Should include:
- Columbus orb/logo
- active status dot
- slim divider
- heading:
  `Who's the one you're searching for?`

Optional helper copy:
`Columbus searches mock job signals and stages recruiter-ready results.`

The Columbus orb should be cleaner and premium:
- circular warm gradient face/orb
- tiny animated dots around perimeter
- soft orange glow
- subtle active-state motion
- green online indicator

---

## Conversation transcript
Use a more premium chat style.

### Assistant messages
- appear left-aligned
- use Columbus mini orb/avatar
- white or warm-white bubble
- subtle shadow
- readable line-height
- consistent padding

### User messages
- right-aligned
- mint-tinted bubble
- slightly stronger emphasis
- clean rounded corners
- consistent max width

### System/search status messages
Style differently:
- smaller utility bubble or event row
- e.g. “Searching the web…”
- “Ranking 20 roles…”
- “Preparing artifact panel…”

Could include tiny inline animated dots.

### Suggested opening flow
Example transcript:
1. Columbus: “What role are you targeting?”
2. User: “Frontend engineer”
3. Columbus: “Remote, hybrid, or on-site?”
4. User: “Remote”
5. Columbus: “Any specific tech stack or industry?”
6. User: “React, TypeScript, SaaS”
7. Columbus: “Searching the web…”
8. Columbus: “I found 20 roles and staged them in the artifact panel. Open a card to inspect fit, requirements, and apply paths.”

---

## Composer
The bottom input area should feel much better.

### Requirements
- sticky bottom
- pill-shaped input shell
- better integrated send button
- placeholder:
  `Ex: Senior Rust Engineer`
- subtle shadow
- better border
- send icon inside circular action button
- on focus, soft mint ring or glow

Optional:
- show quick chips like:
  - Frontend Engineer
  - Backend Engineer
  - Product Analyst
  - ML Intern

---

# World-Class Columbus Animation Spec

## Animation framework
If Framer Motion already exists, use it.
If not, use clean CSS keyframes or SVG animation.
You may also use Lottie only if it is already easy and does not complicate the app.

## Recommended approach
Build a reusable `ColumbusOrb` component with modes:
- `idle`
- `listening`
- `searching`
- `thinking`
- `complete`

### Orb animation details

#### idle
- gentle scale pulse every ~3 seconds
- tiny perimeter dots drifting slightly
- warm glow blur softly breathing

#### listening
- slight tilt or scale-up
- green presence dot pulses
- outer ring brightens
- suggestion chips fade in below

#### searching
- outer dotted ring rotates slowly
- a sweep beam or arc rotates around the circle
- mini floating particles move outward then inward
- subtle “scan” pulse every 1–1.5 seconds

#### thinking
- more layered
- small connected nodes animate around orb
- lines draw and dissolve
- progress label changes below orb:
  - Gathering roles
  - Ranking fit
  - Reading requirements
  - Structuring output
- if easier, show the stage label in transcript/status area instead of under the orb

#### complete
- motion settles
- outer ring slows
- green dot stabilizes
- a soft completion flash or “resolved glow” appears briefly

---

## Artifact panel loading animation
When jobs are being generated:
- show skeleton cards in the results grid
- show a shimmer pass
- animate card placeholders with stagger
- right detail panel can show a premium loading card

When the first result arrives:
- cards fade/slide upward into place
- selected job panel slides in from the right
- transition should feel premium, not abrupt

---

# Main Results Area Requirements

## Header
At the top of the main area:
- filter pills
- strong heading like:
  `COLUMBUS FOUND 20 ROLES`
- active query chips:
  - Frontend Developer
  - 1 year experience
  - Remote
  - React
  - TypeScript
- source row:
  `Sources: RemoteOK · HN Who's Hiring · GitHub Jobs Archive · Adzuna`

Improve spacing and hierarchy.

---

## Job card design
Make cards more refined.

Each card should include:
- company avatar block / initials
- company name
- location or work mode
- time-ago pill
- job title
- skill/attribute tags
- short fit summary
- salary
- apply button
- source attribution

### Card behavior
- hover lift
- stronger shadow on hover
- mint border hint on hover
- selecting card updates right-side detail panel
- selected card may get a subtle accent outline

---

## Job detail panel
The right panel should feel polished and structured.

Sections:
1. Header
2. Tags
3. Role brief
4. Requirements
5. Company details
6. Apply paths
7. Action buttons

### Header
Include:
- company mark
- company name
- role title
- work mode / employment type
- match score badge

### Role brief
Readable paragraph, not cramped

### Requirements
Short bullets or stacked lines

### Company details
Use a 2x2 card grid:
- Industry
- Team
- Location
- Why it matches

### Apply paths
Two clean blocks:
- Direct application
- Team overview / company page

### Actions
Buttons:
- `Open listing`
- `Save to collection`

---

# Mock Data Requirements

Use local mock data in a dedicated file, e.g.

- `src/data/columbusMockData.ts`
or
- `src/data/columbus_mock_data.json`

Include:

## 1. Conversation starter suggestions
```ts
[
  "Frontend engineer",
  "Backend engineer",
  "ML intern",
  "Product analyst"
]
```

## 2. Search stage labels
```ts
[
  "Gathering roles",
  "Ranking fit",
  "Reading requirements",
  "Structuring output"
]
```

## 3. Search transcript mock messages
- assistant messages
- user messages
- status messages

## 4. Filter pills
- All
- Remote
- Full-time
- Internship
- By Company

## 5. Active search chips
- Frontend Developer
- 1 year experience
- Remote
- React
- TypeScript

## 6. Jobs list
At least 8–10 mock jobs with realistic fields:
- id
- company
- company initials
- title
- location/work mode
- employment type
- salary
- postedAt
- tags
- fitSummary
- source
- matchScore
- roleBrief
- requirements
- companyInfo
- applyPaths

Use believable but mock data.

Examples:
- Northstar Labs — Frontend Engineer
- Orbit Commerce — Frontend Developer
- Beacon Cloud — UI Engineer
- Helio AI — Machine Learning Intern
- Stackline Studio — Product Engineer
- VantaFlow — React Engineer
- Alto Systems — Backend Engineer
- Meridian Bio — Data Analyst Intern

## 7. Empty state
Provide mock empty state content too:
- title
- helper text
- icon/illustration label

---

# Implementation Structure

Refactor cleanly. Possible components:

- `ColumbusPage`
- `ColumbusSidebar`
- `ColumbusOrb`
- `ConversationThread`
- `MessageBubble`
- `Composer`
- `ResultsHeader`
- `FilterPills`
- `JobResultsGrid`
- `JobCard`
- `JobDetailPanel`
- `ApplyPathCard`
- `CompanyInfoGrid`
- `LoadingState`
- `EmptyStateIllustration`

Do not overengineer, but do clean this up.

---

# Interaction Requirements

## Search flow
When user presses Enter or clicks send:
1. input is added as user message
2. assistant asks follow-up if needed, OR directly simulates search
3. orb enters `searching`
4. transcript adds search status messages
5. artifact area shows loading state
6. after a short staged delay, results populate
7. first job becomes selected
8. orb resolves to `complete`

## Card selection
- clicking a card updates selected job
- selected card visually changes
- detail panel updates with animation

## Filter behavior
Filtering should work locally:
- All
- Remote
- Full-time
- Internship
- By Company

You can interpret “By Company” as grouping/sorting or filtering view if needed, but keep it simple and visually coherent.

---

# Motion and Animation Quality Bar

The animation work should feel intentional and premium.

## Minimum required motion upgrades
- orb state transitions
- transcript bubbles animate in
- suggestion chips animate in on focus
- loading skeletons shimmer
- cards stagger in
- selected detail panel transitions smoothly
- hover states are polished
- button transitions are subtle and premium

Do **not** use cheesy easing or oversized motion.

---

# Technical Constraints

- Keep existing tech stack
- If project already uses Tailwind, continue using Tailwind
- If project already uses Framer Motion, use it
- Avoid adding unnecessary dependencies
- No backend
- No API calls
- No fake fetch to remote URLs
- No console errors
- No layout overflow
- Responsive and clean

---

# Acceptance Checklist

Before finishing, verify:

- left rail width and layout feel fixed and premium
- left conversation section has better spacing and better scroll behavior
- composer feels integrated and polished
- Columbus orb animation is noticeably upgraded and world-class compared to current state
- search / thinking state is not a generic spinner
- job/search icons are consistent and improved
- mock data is richer and believable
- results area feels more polished
- job detail panel feels premium and structured
- selecting cards works smoothly
- loading state feels intentional
- overall page looks much better than before
- no backend or API calls were introduced

---

# Deliverables

Please implement the UI refactor and include:
1. cleaned and improved Columbus page
2. upgraded animation system
3. richer local mock data
4. clean components
5. no broken layout
6. no TypeScript or runtime issues
