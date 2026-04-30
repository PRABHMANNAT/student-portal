import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import Collection from '../models/Collection.js';
import Roadmap from '../models/Roadmap.js';
import { generateWithAnthropic } from './anthropicService.js';
import { generateWithGroq } from './groqService.js';
import { addMemoryCollection, listMemoryCollections } from './memoryStore.js';
import { generateWithOpenAI } from './openaiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const demoRoadmap = JSON.parse(
  readFileSync(path.resolve(__dirname, '../demo/roadmapDemo.json'), 'utf8')
);

const systemPrompt = `You are Aristotle, a career roadmap expert.
Generate a detailed career roadmap in STRICT JSON format.
Schema: {
  title,
  description,
  phases: [{
    id,
    label,
    duration,
    color,
    nodes: [{
      id,
      label,
      type,
      resources: [{ title, url }],
      description,
      estimatedHours
    }]
  }],
  connections: [{ from, to, type }]
}
For resources, include real URLs from MDN, freeCodeCamp, roadmap.sh, YouTube, Coursera, React docs, Node docs, and other reputable learning sources.
Use colors: teal #00b4a0 for core nodes, purple #8b7fd4 for optional, orange #f59340 for advanced.
Respond ONLY with valid JSON, no markdown.`;

const providerChain = [
  { name: 'claude-sonnet-4-20250514', execute: generateWithAnthropic },
  { name: 'llama3-70b-8192', execute: generateWithGroq },
  { name: 'gpt-4o', execute: generateWithOpenAI }
];

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
  const fallbackUrl = `https://roadmap.sh`;

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

function normalizeRoadmap(data) {
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
  return Array.from(
    new Set(
      roadmap.phases.flatMap((phase) =>
        phase.nodes.flatMap((node) => node.resources.map((resource) => resource.url))
      )
    )
  );
}

function buildCollectionSummary(roadmap) {
  return `${roadmap.phases.length} phases, ${roadmap.phases.reduce(
    (sum, phase) => sum + phase.nodes.length,
    0
  )} nodes`;
}

export async function generateRoadmapData({
  query = 'Full Stack Developer path',
  userId = 'guest'
} = {}) {
  const fallbackChain = [];

  for (const provider of providerChain) {
    try {
      const raw = await provider.execute({
        systemPrompt,
        userPrompt: query
      });

      const roadmap = normalizeRoadmap(extractJson(raw));
      const sources = getSourcesFromRoadmap(roadmap);

      if (mongoose.connection.readyState === 1) {
        await Roadmap.create({
          userId,
          title: roadmap.title,
          query,
          data: roadmap,
          source:
            provider.name === 'claude-sonnet-4-20250514'
              ? 'claude'
              : provider.name === 'llama3-70b-8192'
                ? 'groq'
                : 'openai',
          tags: ['roadmap', roadmap.title.toLowerCase()]
        });
      }

      return {
        roadmap,
        sources,
        meta: {
          mode: 'live',
          provider: provider.name,
          agent: 'Aristotle',
          fallbackChain,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      fallbackChain.push({
        provider: provider.name,
        reason: error.message
      });
    }
  }

  const roadmap = normalizeRoadmap(demoRoadmap);

  return {
    roadmap,
    sources: getSourcesFromRoadmap(roadmap),
    meta: {
      mode: 'demo',
      provider: 'demo',
      agent: 'Aristotle',
      fallbackChain,
      timestamp: new Date().toISOString()
    }
  };
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
