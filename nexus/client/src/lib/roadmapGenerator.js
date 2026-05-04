import { layoutRoadmap } from './layoutRoadmap.js';
import { generateRoadmapViaLLM } from './openaiClient.js';

const TEMPLATE_CAREERS = [
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'React Developer',
  'Product Manager',
  'Technical Product Manager',
  'AI/ML Engineer',
  'Data Scientist',
  'Data Engineer',
  'DevOps Engineer',
  'Cloud Engineer (AWS)',
  'Cybersecurity Engineer',
  'Android Developer (Kotlin)',
  'iOS Developer (Swift)',
  'Game Developer (Unity)',
  'Startup Founder (Technical)',
  'UX/UI Designer',
  'Blockchain Developer',
  'Prompt Engineer',
  'Technical Writer'
];

const TOPIC_BRANCHES = {
  'Programming Fundamentals': ['Variables & Types', 'Control Flow', 'Functions & Scope', 'Error Handling', 'Async Programming'],
  'API Design': ['REST Principles', 'GraphQL Basics', 'Auth & JWTs', 'Rate Limiting', 'OpenAPI / Swagger'],
  Databases: ['SQL Fundamentals', 'Normalization', 'Indexing & Performance', 'Transactions & ACID', 'NoSQL Basics'],
  'Auth & Security': ['OAuth 2.0 Flows', 'CSRF & XSS', 'HTTPS & TLS', 'Password Hashing', 'Secrets Management'],
  'HTML & CSS': ['Semantic HTML', 'Forms & Validation', 'CSS Cascade', 'Flexbox & Grid', 'Responsive Layout'],
  JavaScript: ['Closures', 'Async/Await', 'DOM APIs', 'Modules', 'Error Handling'],
  React: ['Component Composition', 'Hooks', 'State Management', 'Forms', 'Performance'],
  TypeScript: ['Type Narrowing', 'Generics', 'Utility Types', 'API Types', 'Strict Mode'],
  'Node & Express': ['Routing', 'Middleware', 'Request Validation', 'Error Handling', 'Background Jobs'],
  PostgreSQL: ['Schema Design', 'Joins', 'Indexes', 'Transactions', 'Query Planning'],
  Testing: ['Unit Tests', 'Integration Tests', 'Mocking', 'E2E Tests', 'Test Data'],
  Performance: ['Caching', 'Bundle Size', 'Database Bottlenecks', 'Profiling', 'Core Web Vitals'],
  Deployment: ['CI/CD Pipelines', 'Environment Variables', 'Docker Images', 'Rollback Strategy', 'Health Checks'],
  Observability: ['Structured Logs', 'Metrics', 'Tracing', 'Alerting', 'Incident Review'],
  'Capstone Project': ['Problem Selection', 'Architecture Plan', 'MVP Scope', 'User Feedback', 'Launch Checklist'],
  'Case Studies': ['Problem Framing', 'Technical Decisions', 'Tradeoffs', 'Metrics', 'Screenshots & Demos'],
  'Interview Prep': ['DSA Patterns', 'System Design', 'Behavioral Stories', 'Take-home Reviews', 'Mock Interviews'],
  'Open Source': ['Issue Triage', 'Small PRs', 'Maintainer Communication', 'Code Review', 'Release Notes'],
  'Git & GitHub': ['Branching', 'Pull Requests', 'Merge Conflicts', 'GitHub Actions', 'Code Review'],
  Python: ['Data Structures', 'Virtual Environments', 'Type Hints', 'Testing', 'Packaging'],
  'Linear Algebra': ['Vectors', 'Matrices', 'Eigenvectors', 'Dot Products', 'Dimensionality'],
  Statistics: ['Distributions', 'Hypothesis Tests', 'Confidence Intervals', 'Regression', 'Sampling Bias'],
  'Machine Learning': ['Supervised Learning', 'Feature Engineering', 'Train/Test Splits', 'Evaluation Metrics', 'Overfitting'],
  'Deep Learning': ['Neural Networks', 'Backpropagation', 'CNNs', 'Transformers', 'Regularization'],
  'Model Evaluation': ['Precision & Recall', 'ROC/AUC', 'Error Analysis', 'Calibration', 'Offline vs Online Metrics'],
  'ML System Design': ['Data Pipelines', 'Feature Stores', 'Model Serving', 'Monitoring', 'Retraining'],
  PyTorch: ['Tensors', 'Autograd', 'Datasets & DataLoaders', 'Training Loops', 'GPU Debugging'],
  'LLM Apps': ['Prompt Design', 'RAG', 'Tool Calling', 'Evaluation Sets', 'Guardrails'],
  MLOps: ['Experiment Tracking', 'Model Registry', 'CI for ML', 'Deployment Targets', 'Drift Monitoring'],
  'Vector Databases': ['Embeddings', 'Similarity Search', 'Chunking', 'Metadata Filters', 'Recall Tuning'],
  DSA: ['Arrays & Strings', 'Hash Maps', 'Trees', 'Graphs', 'Dynamic Programming'],
  'AI Interviews': ['ML Fundamentals', 'System Design', 'Coding Rounds', 'Research Discussion', 'Portfolio Walkthrough'],
  'User Research': ['Interview Scripts', 'Recruiting Users', 'Synthesis', 'Personas', 'Research Ethics'],
  'Product Sense': ['Problem Discovery', 'Prioritization', 'User Journeys', 'Tradeoffs', 'Success Metrics'],
  Metrics: ['North Star Metrics', 'Funnels', 'Retention', 'Cohorts', 'Experiment Readouts'],
  Roadmapping: ['Outcome Themes', 'Prioritization', 'Dependencies', 'Stakeholder Updates', 'Release Planning'],
  Experimentation: ['Hypothesis Design', 'A/B Tests', 'Sample Size', 'Guardrail Metrics', 'Decision Logs'],
  'SQL Analytics': ['Aggregations', 'Window Functions', 'Funnels', 'Retention Queries', 'Dashboard QA'],
  'System Design': ['Requirements', 'API Boundaries', 'Storage Choices', 'Scaling', 'Failure Modes']
};

