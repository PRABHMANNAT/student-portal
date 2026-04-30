import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Compass, ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'remote', label: 'Remote' },
  { key: 'full-time', label: 'Full-time' },
  { key: 'internship', label: 'Internship' },
  { key: 'company', label: 'By Company' }
];

const loadingSteps = ['Scanning LinkedIn...', 'Checking Indeed...', 'Parsing results...'];

function domainFromUrl(url = '') {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'direct link';
  }
}

function formatQueryPills(query = {}) {
  return [query.role, query.experience || query.level, query.type, query.location, query.stack]
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(Boolean);
}

export function JobsLoadingPanel() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % loadingSteps.length);
    }, 1300);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="jobs-loading-panel">
      <div className="jobs-loading-center">
        <motion.svg
          viewBox="0 0 100 100"
          className="jobs-loading-compass"
          animate={{ rotate: 360 }}
          transition={{ duration: 3.8, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
        >
          <circle cx="50" cy="50" r="38" fill="#ffffff" stroke="rgba(245,147,64,0.16)" strokeWidth="2" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#f59340" strokeWidth="2.5" strokeDasharray="4 8" />
          <path d="M50 18 62 52 50 82 38 52Z" fill="#f59340" opacity="0.92" />
          <circle cx="50" cy="50" r="6" fill="#ffffff" stroke="#f59340" strokeWidth="2" />
        </motion.svg>

        <p className="jobs-loading-copy">COLUMBUS IS NAVIGATING...</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={loadingSteps[stepIndex]}
            className="jobs-loading-status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24 }}
          >
            {loadingSteps[stepIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function JobResultsPanel({
  result,
  selectedJobId,
  onSelectJob,
  activeFilter,
  onFilterChange,
  onSaveJob,
  savingJobId,
  selectedJobDetail
}) {
  const jobs = result?.jobs || [];
  const queryPills = useMemo(() => formatQueryPills(result?.query), [result?.query]);

  const filteredJobs = useMemo(() => {
    const nextJobs = [...jobs];

    switch (activeFilter) {
      case 'remote':
        return nextJobs.filter((job) => `${job.location} ${job.type}`.toLowerCase().includes('remote'));
      case 'full-time':
        return nextJobs.filter((job) => (job.type || '').toLowerCase().includes('full-time'));
      case 'internship':
        return nextJobs.filter((job) => (job.type || '').toLowerCase().includes('intern'));
      case 'company':
        return nextJobs.sort((left, right) => left.company.localeCompare(right.company));
      default:
        return nextJobs;
    }
  }, [activeFilter, jobs]);

  const selectedJob =
    selectedJobDetail ||
    jobs.find((job) => job.id === selectedJobId) ||
    filteredJobs.find((job) => job.id === selectedJobId) ||
    filteredJobs[0] ||
    null;

  return (
    <div className="jobs-results-panel">
      <div className="jobs-results-main">
        <div className="jobs-filter-bar">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`jobs-filter-pill ${activeFilter === filter.key ? 'is-active' : ''}`}
              onClick={() => onFilterChange(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <h2 className="jobs-results-heading">{`COLUMBUS FOUND ${filteredJobs.length} ROLES`}</h2>

        {queryPills.length ? (
          <div className="jobs-results-query">
            {queryPills.map((pill) => (
              <span key={pill} className="jobs-query-pill">
                {pill}
              </span>
            ))}
          </div>
        ) : null}

        {result?.sources?.length ? (
          <p className="jobs-source-line">{`Sources: ${result.sources.join(' • ')}`}</p>
        ) : null}

        <div className="jobs-card-grid">
          {filteredJobs.map((job, index) => (
            <motion.button
              key={job.id}
              type="button"
              className={`job-card ${selectedJob?.id === job.id ? 'is-selected' : ''}`}
              onClick={() => onSelectJob(job.id)}
              layoutId={`job-card-${job.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
            >
              <div className="job-card-top">
                <div className="job-company-block">
                  <div className="job-company-logo" style={{ background: job.companyColor || '#1a1a1a' }}>
                    {job.companyInitial || job.company?.slice(0, 1) || 'C'}
                  </div>
                  <div className="job-company-meta">
                    <strong>{job.company}</strong>
                    <span className="job-source-line">{job.location}</span>
                  </div>
                </div>
                <span className="job-posted-chip">{job.postedAt || 'Fresh'}</span>
              </div>

              <h3 className="job-card-title">{job.title}</h3>

              <div className="job-tags">
                {(job.tags || []).slice(0, 4).map((tag) => (
                  <span key={tag} className="job-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="job-card-copy">{job.matchReason || job.summary}</p>
              <p className="job-card-salary">{job.salary}</p>

              <div className="job-card-bottom">
                <span className="job-apply-button">
                  APPLY <ArrowUpRight size={14} strokeWidth={2} />
                </span>
                <span className="job-source-badge">{`via ${job.source}`}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="jobs-results-sidebar">
        <AnimatePresence mode="wait" initial={false}>
          {selectedJob ? (
            <motion.aside
              key={selectedJob.id}
              className="job-detail-panel"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              layoutId={`job-card-${selectedJob.id}`}
            >
              <div className="job-detail-top">
                <div>
                  <span className="roadmap-resource-eyebrow">{selectedJob.company}</span>
                  <h3>{selectedJob.title}</h3>
                  <p className="job-detail-subtitle">
                    {selectedJob.location} • {selectedJob.type}
                  </p>
                </div>

                <div className="job-detail-match">
                  <strong>{selectedJob.relevanceScore || 88}</strong>
                  <span>MATCH</span>
                </div>
              </div>

              <div className="job-tags">
                {(selectedJob.tags || []).map((tag) => (
                  <span key={tag} className="job-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="job-detail-section">
                <h4>Role Brief</h4>
                <p>{selectedJob.description || selectedJob.summary}</p>
              </div>

              <div className="job-detail-section">
                <h4>Requirements</h4>
                <ul className="job-detail-list">
                  {(selectedJob.requirements || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="job-detail-section">
                <h4>Company</h4>
                <div className="job-detail-company">
                  <div className="job-detail-fact">
                    <span>Industry</span>
                    <strong>{selectedJob.companyInfo?.industry || 'Technology'}</strong>
                  </div>
                  <div className="job-detail-fact">
                    <span>Team</span>
                    <strong>{selectedJob.companyInfo?.size || 'Growing team'}</strong>
                  </div>
                  <div className="job-detail-fact">
                    <span>Location</span>
                    <strong>{selectedJob.companyInfo?.hq || selectedJob.location}</strong>
                  </div>
                  <div className="job-detail-fact">
                    <span>Why it matches</span>
                    <strong>{selectedJob.matchReason || 'Strong topical alignment'}</strong>
                  </div>
                </div>
              </div>

              <div className="job-detail-section">
                <h4>Apply Paths</h4>
                <div className="job-detail-resource-list">
                  {(selectedJob.links || []).map((link) => (
                    <a
                      key={`${selectedJob.id}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="job-detail-resource-card"
                    >
                      <div>
                        <strong>{link.title}</strong>
                        <div className="job-detail-resource-meta">
                          <span className="job-source-badge">{domainFromUrl(link.url)}</span>
                          <span className="jobs-source-line">{link.kind}</span>
                        </div>
                      </div>
                      <ExternalLink size={16} strokeWidth={2} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="job-detail-actions">
                <a href={selectedJob.applyUrl} target="_blank" rel="noreferrer" className="job-apply-button">
                  Open listing <ArrowUpRight size={14} strokeWidth={2} />
                </a>
                <button
                  type="button"
                  className="job-apply-button"
                  onClick={() => onSaveJob(selectedJob)}
                  disabled={savingJobId === selectedJob.id}
                >
                  {savingJobId === selectedJob.id ? 'Saving...' : 'Save to Collections'}
                </button>
              </div>
            </motion.aside>
          ) : (
            <motion.div
              key="job-detail-empty"
              className="job-detail-panel job-detail-empty"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
            >
              <div>
                <Compass size={28} strokeWidth={1.8} />
                <p>Select a job card to inspect the role, company, and apply links.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
