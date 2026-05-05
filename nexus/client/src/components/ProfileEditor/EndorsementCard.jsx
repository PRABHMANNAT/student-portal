import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function EndorsementCard({ endorsement, index }) {
  return (
    <motion.article
      className="pe-endorsement-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Quote size={18} className="pe-endorsement-quote-icon" />
      <p className="pe-endorsement-text">"{endorsement.quote}"</p>
      <div className="pe-endorsement-author">
        <div className="pe-endorsement-avatar">
          {endorsement.name.charAt(0)}
        </div>
        <div>
          <span className="pe-endorsement-name">{endorsement.name}</span>
          <span className="pe-endorsement-role">{endorsement.role}</span>
        </div>
      </div>
    </motion.article>
  );
}
