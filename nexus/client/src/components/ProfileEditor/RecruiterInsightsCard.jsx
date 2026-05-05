import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, TrendingUp, BarChart3, Shield } from 'lucide-react';

export default function RecruiterInsightsCard({ insights, checklist, roleFitSummary, interviewTalkingPoints }) {
  return (
    <motion.aside
      className="pe-insights-card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pe-insights-header">
        <BarChart3 size={16} />
        <h3 className="pe-insights-title">Recruiter insights</h3>
      </div>

      <ul className="pe-insights-list">
        {insights.map((insight, i) => (
          <li key={i} className="pe-insight-item">
            <TrendingUp size={13} className="pe-insight-icon" />
            <span>{insight}</span>
          </li>
        ))}
      </ul>

      {roleFitSummary && (
        <motion.div
          className="pe-role-fit"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, delay: 0.15 }}
        >
          <div className="pe-role-fit-header">
            <Sparkles size={14} />
            <span>Role fit summary</span>
          </div>
          <p className="pe-role-fit-text">{roleFitSummary}</p>
        </motion.div>
      )}

      {interviewTalkingPoints && interviewTalkingPoints.length > 0 && (
        <div className="pe-talking-points">
          <div className="pe-talking-points-header">
            <Shield size={14} />
            <span>Interview talking points</span>
          </div>
          <ul className="pe-talking-points-list">
            {interviewTalkingPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="pe-checklist">
        <h4 className="pe-checklist-title">Recruiter checklist</h4>
        {checklist.map((item, i) => (
          <div key={i} className="pe-checklist-item">
            <CheckCircle size={14} className={`pe-checklist-icon is-${item.status}`} />
            <span className="pe-checklist-label">{item.label}</span>
            <span className={`pe-checklist-status is-${item.status}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </motion.aside>
  );
}
