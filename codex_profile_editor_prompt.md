# Codex Prompt — Convert Notes Page into AI “Edit My Profile” Mock Demo

You are editing an existing Vite/React frontend at `localhost:5173/notes`. The current page is a Notes workspace with a left vertical nav, a middle-left assistant prompt area, a central notes canvas, and an empty comments panel on the far right.

## Goal

Replace the existing Notes workspace with an “Edit My Profile” workspace.

It should feel like the same product and color system, but the actual page purpose changes:

- Leftmost vertical navigation stays.
- Middle-left assistant panel becomes a profile-edit instruction panel.
- Main canvas expands from the middle to the far right and replaces the old notes canvas plus empty comments panel.
- Right canvas shows a live, recruiter-facing candidate profile card inspired by the hand-drawn mockup:
  - profile identity
  - education
  - graduation
  - verified skill chips
  - video pitch card
  - metrics
  - proof/project cards
  - endorsements
  - insights / recruiter checklist
- No backend. This is a polished mock demo only.
- Use deterministic mock transformations from a local JSON/object.

## Critical Constraint

Do **not** rewrite the entire app.

Inspect the existing page/component structure first and make the smallest clean changes required to convert only the Notes page. Preserve the current design language, current nav shell, current cream/mint/purple/black style, and current app layout.

Do not create authentication, database calls, API routes, Supabase, or real AI calls.

## Visual Direction

Follow the current screenshot style:

- cream background
- soft paper canvas
- black typography
- muted gray helper text
- mint action buttons
- purple assistant/avatar accents
- rounded cards
- soft shadows
- thin borders
- calm SaaS / Notion / Apple style
- not neon
- not dark mode
- not cyberpunk

Use this palette unless equivalent CSS variables already exist:

```ts
const profileTheme = {
  background: "#F6F1E7",
  canvas: "#FBFAF5",
  paper: "#FFFFFF",
  ink: "#111111",
  muted: "#8E8B84",
  border: "#E8E1D4",
  mint: "#BFF3EB",
  mintStrong: "#16C7B7",
  purple: "#8B5CF6",
  purpleSoft: "#F1E8FF",
  orange: "#F29E64",
  green: "#2ECC71",
  yellow: "#FFF1A8"
};
```

Typography should remain close to current product. Headings should feel premium and bold. Small section labels can use the current condensed display style already present in the Notes page.

## Layout

Final layout should be:

```txt
| vertical nav | assistant panel | profile canvas stretching to right edge |
```

Remove the old far-right comments column completely.

Suggested dimensions:

- nav: keep existing width
- assistant panel: around 360px to 420px
- main canvas: `flex: 1`
- no empty right column
- full height page
- no horizontal overflow
- main profile canvas scrolls vertically

## Left Vertical Nav

Keep current left vertical navigation visually intact.

Only change the active item from Notes to Profile/Edit Profile if labels exist.

Do not redesign the whole nav.

## Middle-Left Assistant Panel

This becomes the “Aristotle Profile Editor” panel.

Content:

1. Current assistant avatar style stays, but label should be:
   “Who are we tailoring you for?”

2. Instruction card copy:
   “Aristotle edits your candidate profile using mock recruiter signals. Ask for a role, company, or skill focus.”

3. Input bar at bottom:
   Placeholder examples:
   - `Ex: Customize for IBM SDE 1`
   - `Ex: Make it backend focused`
   - `Ex: Frontend-only profile`

4. When the user starts typing or focuses the input, show 3–4 suggestion popups above the input.

Suggestions:
- Customize for IBM SDE 1
- Frontend-only version
- Backend-specific version
- Make me shortlist-ready

When a suggestion is clicked:
- put the full prompt text into the input
- do not apply changes until Enter is pressed

When Enter is pressed:
- run the mock generation sequence
- show animation/progress on the right canvas
- update the profile fields using mock data
- clear or keep input depending on simplest clean implementation

## Main Canvas Header

At top of the canvas replace “NOTES · V1.0 · DRAFT” with:

`PROFILE · V1.0 · MOCK`

Right side buttons:
- `EXPORT`
- `SAVE`
- optional `RESET`

They are mock buttons only. On click they can show a tiny toast such as “Mock export ready” or “Saved locally for demo”.

## Profile Canvas Content

The candidate card should be inspired by the paper sketch but more premium and complete.

Default candidate:

- Name: Veer Vink
- Education: Computer Science · USYD
- Graduation: Dec 2026
- Verified by: Aristotle
- Headline: “Computer Science student building AI products that actually ship.”
- Skill chips: React, TypeScript, Python, CRM, REST APIs, SQL

Top section:

- round avatar/photo upload
- name and identity
- education line
- graduation line
- verified by Aristotle badge
- target role/company pill

Profile photo upload:
- mock only
- clicking upload uses `<input type="file">`
- preview with `URL.createObjectURL`
- no real upload

Video card:

A large rounded rectangle like the hand-drawn sketch:

- center play icon
- text: “Meet Veer.”
- quote: “I build AI products that actually ship.”
- small duration: `0:42`
- left/right tiny arrow buttons as decoration or interactive carousel buttons
- clicking play can toggle a mock overlay text: “Mock video pitch preview”

Metrics row:

- Hackathons: 04
- Projects: 07
- Public repos: 12
- Certifications: 03

Use compact pills/cards.

Proof / project cards:

At least 3 visible cards, responsive grid:

