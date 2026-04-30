import { motion } from 'framer-motion';

import ConstellationCanvas from './ConstellationCanvas';

const transition = {
  duration: 0.36,
  ease: [0.22, 1, 0.36, 1]
};

export default function ArtifactPanel({
  eyebrow,
  title,
  summary,
  meta,
  accent = 'var(--teal)',
  action,
  children
}) {
  return (
    <section className="artifact-panel">
      <motion.div
        className="artifact-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={transition}
      >
        <div className="artifact-copy">
          <p className="artifact-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="artifact-summary">{summary}</p>

          <div className="artifact-meta-row">
            <span className="meta-pill">{meta?.agent || 'NEXUS'}</span>
            <span className="meta-pill">{meta?.mode === 'live' ? 'Live' : 'Demo-safe'}</span>
            <span className="meta-pill">{meta?.provider || 'fallback'}</span>
          </div>

          {action ? (
            <button type="button" className="primary-button artifact-action" onClick={action.onClick} disabled={action.disabled}>
              {action.label}
            </button>
          ) : null}
        </div>

        <div className="artifact-visual">
          <ConstellationCanvas accent={accent} />
        </div>
      </motion.div>

      <motion.div
        className="artifact-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, delay: 0.08 }}
      >
        {children}
      </motion.div>
    </section>
  );
}

