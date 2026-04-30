import { motion } from 'framer-motion';

export default function RoadmapArtifact({ roadmap, highlightedId, onHighlight }) {
  return (
    <div className="artifact-stack">
      <section className="artifact-band">
        <div className="band-header">
          <h3>Execution phases</h3>
          <p>{roadmap.northStar}</p>
        </div>

        <div className="phase-grid">
          {roadmap.phases.map((phase, index) => (
            <motion.button
              type="button"
              layout
              key={phase.id}
              className={`phase-card ${highlightedId === phase.id ? 'is-highlighted' : ''}`}
              onClick={() => onHighlight(phase.id)}
              whileHover={{ y: -4 }}
            >
              <span className="phase-index">0{index + 1}</span>
              <h4>{phase.label}</h4>
              <p>{phase.objective}</p>
              <span className="phase-window">{phase.window}</span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="artifact-band roadmap-detail-grid">
        <div className="detail-panel">
          {roadmap.phases
            .filter((phase) => phase.id === highlightedId)
            .map((phase) => (
              <div key={phase.id}>
                <div className="band-header">
                  <h3>{phase.label}</h3>
                  <p>{phase.window}</p>
                </div>
                <div className="detail-columns">
                  <div>
                    <span className="detail-label">Deliverables</span>
                    <ul className="clean-list">
                      {phase.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="detail-label">Skills</span>
                    <ul className="clean-list">
                      {phase.skills.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="detail-label">Checkpoints</span>
                    <ul className="clean-list">
                      {phase.checkpoints.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="detail-panel">
          <div className="band-header">
            <h3>Weekly cadence</h3>
            <p>Keep the loop consistent.</p>
          </div>
          <ul className="cadence-list">
            {roadmap.weeklyCadence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="artifact-band">
        <div className="band-header">
          <h3>Portfolio proofs</h3>
          <p>Build artifacts that interviewers can inspect quickly.</p>
        </div>

        <div className="project-grid">
          {roadmap.projects.map((project) => (
            <article key={project.id} className="project-card">
              <span className="detail-label">{project.stack}</span>
              <h4>{project.title}</h4>
              <p>{project.impact}</p>
              <ul className="clean-list">
                {project.proofPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="artifact-band metric-band">
        {roadmap.metrics.map((metric) => (
          <article key={metric.label} className={`metric-tile tone-${metric.tone}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>
    </div>
  );
}