1. Ingen HR  
   Proof-first hiring platform  
   Designed a recruiter-facing platform that turns candidate work into structured proof signals.  
   Skills: React, TypeScript, Product Design

2. Bayjah  
   3D React merchandise portfolio  
   Built a premium portfolio/storefront with custom 3D product interaction and frontend polish.  
   Skills: React, Three.js, UI Engineering

3. Customer CRM Toolkit  
   Backend-focused workflow mock  
   Implemented clean API-style data flows, structured customer records, and lightweight dashboard logic.  
   Skills: Python, SQL, APIs

Endorsements:

- John Doe — Tutor, University of Sydney  
  “Veer is a strong student, takes feedback well, and listens carefully before improving the work.”

- Maya Shah — Project mentor  
  “Clear builder energy. He can connect product requirements with working frontend execution.”

Insights / Recruiter checklist:

Right-side card inside the main canvas, not a separate comments panel.

Show:
- 1 internship offer
- 3 certifications
- 4 verified project proofs
- Backend readiness: growing
- Frontend readiness: strong

Checklist:
- Education: complete
- Technical skills: complete
- Project proof: complete
- Role fit summary: generated
- Interview talking points: generated

## Mock AI Editing Behaviour

Create local data and transformation logic.

There must be no backend.

Suggested implementation:

- `src/data/profileEditorMockData.ts` or `.json`
- `defaultProfile`
- `promptSuggestions`
- `mockTransformations`
- `animationStates`

When Enter is pressed, detect which transformation to use:

```ts
const lower = input.toLowerCase();

if (lower.includes("ibm") || lower.includes("sde 1") || lower.includes("sde1")) {
  apply "ibm-sde1";
} else if (lower.includes("frontend") || lower.includes("react")) {
  apply "frontend-only";
} else if (lower.includes("backend") || lower.includes("api") || lower.includes("python") || lower.includes("sql")) {
  apply "backend-only";
} else {
  apply "graduate-shortlist";
}
```

During mock generation:

- set `isGenerating = true`
- show animated overlay on profile canvas
- cycle through these steps:
  1. Reading profile context
  2. Extracting role signals
  3. Rewriting headline and skills
  4. Updating proof cards
  5. Final recruiter polish
- animate changed fields with a short highlight pulse
- after the animation ends, update the profile state
- set `isGenerating = false`

The update should visually feel like real-time editing:
- skeleton shimmer or translucent overlay
- small “Aristotle is editing…” badge
- cards softly pulse
- changed chips briefly highlight in pale yellow/mint
- profile headline cross-fades

Use Framer Motion if the project already has it. If not, use CSS transitions/keyframes only.

## Required Interaction Details

- Press Enter in input runs transformation.
- Clicking suggestion fills input.
- Input focus shows suggestions.
- Escape hides suggestions.
- Reset button restores default profile.
- Photo upload previews locally.
- Save/export buttons show mock toast.
- No actual server calls.
- No console errors.
- Page remains responsive.

## Components to Create or Refactor

Use existing components if available. Otherwise create:

- `ProfileEditorPage`
- `ProfileAssistantPanel`
- `PromptSuggestionList`
- `ProfileCanvas`
- `CandidateHeroCard`
- `VideoPitchCard`
- `MetricStrip`
- `SkillChip`
- `ProofCard`
- `EndorsementCard`
- `RecruiterInsightsCard`
- `GenerationOverlay`
- `Toast`

Keep files clean and readable.

## Page Copy

Main assistant panel:

Title:
`Who's the role you're tailoring for?`

Instruction card:
`Aristotle edits your candidate profile using mock recruiter signals. Ask for a role, company, or skill focus.`

Input placeholder:
`Ex: Customize for IBM SDE 1`

Canvas header:
`PROFILE · V1.0 · MOCK`

Main profile label:
`Recruiter-ready profile`

Verified line:
`Top skills verified by Aristotle`

Role fit title:
`Role fit summary`

Proof section:
`Verified proof`

Endorsement section:
`Endorsements`

Insights section:
`Recruiter insights`

## Animation Requirements

Make the demo feel impressive.

Minimum animations:

1. Suggestion chips slide/fade above input.
2. On Enter, progress overlay appears on profile canvas.
3. Step label changes every ~700–1000ms.
4. Profile sections pulse/glow subtly while being edited.
5. Updated skill chips animate in.
6. Role-fit summary fades in after generation.
7. Toast appears for Save/Export.

No heavy animations that break readability.

## Responsiveness

Desktop is priority.

For smaller widths:
- assistant panel can narrow
- profile grid becomes one column
- recruiter insights card stacks below proof cards

## Quality Bar

The final result should look like a real product demo for a proof-first hiring/profile editor.

It should not look like a form page.

It should feel like an AI command surface editing a live candidate profile.

## Acceptance Checklist

Before finishing, verify:

- `/notes` no longer shows React Hooks Notes.
- The far-right comments panel is gone.
- The main canvas reaches the right edge.
- The left nav remains visually consistent.
- Suggestions appear above input.
- Clicking suggestions fills the input.
- Pressing Enter runs animation.
- Profile updates after animation.
- IBM, frontend, backend, and generic prompts produce visibly different profile versions.
- Upload photo preview works locally.
- Reset returns to default data.
- Save/export show mock feedback.
- No backend/API calls are introduced.
- No TypeScript errors.
- No console errors.
