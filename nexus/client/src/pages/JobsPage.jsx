import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SideNav from '../components/Shell/SideNav';
import IntakePanel from '../components/Columbus/IntakePanel';
import ResultsLayout from '../components/Columbus/ResultsLayout';
import columbusMockData from '../data/columbus_mock_data.json';
import '../styles/columbus.css';

export default function JobsPage() {
  const [orbState, setOrbState] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // Initial greeting
    setMessages([
      { role: 'assistant', text: 'What role are you targeting?' }
    ]);
  }, []);

  const handleSend = async (input) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    
    // Simulate orchestration
    setOrbState('listening');
    
    setTimeout(() => {
      setOrbState('searching');
      setMessages(prev => [...prev, { role: 'status', text: 'Searching the web...' }]);
      setIsLoading(true);
      setJobs([]);
      setSelectedJobId(null);
    }, 800);

    setTimeout(() => {
      setOrbState('thinking');
      setMessages(prev => [...prev, { role: 'status', text: 'Ranking fit and reading requirements...' }]);
    }, 2500);

    setTimeout(() => {
      setOrbState('complete');
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', text: 'I found several roles and staged them in the results panel. Select a card to inspect fit, requirements, and apply paths.' }
      ]);
      setJobs(columbusMockData.jobs);
      if (columbusMockData.jobs.length > 0) {
        setSelectedJobId(columbusMockData.jobs[0].id);
      }
      setIsLoading(false);
      
      setTimeout(() => setOrbState('idle'), 2000);
    }, 4500);
  };

  const filteredJobs = jobs.filter(job => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Remote') return job.employmentType.toLowerCase().includes('remote') || job.location.toLowerCase().includes('remote');
    if (activeFilter === 'Full-time') return job.employmentType.toLowerCase().includes('full-time') || job.employmentType.toLowerCase().includes('full time');
    if (activeFilter === 'Internship') return job.employmentType.toLowerCase().includes('intern') || job.title.toLowerCase().includes('intern');
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <SideNav />
      <div className="jobs-page">
        <IntakePanel 
          orbState={orbState}
          messages={messages}
          onSend={handleSend}
          suggestions={columbusMockData.assistant.quickSuggestions}
        />
        <ResultsLayout 
          jobs={filteredJobs}
          isLoading={isLoading}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filters={columbusMockData.resultsHeader.filters}
        />
      </div>
    </motion.div>
  );
}
