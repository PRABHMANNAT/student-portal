import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import JobResultsPanel, { JobsLoadingPanel } from '../components/Jobs/JobResultsPanel';
import AppShell from '../components/Shell/AppShell';
import { jobsApi } from '../api';
import { useApp } from '../context/AppContext';
import { useChat } from '../hooks/useChat';

const QUESTIONS = [
  { key: 'role', text: 'What role are you targeting?' },
  { key: 'experience', text: "What's your experience level?" },
  { key: 'type', text: 'Remote, hybrid, or on-site?' },
  { key: 'stack', text: 'Any specific tech stack or industry?' }
];

const ROLE_PATTERN =
  /\b(frontend developer|frontend engineer|backend developer|backend engineer|full stack developer|full-stack developer|software engineer|machine learning engineer|ml engineer|data scientist|data analyst|product manager|product designer|founder|intern|research engineer)\b/i;
const EXPERIENCE_PATTERN = /(\d+)\s*\+?\s*(year|years|yr|yrs)/i;
const LOCATION_PATTERN =
  /\b(bengaluru|bangalore|mumbai|pune|delhi|gurgaon|hyderabad|chennai|kolkata|san francisco|new york|london|singapore)\b/i;

function normalizeRole(value = '') {
  return value
    .replace(/\bexp(erience)?\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferProfile(input, current, pendingKey) {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  const next = {
    ...current,
    summary: current.summary ? `${current.summary} | ${trimmed}` : trimmed
  };

  const roleMatch = trimmed.match(ROLE_PATTERN);
  const experienceMatch = trimmed.match(EXPERIENCE_PATTERN);
  const stackBits = trimmed
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (roleMatch && !next.role) {
    next.role = normalizeRole(roleMatch[0]);
  }

  if (!next.role && stackBits.length && pendingKey === 'role') {
    next.role = normalizeRole(stackBits[0]);
  }

  if (experienceMatch) {
    next.experience = `${experienceMatch[1]} year${experienceMatch[1] === '1' ? '' : 's'} experience`;
  } else if (/\b(no exp|no experience|fresher|entry level|entry-level)\b/i.test(lower)) {
    next.experience = 'No experience';
  } else if (/\b(junior)\b/i.test(lower)) {
    next.experience = 'Junior';
  } else if (pendingKey === 'experience' && !next.experience) {
    next.experience = trimmed;
  }

  if (/\bremote\b/i.test(lower)) {
    next.type = 'Remote';
    next.location = 'Remote';
  } else if (/\bhybrid\b/i.test(lower)) {
    next.type = 'Hybrid';
  } else if (/\bon[\s-]?site\b/i.test(lower)) {
    next.type = 'On-site';
  } else if (pendingKey === 'type' && !next.type) {
    next.type = trimmed;
  }

  const locationMatch = trimmed.match(LOCATION_PATTERN);
  if (locationMatch) {
    next.location = locationMatch[0];
  } else if (!next.location) {
    next.location = next.type === 'Remote' ? 'Remote' : 'Anywhere';
  }

  const stackHints = stackBits.filter((item) => {
    const value = item.toLowerCase();
    return (
      value !== (next.role || '').toLowerCase() &&
      value !== (next.experience || '').toLowerCase() &&
      value !== (next.type || '').toLowerCase()
    );
  });

  if (stackHints.length && !next.stack) {
    next.stack = stackHints.join(', ');
  } else if (/\b(react|node|python|typescript|javascript|java|go|b2b saas|ai|ml|data|fintech|healthtech)\b/i.test(lower) && !next.stack) {
    next.stack = trimmed;
  } else if (pendingKey === 'stack' && !next.stack) {
    next.stack = trimmed;
  }

  return next;
}

function nextMissingKey(profile) {
  return QUESTIONS.find((question) => !profile[question.key])?.key || null;
}

function buildSearchPayload(profile, userId) {
  return {
    role: profile.role || 'Software Engineer',
    experience: profile.experience || 'Entry level',
    type: profile.type || 'Remote',
    stack: profile.stack || 'Generalist',
    location: profile.location || 'Anywhere',
    query:
      profile.summary ||
      [profile.role, profile.experience, profile.type, profile.stack].filter(Boolean).join(', '),
    userId
  };
}

export default function JobsPage() {
  const location = useLocation();
  const { session, refreshCollections } = useApp();
  const { messages, pushMessage, resetMessages } = useChat('jobs');
  const [profile, setProfile] = useState({});
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState({ mode: 'demo', provider: 'idle' });
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobDetail, setSelectedJobDetail] = useState(null);
  const [savingJobId, setSavingJobId] = useState(null);

  useEffect(() => {
    const job = location.state?.savedJob;

    if (!job?.title) {
      return;
    }

    const nextMeta = {
      mode: 'collection',
      provider: 'collections',
      timestamp: new Date().toISOString()
    };

    setResult({
      jobs: [job],
      total: 1,
      sources: [job.source || 'Collections'],
      query: {
        role: job.title,
        type: job.type,
        location: job.location
      },
      meta: nextMeta
    });
    setMeta(nextMeta);
    setSelectedJobId(job.id);
    setSelectedJobDetail(job);
    pushMessage({
      role: 'assistant',
      text: `${job.title} was loaded from Collections.`
    });
  }, [location.state, pushMessage]);

  const handleSubmit = async (input) => {
    pushMessage({ role: 'user', text: input });

    const pendingKey = nextMissingKey(profile);
    const nextProfile = inferProfile(input, profile, pendingKey);
    const nextQuestionKey = nextMissingKey(nextProfile);

    setProfile(nextProfile);

    if (nextQuestionKey) {
      pushMessage({
        role: 'assistant',
        text: QUESTIONS.find((question) => question.key === nextQuestionKey)?.text || QUESTIONS[0].text
      });
      return;
    }

    pushMessage({ role: 'assistant', text: 'Searching the web... 🧭' });
    setLoading(true);
    setResult(null);
    setSelectedJobId(null);
    setSelectedJobDetail(null);

    const response = await jobsApi.search(buildSearchPayload(nextProfile, session.user.id || 'guest'));

    setResult(response);
    setMeta(response.meta || { mode: 'demo', provider: 'client-fallback' });
    setLoading(false);
    setActiveFilter('all');

    if (response.jobs?.length) {
      setSelectedJobId(response.jobs[0].id);
      setSelectedJobDetail(response.jobs[0]);
    }

    pushMessage({
      role: 'assistant',
      text: `${response.total || response.jobs?.length || 0} roles are staged in the artifact panel. Open a card to inspect fit, requirements, and apply links.`
    });
  };

  const handleSelectJob = async (jobId) => {
    setSelectedJobId(jobId);

    const localJob = result?.jobs?.find((job) => job.id === jobId) || null;
    if (localJob) {
      setSelectedJobDetail(localJob);
    }

    const response = await jobsApi.getById(jobId);
    setSelectedJobDetail(response.job || localJob);
  };

  const handleSaveJob = async (job) => {
    setSavingJobId(job.id);
    await jobsApi.save({
      job,
      userId: session.user.id || 'guest'
    });
    await refreshCollections();
    setSavingJobId(null);
    pushMessage({
      role: 'assistant',
      text: `${job.title} has been saved to Collections.`
    });
  };

  const handleReset = () => {
    resetMessages();
    setProfile({});
    setResult(null);
    setMeta({ mode: 'demo', provider: 'idle' });
    setLoading(false);
    setActiveFilter('all');
    setSelectedJobId(null);
    setSelectedJobDetail(null);
  };

  const hasArtifact = loading || Boolean(result);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AppShell
        chat={{
          title: 'Columbus',
          description: 'Describe yourself to Columbus.',
          messages,
          suggestions: [
            'Frontend dev, 1 year exp, remote',
            'ML intern, Python, no exp',
            'Product manager, 3 years, B2B SaaS'
          ],
          onSubmit: handleSubmit,
          loading,
          meta,
          accentColor: '#f59340',
          statusColor: 'var(--teal)',
          secondaryAction: {
            label: 'Reset chat',
            onClick: handleReset
          },
          footer: (
            <p>{loading ? 'Columbus is ranking live opportunities.' : 'All job output renders in the artifact panel.'}</p>
          )
        }}
        artifact={{
          empty: !hasArtifact,
          motionKey:
            result?.meta?.timestamp || result?.query?.role || (loading ? 'jobs-loading' : 'jobs-empty')
        }}
      >
        {loading ? (
          <JobsLoadingPanel />
        ) : result ? (
          <JobResultsPanel
            result={result}
            selectedJobId={selectedJobId}
            selectedJobDetail={selectedJobDetail}
            onSelectJob={handleSelectJob}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onSaveJob={handleSaveJob}
            savingJobId={savingJobId}
          />
        ) : null}
      </AppShell>
    </motion.div>
  );
}
