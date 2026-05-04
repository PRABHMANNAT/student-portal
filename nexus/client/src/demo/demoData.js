const CAREERS = [
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'React Developer',
  'Vue.js Developer',
  'Angular Developer',
  'Node.js Developer',
  'Python Developer',
  'Django Developer',
  'FastAPI Developer',
  'Java Developer',
  'Spring Boot Developer',
  'Golang Developer',
  'Rust Developer',
  'iOS Developer (Swift)',
  'Android Developer (Kotlin)',
  'Flutter Developer',
  'React Native Developer',
  'DevOps Engineer',
  'Site Reliability Engineer (SRE)',
  'Cloud Engineer (AWS)',
  'Cloud Engineer (GCP)',
  'Cloud Engineer (Azure)',
  'Kubernetes Engineer',
  'Docker & Containerization',
  'CI/CD Engineer',
  'Linux System Administrator',
  'Cybersecurity Engineer',
  'Penetration Tester (Ethical Hacker)',
  'Blockchain Developer',
  'Smart Contract Developer (Solidity)',
  'Web3 Developer',
  'AI/ML Engineer',
  'Deep Learning Engineer',
  'NLP Engineer',
  'Computer Vision Engineer',
  'Data Scientist',
  'Data Analyst',
  'Data Engineer',
  'MLOps Engineer',
  'Prompt Engineer',
  'LLM Fine-tuning Engineer',
  'Embedded Systems Engineer',
  'Game Developer (Unity)',
  'Game Developer (Unreal Engine)',
  'Technical SEO Engineer',
  'QA Automation Engineer',
  'Database Administrator (PostgreSQL)',
  'GraphQL API Developer',
  'Open Source Contributor path',
  'Product Manager',
  'Technical Product Manager',
  'UX/UI Designer',
  'Product Designer',
  'No-Code Builder (Webflow/Bubble)',
  'Startup Founder (Technical)',
  'Startup Founder (Non-Technical)',
  'Growth Hacker',
  'Digital Marketer',
  'Content Strategist',
  'SaaS Builder',
  'Indie Hacker',
  'VC-Backed Founder path',
  'Angel Investor path',
  'Video Editor',
  'Motion Designer',
  '3D Artist (Blender)',
  'Brand Designer',
  'Illustrator / Digital Artist',
  'Photographer to Pro',
  'YouTube Creator',
  'Podcast Creator',
  'Newsletter Writer',
  'Quant Developer',
  'Financial Analyst',
  'Chartered Accountant (CA)',
  'Corporate Lawyer path',
  'Product Marketer',
  'Technical Writer',
  'Developer Advocate'
];

const FOUNDATIONS = {
  web: ['HTML & CSS', 'JavaScript', 'Git & GitHub', 'Web Basics'],
  backend: ['Programming Fundamentals', 'API Design', 'Databases', 'Auth & Security'],
  cloud: ['Linux Basics', 'Networking', 'Cloud Fundamentals', 'Infrastructure as Code'],
  data: ['Python', 'Statistics', 'SQL', 'Data Visualization'],
  ai: ['Python', 'Linear Algebra', 'Machine Learning', 'Model Evaluation'],
  product: ['User Research', 'Product Strategy', 'Metrics', 'Roadmapping'],
  design: ['Visual Design', 'UX Research', 'Figma Systems', 'Accessibility'],
  creative: ['Creative Workflow', 'Storytelling', 'Tooling', 'Portfolio'],
  finance: ['Financial Modeling', 'Markets', 'Excel / Sheets', 'Risk Basics'],
  law: ['Legal Research', 'Contracts', 'Corporate Law', 'Writing']
};

const YOUTUBE_POOL = [
  ['Full Course for Beginners', 'freeCodeCamp', '6h 30m', 'https://www.youtube.com/@freecodecamp'],
  ['Crash Course', 'Traversy Media', '2h 10m', 'https://www.youtube.com/@TraversyMedia'],
  ['In 100 Seconds', 'Fireship', '12m', 'https://www.youtube.com/@Fireship'],
  ['Production Patterns', 'The Primeagen', '1h 05m', 'https://www.youtube.com/@ThePrimeagen'],
  ['Deep Dive Tutorial', 'Academind', '3h 20m', 'https://www.youtube.com/@academind'],
  ['Practical Guide', 'TechWorld with Nana', '2h 45m', 'https://www.youtube.com/@TechWorldwithNana'],
  ['Systems Explained', 'ByteByteGo', '25m', 'https://www.youtube.com/@ByteByteGo'],
  ['Computer Science Lecture', 'MIT OpenCourseWare', '1h 20m', 'https://www.youtube.com/@mitocw'],
  ['Stanford Lecture', 'Stanford Online', '1h 15m', 'https://www.youtube.com/@stanfordonline'],
  ['Hands-on Walkthrough', 'Web Dev Simplified', '48m', 'https://www.youtube.com/@WebDevSimplified']
];

