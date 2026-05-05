import JobCard from './JobCard';

export default function JobsList({ jobs, isLoading, selectedJobId, onSelectJob }) {
  if (isLoading) {
    return (
      <div className="jobs-list">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="jobs-card is-skeleton" />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="jobs-empty-state">
        <h3>Your Columbus output appears here</h3>
        <p>Search for a role to stage ranked jobs, requirements, fit scores, and apply paths.</p>
      </div>
    );
  }

  return (
    <div className="jobs-list">
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          isSelected={selectedJobId === job.id}
          onClick={() => onSelectJob(job.id)}
        />
      ))}
    </div>
  );
}