const FALLBACK_TEMPLATE_SECTIONS = {
  'Full Stack Developer': [
    ['Foundation', ['Programming Fundamentals', 'Git & GitHub', 'Databases']],
    ['Frontend', ['HTML & CSS', 'JavaScript', 'React']],
    ['Backend', ['API Design', 'Node & Express', 'Auth & Security']],
    ['Production', ['Testing', 'Deployment', 'System Design']]
  ],
  'AI/ML Engineer': [
    ['Foundation', ['Python', 'Linear Algebra', 'Statistics']],
    ['Core ML', ['Machine Learning', 'Deep Learning', 'Model Evaluation']],
    ['Production AI', ['PyTorch', 'LLM Apps', 'MLOps']],
    ['Hiring', ['Case Studies', 'AI Interviews', 'Capstone Project']]
  ],
  'Product Manager': [
    ['Foundation', ['User Research', 'Product Sense', 'Metrics']],
    ['Execution', ['Experimentation', 'SQL Analytics', 'System Design']],
    ['Hiring', ['Interview Prep', 'Case Studies', 'Roadmapping']]
  ]
};

const DEFAULT_TEMPLATE_SECTIONS = [
  ['Foundation', ['Programming Fundamentals', 'Git & GitHub', 'Databases']],
  ['Core Skills', ['Testing', 'Performance', 'Deployment']],
  ['Proof', ['Capstone Project', 'Case Studies', 'Interview Prep', 'DSA']]
];

