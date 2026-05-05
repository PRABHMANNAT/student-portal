import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Map, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';

import AppShell from '../components/Shell/AppShell';
import '../styles/collections-v2.css';

const TABS = [
  { key: 'all', label: 'ALL' },
  { key: 'saved-profile', label: 'SAVED PROFILES' },
  { key: 'job', label: 'JOBS' },
  { key: 'roadmap', label: 'ROADMAPS' }
];

const MOCK_COLLECTIONS = [
  // Saved Profiles
  {
    id: 'sp-1',
    type: 'saved-profile',
    title: 'IBM SDE 1 Profile',
    subtitle: 'Tailored for Northstar Labs / IBM-style SDE screening',
    description: 'Backend-leaning profile version with Python, SQL, REST APIs, and recruiter-focused proof.',
    date: 'Apr 24, 2026',
    tags: ['Python', 'SQL', 'APIs'],
    cta: 'OPEN PROFILE'
  },
  {
    id: 'sp-2',
    type: 'saved-profile',
    title: 'Frontend Engineer Profile',
    subtitle: 'Tailored for UI/UX focused roles',
    description: 'Frontend role with strong React, UI systems, and product execution focus. Emphasizes visual polish.',
    date: 'Apr 18, 2026',
    tags: ['React', 'Framer Motion', 'Tailwind'],
    cta: 'OPEN PROFILE'
  },
  {
    id: 'sp-3',
    type: 'saved-profile',
    title: 'Backend Engineer Profile',
    subtitle: 'High-performance systems engineering',
    description: 'AI-tailored profile version for backend-focused graduate roles. Focuses on architecture and distributed systems.',
    date: 'Apr 15, 2026',
    tags: ['Go', 'PostgreSQL', 'Docker'],
    cta: 'OPEN PROFILE'
  },
  // Jobs
  {
    id: 'job-1',
    type: 'job',
    title: 'Frontend Engineer',
    company: 'Northstar Labs',
    description: 'Joining the core platform team to build scalable UI systems and interactive dashboards.',
    date: 'Apr 26, 2026',
    tags: ['Remote', 'Full-time', 'React'],
    salary: '$110k - $130k',
    cta: 'OPEN JOB'
  },
  {
    id: 'job-2',
    type: 'job',
    title: 'Full Stack Engineer',
    company: 'Lumio AI',
    description: 'Building AI-driven recruiter workflows and maintaining the Node/React monolithic architecture.',
    date: 'Apr 22, 2026',
    tags: ['Hybrid', 'TypeScript', 'Node.js'],
    salary: '$120k - $145k',
    cta: 'OPEN JOB'
  },
  {
    id: 'job-3',
    type: 'job',
    title: 'Product Engineer',
    company: 'Vertex Systems',
    description: 'Fast-paced product engineering role focusing on shipping user-facing features quickly.',
    date: 'Apr 10, 2026',
    tags: ['Remote', 'React', 'Go'],
    salary: '$105k - $125k',
    cta: 'OPEN JOB'
  },
  // Roadmaps
  {
    id: 'rm-1',
    type: 'roadmap',
    title: 'Full Stack Developer',
    description: 'Structured path with phases, milestones, and skill nodes covering frontend and backend fundamentals.',
    date: 'Apr 28, 2026',
    phasesCount: 4,
    nodesCount: 32,
    cta: 'OPEN IN 3D'
  },
  {
    id: 'rm-2',
    type: 'roadmap',
    title: 'Backend Foundations',
    description: 'Deep dive into databases, caching, message queues, and API design principles.',
    date: 'Apr 12, 2026',
    phasesCount: 3,
    nodesCount: 24,
    cta: 'OPEN IN 3D'
  },
  {
    id: 'rm-3',
    type: 'roadmap',
    title: 'AI Product Builder',
    description: 'Integrating LLMs, prompt engineering, and building AI-first application architectures.',
    date: 'Apr 29, 2026',
    phasesCount: 5,
    nodesCount: 40,
    cta: 'OPEN IN 3D'
  }
];

function RoadmapPreview() {
  return (
    <svg viewBox="0 0 186 64" className="collections-v2-roadmap-preview" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
      <path
        d="M 18 32 C 36 22, 132 42, 150 32"
        fill="none"
        stroke="#18C8B8"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.42"
      />
      <circle cx="18" cy="32" r="6" fill="#18C8B8" />
      <circle cx="18" cy="32" r="10" fill="none" stroke="#18C8B8" opacity="0.2" />
      
      <circle cx="84" cy="34" r="6" fill="#18C8B8" />
      <circle cx="84" cy="34" r="10" fill="none" stroke="#18C8B8" opacity="0.2" />
      
      <circle cx="150" cy="32" r="6" fill="#18C8B8" />
      <circle cx="150" cy="32" r="10" fill="none" stroke="#18C8B8" opacity="0.2" />
    </svg>
  );
}

