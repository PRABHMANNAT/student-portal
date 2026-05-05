import { motion, AnimatePresence } from 'framer-motion';

export default function SkillChip({ label, type, confidence, isHighlighted }) {
  const typeColors = {
    frontend: { bg: '#EDE9FE', color: '#7C3AED', border: '#DDD6FE' },
    backend: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
    data: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
    product: { bg: '#FFE4E6', color: '#E11D48', border: '#FECDD3' },
    quality: { bg: '#DBEAFE', color: '#2563EB', border: '#BFDBFE' },
  };

  const palette = typeColors[type] || typeColors.frontend;

  return (
    <motion.span
      className={`pe-skill-chip ${isHighlighted ? 'is-highlighted' : ''}`}
      style={{
        '--chip-bg': palette.bg,
        '--chip-color': palette.color,
        '--chip-border': palette.border,
      }}
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="pe-skill-chip-label">{label}</span>
      {confidence != null && (
        <span className="pe-skill-chip-confidence">{confidence}%</span>
      )}
    </motion.span>
  );
}
