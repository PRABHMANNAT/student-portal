import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';

import Collection from '../models/Collection.js';
import { generateWithAnthropic } from './anthropicService.js';
import { jobsDemo } from './demoCatalog.js';
import { generateWithGroq } from './groqService.js';
import { addMemoryCollection } from './memoryStore.js';

const latestJobs = new Map();

function extractJsonPayload(value = '') {
  const trimmed = value.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = Math.min(
      ...['{', '[']
        .map((token) => trimmed.indexOf(token))
        .filter((index) => index >= 0)
    );
    const end = Math.max(trimmed.lastIndexOf('}'), trimmed.lastIndexOf(']'));

    if (!Number.isFinite(start) || end < start) {
      throw new Error('Provider did not return JSON');
    }

    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

function titleCase(value = '') {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeProfile(profile = {}) {
  const role = titleCase(profile.role || 'Software Engineer');
  const experience = profile.experience || profile.level || 'Entry level';
  const type = profile.type || 'Remote';
  const stack = profile.stack || profile.keywords?.join(', ') || 'Generalist';
  const location = profile.location || (type.toLowerCase().includes('remote') ? 'Remote' : 'Anywhere');
  const keywords = Array.isArray(profile.keywords)
    ? profile.keywords.filter(Boolean)
    : String(stack)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    role,
    experience,
    type,
    stack,
    location,
    keywords
  };
}

function buildCompanyColor(index) {
  const palette = ['#00b4a0', '#8b7fd4', '#f59340', '#1a1a1a'];
  return palette[index % palette.length];
}

function scoreJob(profile, job) {
  const haystack = [
    job.title,
    job.company,
    job.location,
    job.type,
    ...(job.tags || []),
    job.description,
    ...(job.requirements || [])
  ]
    .join(' ')
    .toLowerCase();

  let score = 58;

  const roleNeedle = String(profile.role || '').toLowerCase();
  const experienceNeedle = String(profile.experience || '').toLowerCase();
  const typeNeedle = String(profile.type || '').toLowerCase();

  if (roleNeedle && haystack.includes(roleNeedle)) {
    score += 18;
  }

  if (typeNeedle && haystack.includes(typeNeedle.replace('-', ' '))) {
    score += 8;
  }

  if (experienceNeedle.includes('no experience') && String(job.type || '').toLowerCase().includes('intern')) {
    score += 8;
  }

  for (const keyword of profile.keywords || []) {
    if (haystack.includes(String(keyword).toLowerCase())) {
      score += 4;
    }
  }

  if (String(job.location || '').toLowerCase().includes(String(profile.location || '').toLowerCase())) {
    score += 5;
  }

  return Math.min(99, Math.max(60, score));
}

function normalizeJob(job, index, fallbackSource, profile) {
  const title = job.title || job.position || profile.role || 'Open role';
  const company = job.company || job.company_name || 'Hiring Team';
  const location = job.location || job.candidate_required_location || job.region || profile.location;
  const type = job.type || job.employmentType || (title.toLowerCase().includes('intern') ? 'Internship' : 'Full-time');
  const description = job.description || job.summary || 'Role description unavailable from the source.';
  const tags = Array.from(
    new Set(
      [location, type, ...(job.tags || []), ...(job.technologies || []), ...(job.keywords || [])]
        .filter(Boolean)
        .map((item) => String(item).trim())
    )
  ).slice(0, 4);

  return {
    id: job.id || `${fallbackSource.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
    title,
    company,
    companyInitial: company.slice(0, 1).toUpperCase(),
    companyColor: job.companyColor || buildCompanyColor(index),
    postedAt: job.postedAt || job.date || job.created_at || 'Fresh',
    location,
    type,
    salary: job.salary || job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}` : 'Compensation not listed',
    tags,
    summary: job.summary || description.slice(0, 140),
    description,
    requirements: job.requirements || job.skills || ['Review source listing for full requirements'],
    companyInfo: job.companyInfo || {
      industry: job.industry || 'Technology',
      size: job.companySize || 'Growing team',
      hq: job.hq || location
    },
    applyUrl: job.applyUrl || job.url || job.redirect_url || 'https://example.com',
    source: job.source || fallbackSource,
    relevanceScore: Number(job.relevanceScore) || scoreJob(profile, job),
    matchReason: job.matchReason || 'Ranked for strong overlap with the requested role, work mode, and stack.',
    links:
      job.links && job.links.length
        ? job.links
        : [
            {
              title: 'Direct application',
              url: job.applyUrl || job.url || job.redirect_url || 'https://example.com',
              kind: 'Apply'
            }
          ]
  };
}

function dedupeJobs(jobs) {
  const seen = new Set();

  return jobs.filter((job) => {
    const key = `${job.company}|${job.title}|${job.location}`.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function parseIntentWithGroq(input) {
  const systemPrompt =
    'Extract job search params as JSON with shape { role, level, type, keywords, location }. Respond with JSON only.';
  const response = await generateWithGroq({
    systemPrompt,
    userPrompt: typeof input === 'string' ? input : JSON.stringify(input)
  });

  return extractJsonPayload(response);
}

async function parseJobSearchIntent(payload = {}) {
  const direct = normalizeProfile(payload);

  if (payload.role && payload.experience && payload.type && payload.stack) {
    return direct;
  }

  const naturalInput = payload.query || [payload.role, payload.experience, payload.type, payload.stack, payload.location].filter(Boolean).join(', ');

  try {
    const parsed = await parseIntentWithGroq(naturalInput);
    return normalizeProfile({
      role: parsed.role || direct.role,
      experience: parsed.level || direct.experience,
      type: parsed.type || direct.type,
      stack: Array.isArray(parsed.keywords) ? parsed.keywords.join(', ') : direct.stack,
      keywords: parsed.keywords || direct.keywords,
      location: parsed.location || direct.location
    });
  } catch {
    return direct;
  }
}

function looksRelevant(profile, text = '') {
  const haystack = text.toLowerCase();
  const role = String(profile.role || '').toLowerCase();
  const type = String(profile.type || '').toLowerCase();
  const location = String(profile.location || '').toLowerCase();
  const keywords = (profile.keywords || []).map((item) => String(item).toLowerCase());

  const roleMatch =
    !role ||
    haystack.includes(role) ||
    (role.includes('frontend') && /react|frontend|ui|design system/.test(haystack)) ||
    (role.includes('backend') && /backend|node|api|service/.test(haystack)) ||
    (role.includes('product') && /product|pm|roadmap|growth/.test(haystack)) ||
    ((role.includes('machine learning') || role.includes('ml')) && /ml|machine learning|python|ai|llm/.test(haystack));

  const keywordMatch = !keywords.length || keywords.some((keyword) => haystack.includes(keyword));
  const typeMatch = !type || haystack.includes(type.replace('-', ' '));
  const locationMatch = !location || haystack.includes(location.toLowerCase());

  return roleMatch && keywordMatch && (typeMatch || locationMatch || type === 'Remote');
}

function buildDemoCatalogJobs(profile) {
  return jobsDemo.jobs
    .map((job, index) => normalizeJob(job, index, job.source || 'Demo Catalog', profile));
}

async function fetchRemoteOkJobs(profile) {
  const response = await axios.get('https://remoteok.com/api', {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0'
    },
    timeout: 12000
  });

  const items = Array.isArray(response.data) ? response.data.slice(1) : [];
  const filtered = items.filter((item) =>
    looksRelevant(profile, [item.position, item.tags?.join(' '), item.description].join(' '))
  );

  return filtered.slice(0, 8).map((item, index) =>
    normalizeJob(
      {
        id: `remoteok-${item.id || index + 1}`,
        title: item.position,
        company: item.company,
        location: item.location || item.candidate_required_location || 'Remote',
        type: item.type || 'Full-time',
        tags: [item.candidate_required_location, ...(item.tags || [])],
        description: cheerio.load(`<div>${item.description || ''}</div>`).text().replace(/\s+/g, ' ').trim(),
        salary:
          item.salary_min && item.salary_max
            ? `$${item.salary_min.toLocaleString()} - $${item.salary_max.toLocaleString()}`
            : 'Compensation not listed',
        applyUrl: item.url,
        source: 'RemoteOK'
      },
      index,
      'RemoteOK',
      profile
    )
  );
}

function flattenComments(node, bucket = []) {
  if (!node) {
    return bucket;
  }

  if (node.text) {
    bucket.push(node);
  }

  for (const child of node.children || []) {
    flattenComments(child, bucket);
  }

  return bucket;
}

function parseHnCommentToJob(comment, index, profile) {
  const text = cheerio.load(`<div>${comment.text || ''}</div>`).text().replace(/\s+/g, ' ').trim();
  const parts = text.split('|').map((item) => item.trim()).filter(Boolean);

  if (!text || !looksRelevant(profile, text)) {
    return null;
  }

  const company = parts[0]?.slice(0, 48) || `HN Hiring Team ${index + 1}`;
  const title =
    parts.find((item) => /engineer|developer|manager|analyst|scientist|intern/i.test(item)) ||
    `${profile.role} opportunity`;
  const location =
    parts.find((item) => /remote|hybrid|on-site|onsite|india|usa|europe|london|bangalore|bengaluru/i.test(item)) ||
    profile.location;

  return normalizeJob(
    {
      id: `hn-${comment.id || index + 1}`,
      company,
      title,
      location,
      type: /intern/i.test(title) ? 'Internship' : 'Full-time',
      description: text,
      tags: parts.slice(1, 5),
      applyUrl: comment.url || 'https://news.ycombinator.com',
      source: "HN Who's Hiring"
    },
    index,
    "HN Who's Hiring",
    profile
  );
}

async function fetchHnWhoHiringJobs(profile) {
  const threadSearch = await axios.get('https://hn.algolia.com/api/v1/search?query=who+is+hiring&tags=ask_hn', {
    timeout: 12000
  });
  const thread = threadSearch.data?.hits?.[0];

  if (!thread?.objectID) {
    throw new Error('HN thread not found');
  }

  const itemResponse = await axios.get(`https://hn.algolia.com/api/v1/items/${thread.objectID}`, {
    timeout: 12000
  });

  const comments = flattenComments(itemResponse.data).slice(0, 80);
  const jobs = comments
    .map((comment, index) => parseHnCommentToJob(comment, index, profile))
    .filter(Boolean)
    .slice(0, 8);

  if (!jobs.length) {
    throw new Error('HN parsing returned no relevant jobs');
  }

  return jobs;
}

function buildGithubArchiveDemoJobs(profile) {
  return jobsDemo.jobs
    .filter((job) => job.source === 'GitHub Jobs Archive')
    .filter((job) => looksRelevant(profile, [job.title, ...(job.tags || []), job.description].join(' ')))
    .slice(0, 4)
    .map((job, index) => normalizeJob(job, index, 'GitHub Jobs Archive', profile));
}

async function fetchAdzunaJobs(profile) {
  if (!process.env.ADZUNA_APP_ID || !process.env.ADZUNA_APP_KEY) {
    throw new Error('Missing Adzuna credentials');
  }

  const country = process.env.ADZUNA_COUNTRY || 'us';
  const params = new URLSearchParams({
    app_id: process.env.ADZUNA_APP_ID,
    app_key: process.env.ADZUNA_APP_KEY,
    results_per_page: '8',
    what: `${profile.role} ${profile.stack}`,
    where: profile.location
  });

  const response = await axios.get(
    `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${params.toString()}`,
    { timeout: 12000 }
  );

  const results = response.data?.results || [];
  return results.map((job, index) =>
    normalizeJob(
      {
        id: `adzuna-${job.id || index + 1}`,
        title: job.title,
        company: job.company?.display_name,
        location: job.location?.display_name,
        type: job.contract_time || job.contract_type || 'Full-time',
        description: cheerio.load(`<div>${job.description || ''}</div>`).text().replace(/\s+/g, ' ').trim(),
        salary:
          job.salary_min && job.salary_max
            ? `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(job.salary_max).toLocaleString()}`
            : 'Compensation not listed',
        applyUrl: job.redirect_url,
        source: 'Adzuna'
      },
      index,
      'Adzuna',
      profile
    )
  );
}

async function collectJobs(profile) {
  const jobs = [];
  const sources = [];
  const errors = [];

  const tasks = [
    ['RemoteOK', () => fetchRemoteOkJobs(profile)],
    ["HN Who's Hiring", () => fetchHnWhoHiringJobs(profile)],
    ['GitHub Jobs Archive', async () => buildGithubArchiveDemoJobs(profile)],
    ['Adzuna', () => fetchAdzunaJobs(profile)]
  ];

  for (const [source, runner] of tasks) {
    try {
      const result = await runner();
      if (result?.length) {
        jobs.push(...result);
        sources.push(source);
      }
    } catch (error) {
      errors.push(`${source}: ${error.message}`);
    }
  }

  return {
    jobs: dedupeJobs(jobs),
    sources,
    errors
  };
}

function applyRankingPayload(jobs, ranking) {
  const scoreById = new Map(
    ranking.map((item) => [
      item.id,
      {
        relevanceScore: Number(item.relevanceScore) || 80,
        matchReason: item.matchReason || 'Ranked by Columbus for topical relevance.'
      }
    ])
  );

  return jobs
    .map((job) => ({
      ...job,
      ...(scoreById.get(job.id) || {})
    }))
    .sort((left, right) => (right.relevanceScore || 0) - (left.relevanceScore || 0))
    .slice(0, 20);
}

async function rankJobsWithAI(profile, jobs) {
  const systemPrompt = `Given this user profile and a jobs array, rank the jobs by relevance.
Return a JSON array with items { id, relevanceScore, matchReason }.
Scores must be 0-100. Use the original ids only.`;
  const userPrompt = JSON.stringify({ profile, jobs: jobs.slice(0, 30) });

  const providers = [
    ['anthropic', generateWithAnthropic],
    ['groq', generateWithGroq]
  ];

  for (const [provider, runner] of providers) {
    try {
      const response = await runner({ systemPrompt, userPrompt });
      const ranking = extractJsonPayload(response);
      return {
        jobs: applyRankingPayload(jobs, Array.isArray(ranking) ? ranking : []),
        provider
      };
    } catch {
      // Continue through the fallback chain.
    }
  }

  return {
    jobs: jobs
      .map((job) => ({
        ...job,
        relevanceScore: scoreJob(profile, job),
        matchReason: job.matchReason || 'Ranked heuristically from role, location, and stack overlap.'
      }))
      .sort((left, right) => right.relevanceScore - left.relevanceScore)
      .slice(0, 20),
    provider: 'heuristic'
  };
}

function cacheJobs(jobs = []) {
  for (const job of jobs) {
    latestJobs.set(job.id, job);
  }
}

export async function searchJobs(payload = {}) {
  const query = await parseJobSearchIntent(payload);
  const collected = await collectJobs(query);
  const combinedJobs =
    collected.jobs.length >= 8
      ? collected.jobs
      : dedupeJobs([...collected.jobs, ...buildDemoCatalogJobs(query)]);

  if (!combinedJobs.length) {
    const demoResult = {
      ...jobsDemo,
      query,
      meta: {
        mode: 'demo',
        provider: 'jobs-demo',
        agent: 'Columbus',
        sourcesTried: collected.errors,
        timestamp: new Date().toISOString()
      }
    };

    cacheJobs(demoResult.jobs);
    return demoResult;
  }

  const ranked = await rankJobsWithAI(query, combinedJobs);
  const liveSourceCount = collected.sources.filter((source) => source !== 'GitHub Jobs Archive').length;
  const result = {
    jobs: ranked.jobs,
    total: ranked.jobs.length,
    sources: collected.jobs.length >= 8 ? collected.sources : Array.from(new Set([...collected.sources, 'Demo Catalog'])),
    query,
    meta: {
      mode: liveSourceCount ? 'live' : 'demo',
      provider: ranked.provider,
      agent: 'Columbus',
      partialFailures: collected.errors,
      timestamp: new Date().toISOString()
    }
  };

  cacheJobs(result.jobs);
  return result;
}

export async function getJobDetail(id) {
  const cached = latestJobs.get(id);
  if (cached) {
    return cached;
  }

  return jobsDemo.jobs.find((job) => job.id === id) || jobsDemo.jobs[0];
}

export async function saveJobCollection({ job, userId = 'guest' }) {
  if (mongoose.connection.readyState === 1 && userId !== 'guest') {
    const item = await Collection.create({
      userId,
      type: 'jobs',
      title: job.title,
      summary: `${job.company} • ${job.location}`,
      tags: ['jobs', ...(job.tags || []).slice(0, 3)],
      payload: job
    });

    return {
      id: item._id.toString(),
      savedAt: item.createdAt
    };
  }

  const item = addMemoryCollection({
    id: `saved-${Date.now()}`,
    type: 'jobs',
    title: job.title,
    summary: `${job.company} • ${job.location}`,
    tags: ['jobs', ...(job.tags || []).slice(0, 3)],
    payload: job,
    savedAt: new Date().toISOString()
  });

  return {
    id: item.id,
    savedAt: item.savedAt
  };
}