const DOC_POOL = [
  ['MDN Reference', 'https://developer.mozilla.org', 'developer.mozilla.org'],
  ['web.dev Reference', 'https://web.dev/learn', 'web.dev'],
  ['freeCodeCamp Curriculum', 'https://www.freecodecamp.org/learn', 'freecodecamp.org'],
  ['GitHub Docs', 'https://docs.github.com', 'docs.github.com'],
  ['OWASP', 'https://owasp.org/www-project-top-ten/', 'owasp.org'],
  ['Docker Docs', 'https://docs.docker.com', 'docs.docker.com'],
  ['Kubernetes Docs', 'https://kubernetes.io/docs/home/', 'kubernetes.io'],
  ['AWS Docs', 'https://docs.aws.amazon.com', 'docs.aws.amazon.com'],
  ['Google Cloud Docs', 'https://cloud.google.com/docs', 'cloud.google.com'],
  ['Azure Docs', 'https://learn.microsoft.com/azure/', 'learn.microsoft.com'],
  ['Papers with Code', 'https://paperswithcode.com', 'paperswithcode.com'],
  ['arXiv', 'https://arxiv.org', 'arxiv.org'],
  ['React Docs', 'https://react.dev/learn', 'react.dev'],
  ['PostgreSQL Docs', 'https://www.postgresql.org/docs/', 'postgresql.org'],
  ['CSS-Tricks', 'https://css-tricks.com', 'css-tricks.com']
];

const SPECIAL_DOCS = {
  'HTML & CSS': [
    ['MDN HTML Reference', 'https://developer.mozilla.org', 'developer.mozilla.org'],
    ['CSS Tricks Complete Guide', 'https://css-tricks.com', 'css-tricks.com']
  ],
  React: [
    ['React Docs', 'https://react.dev/learn', 'react.dev'],
    ['Vercel React Guide', 'https://vercel.com/guides', 'vercel.com']
  ],
  Kubernetes: [
    ['Kubernetes Docs', 'https://kubernetes.io/docs/home/', 'kubernetes.io'],
    ['CNCF Landscape', 'https://landscape.cncf.io', 'landscape.cncf.io']
  ],
  Docker: [
    ['Docker Docs', 'https://docs.docker.com', 'docs.docker.com'],
    ['Docker Curriculum', 'https://docker-curriculum.com', 'docker-curriculum.com']
  ],
  Python: [
    ['Python Docs', 'https://docs.python.org/3/', 'docs.python.org'],
    ['Real Python', 'https://realpython.com', 'realpython.com']
  ],
  'Machine Learning': [
    ['Papers with Code', 'https://paperswithcode.com', 'paperswithcode.com'],
    ['scikit-learn Docs', 'https://scikit-learn.org/stable/user_guide.html', 'scikit-learn.org']
  ]
};

const SPECIAL_YOUTUBE = {
  'HTML & CSS': [
    {
      title: 'HTML & CSS Full Course',
      channel: 'freeCodeCamp',
      duration: '6h 30m',
      url: 'https://youtube.com/watch?v=mU6anWqZJcc',
      thumbnail: ''
    },
    {
      title: 'CSS Grid & Flexbox',
      channel: 'Kevin Powell',
      duration: '2h 15m',
      url: 'https://youtube.com/watch?v=u044iM9xsWU',
      thumbnail: ''
    }
  ]
};

