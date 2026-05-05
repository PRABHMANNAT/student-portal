export default function ResultsHeader({ jobsCount, isLoading, activeFilter, onFilterChange, filters }) {
  return (
    <div className="jobs-right__header">
      <div className="jobs-right__filters">
        {filters.map(f => (
          <button
            key={f}
            className={`jobs-filter-pill ${activeFilter === f ? 'is-active' : ''}`}
            onClick={() => onFilterChange(f)}
          >
            {f}
          </button>
        ))}
      </div>
      
      <div className="jobs-right__title-block">
        <h1 className="jobs-results-title">
          {isLoading ? 'COLUMBUS IS SEARCHING' : `COLUMBUS FOUND ${jobsCount || 0} ROLES`}
        </h1>
        
        <div className="jobs-active-queries">
          <span className="jobs-query-tag">Frontend Developer</span>
          <span className="jobs-query-tag">1 year experience</span>
        </div>
        
        <p className="jobs-sources">
          Sources: RemoteOK · HN Who's Hiring · GitHub Jobs Archive · Adzuna
        </p>
      </div>
    </div>
  );
}