function slug(value = '') {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function branchesForTopic(topic) {
  const fallback = [
    `${topic} Fundamentals`,
    `${topic} Tooling`,
    `${topic} Failure Modes`,
    `${topic} Best Practices`,
    `${topic} Review Checklist`
  ];
  return TOPIC_BRANCHES[topic] || fallback;
}

function buildContent(nodeTitle, career) {
  return {
    description: `${nodeTitle} for ${career}: learn the core concepts, implementation tradeoffs, and production constraints.`,
    freeResources: [
      { type: 'article', title: `${nodeTitle} official docs`, url: 'https://developer.mozilla.org/', source: 'MDN' },
      { type: 'article', title: `${nodeTitle} practical guide`, url: 'https://www.freecodecamp.org/learn', source: 'freeCodeCamp' }
    ],
    premiumResources: []
  };
}

function buildLogicalTemplate(career, profile = {}, prompt) {
  const sectionDefs = FALLBACK_TEMPLATE_SECTIONS[career] || DEFAULT_TEMPLATE_SECTIONS;
  const content = {};
  const sections = sectionDefs.map(([title, topics], sectionIndex) => ({
    id: slug(title),
    title,
    spine: topics.map((topic, topicIndex) => {
      const nodeId = slug(`${title}-${topic}`);
      const branches = branchesForTopic(topic).map((branchTitle, branchIndex) => {
        const branchId = slug(`${nodeId}-${branchTitle}`);
        content[branchId] = buildContent(branchTitle, career);
        return {
          id: branchId,
          title: branchTitle,
          side: branchIndex % 2 === 0 ? 'right' : 'left',
          style: 'alternative',
          estimatedHours: 4,
          difficulty: topicIndex < 2 ? 'Beginner' : 'Intermediate',
          personalizedNote: null
        };
      });

      content[nodeId] = buildContent(topic, career);
      return {
        id: nodeId,
        title: topic,
        style: 'primary',
        estimatedHours: 12 + sectionIndex * 4,
        difficulty: sectionIndex < 1 ? 'Beginner' : 'Intermediate',
        personalizedNote: null,
        branches
      };
    }),
    checkpoint: {
      id: `cp-${slug(title)}`,
      title: `Checkpoint - ${title} Complete`
    }
  }));

  const roadmap = {
    id: slug(career),
    career,
    title: career,
    subtitle: `A practical ${career.toLowerCase()} roadmap with specific sub-topics and focused milestones.`,
    description: `Personalized for ${profile.fullName}: ${career} from ${profile.university}, ${profile.city}.`,
    totalHours: sections.reduce((sum, section) => sum + section.spine.reduce((nodeSum, item) => nodeSum + item.estimatedHours + item.branches.length * 4, 0), 0),
    duration: durationFromPrompt(prompt, profile),
    personalizationRationale: [
      `Aligned to ${profile.targetTimeline?.replace(/_/g, ' ') || 'your target timeline'}.`,
      `Uses your current ${profile.yearsOfExperience || 0} year experience as the baseline.`,
      `Targets ${career} fundamentals before interview proof.`
    ],
    sections,
    content
  };

  return applyPersonalization(roadmap, profile);
}

function applyPersonalization(roadmap, profile = {}) {
  const knownSkills = Array.from(profileSkillSet(profile));
  const weaknesses = profile.weaknesses || [];
  const university = profile.university || 'your coursework';

  (roadmap.sections || []).forEach((section) => {
    let companyNotesInSection = 0;

    (section.spine || []).forEach((spineNode) => {
      const title = spineNode.title.toLowerCase();
      const knownSkill = knownSkills.find((skill) => title.includes(skill) || skill.includes(title));
      const weakness = weaknesses.find((item) => title.includes(item.toLowerCase()));

      if (knownSkill) {
        spineNode.style = 'optional';
        spineNode.personalizedNote = `You know this from your ${university} work - quick refresh.`;
      }

      if (weakness) {
        spineNode.style = 'primary';
        spineNode.personalizedNote = `Spend extra time - flagged ${weakness} as a weakness.`;
      }

      if (!spineNode.personalizedNote && companyNotesInSection < 1 && /typescript|system design|mlops|metrics|testing|security/i.test(spineNode.title)) {
        const company = (profile.targetCompanies || [])[companyNotesInSection];
        if (company) {
          spineNode.personalizedNote = `${company} tends to inspect ${spineNode.title.toLowerCase()} depth; go deeper here.`;
          companyNotesInSection += 1;
        }
      }

      (spineNode.branches || []).forEach((branch) => {
        const branchTitle = branch.title.toLowerCase();
        const branchWeakness = weaknesses.find((item) => branchTitle.includes(item.toLowerCase()));
        if (branchWeakness) {
          branch.personalizedNote = `Spend extra time - flagged ${branchWeakness} as a weakness.`;
        }
      });
    });
  });

  return dedupePersonalizedNotes(roadmap);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
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

function normalizeGeneratedRoadmap(roadmap, profile, prompt) {
  if (Array.isArray(roadmap.sections)) {
    const cleanedRoadmap = dedupePersonalizedNotes(clone(roadmap));
    const layout = layoutRoadmap(cleanedRoadmap);
    return {
      ...cleanedRoadmap,
      ...layout,
      id: cleanedRoadmap.id || slug(cleanedRoadmap.title || cleanedRoadmap.career || detectCareer(prompt)),
      career: cleanedRoadmap.career || cleanedRoadmap.title || detectCareer(prompt),
      title: cleanedRoadmap.title || cleanedRoadmap.career || detectCareer(prompt),
      subtitle: cleanedRoadmap.subtitle || `Step by step guide to becoming a modern ${(cleanedRoadmap.title || detectCareer(prompt)).toLowerCase()}`,
      description: cleanedRoadmap.description || cleanedRoadmap.subtitle || `Personalized for ${profile.fullName} at ${profile.university}.`,
      totalNodes: layout.nodes.filter((node) => node.type !== 'section_header').length,
      totalHours: cleanedRoadmap.totalHours || layout.nodes.length * 6,
      duration: cleanedRoadmap.duration || durationFromPrompt(prompt, profile),
      personalizationRationale: cleanedRoadmap.personalizationRationale || [],
      checkpoints: cleanedRoadmap.checkpoints || [],
      firstUncompletedNode: cleanedRoadmap.firstUncompletedNode || layout.nodes.find((node) => node.type === 'topic')?.id || null,
      content: cleanedRoadmap.content || {}
    };
  }

  if (Array.isArray(roadmap.nodes) && Array.isArray(roadmap.edges)) {
    return {
      ...roadmap,
      career: roadmap.career || roadmap.title || detectCareer(prompt),
      title: roadmap.title || roadmap.career || detectCareer(prompt),
      subtitle: roadmap.subtitle || `Step by step guide to becoming a modern ${(roadmap.title || detectCareer(prompt)).toLowerCase()}`,
      description: roadmap.description || roadmap.subtitle || `Personalized for ${profile.fullName} at ${profile.university}.`,
      totalNodes: roadmap.totalNodes || roadmap.nodes.filter((node) => node.type !== 'label').length,
      totalHours: roadmap.totalHours || roadmap.nodes.length * 6,
      duration: roadmap.duration || durationFromPrompt(prompt, profile),
      content: roadmap.content || {}
    };
  }

  const phases = (roadmap.phases || []).map((phase, phaseIndex) => {
    const nodes = (phase.nodes || []).map((item, nodeIndex) => ({
      id: item.id || `${phase.id || `phase-${phaseIndex}`}-${nodeIndex}`,
      title: item.title || item.label || 'Topic',
      type: item.type || 'key',
      hours: item.hours || item.estimatedHours || 12,
      description: item.description || `${item.title || 'Topic'} for ${profile.targetRole}.`,
      personalizedNote: item.personalizedNote || '',
      youtube: item.youtube || [],
      docs: item.docs || [],
      projects: item.projects || []
    }));

    return {
      id: phase.id || `phase-${phaseIndex + 1}`,
      label: phase.label || phase.name || `Phase ${phaseIndex + 1}`,
      name: phase.name || phase.label || `Phase ${phaseIndex + 1}`,
      duration: phase.duration || 'Self paced',
      description: phase.description || `Work through phase ${phaseIndex + 1}.`,
      nodes,
      hours: nodes.reduce((sum, item) => sum + item.hours, 0)
    };
  });

  const branchNodeHours = Object.values(roadmap.branches || {})
    .flatMap((group) => (Array.isArray(group) ? group : group?.nodes || []))
    .reduce((sum, item) => sum + (item.estimatedHours || item.hours || 0), 0);
  const spineNodeHours = (roadmap.spine || []).reduce((sum, item) => sum + (item.estimatedHours || item.hours || 0), 0);
  const phaseHours = phases.reduce((sum, phase) => sum + phase.hours, 0);
  const totalHours = roadmap.totalHours || phaseHours || spineNodeHours + branchNodeHours;

  return {
    ...roadmap,
    career: roadmap.career || roadmap.title || detectCareer(prompt),
    title: roadmap.title || roadmap.career || detectCareer(prompt),
    description: roadmap.description || `Personalized for ${profile.fullName} at ${profile.university}.`,
    totalHours,
    totalPhases: roadmap.totalPhases || phases.length || (roadmap.spine || []).filter((item) => item.type === 'section_header').length,
    duration: roadmap.duration || durationFromPrompt(prompt, profile),
    phases
  };
}

export async function generateRoadmap(prompt, profile, onProgress) {
  console.log('🚀 [Roadmap] Generation started');
  console.log('🔑 [Roadmap] API key present:', !!import.meta.env.VITE_OPENAI_API_KEY);
  console.log('🔑 [Roadmap] API key prefix:', import.meta.env.VITE_OPENAI_API_KEY?.slice(0, 7));

  try {
    onProgress?.({ stage: 'thinking', message: 'Analyzing your profile...' });

    console.log('🤖 [Roadmap] Calling OpenAI...');
    const generatedRoadmap = await generateRoadmapViaLLM(prompt, profile);
    console.log('✅ [Roadmap] LLM SUCCESS - using LLM output');
    const roadmap = normalizeGeneratedRoadmap(generatedRoadmap, profile, prompt);
    onProgress?.({ stage: 'complete', message: 'Roadmap ready' });
    return {
      roadmap,
      source: 'llm',
      meta: {
        mode: 'live',
        provider: 'openai-gpt-4o-mini',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('❌ [Roadmap] LLM FAILED:', error);
    console.error('❌ [Roadmap] Error details:', error?.message);
    console.warn('⚠️ [Roadmap] FALLING BACK TO TEMPLATE - this is why output looks generic');
    onProgress?.({ stage: 'fallback', message: 'Building from template library...' });
    const roadmap = generateFromTemplate(prompt, profile);
    return { roadmap, source: 'template', error };
  }
}

export function generateFromTemplate(prompt, profile) {
  const career = detectCareer(prompt);
  return normalizeGeneratedRoadmap(buildLogicalTemplate(career, profile, prompt), profile, prompt);
}

function detectCareer(prompt = '') {
  const text = prompt.toLowerCase();
  const rules = [
    [/product manager|\bpm\b|product management/, 'Product Manager'],
    [/technical product/, 'Technical Product Manager'],
    [/ai engineer|\bai\b|\bml\b|machine learning/, 'AI/ML Engineer'],
    [/frontend|front end|canva|react/, 'Frontend Engineer'],
    [/backend|back end|node/, 'Backend Engineer'],
    [/full stack|fullstack/, 'Full Stack Developer'],
    [/data scientist|data science/, 'Data Scientist'],
    [/data engineer/, 'Data Engineer'],
    [/devops/, 'DevOps Engineer'],
    [/aws|cloud/, 'Cloud Engineer (AWS)'],
    [/security|cyber/, 'Cybersecurity Engineer'],
    [/android|kotlin/, 'Android Developer (Kotlin)'],
    [/ios|swift/, 'iOS Developer (Swift)'],
    [/unity|game/, 'Game Developer (Unity)'],
    [/startup|founder/, 'Startup Founder (Technical)'],
    [/ux|ui|designer/, 'UX/UI Designer'],
    [/blockchain|solidity|web3/, 'Blockchain Developer']
  ];

  return rules.find(([pattern]) => pattern.test(text))?.[1] || 'Full Stack Developer';
}

function durationFromPrompt(prompt, profile = {}) {
  const text = prompt.toLowerCase();
  if (/6\s*months?/.test(text)) return '6 months';
  if (/1\s*year|12\s*months?/.test(text)) return '1 year';
  if (/2\s*years?/.test(text)) return '2 years';
  return profile.targetTimeline === '6_months' ? '6 months' : profile.targetTimeline === '2_years' ? '2 years' : '1 year';
}

function profileSkillSet(profile = {}) {
  return new Set(
    [
      ...(profile.programmingLanguages || []),
      ...(profile.frameworks || []),
      ...(profile.tools || []),
      ...(profile.internships || []).flatMap((item) => item.stack || []),
      ...(profile.projects || []).flatMap((item) => item.stack || [])
    ].map((item) => item.toLowerCase())
  );
}

export function buildRoadmapAcknowledgement(prompt, profile, roadmap) {
  const target = roadmap.career || roadmap.title || 'your target role';
  const company = [...(profile.targetCompanies || []), 'Google', 'OpenAI', 'Canva'].find((item) =>
    prompt.toLowerCase().includes(item.toLowerCase())
  );
  const companyText = company && !target.toLowerCase().includes(company.toLowerCase()) ? ` at ${company}` : '';

  return `Got it. Building your path to ${target}${companyText}, factoring in your CS background at ${profile.university}, ${profile.city}, ${profile.visaStatus.replace(/_/g, ' ')}, and ${profile.yearsOfExperience} year of experience.`;
}

export const ROADMAP_TEMPLATE_CAREERS = TEMPLATE_CAREERS;
