import { motion } from 'framer-motion';

export default function ColumbusOrb({ state = 'idle' }) {
  // states: idle, listening, searching, thinking, complete
  return (
    <div className={`columbus-orb-container orb-state-${state}`}>
      <div className="omni" role="status" aria-label="Loading">
        <div className="omni-ring">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="dot" />
          ))}
        </div>
        <div className="omni-eyes">
          <div className="eye" />
          <div className="eye" />
        </div>
      </div>
    </div>
  );
}
