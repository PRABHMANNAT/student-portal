import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function JobCard({ job, isSelected, onClick }) {
  return (
    <motion.div
      layoutId={`job-card-${job.id}`}
      className={`jobs-card ${isSelected ? 'is-selected' : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="jobs-card-top">
        <div className="jobs-card-avatar">
          {job.companyInitials}
        </div>
        <div className="jobs-card-meta-wrap">
          <div className="jobs-card-company-row">
            <span className="jobs-card-company">{job.company}</span>
            <span className="jobs-card-posted">{job.postedAt}</span>
          </div>
          <div className="jobs-card-location">
            <MapPin size={12} />
            {job.location} · {job.employmentType}
          </div>
        </div>
      </div>
      
      <h3 className="jobs-card-title">{job.title}</h3>

      <div className="jobs-card-tags">
        {job.tags?.slice(0, 3).map(tag => (
          <span key={tag} className="jobs-card-tag">{tag}</span>
        ))}
      </div>

      <p className="jobs-card-summary">{job.fitSummary}</p>

      <div className="jobs-card-divider" />

      <div className="jobs-card-bottom">
        <span className="jobs-card-salary">{job.salary}</span>
        <span className="jobs-card-match">{job.matchScore} Fit</span>
      </div>
    </motion.div>
  );
}
