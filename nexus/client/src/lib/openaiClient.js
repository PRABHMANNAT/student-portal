const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

function isConfiguredApiKey(apiKey) {
  return Boolean(apiKey && apiKey !== 'your_key_here' && !apiKey.includes('XXXXXX'));
}

export async function generateRoadmapViaLLM(userPrompt, profile) {
  // TODO: Move to backend proxy before production deploy.
  // Frontend API key exposure is OK for local dev demo only.
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!isConfiguredApiKey(apiKey)) {
    const error = new Error('OpenAI API key not configured');
    error.code = 'OPENAI_API_KEY_MISSING';
    throw error;
  }

  const systemPrompt = buildSystemPrompt();
  let userMessage = buildUserMessage(userPrompt, profile);
  let lastRawJSON = '';

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const rawJSON = await requestRoadmapJSON(apiKey, systemPrompt, userMessage);
    lastRawJSON = rawJSON;

    try {
      return JSON.parse(rawJSON);
    } catch (error) {
      if (attempt === 1) {
        console.error('Failed to parse LLM JSON:', lastRawJSON);
        const parseError = new Error('LLM returned invalid JSON');
        parseError.code = 'OPENAI_INVALID_JSON';
        throw parseError;
      }

      userMessage = `${buildUserMessage(userPrompt, profile)}

The previous response was invalid JSON. Retry once and return ONLY strict JSON with no markdown fences.`;
    }
  }

  throw new Error('LLM returned invalid JSON');
}

async function requestRoadmapJSON(apiKey, systemPrompt, userMessage) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 45000);

  const response = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 12000
    })
  }).finally(() => window.clearTimeout(timeout));

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const rawJSON = data.choices?.[0]?.message?.content;

  if (!rawJSON) {
    throw new Error('OpenAI API returned an empty response');
  }

  return rawJSON;
}

function buildSystemPrompt() {
  return `You are Aristotle, generating a personalized career roadmap. Output a LOGICAL TREE STRUCTURE only - no positions, no coordinates. The renderer handles all layout automatically.

{
  "title": "string (e.g. 'AI/ML Engineer @ OpenAI')",
  "subtitle": "string (one-liner)",
  "totalHours": number,
  "duration": "string (e.g. '12 months')",
  "totalNodes": number,
  "personalizationRationale": [
    "string (3-5 bullet points explaining personalization)"
  ],
  "sections": [
    {
      "id": "kebab-case",
      "title": "Foundations",
      "spine": [
        {
          "id": "kebab-case-unique",
          "title": "Topic Title",
          "style": "primary" | "alternative" | "optional",
          "estimatedHours": number,
          "difficulty": "Beginner" | "Intermediate" | "Advanced",
          "personalizedNote": "string | null (max 80 chars)",
          "branches": [
            {
              "id": "kebab-case-unique",
              "title": "Sub-topic",
              "side": "left" | "right",
              "style": "alternative" | "optional",
              "estimatedHours": number,
              "difficulty": "Beginner" | "Intermediate" | "Advanced"
            }
          ]
        }
      ],
      "checkpoint": {
        "id": "cp-kebab-case",
        "title": "Checkpoint - Foundations Complete"
      }
    }
  ],
  "content": {
    "node-id": {
      "description": "2-3 sentences",
      "freeResources": [
        { "type": "article|video|feed|podcast", "title": "...", "url": "...", "source": "..." }
      ],
      "premiumResources": [
        { "type": "course|book", "title": "...", "url": "...", "source": "...", "discount": "20% Off" | null }
      ]
    }
  },
  "checkpoints": [
    { "id": "cp-kebab-case", "title": "Foundations", "totalTopics": 12, "completedCount": 0 }
  ],
  "firstUncompletedNode": "first-spine-node-id"
}

LAYOUT RULES:
- Each section has 5-10 spine nodes.
- Each spine node has 2-6 branches.
- Do not create nested branches; every branch must be a direct child of exactly one spine node.
- Branches are split between "left" and "right" sides.
- Try to balance: if a node has 6 branches, put 3 left and 3 right.
- Generate 5-7 sections total.
- 60-100 total nodes minimum.

BRANCH UNIQUENESS REQUIREMENT:
Every branch must be a SPECIFIC sub-topic of its parent spine node.
NEVER use generic patterns like:
- "Ship a {topic} mini project"
- "Add {topic} to portfolio"
- "MDN Web Docs"
- "freeCodeCamp Learn"
- "web.dev Learn"
Resources belong in the "content" object as freeResources/premiumResources. Branches must be ACTUAL learning sub-topics.
Correct examples for spine="Programming Fundamentals": Variables & Data Types, Control Flow, Functions & Scope, Error Handling, Async Programming.
Correct examples for spine="API Design": REST Principles, Authentication & JWTs, Rate Limiting, Versioning, OpenAPI / Swagger.
Correct examples for spine="Databases": SQL Fundamentals, Normalization, Indexing & Performance, Transactions & ACID, NoSQL Basics.
If a spine node would have fewer than 3 unique sub-topics, drop it and merge with another. Do NOT pad with generic project, portfolio, or resource nodes.

PERSONALIZATION:
- Use student profile to mark known skills as "optional" style.
- Add personalizedNote on nodes where context matters.
- Reference target companies, weaknesses, and timeline.
- Adjust depth based on yearsOfExperience.
- personalizationRationale must be based on the profile diff versus this roadmap: known skills skipped, weaknesses deepened, target companies emphasized, location/visa constraints, and timeline tradeoffs.

PERSONALIZED NOTE RULES:
- Maximum 30% of nodes should have a personalizedNote.
- Each note must be SPECIFIC to that topic, not generic.
- Notes serve ONE of these purposes ONLY: skip signal, focus signal, company-specific signal, or geographic signal.
- NEVER use the same note text on multiple nodes.
- NEVER write generic notes like "Important for X interviews".
- If a node has nothing genuinely personalized to say, set personalizedNote: null.
Good examples: "Skip basics - your React intern role at Local Startup covers this."; "Atlassian's Forge platform requires solid TypeScript depth."; "You flagged DSA as a weakness - extra reps recommended."; "Canva uses Vue heavily; consider this over React if targeting them."
Bad examples: "Important for Atlassian interviews and portfolio review."; "Important for {company} interviews."; "Critical for your career."

CONTENT:
- Every node ID in spine/branches MUST have an entry in "content".
- 4-6 free resources per node using real URLs.
- 1-2 premium resources per node.
- Real sources: MDN, freeCodeCamp, Coursera, Andrej Karpathy, 3Blue1Brown, official docs, and reputable project docs.

Return ONLY valid JSON.`;
}

function buildUserMessage(userPrompt, profile) {
  return `STUDENT PROFILE:
${JSON.stringify(profile, null, 2)}

GOAL / REQUEST:
${userPrompt}

Generate the personalized roadmap now. Return JSON only.`;
}
