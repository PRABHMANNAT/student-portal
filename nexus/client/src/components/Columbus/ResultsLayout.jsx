import { useState } from 'react';
import ResultsHeader from './ResultsHeader';
import JobsList from './JobsList';
import JobDetailPanel from './JobDetailPanel';

export default function ResultsLayout({
  jobs,
  isLoading,
  selectedJobId,
  onSelectJob,
  activeFilter,
  onFilterChange,
  filters
}) {
  const selectedJob = jobs?.find(j => j.id === selectedJobId) || null;

  return (
    <main className="jobs-right">
      <ResultsHeader
        jobsCount={jobs?.length || 0}
        isLoading={isLoading}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        filters={filters}
      />
      
      <div className="jobs-right__body">
        <div className="jobs-list-container">
          <JobsList
            jobs={jobs}
            isLoading={isLoading}
            selectedJobId={selectedJobId}
            onSelectJob={onSelectJob}
          />
        </div>
        
        {selectedJob && (
          <div className="jobs-detail-container">
            <JobDetailPanel job={selectedJob} />
          </div>
        )}
      </div>
    </main>
  );
}
