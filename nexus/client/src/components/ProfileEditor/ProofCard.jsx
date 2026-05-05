import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function ProofCard({ card, index, isGenerating }) {
  return (
    <motion.article
      className={`pe-proof-card ${isGenerating ? 'is-pulsing' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="pe-proof-card-header">
        <h4 className="pe-proof-title">{card.title}</h4>
        <span className="pe-proof-subtitle">{card.subtitle}</span>
      </div>

      <p className="pe-proof-description">{card.description}</p>

      {card.imageUrl && (
        <div className="pe-proof-image" style={{ marginTop: '12px', marginBottom: '12px' }}>
          <img src={card.imageUrl} alt={card.title} style={{ width: '100%', height: 'auto', borderRadius: '8px', objectFit: 'cover', maxHeight: '180px' }} />
        </div>
      )}

      <div className="pe-proof-skills">
        {card.skills.map((skill) => (
          <span key={skill} className="pe-proof-skill-tag">{skill}</span>
        ))}
      </div>

      <div className="pe-proof-footer">
        <span className="pe-proof-evidence">{card.evidence}</span>
        <button type="button" className="pe-proof-link" onClick={() => {}}>
          <ExternalLink size={13} />
          {card.linkLabel}
        </button>
      </div>
    </motion.article>
  );
}
