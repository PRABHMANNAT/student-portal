import { motion } from 'framer-motion';
import { ArrowRight, NotebookPen, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import CompanyLogo from '../components/CompanyLogo';
import AppShell from '../components/Shell/AppShell';
import { useApp } from '../context/AppContext';

const TABS = [
  { key: 'all', label: 'ALL' },
  { key: 'roadmap', label: 'ROADMAPS' },
  { key: 'jobs', label: 'JOBS' },
  { key: 'notes', label: 'NOTES' }
];

function formatSavedDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function resolveRoadmapPayload(item) {
  const payload = item.payload || {};
  return payload.roadmap || payload;
}

function resolveJobPayload(item) {
  const payload = item.payload || {};

  if (Array.isArray(payload.jobs)) {
    return payload.jobs[0] || null;
  }

  if (payload.job) {
    return payload.job;
  }

  return payload;
}

function resolveNotePayload(item) {
  const payload = item.payload || {};

  if (payload.note) {
    return {
      ...payload.note,
      comments: payload.comments || []
    };
  }

  return payload;
}

function RoadmapPreview({ roadmap }) {
  const phases = roadmap?.phases || [];
  const points = phases.map((phase, index) => ({
    x: 18 + index * (phases.length > 1 ? 150 / (phases.length - 1) : 0),
    y: 24 + ((index % 2) * 18)
  }));

  return (
    <svg viewBox="0 0 186 84" className="collections-roadmap-preview" aria-hidden="true">
      <rect x="1" y="1" width="184" height="82" rx="18" fill="#f7f6f3" stroke="var(--border)" />
      {points.slice(0, -1).map((point, index) => (
        <path
          key={`line-${phases[index]?.id || index}`}
          d={`M ${point.x} ${point.y} C ${point.x + 18} ${point.y - 10}, ${points[index + 1].x - 18} ${points[index + 1].y + 10}, ${points[index + 1].x} ${points[index + 1].y}`}
          fill="none"
          stroke="#00b4a0"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.42"
        />
      ))}
      {points.map((point, index) => (
        <g key={phases[index]?.id || index}>
          <circle cx={point.x} cy={point.y} r="8" fill={phases[index]?.color || '#00b4a0'} />
          <circle cx={point.x} cy={point.y} r="13" fill="none" stroke={phases[index]?.color || '#00b4a0'} opacity="0.2" />
        </g>
      ))}
    </svg>
  );
}

function EmptyCollectionState() {
  return (
    <div className="collections-empty-state">
      <motion.svg
        viewBox="0 0 240 200"
        className="collections-empty-illustration"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <rect x="28" y="56" width="184" height="104" rx="18" fill="#ffffff" stroke="var(--border)" />
        <path d="M54 70v76M94 70v76M134 70v76M174 70v76" stroke="var(--border-input)" strokeWidth="8" strokeLinecap="round" />
        <path d="M42 160h156" stroke="var(--mid)" strokeWidth="5" strokeLinecap="round" opacity="0.14" />
        <rect x="58" y="86" width="24" height="48" rx="8" fill="var(--teal-soft)" stroke="var(--teal)" />
        <rect x="100" y="78" width="24" height="56" rx="8" fill="rgba(139,127,212,0.12)" stroke="var(--purple)" />
        <rect x="142" y="94" width="24" height="40" rx="8" fill="rgba(245,147,64,0.12)" stroke="var(--orange)" />
      </motion.svg>

      <p className="collections-empty-copy">
        Your collection is empty. Start by saving a roadmap or note.
      </p>

      <div className="collections-empty-actions">
        <Link to="/roadmap" className="collections-cta collections-cta-primary">
          Explore Roadmaps
        </Link>
        <Link to="/notes" className="collections-cta collections-cta-secondary">
          Generate Notes
        </Link>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  const navigate = useNavigate();
  const { collections, collectionsLoading, removeCollection } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = useMemo(() => {
    if (activeTab === 'all') {
      return collections;
    }

    return collections.filter((item) => item.type === activeTab);
  }, [activeTab, collections]);

  const openCollectionItem = (item) => {
    if (item.type === 'roadmap') {
      const roadmap = resolveRoadmapPayload(item);
      navigate('/roadmap', {
        state: roadmap?.title ? { savedRoadmap: roadmap } : undefined
      });
      return;
    }

    if (item.type === 'jobs') {
      const job = resolveJobPayload(item);
      navigate('/jobs', {
        state: job?.title ? { savedJob: job } : undefined
      });
      return;
    }

    if (item.type === 'notes') {
      const note = resolveNotePayload(item);
      navigate('/notes', {
        state: note?.title ? { savedNote: note } : undefined
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AppShell
        chat={{ hidden: true, title: 'Collection' }}
        artifact={{
          hideHeader: true,
          empty: false,
          motionKey: `collections-${activeTab}-${filteredItems.length}`
        }}
      >
        <div className="collections-page">
          <div className="collections-topbar">
            <div>
              <h1 className="collections-title">COLLECTION</h1>
            </div>

            <div className="collections-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`collections-tab ${activeTab === tab.key ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {collectionsLoading ? (
            <div className="collections-loading">Loading saved workspace artifacts...</div>
          ) : filteredItems.length ? (
            <div className="collections-grid">
              {filteredItems.map((item, index) => {
                if (item.type === 'roadmap') {
                  const roadmap = resolveRoadmapPayload(item);
                  const phasesCount = roadmap?.phases?.length || 0;
                  const nodesCount = roadmap?.phases?.reduce(
                    (count, phase) => count + (phase.nodes?.length || 0),
                    0
                  ) || 0;

                  return (
                    <motion.article
                      key={item.id}
                      className="collections-card collections-card-roadmap"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.32 }}
                    >
                      <button
                        type="button"
                        className="collections-delete"
                        onClick={() => removeCollection(item.id)}
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 size={16} strokeWidth={1.9} />
                      </button>

                      <RoadmapPreview roadmap={roadmap} />

                      <div className="collections-card-head">
                        <h3 className="collections-roadmap-title">{item.title}</h3>
                        <span className="collections-date-chip">{formatSavedDate(item.savedAt)}</span>
                      </div>

                      <p className="collections-roadmap-meta">{`${phasesCount} phases · ${nodesCount} nodes`}</p>

                      <button
                        type="button"
                        className="collections-open-button"
                        onClick={() => openCollectionItem(item)}
                      >
                        OPEN IN 3D <ArrowRight size={14} strokeWidth={2} />
                      </button>
                    </motion.article>
                  );
                }

                if (item.type === 'jobs') {
                  const job = resolveJobPayload(item);

                  return (
                    <motion.article
                      key={item.id}
                      className="collections-card collections-card-job"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.32 }}
                    >
                      <button
                        type="button"
                        className="collections-delete"
                        onClick={() => removeCollection(item.id)}
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 size={16} strokeWidth={1.9} />
                      </button>

                      <div className="collections-job-top">
                        <CompanyLogo
                          company={job?.company || item.title}
                          domain={job?.companyDomain}
                          url={job?.applyUrl}
                          links={job?.links}
                        />
                        <div>
                          <strong>{job?.company || item.title}</strong>
                          <span>{job?.postedAt || formatSavedDate(item.savedAt)}</span>
                        </div>
                      </div>

                      <h3 className="collections-job-title">{job?.title || item.title}</h3>
                      <div className="collections-tag-row">
                        {(job?.tags || item.tags || []).slice(0, 4).map((tag) => (
                          <span key={`${item.id}-${tag}`} className="collections-job-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="collections-job-salary">{job?.salary || item.summary}</p>

                      <button
                        type="button"
                        className="collections-open-button"
                        onClick={() => openCollectionItem(item)}
                      >
                        OPEN JOB <ArrowRight size={14} strokeWidth={2} />
                      </button>
                    </motion.article>
                  );
                }

                const note = resolveNotePayload(item);
                const preview =
                  (note?.content || item.summary || '')
                    .split('\n')
                    .filter(Boolean)
                    .slice(0, 3)
                    .join(' ')
                    .replace(/[#*`>-]/g, '')
                    .trim() || item.summary;

                return (
                  <motion.article
                    key={item.id}
                    className="collections-card collections-card-note"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.32 }}
                  >
                    <button
                      type="button"
                      className="collections-delete"
                      onClick={() => removeCollection(item.id)}
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 size={16} strokeWidth={1.9} />
                    </button>

                    <div className="collections-note-icon">
                      <NotebookPen size={18} strokeWidth={1.9} />
                    </div>

                    <div className="collections-card-head">
                      <h3 className="collections-note-title">{item.title}</h3>
                      <span className="collections-date-chip">{formatSavedDate(item.savedAt)}</span>
                    </div>

                    <p className="collections-note-preview">{preview}</p>

                    <div className="collections-note-bottom">
                      <span className="collections-comment-badge">
                        {(note?.comments || []).length} comments
                      </span>

                      <button
                        type="button"
                        className="collections-open-button"
                        onClick={() => openCollectionItem(item)}
                      >
                        OPEN NOTES <ArrowRight size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <EmptyCollectionState />
          )}
        </div>
      </AppShell>
    </motion.div>
  );
}
