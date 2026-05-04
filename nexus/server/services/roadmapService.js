import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import Collection from '../models/Collection.js';
import Roadmap from '../models/Roadmap.js';
import { addMemoryCollection, listMemoryCollections } from './memoryStore.js';
import { generateWithOpenAI } from './openaiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demoRoadmap = JSON.parse(
  readFileSync(path.resolve(__dirname, '../demo/roadmapDemo.json'), 'utf8')
);

const systemPrompt = `You are Aristotle, generating a personalized career roadmap.
Output a LOGICAL TREE STRUCTURE only - no positions, no coordinates. The renderer handles all layout automatically.

OUTPUT SCHEMA:
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
              "difficulty": "Beginner" | "Intermediate" | "Advanced",
              "personalizedNote": "string | null"
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
- Generate 60-100 total spine and branch nodes minimum.

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
- Use the student profile to mark known skills as "optional" style.
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
- Real sources: official docs, MDN, web.dev, freeCodeCamp, Coursera, Andrej Karpathy, 3Blue1Brown, and reputable project docs.

Respond ONLY with valid JSON, no markdown.`;

function extractJson(raw) {
  const input = `${raw || ''}`.trim();

  if (!input) {
    throw new Error('Empty model response');
  }

  try {
    return JSON.parse(input);
  } catch {
    const cleaned = input
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');

      if (start === -1 || end === -1 || end <= start) {
        throw new Error('Response did not contain valid JSON');
      }

      return JSON.parse(cleaned.slice(start, end + 1));
    }
  }
}

function normalizeResource(resource, fallbackIndex) {
  const fallbackUrl = `https://developer.mozilla.org/`;

  return {
    title: resource?.title || `Resource ${fallbackIndex + 1}`,
    url: resource?.url || fallbackUrl
  };
}

function normalizeNode(node, phaseColor, fallbackIndex) {
  const type = node?.type || 'core';

  return {
    id: node?.id || `node-${fallbackIndex + 1}`,
    label: node?.label || `Node ${fallbackIndex + 1}`,
    type,
    color:
      node?.color ||
      (type === 'optional'
        ? '#8b7fd4'
        : type === 'advanced'
          ? '#f59340'
          : phaseColor || '#00b4a0'),
    resources: Array.isArray(node?.resources)
      ? node.resources.map(normalizeResource)
      : [],
    description:
      node?.description ||
      'Build practical understanding and connect this skill to real project work.',
    estimatedHours: Number(node?.estimatedHours || 16),
    status: node?.status || 'pending'
  };
}

function normalizePhase(phase, phaseIndex) {
  const phaseColor = phase?.color || '#00b4a0';

  return {
    id: phase?.id || `phase-${phaseIndex + 1}`,
    label: phase?.label || `Phase ${phaseIndex + 1}`,
    duration: phase?.duration || 'TBD',
    color: phaseColor,
    nodes: Array.isArray(phase?.nodes)
      ? phase.nodes.map((node, nodeIndex) =>
          normalizeNode(node, phaseColor, nodeIndex)
        )
      : []
  };
}

function isGenericBranchTitle(title = '') {
  const text = title.toLowerCase().trim();
  return (
    /^ship (a |an )?.*mini project$/.test(text) ||
    /^add .* to (a )?.*portfolio$/.test(text) ||
    /^(mdn web docs|freecodecamp learn|web\.dev learn)$/.test(text)
  );
}

function dedupePersonalizedNotes(roadmap) {
  const seenNotes = new Set();
  const notedNodes = [];

  const processNode = (node) => {
    if (!node?.personalizedNote) return;

    const note = node.personalizedNote.trim();
    const noteKey = note.toLowerCase();
    const genericNote = /important for .*interviews?|portfolio review|critical for your career/i.test(note);

    if (!note || genericNote || seenNotes.has(noteKey)) {
      node.personalizedNote = null;
      return;
    }

    node.personalizedNote = note;
    seenNotes.add(noteKey);
    notedNodes.push(node);
  };

  (roadmap.sections || []).forEach((section) => {
    (section.spine || []).forEach((spine) => {
      spine.branches = (spine.branches || []).filter((branch) => !isGenericBranchTitle(branch.title));
      processNode(spine);
      spine.branches.forEach(processNode);
    });
  });

  const totalNodes = (roadmap.sections || []).reduce(
    (sum, section) =>
      sum +
      (section.spine || []).reduce((nodeSum, spine) => nodeSum + 1 + (spine.branches || []).length, 0),
    0
  );
  const maxNotes = Math.floor(totalNodes * 0.3);

  notedNodes.slice(maxNotes).forEach((node) => {
    node.personalizedNote = null;
  });

  return roadmap;
}

