import { motion } from 'framer-motion';

import CompanyLogo from '../CompanyLogo';

export default function JobsArtifact({ jobs, highlightedId, onHighlight }) {
  const activeJob = jobs.results.find((job) => job.id === highlightedId) || jobs.results[0];

  return (
    <div className="artifact-stack">
      <section className="artifact-band">
        <div className="band-header">
          <h3>Market pulse</h3>
          <p>{jobs.headline}</p>
        </div>
        <div className="insight-grid">
          {jobs.marketPulse.map((item) => (
            <article key={item} className="insight-card">
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="artifact-band jobs-layout">
        <div className="job-list">
          {jobs.results.map((job) => (
            <motion.button
              type="button"
              key={job.id}
              className={`job-row ${highlightedId === job.id ? 'is-highlighted' : ''}`}
              onClick={() => onHighlight(job.id)}
              whileHover={{ x: 4 }}
            >
              <div className="job-row-brand">
                <CompanyLogo company={job.company} domain={job.companyDomain} url={job.applyUrl} links={job.links} size="sm" />
                <div>
                  <span className="job-company">{job.company}</span>
                  <h4>{job.title}</h4>
                  <p>
                    {job.location} • {job.mode}
                  </p>
                </div>
              </div>
              <span className="job-match">{job.match}</span>
            </motion.button>
          ))}
        </div>

        {activeJob ? (
          <div className="job-spotlight">
            <div className="band-header">
              <h3>{activeJob.title}</h3>
              <p>{activeJob.company}</p>
            </div>

            <div className="detail-columns compact">
              <div>
                <span className="detail-label">Skills</span>
                <ul className="clean-list">
                  {activeJob.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="detail-label">Why it fits</span>
                <ul className="clean-list">
                  {activeJob.why.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="spotlight-footer">
              <span className="meta-pill">{activeJob.status}</span>
              <a href={activeJob.url} target="_blank" rel="noreferrer" className="secondary-link">
                Open listing
              </a>
            </div>
          </div>
        ) : null}
      </section>

      <section className="artifact-band">
        <div className="band-header">
          <h3>Columbus recommendation</h3>
          <p>{jobs.spotlight.title}</p>
        </div>
        <div className="spotlight-note">
          <p>{jobs.spotlight.insight}</p>
          <ul className="clean-list">
            {jobs.spotlight.nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
