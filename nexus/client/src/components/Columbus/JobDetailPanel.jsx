import { motion } from 'framer-motion';
import { Bookmark, ExternalLink } from 'lucide-react';

export default function JobDetailPanel({ job }) {
  if (!job) return null;

  return (
    <motion.aside
      className="jobs-detail-panel"
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <div className="jobs-detail-scroll">
        <div className="jobs-detail-header">
          <span className="jobs-detail-eyebrow-match">{job.matchScore} MATCH</span>
          <p className="jobs-detail-company">{job.company}</p>
          <h2 className="jobs-detail-title">{job.title}</h2>
          
          <div className="jobs-detail-meta">
            <span className="jobs-detail-salary">{job.salary}</span>
            <div className="jobs-card-tags">
              {job.tags?.map(tag => (
                <span key={tag} className="jobs-card-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="jobs-detail-section">
          <h4 className="jobs-detail-eyebrow">ROLE BRIEF</h4>
          <p className="jobs-detail-text">{job.roleBrief}</p>
        </div>

        <div className="jobs-detail-section">
          <h4 className="jobs-detail-eyebrow">REQUIREMENTS</h4>
          <ul className="jobs-detail-list">
            {job.requirements?.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="jobs-detail-section">
          <h4 className="jobs-detail-eyebrow">COMPANY DETAILS</h4>
          <div className="jobs-detail-company-grid">
            <div className="jobs-company-stat">
              <span className="jobs-stat-label">INDUSTRY</span>
              <span className="jobs-stat-value">{job.companyInfo?.industry || 'Technology'}</span>
            </div>
            <div className="jobs-company-stat">
              <span className="jobs-stat-label">TEAM SIZE</span>
              <span className="jobs-stat-value">{job.companyInfo?.team || '50-200 employees'}</span>
            </div>
            <div className="jobs-company-stat">
              <span className="jobs-stat-label">HQ / LOCATION</span>
              <span className="jobs-stat-value">{job.companyInfo?.location || 'Remote'}</span>
            </div>
          </div>
        </div>
        
        <div className="jobs-detail-why">
          <h4 className="jobs-detail-eyebrow">WHY IT MATCHES</h4>
          <p className="jobs-detail-why-text">{job.companyInfo?.whyItMatches || job.fitSummary}</p>
        </div>
      </div>

      <div className="jobs-detail-actions">
        <button className="jobs-btn-secondary">
          <Bookmark size={16} /> Save
        </button>
        <button className="jobs-btn-primary">
          Apply Now <ExternalLink size={16} />
        </button>
      </div>
    </motion.aside>
  );
}