function normalizeRoadmap(data) {
  if (Array.isArray(data?.sections)) {
    const sections = data.sections
      .filter((section) => section?.id && section?.title)
      .map((section, sectionIndex) => ({
        id: section.id || `section-${sectionIndex + 1}`,
        title: section.title || `Section ${sectionIndex + 1}`,
        spine: Array.isArray(section.spine)
          ? section.spine
              .filter((node) => node?.id && node?.title)
              .map((node, nodeIndex) => ({
                id: node.id || `${section.id || `section-${sectionIndex + 1}`}-topic-${nodeIndex + 1}`,
                title: node.title,
                style: node.style === 'optional' || node.style === 'alternative' ? node.style : 'primary',
                estimatedHours: Number(node.estimatedHours || node.hours || 0) || null,
                difficulty: node.difficulty || null,
                personalizedNote: node.personalizedNote || null,
                branches: Array.isArray(node.branches)
                  ? node.branches
                      .filter((branch) => branch?.id && branch?.title)
                      .filter((branch) => !isGenericBranchTitle(branch.title))
                      .map((branch, branchIndex) => ({
                        id: branch.id || `${node.id || `topic-${nodeIndex + 1}`}-branch-${branchIndex + 1}`,
                        title: branch.title,
                        side: branch.side === 'left' ? 'left' : 'right',
                        style: branch.style === 'optional' ? 'optional' : 'alternative',
                        estimatedHours: Number(branch.estimatedHours || branch.hours || 0) || null,
                        difficulty: branch.difficulty || null,
                        personalizedNote: branch.personalizedNote || null
                      }))
                  : []
              }))
          : [],
        checkpoint: section.checkpoint?.id && section.checkpoint?.title
          ? {
              id: section.checkpoint.id,
              title: section.checkpoint.title
            }
          : null
      }));

    const totalNodes = sections.reduce(
      (sum, section) =>
        sum +
        section.spine.length +
        section.spine.reduce((branchSum, node) => branchSum + node.branches.length, 0) +
        (section.checkpoint ? 1 : 0),
      0
    );

    return dedupePersonalizedNotes({
      id: data.id || 'generated-roadmap',
      title: data.title || demoRoadmap.title,
      subtitle: data.subtitle || data.description || demoRoadmap.description,
      totalNodes: Number(data.totalNodes || totalNodes),
      duration: data.duration || 'Self paced',
      totalHours: Number(data.totalHours || totalNodes * 6),
      personalizationRationale: Array.isArray(data.personalizationRationale)
        ? data.personalizationRationale
        : [],
      checkpoints: Array.isArray(data.checkpoints) ? data.checkpoints : [],
      firstUncompletedNode: data.firstUncompletedNode || sections[0]?.spine?.[0]?.id || null,
      sections,
      content: data.content || {}
    });
  }

  if (Array.isArray(data?.nodes) && Array.isArray(data?.edges)) {
    const nodes = data.nodes
      .filter((node) => node?.id && node?.title)
      .map((node, index) => ({
        id: node.id,
        type: node.type || 'topic',
        title: node.title,
        x: Number(node.x ?? 620),
        y: Number(node.y ?? 100 + index * 120),
        width: Number(node.width || (node.type === 'subtopic' ? 200 : 240)),
        height: Number(node.height || (node.type === 'subtopic' ? 38 : 49)),
        style: node.style || (node.type === 'subtopic' ? 'alternative' : 'primary'),
        personalizedNote: node.personalizedNote || null
      }));
    const nodeIds = new Set(nodes.map((node) => node.id));

    return {
      id: data.id || 'generated-roadmap',
      title: data.title || demoRoadmap.title,
      subtitle: data.subtitle || data.description || demoRoadmap.description,
      totalNodes: Number(data.totalNodes || nodes.filter((node) => node.type !== 'label').length),
      duration: data.duration || 'Self paced',
      totalHours: Number(data.totalHours || nodes.length * 6),
      nodes,
      edges: Array.isArray(data.edges)
        ? data.edges
            .filter((edge) => nodeIds.has(edge?.source) && nodeIds.has(edge?.target))
            .map((edge, index) => ({
              id: edge.id || `e${index + 1}`,
              source: edge.source,
              target: edge.target,
              type: edge.type === 'dashed' ? 'dashed' : 'solid',
              sourceHandle: edge.sourceHandle || 'bottom',
              targetHandle: edge.targetHandle || 'top'
            }))
        : [],
      content: data.content || {}
    };
  }

  return {
    title: data?.title || demoRoadmap.title,
    description: data?.description || demoRoadmap.description,
    phases: Array.isArray(data?.phases)
      ? data.phases.map(normalizePhase)
      : demoRoadmap.phases.map(normalizePhase),
    connections: Array.isArray(data?.connections)
      ? data.connections.map((connection) => ({
          from: connection?.from,
          to: connection?.to,
          type: connection?.type || 'required'
        }))
      : demoRoadmap.connections
  };
}

