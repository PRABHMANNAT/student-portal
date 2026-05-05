// Pre-built roadmap templates for AI Engineer, Frontend Engineer, Full Stack Developer
// Format matches the sections schema consumed by layoutRoadmap() → toRoadmapSchema()

export const AI_ENGINEER_ROADMAP = {
  id: 'ai-engineer',
  title: 'AI Engineer',
  subtitle: 'From fundamentals to production-ready AI systems',
  description: 'A comprehensive roadmap for becoming an AI Engineer — covering LLMs, prompt engineering, RAG, agents, and deployment.',
  totalHours: 480,
  duration: '12 months',
  personalizationRationale: [
    'Covers modern LLM application development, not just ML theory.',
    'Includes production deployment, monitoring, and evaluation.',
    'Balances open-source and closed-source model workflows.',
    'Ends with hands-on AI agent and RAG system builds.',
  ],
  sections: [
    {
      id: 'introduction',
      title: 'Introduction',
      spine: [
        {
          id: 'what-is-ai-engineer',
          title: 'What is an AI Engineer?',
          style: 'primary',
          estimatedHours: 4,
          difficulty: 'Beginner',
          branches: [
            { id: 'roles-responsibilities', title: 'Roles & Responsibilities', side: 'right', style: 'alternative', estimatedHours: 2, difficulty: 'Beginner' },
            { id: 'impact-product-dev', title: 'Impact on Product Development', side: 'right', style: 'alternative', estimatedHours: 2, difficulty: 'Beginner' },
            { id: 'ai-vs-ml-engineer', title: 'AI Engineer vs ML Engineer', side: 'left', style: 'alternative', estimatedHours: 2, difficulty: 'Beginner' },
            { id: 'ai-career-paths', title: 'AI Career Paths', side: 'left', style: 'alternative', estimatedHours: 2, difficulty: 'Beginner' },
          ],
        },
      ],
      checkpoint: { id: 'cp-intro', title: 'Checkpoint — AI Engineering Overview Complete' },
    },
    {
      id: 'working-with-llms',
      title: 'Working With LLMs',
      spine: [
        {
          id: 'how-llms-work',
          title: 'How LLMs Work',
          style: 'primary',
          estimatedHours: 20,
          difficulty: 'Intermediate',
          branches: [
            { id: 'tokens-tokenization', title: 'Tokens & Tokenization', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
            { id: 'context-windows', title: 'Context Windows', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
            { id: 'embeddings', title: 'Embeddings', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'training-overview', title: 'Training Overview', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'inference-basics', title: 'Inference', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
          ],
        },
        {
          id: 'prompt-engineering',
          title: 'Prompt Engineering',
          style: 'primary',
          estimatedHours: 24,
          difficulty: 'Intermediate',
          branches: [
            { id: 'zero-shot-prompting', title: 'Zero-shot Prompting', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
            { id: 'few-shot-prompting', title: 'Few-shot Prompting', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
            { id: 'chain-of-thought', title: 'Chain of Thought', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'structured-outputs', title: 'Structured Outputs', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
          ],
        },
        {
          id: 'context-engineering',
          title: 'Context Engineering',
          style: 'primary',
          estimatedHours: 20,
          difficulty: 'Intermediate',
          branches: [
            { id: 'sampling-temperature', title: 'Temperature', side: 'right', style: 'alternative', estimatedHours: 3, difficulty: 'Beginner' },
            { id: 'top-k-sampling', title: 'Top-K Sampling', side: 'right', style: 'alternative', estimatedHours: 3, difficulty: 'Intermediate' },
            { id: 'top-p-nucleus', title: 'Top-P / Nucleus', side: 'left', style: 'alternative', estimatedHours: 3, difficulty: 'Intermediate' },
            { id: 'system-prompts', title: 'System Prompts', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
          ],
        },
      ],
      checkpoint: { id: 'cp-llm-fundamentals', title: 'Checkpoint — LLM Fundamentals Complete' },
    },
    {
      id: 'ai-models',
      title: 'AI Models',
      spine: [
        {
          id: 'open-source-models',
          title: 'Open Source Models',
          style: 'primary',
          estimatedHours: 20,
          difficulty: 'Intermediate',
          branches: [
            { id: 'llama-family', title: 'LLaMA Family', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'mistral-models', title: 'Mistral Models', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
            { id: 'ollama-local', title: 'Ollama (Local)', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
            { id: 'huggingface-hub', title: 'HuggingFace Hub', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
          ],
        },
        {
          id: 'closed-source-models',
          title: 'Closed Source Models',
          style: 'primary',
          estimatedHours: 16,
          difficulty: 'Beginner',
          branches: [
            { id: 'openai-gpt4', title: 'OpenAI GPT-4o', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
            { id: 'anthropic-claude', title: 'Anthropic Claude', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
            { id: 'google-gemini', title: 'Google Gemini', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
            { id: 'model-selection', title: 'Model Selection Guide', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
          ],
        },
      ],
      checkpoint: { id: 'cp-models', title: 'Checkpoint — AI Models Complete' },
    },
    {
      id: 'ai-apis-sdks',
      title: 'AI APIs & SDKs',
      spine: [
        {
          id: 'vector-databases',
          title: 'Vector Databases',
          style: 'primary',
          estimatedHours: 24,
          difficulty: 'Intermediate',
          branches: [
            { id: 'pinecone', title: 'Pinecone', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'weaviate', title: 'Weaviate', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'pgvector', title: 'pgvector (PostgreSQL)', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'similarity-search', title: 'Similarity Search', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
          ],
        },
        {
          id: 'rag',
          title: 'RAG — Retrieval Augmented Generation',
          style: 'primary',
          estimatedHours: 32,
          difficulty: 'Advanced',
          branches: [
            { id: 'chunking-strategies', title: 'Chunking Strategies', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'retrieval-pipelines', title: 'Retrieval Pipelines', side: 'right', style: 'alternative', estimatedHours: 10, difficulty: 'Advanced' },
            { id: 'reranking', title: 'Reranking', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
            { id: 'rag-evaluation', title: 'RAG Evaluation', side: 'left', style: 'alternative', estimatedHours: 8, difficulty: 'Advanced' },
          ],
        },
        {
          id: 'ai-agents',
          title: 'AI Agents',
          style: 'primary',
          estimatedHours: 40,
          difficulty: 'Advanced',
          branches: [
            { id: 'tool-calling', title: 'Tool Calling', side: 'right', style: 'alternative', estimatedHours: 10, difficulty: 'Intermediate' },
            { id: 'agent-frameworks', title: 'LangChain / LlamaIndex', side: 'right', style: 'alternative', estimatedHours: 12, difficulty: 'Advanced' },
            { id: 'multi-agent-systems', title: 'Multi-Agent Systems', side: 'left', style: 'alternative', estimatedHours: 12, difficulty: 'Advanced' },
            { id: 'agent-memory', title: 'Agent Memory', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
          ],
        },
      ],
      checkpoint: { id: 'cp-build-first-ai', title: 'Checkpoint — Build First AI App' },
    },
    {
      id: 'production',
      title: 'Building AI Products',
      spine: [
        {
          id: 'production-deployment',
          title: 'Production & Deployment',
          style: 'primary',
          estimatedHours: 32,
          difficulty: 'Advanced',
          branches: [
            { id: 'api-design-ai', title: 'AI API Design', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Advanced' },
            { id: 'streaming-responses', title: 'Streaming Responses', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'cost-optimization', title: 'Cost Optimization', side: 'left', style: 'alternative', estimatedHours: 8, difficulty: 'Advanced' },
            { id: 'latency-caching', title: 'Latency & Caching', side: 'left', style: 'alternative', estimatedHours: 10, difficulty: 'Advanced' },
          ],
        },
        {
          id: 'monitoring-evaluation',
          title: 'Monitoring & Evaluation',
          style: 'primary',
          estimatedHours: 28,
          difficulty: 'Advanced',
          branches: [
            { id: 'llm-evals', title: 'LLM Evaluations', side: 'right', style: 'alternative', estimatedHours: 10, difficulty: 'Advanced' },
            { id: 'guardrails', title: 'Guardrails & Safety', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Advanced' },
            { id: 'observability-ai', title: 'AI Observability', side: 'left', style: 'alternative', estimatedHours: 10, difficulty: 'Advanced' },
          ],
        },
      ],
      checkpoint: { id: 'cp-production-ready', title: 'Checkpoint — Production Ready' },
    },
  ],
};

export const FRONTEND_ENGINEER_ROADMAP = {
  id: 'frontend-engineer',
  title: 'Frontend Engineer',
  subtitle: 'From HTML basics to production React applications',
  description: 'A structured path from web fundamentals through modern frontend development with React, TypeScript, and deployment.',
  totalHours: 360,
  duration: '10 months',
  personalizationRationale: [
    'Starts with solid web fundamentals before jumping into frameworks.',
    'Covers modern React patterns, hooks, and state management.',
    'Includes testing, performance, and deployment.',
    'Ends with interview prep and portfolio projects.',
  ],
  sections: [
    {
      id: 'web-foundations',
      title: 'Web Foundations',
      spine: [
        {
          id: 'internet-basics',
          title: 'Internet & Web',
          style: 'primary',
          estimatedHours: 8,
          difficulty: 'Beginner',
          branches: [
            { id: 'how-internet-works', title: 'How the Internet Works', side: 'right', style: 'alternative', estimatedHours: 2, difficulty: 'Beginner' },
            { id: 'http-https', title: 'HTTP & HTTPS', side: 'right', style: 'alternative', estimatedHours: 2, difficulty: 'Beginner' },
            { id: 'dns', title: 'DNS', side: 'left', style: 'alternative', estimatedHours: 2, difficulty: 'Beginner' },
            { id: 'browsers', title: 'How Browsers Work', side: 'left', style: 'alternative', estimatedHours: 2, difficulty: 'Beginner' },
          ],
        },
        {
          id: 'html',
          title: 'HTML',
          style: 'primary',
          estimatedHours: 20,
          difficulty: 'Beginner',
          branches: [
            { id: 'semantic-html', title: 'Semantic HTML', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
            { id: 'html-forms', title: 'Forms & Validation', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Beginner' },
            { id: 'accessibility-basics', title: 'Accessibility Basics', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'seo-meta', title: 'SEO & Meta Tags', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
          ],
        },
        {
          id: 'css',
          title: 'CSS',
          style: 'primary',
          estimatedHours: 32,
          difficulty: 'Beginner',
          branches: [
            { id: 'flexbox', title: 'Flexbox', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Beginner' },
            { id: 'css-grid', title: 'CSS Grid', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'responsive-design', title: 'Responsive Design', side: 'left', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'css-animations', title: 'Animations', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
          ],
        },
      ],
      checkpoint: { id: 'cp-foundations', title: 'Checkpoint — Web Foundations Complete' },
    },
    {
      id: 'javascript-core',
      title: 'Core JavaScript',
      spine: [
        {
          id: 'javascript',
          title: 'JavaScript',
          style: 'primary',
          estimatedHours: 48,
          difficulty: 'Intermediate',
          branches: [
            { id: 'dom-apis', title: 'DOM APIs', side: 'right', style: 'alternative', estimatedHours: 10, difficulty: 'Intermediate' },
            { id: 'fetch-api', title: 'Fetch API', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'es6-modules', title: 'ES6+ & Modules', side: 'left', style: 'alternative', estimatedHours: 12, difficulty: 'Intermediate' },
            { id: 'async-await', title: 'Async / Await', side: 'left', style: 'alternative', estimatedHours: 10, difficulty: 'Intermediate' },
          ],
        },
        {
          id: 'version-control',
          title: 'Version Control (Git)',
          style: 'primary',
          estimatedHours: 16,
          difficulty: 'Beginner',
          branches: [
            { id: 'git-basics', title: 'Git Basics', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
            { id: 'branching-merging', title: 'Branching & Merging', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
            { id: 'pull-requests', title: 'Pull Requests', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
            { id: 'github-actions', title: 'GitHub Actions', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Advanced' },
          ],
        },
      ],
      checkpoint: { id: 'cp-core-web', title: 'Checkpoint — Core Web Complete' },
    },
    {
      id: 'frameworks',
      title: 'Frontend Frameworks',
      spine: [
        {
          id: 'react',
          title: 'React',
          style: 'primary',
          estimatedHours: 48,
          difficulty: 'Intermediate',
          branches: [
            { id: 'react-hooks', title: 'React Hooks', side: 'right', style: 'alternative', estimatedHours: 12, difficulty: 'Intermediate' },
            { id: 'react-context', title: 'Context API', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'react-router', title: 'React Router', side: 'left', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'error-boundaries', title: 'Error Boundaries', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Advanced' },
          ],
        },
        {
          id: 'typescript',
          title: 'TypeScript',
          style: 'primary',
          estimatedHours: 32,
          difficulty: 'Intermediate',
          branches: [
            { id: 'ts-types-interfaces', title: 'Types & Interfaces', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'ts-generics', title: 'Generics', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Advanced' },
            { id: 'ts-narrowing', title: 'Type Narrowing', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
            { id: 'tsconfig', title: 'tsconfig & Strict Mode', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
          ],
        },
        {
          id: 'state-management',
          title: 'State Management',
          style: 'primary',
          estimatedHours: 24,
          difficulty: 'Intermediate',
          branches: [
            { id: 'zustand', title: 'Zustand', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'tanstack-query', title: 'TanStack Query', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'reducers', title: 'useReducer Pattern', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
          ],
        },
      ],
      checkpoint: { id: 'cp-frameworks', title: 'Checkpoint — Frontend Frameworks Complete' },
    },
    {
      id: 'testing-performance',
      title: 'Testing & Performance',
      spine: [
        {
          id: 'testing',
          title: 'Testing',
          style: 'primary',
          estimatedHours: 32,
          difficulty: 'Advanced',
          branches: [
            { id: 'vitest', title: 'Vitest (Unit)', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'testing-library', title: 'Testing Library', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'playwright-e2e', title: 'Playwright (E2E)', side: 'left', style: 'alternative', estimatedHours: 10, difficulty: 'Advanced' },
            { id: 'msw', title: 'MSW (API Mocks)', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
          ],
        },
        {
          id: 'performance',
          title: 'Performance',
          style: 'primary',
          estimatedHours: 20,
          difficulty: 'Advanced',
          branches: [
            { id: 'core-web-vitals', title: 'Core Web Vitals', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'code-splitting', title: 'Code Splitting', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
            { id: 'image-optimization', title: 'Image Optimization', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
          ],
        },
        {
          id: 'deployment',
          title: 'Deployment',
          style: 'primary',
          estimatedHours: 16,
          difficulty: 'Intermediate',
          branches: [
            { id: 'vercel-deploy', title: 'Vercel', side: 'right', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
            { id: 'cdn-caching', title: 'CDN & Caching', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'preview-deploys', title: 'Preview Deploys', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
          ],
        },
      ],
      checkpoint: { id: 'cp-production-fe', title: 'Checkpoint — Production Complete' },
    },
  ],
};

export const FULLSTACK_DEVELOPER_ROADMAP = {
  id: 'full-stack-developer',
  title: 'Full Stack Developer',
  subtitle: 'Frontend + Backend + Databases + Deployment',
  description: 'A complete full stack roadmap covering React frontend, Node.js backend, SQL/NoSQL databases, Docker, and cloud deployment.',
  totalHours: 520,
  duration: '14 months',
  personalizationRationale: [
    'Covers both frontend and backend with real integrations.',
    'Includes SQL and NoSQL databases with ORM patterns.',
    'DevOps essentials: Docker, GitHub Actions, cloud deployment.',
    'Ends with system design and interview preparation.',
  ],
  sections: [
    {
      id: 'frontend-stack',
      title: 'Frontend',
      spine: [
        {
          id: 'html-css-js',
          title: 'HTML / CSS / JavaScript',
          style: 'primary',
          estimatedHours: 48,
          difficulty: 'Beginner',
          branches: [
            { id: 'semantic-html-fs', title: 'Semantic HTML', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Beginner' },
            { id: 'flexbox-grid-fs', title: 'Flexbox & Grid', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Beginner' },
            { id: 'dom-events', title: 'DOM & Events', side: 'left', style: 'alternative', estimatedHours: 10, difficulty: 'Intermediate' },
            { id: 'es6-plus', title: 'ES6+', side: 'left', style: 'alternative', estimatedHours: 10, difficulty: 'Intermediate' },
          ],
        },
        {
          id: 'react-frontend',
          title: 'React (Frontend)',
          style: 'primary',
          estimatedHours: 40,
          difficulty: 'Intermediate',
          branches: [
            { id: 'react-hooks-fs', title: 'Hooks', side: 'right', style: 'alternative', estimatedHours: 10, difficulty: 'Intermediate' },
            { id: 'react-ts', title: 'TypeScript', side: 'right', style: 'alternative', estimatedHours: 10, difficulty: 'Intermediate' },
            { id: 'tailwind-css', title: 'Tailwind CSS', side: 'left', style: 'alternative', estimatedHours: 8, difficulty: 'Beginner' },
            { id: 'state-mgmt-fs', title: 'State Management', side: 'left', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
          ],
        },
      ],
      checkpoint: { id: 'cp-frontend-fs', title: 'Checkpoint — Frontend Complete' },
    },
    {
      id: 'backend-stack',
      title: 'Backend',
      spine: [
        {
          id: 'nodejs',
          title: 'Node.js',
          style: 'primary',
          estimatedHours: 32,
          difficulty: 'Intermediate',
          branches: [
            { id: 'node-modules', title: 'Node Modules', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'event-loop', title: 'Event Loop', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
            { id: 'npm-packages', title: 'NPM Ecosystem', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Beginner' },
            { id: 'streams', title: 'Streams & Buffers', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
          ],
        },
        {
          id: 'express-rest-apis',
          title: 'Express / REST APIs',
          style: 'primary',
          estimatedHours: 36,
          difficulty: 'Intermediate',
          branches: [
            { id: 'rest-principles', title: 'REST Principles', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'graphql-basics', title: 'GraphQL', side: 'right', style: 'alternative', estimatedHours: 10, difficulty: 'Advanced' },
            { id: 'websockets', title: 'WebSockets', side: 'left', style: 'alternative', estimatedHours: 8, difficulty: 'Advanced' },
            { id: 'auth-jwt', title: 'Auth & JWTs', side: 'left', style: 'alternative', estimatedHours: 10, difficulty: 'Intermediate' },
          ],
        },
      ],
      checkpoint: { id: 'cp-backend-fs', title: 'Checkpoint — Backend Complete' },
    },
    {
      id: 'databases',
      title: 'Databases',
      spine: [
        {
          id: 'databases-sql-nosql',
          title: 'Databases',
          style: 'primary',
          estimatedHours: 40,
          difficulty: 'Intermediate',
          branches: [
            { id: 'postgresql-fs', title: 'PostgreSQL', side: 'right', style: 'alternative', estimatedHours: 12, difficulty: 'Intermediate' },
            { id: 'mongodb-fs', title: 'MongoDB', side: 'right', style: 'alternative', estimatedHours: 10, difficulty: 'Intermediate' },
            { id: 'redis-caching', title: 'Redis', side: 'left', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'orms', title: 'ORMs (Prisma / Drizzle)', side: 'left', style: 'alternative', estimatedHours: 10, difficulty: 'Intermediate' },
          ],
        },
        {
          id: 'authentication',
          title: 'Authentication',
          style: 'primary',
          estimatedHours: 24,
          difficulty: 'Intermediate',
          branches: [
            { id: 'oauth-2', title: 'OAuth 2.0', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Advanced' },
            { id: 'sessions-cookies', title: 'Sessions & Cookies', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'password-hashing', title: 'Password Hashing', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
            { id: 'security-basics', title: 'Security Basics', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
          ],
        },
      ],
      checkpoint: { id: 'cp-databases', title: 'Checkpoint — Databases & Auth Complete' },
    },
    {
      id: 'devops',
      title: 'DevOps & Deployment',
      spine: [
        {
          id: 'docker',
          title: 'Docker',
          style: 'primary',
          estimatedHours: 24,
          difficulty: 'Intermediate',
          branches: [
            { id: 'dockerfiles', title: 'Dockerfiles', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'docker-compose', title: 'Docker Compose', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Intermediate' },
            { id: 'container-registry', title: 'Container Registry', side: 'left', style: 'alternative', estimatedHours: 4, difficulty: 'Intermediate' },
          ],
        },
        {
          id: 'ci-cd',
          title: 'CI/CD',
          style: 'primary',
          estimatedHours: 20,
          difficulty: 'Advanced',
          branches: [
            { id: 'github-actions-fs', title: 'GitHub Actions', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Advanced' },
            { id: 'deploy-strategies', title: 'Deploy Strategies', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
            { id: 'rollback-health', title: 'Rollback & Health Checks', side: 'left', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
          ],
        },
        {
          id: 'cloud-deployment',
          title: 'Cloud Deployment',
          style: 'primary',
          estimatedHours: 28,
          difficulty: 'Advanced',
          branches: [
            { id: 'vercel-railway', title: 'Vercel / Railway', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Intermediate' },
            { id: 'aws-basics', title: 'AWS Basics', side: 'right', style: 'alternative', estimatedHours: 12, difficulty: 'Advanced' },
            { id: 'monitoring-fs', title: 'Monitoring', side: 'left', style: 'alternative', estimatedHours: 10, difficulty: 'Advanced' },
          ],
        },
        {
          id: 'system-design',
          title: 'System Design',
          style: 'primary',
          estimatedHours: 32,
          difficulty: 'Advanced',
          branches: [
            { id: 'system-requirements', title: 'Requirements Scoping', side: 'right', style: 'alternative', estimatedHours: 6, difficulty: 'Advanced' },
            { id: 'api-boundaries', title: 'API Boundaries', side: 'right', style: 'alternative', estimatedHours: 8, difficulty: 'Advanced' },
            { id: 'scaling-patterns', title: 'Scaling Patterns', side: 'left', style: 'alternative', estimatedHours: 10, difficulty: 'Advanced' },
            { id: 'failure-modes', title: 'Failure Modes', side: 'left', style: 'alternative', estimatedHours: 8, difficulty: 'Advanced' },
          ],
        },
      ],
      checkpoint: { id: 'cp-production-fs', title: 'Checkpoint — Full Stack Production Ready' },
    },
  ],
};

// Keyword → roadmap mapping
const ROADMAP_KEYWORD_MAP = [
  {
    roadmap: AI_ENGINEER_ROADMAP,
    keywords: ['ai engineer', 'ai/ml', 'ai ml', 'artificial intelligence', 'llm', 'large language model', 'machine learning engineer', 'ml engineer', 'ai product', 'generative ai', 'genai', 'ai roadmap'],
  },
  {
    roadmap: FRONTEND_ENGINEER_ROADMAP,
    keywords: ['frontend', 'front-end', 'front end', 'react developer', 'react engineer', 'web developer', 'ui developer', 'ui engineer', 'javascript developer', 'css developer', 'html developer'],
  },
  {
    roadmap: FULLSTACK_DEVELOPER_ROADMAP,
    keywords: ['full stack', 'fullstack', 'full-stack', 'backend', 'back-end', 'back end', 'node.js', 'nodejs', 'node developer', 'backend developer', 'backend engineer', 'software engineer'],
  },
];

export function detectRoadmapFromPrompt(prompt) {
  if (!prompt) return null;
  const text = prompt.toLowerCase().trim();
  for (const entry of ROADMAP_KEYWORD_MAP) {
    if (entry.keywords.some((kw) => text.includes(kw))) {
      return entry.roadmap;
    }
  }
  return null;
}