function slug(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function categoryForCareer(career) {
  const value = career.toLowerCase();
  if (/ai|ml|learning|nlp|vision|prompt|llm/.test(value)) return 'ai';
  if (/data|quant|analyst/.test(value)) return 'data';
  if (/devops|reliability|cloud|kubernetes|docker|ci\/cd|linux/.test(value)) return 'cloud';
  if (/security|hacker/.test(value)) return 'cloud';
  if (/product|founder|growth|marketer|saas|indie|investor/.test(value)) return 'product';
  if (/design|ux|ui|webflow|bubble/.test(value)) return 'design';
  if (/video|motion|3d|blender|brand|illustrator|photo|youtube|podcast|newsletter/.test(value)) return 'creative';
  if (/financial|accountant|lawyer|law/.test(value)) return value.includes('law') ? 'law' : 'finance';
  return career.includes('Frontend') || career.includes('React') || career.includes('Vue') || career.includes('Angular') ? 'web' : 'backend';
}

function careerCoreTopics(career) {
  const value = career.toLowerCase();
  if (value.includes('frontend')) return ['HTML & CSS', 'JavaScript', 'React', 'TypeScript'];
  if (value.includes('full stack')) return ['HTML & CSS', 'React', 'Node & Express', 'PostgreSQL'];
  if (value.includes('react')) return ['HTML & CSS', 'JavaScript', 'React', 'React Testing'];
  if (value.includes('vue')) return ['HTML & CSS', 'JavaScript', 'Vue 3', 'Pinia'];
  if (value.includes('angular')) return ['TypeScript', 'Angular', 'RxJS', 'Angular Testing'];
  if (value.includes('python')) return ['Python', 'FastAPI', 'Testing', 'Packaging'];
  if (value.includes('devops')) return ['Linux', 'Docker', 'CI/CD', 'Kubernetes'];
  if (value.includes('data scientist')) return ['Python', 'Statistics', 'Machine Learning', 'Model Storytelling'];
  if (value.includes('ai/ml')) return ['Python', 'Machine Learning', 'Deep Learning', 'MLOps'];
  if (value.includes('startup') || value.includes('founder')) return ['Customer Discovery', 'MVP Building', 'Go-to-Market', 'Fundraising'];
  return [career.replace(/\s*\(.+\)/, ''), 'Tooling', 'Production Workflow', 'Portfolio'];
}

function phaseTopics(career) {
  const category = categoryForCareer(career);
  const foundation = FOUNDATIONS[category] || FOUNDATIONS.backend;
  const core = careerCoreTopics(career);
  return [
    { label: 'Foundation', duration: '0-3 months', topics: foundation },
    { label: 'Core Systems', duration: '3-6 months', topics: core },
    { label: 'Production Practice', duration: '6-9 months', topics: ['Testing', 'Performance', 'Deployment', 'Observability'] },
    { label: 'Portfolio & Hiring', duration: '9-12 months', topics: ['Capstone Project', 'Case Studies', 'Interview Prep', 'Open Source'] }
  ];
}

function makeYoutube(topic, index) {
  if (SPECIAL_YOUTUBE[topic]) return SPECIAL_YOUTUBE[topic];
  return [0, 1, 2].map((offset) => {
    const item = YOUTUBE_POOL[(index + offset) % YOUTUBE_POOL.length];
    return {
      title: `${topic} ${item[0]}`,
      channel: item[1],
      duration: item[2],
      url: item[3],
      thumbnail: ''
    };
  });
}

function makeDocs(topic, index) {
  const docs = SPECIAL_DOCS[topic] || [DOC_POOL[index % DOC_POOL.length], DOC_POOL[(index + 4) % DOC_POOL.length]];
  return docs.map(([title, url, domain]) => ({ title, url, domain }));
}

function makeProjects(topic, career, index) {
  if (topic === 'HTML & CSS') {
    return [
      { title: 'Semantic HTML practice page', hours: 8, difficulty: 'Beginner' },
      { title: 'Clone a Pricing Page UI', hours: 4, difficulty: 'Beginner' }
    ];
  }
  return [
    { title: `${topic} implementation lab`, hours: 6 + (index % 5) * 2, difficulty: index % 3 ? 'Beginner' : 'Intermediate' },
    { title: `${topic} debugging review`, hours: 4 + (index % 4) * 2, difficulty: 'Beginner' }
  ];
}

function makeNode(topic, career, phaseIndex, nodeIndex) {
  const index = phaseIndex * 7 + nodeIndex;
  const type = nodeIndex === 3 ? 'optional' : nodeIndex === 2 && phaseIndex > 1 ? 'checkpoint' : 'key';
  return {
    id: `${slug(career)}-${slug(topic)}-${phaseIndex}-${nodeIndex}`,
    title: topic,
    hours: topic === 'HTML & CSS' ? 40 : 16 + ((index * 7) % 7) * 6 + phaseIndex * 8,
    type,
    description: `${topic} for ${career}: practical concepts, production habits, and proof-of-work execution.`,
    youtube: makeYoutube(topic, index),
    docs: makeDocs(topic, index),
    projects: makeProjects(topic, career, index)
  };
}

function makeRoadmap(career) {
  const phases = phaseTopics(career).map((phase, phaseIndex) => ({
    id: `${slug(career)}-phase-${phaseIndex + 1}`,
    label: phase.label,
    duration: phase.duration,
    hours: 0,
    nodes: phase.topics.map((topic, nodeIndex) => makeNode(topic, career, phaseIndex, nodeIndex))
  }));

  phases.forEach((phase) => {
    phase.hours = phase.nodes.reduce((total, node) => total + node.hours, 0);
  });

  return {
    title: career,
    description: `A detailed ${career} roadmap with practical milestones, resources, and proof-of-work projects.`,
    phases,
    totalHours: phases.reduce((total, phase) => total + phase.hours, 0)
  };
}

export const ROADMAPS = Object.fromEntries(CAREERS.map((career) => [career, makeRoadmap(career)]));

export const ROADMAP_ALIASES = {
  'Cloud Engineer AWS': 'Cloud Engineer (AWS)',
  'Cloud Engineer GCP': 'Cloud Engineer (GCP)',
  'Cloud Engineer Azure': 'Cloud Engineer (Azure)',
  'Game Developer Unity': 'Game Developer (Unity)',
  'Game Developer Unreal': 'Game Developer (Unreal Engine)',
  'Startup Founder Technical': 'Startup Founder (Technical)',
  'Startup Founder Non-Technical': 'Startup Founder (Non-Technical)',
  'No-Code Builder': 'No-Code Builder (Webflow/Bubble)',
  '3D Artist Blender': '3D Artist (Blender)'
};

export function getRoadmapByCareer(career) {
  const key = ROADMAP_ALIASES[career] || career;
  return ROADMAPS[key] || ROADMAPS['Full Stack Developer'];
}