function SavedProfileCard({ item }) {
  return (
    <motion.article className="collections-v2-card saved-profile">
      <div className="collections-v2-card-top">
        <div className="collections-v2-card-icon-wrapper" style={{ color: '#8B5CF6', background: '#EEE7FF', borderColor: '#EEE7FF' }}>
          <UserRound size={18} strokeWidth={2} />
        </div>
        <span className="collections-v2-card-date">{item.date}</span>
      </div>
      
      <div className="collections-v2-card-body">
        <span className="collections-v2-card-label">Profile</span>
        <h3 className="collections-v2-card-title">{item.title}</h3>
        {item.subtitle && <p className="collections-v2-card-subtitle">{item.subtitle}</p>}
        <p className="collections-v2-card-description">{item.description}</p>
      </div>

      <div className="collections-v2-card-tags">
        {item.tags?.map((tag) => (
          <span key={tag} className="collections-v2-card-tag">{tag}</span>
        ))}
      </div>

      <div className="collections-v2-card-bottom">
        <button type="button" className="collections-v2-card-cta">
          {item.cta} <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>
    </motion.article>
  );
}

function JobCard({ item }) {
  return (
    <motion.article className="collections-v2-card job">
      <div className="collections-v2-card-top">
        <div className="collections-v2-card-icon-wrapper" style={{ color: '#F4A24D', background: '#FFF4C7', borderColor: '#FFF4C7' }}>
          <Briefcase size={18} strokeWidth={2} />
        </div>
        <span className="collections-v2-card-date">{item.date}</span>
      </div>
      
      <div className="collections-v2-card-body">
        <span className="collections-v2-card-label">{item.company}</span>
        <h3 className="collections-v2-card-title">{item.title}</h3>
        <p className="collections-v2-card-description">{item.description}</p>
      </div>

      <div className="collections-v2-card-meta">
        <strong>{item.salary}</strong>
        <span>•</span>
        <div className="collections-v2-card-tags" style={{ paddingTop: 0, marginTop: 0 }}>
          {item.tags?.map((tag) => (
            <span key={tag} className="collections-v2-card-tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="collections-v2-card-bottom">
        <button type="button" className="collections-v2-card-cta">
          {item.cta} <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>
    </motion.article>
  );
}

function RoadmapCard({ item }) {
  return (
    <motion.article className="collections-v2-card roadmap">
      <div className="collections-v2-card-top">
        <div className="collections-v2-card-icon-wrapper" style={{ color: '#18C8B8', background: '#BFF3EB', borderColor: '#BFF3EB' }}>
          <Map size={18} strokeWidth={2} />
        </div>
        <span className="collections-v2-card-date">{item.date}</span>
      </div>
      
      <div className="collections-v2-card-body">
        <span className="collections-v2-card-label">Roadmap</span>
        <h3 className="collections-v2-card-title">{item.title}</h3>
        <p className="collections-v2-card-description">{item.description}</p>
      </div>

      <div className="collections-v2-roadmap-preview">
        <RoadmapPreview />
      </div>

      <div className="collections-v2-card-meta">
        {item.phasesCount} Phases • {item.nodesCount} Nodes
      </div>

      <div className="collections-v2-card-bottom">
        <button type="button" className="collections-v2-card-cta">
          {item.cta} <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>
    </motion.article>
  );
}

export default function CollectionsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return MOCK_COLLECTIONS;
    return MOCK_COLLECTIONS.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AppShell
        chat={{ hidden: true, title: 'Collection' }}
        artifact={{
          hideHeader: true,
          empty: false,
          motionKey: `collections-${activeFilter}-${filteredItems.length}`
        }}
      >
        <div className="collections-v2-page">
          <div className="collections-v2-topbar">
            <div className="collections-v2-header-content">
              <h1 className="collections-v2-title">SAVED COLLECTION</h1>
              <p className="collections-v2-subtitle">
                Saved profiles, job opportunities, and learning paths in one place.
              </p>
            </div>

            <div className="collections-v2-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`collections-v2-tab ${activeFilter === tab.key ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
              <span className="collections-v2-result-count">
                {filteredItems.length} saved items
              </span>
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <motion.div 
              className="collections-v2-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              {filteredItems.map((item) => {
                const variants = {
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                };

                return (
                  <motion.div key={item.id} variants={variants}>
                    {item.type === 'saved-profile' && <SavedProfileCard item={item} />}
                    {item.type === 'job' && <JobCard item={item} />}
                    {item.type === 'roadmap' && <RoadmapCard item={item} />}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="collections-v2-empty">
              <h3>No items found</h3>
              <p>Try changing your filter to see more saved resources.</p>
            </div>
          )}
        </div>
      </AppShell>
    </motion.div>
  );
}
