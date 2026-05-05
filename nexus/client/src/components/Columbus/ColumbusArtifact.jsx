import { motion } from 'framer-motion';
import { MapPin, Search, Sparkles } from 'lucide-react';
import JobDetailPanel from './JobDetailPanel';

export default function ColumbusArtifact({
  jobs,
  isLoading,
  selectedJobId,
  onSelectJob,
  activeFilter,
  onFilterChange,
  filters
}) {
  const selectedJob = jobs?.find(j => j.id === selectedJobId) || null;

  return (
    <main className="results-area">
      <div className="results-header">
        <div className="columbus-filter-row">
          {filters.map(f => (
            <button
              key={f}
              className={`columbus-filter-pill ${activeFilter === f ? 'is-active' : ''}`}
              onClick={() => onFilterChange(f)}
            >
              {f}
            </button>
          ))}
        </div>
        
        <h1 className="results-title">
          {isLoading ? 'COLUMBUS IS SEARCHING' : `COLUMBUS FOUND ${jobs?.length || 0} ROLES`}
        </h1>
        
        <div className="columbus-active-queries">
          <span className="columbus-query-tag">Frontend Developer</span>
          <span className="columbus-query-tag">1 year experience</span>
          <span className="columbus-query-tag">Remote</span>
        </div>
        
        <p className="columbus-sources">
          Sources: RemoteOK · HN Who's Hiring · GitHub Jobs Archive · Adzuna
        </p>
      </div>

      <div className="columbus-artifact-content">
        <div className="results-scroll">
          {isLoading ? (
            <div className="job-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="job-card columbus-skeleton" />
              ))}
            </div>
          ) : jobs?.length > 0 ? (
            <div className="job-grid">
              {jobs.map(job => (
                <motion.div
                  layoutId={`job-card-${job.id}`}
                  key={job.id}
                  className={`job-card ${selectedJobId === job.id ? 'is-selected' : ''}`}
                  onClick={() => onSelectJob(job.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="columbus-card-header">
                    <div className="columbus-company-avatar">
                      {job.companyInitials}
                    </div>
                    <div className="columbus-card-meta-top">
                      <span className="columbus-company-name">{job.company}</span>
                      <div className="columbus-job-location">
                        <MapPin size={12} />
                        {job.location} · {job.employmentType}
                      </div>
                    </div>
                    <span className="columbus-time-pill">{job.postedAt}</span>
                  </div>
                  
                  <h3 className="columbus-job-title">{job.title}</h3>

                  <div className="columbus-card-tags">
                    {job.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="columbus-card-tag">{tag}</span>
                    ))}
                  </div>

                  <p className="columbus-card-summary">
                    {job.fitSummary}
                  </p>

                  <div className="columbus-card-divider" />

                  <div className="columbus-card-footer">
                    <span className="columbus-salary">{job.salary}</span>
                    <span className="columbus-match-score">
                      <Sparkles size={14} />
                      {job.matchScore} Fit
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="columbus-empty-state">
              <div className="columbus-empty-icon">
                <Sparkles size={32} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#111' }}>Your Columbus output appears here</h3>
              <p style={{ margin: 0 }}>Search for a role to stage ranked jobs, requirements, fit scores, and apply paths.</p>
            </div>
          )}
        </div>

        {selectedJob && (
          <JobDetailPanel job={selectedJob} />
        )}
      </div>
    </main>
  );
}