function getSourcesFromRoadmap(roadmap) {
  if (roadmap.content) {
    return Array.from(
      new Set(
        Object.values(roadmap.content).flatMap((item) => [
          ...(item.freeResources || []),
          ...(item.premiumResources || []),
          ...(item.aiTutor || [])
        ].map((resource) => resource.url).filter((url) => url && url !== 'generated'))
      )
    );
  }

  return Array.from(
    new Set(
      roadmap.phases.flatMap((phase) =>
        phase.nodes.flatMap((node) => node.resources.map((resource) => resource.url))
      )
    )
  );
}

function buildCollectionSummary(roadmap) {
  if (Array.isArray(roadmap.nodes)) {
    return `${roadmap.nodes.filter((node) => node.type !== 'label').length} nodes, ${roadmap.edges?.length || 0} edges`;
  }

  if (Array.isArray(roadmap.sections)) {
    return `${roadmap.sections.length} sections, ${roadmap.totalNodes || roadmap.sections.reduce(
      (sum, section) =>
        sum +
        (section.spine?.length || 0) +
        (section.spine || []).reduce((branchSum, node) => branchSum + (node.branches?.length || 0), 0) +
        (section.checkpoint ? 1 : 0),
      0
    )} nodes`;
  }

  return `${roadmap.phases.length} phases, ${roadmap.phases.reduce(
    (sum, phase) => sum + phase.nodes.length,
    0
  )} nodes`;
}

export async function generateRoadmapData({
  query = 'Full Stack Developer path',
  userId = 'guest',
  profile = {}
} = {}) {
  try {
    const raw = await generateWithOpenAI({
      systemPrompt,
      userPrompt: `STUDENT PROFILE:
${JSON.stringify(profile, null, 2)}

GOAL / REQUEST:
${query}

Generate the personalized roadmap now. Return JSON only.`
    });

    const roadmap = normalizeRoadmap(extractJson(raw));
    const sources = getSourcesFromRoadmap(roadmap);

    if (mongoose.connection.readyState === 1) {
      await Roadmap.create({
        userId,
        title: roadmap.title,
        query,
        data: roadmap,
        source: 'openai',
        tags: ['roadmap', roadmap.title.toLowerCase()]
      });
    }

    return {
      roadmap,
      sources,
      meta: {
        mode: 'live',
        provider: 'openai-gpt-4o-mini',
        agent: 'Aristotle',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    const roadmap = normalizeRoadmap(demoRoadmap);

    return {
      roadmap,
      sources: getSourcesFromRoadmap(roadmap),
      meta: {
        mode: 'demo',
        provider: 'demo',
        agent: 'Aristotle',
        error: error.message,
        timestamp: new Date().toISOString()
      }
    };
  }
}

export async function saveRoadmapCollection({ roadmap, userId = 'guest' }) {
  const normalizedRoadmap = normalizeRoadmap(roadmap || demoRoadmap);
  const payload = {
    userId,
    type: 'roadmap',
    title: normalizedRoadmap.title,
    summary: buildCollectionSummary(normalizedRoadmap),
    tags: ['roadmap', normalizedRoadmap.title.toLowerCase()],
    payload: normalizedRoadmap
  };

  if (mongoose.connection.readyState === 1 && userId !== 'guest') {
    const collection = await Collection.create(payload);

    return {
      id: collection._id.toString(),
      savedAt: collection.createdAt,
      meta: { mode: 'live', provider: 'mongodb' }
    };
  }

  const memoryItem = addMemoryCollection({
    id: `saved-${Date.now()}`,
    ...payload,
    savedAt: new Date().toISOString()
  });

  return {
    id: memoryItem.id,
    savedAt: memoryItem.savedAt,
    meta: { mode: 'demo', provider: 'memory-store' }
  };
}

export async function listRoadmapCollections(userId = 'guest') {
  if (mongoose.connection.readyState === 1 && userId !== 'guest') {
    const items = await Collection.find({
      userId,
      type: 'roadmap'
    })
      .sort({ createdAt: -1 })
      .lean();

    return {
      roadmaps: items.map((item) => ({
        id: item._id.toString(),
        title: item.title,
        summary: item.summary,
        savedAt: item.createdAt,
        roadmap: item.payload
      })),
      meta: { mode: 'live', provider: 'mongodb' }
    };
  }

  const items = listMemoryCollections()
    .filter((item) => item.type === 'roadmap')
    .map((item) => ({
      id: item.id || item._id?.toString(),
      title: item.title,
      summary: item.summary,
      savedAt: item.savedAt,
      roadmap: item.payload
    }));

  return {
    roadmaps: items,
    meta: { mode: 'demo', provider: 'memory-store' }
  };
}

export function getDemoRoadmap() {
  return normalizeRoadmap(demoRoadmap);
}
