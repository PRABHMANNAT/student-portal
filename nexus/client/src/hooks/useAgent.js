import { useMemo, useState } from 'react';

import jobsDemo from '../demo/jobs.json';
import notesDemo from '../demo/notes.json';
import roadmapDemo from '../demo/roadmap.json';
import { jobsApi, notesApi, roadmapApi } from '../api';

const agentConfig = {
  roadmap: {
    key: 'roadmap',
    initial: roadmapDemo.roadmap,
    initialMeta: roadmapDemo.meta,
    request: roadmapApi.generate
  },
  jobs: {
    key: 'jobs',
    initial: jobsDemo.jobs,
    initialMeta: jobsDemo.meta,
    request: jobsApi.search
  },
  notes: {
    key: 'notes',
    initial: notesDemo.notes,
    initialMeta: notesDemo.meta,
    request: notesApi.generate
  }
};

export function useAgent(agent) {
  const config = useMemo(() => agentConfig[agent], [agent]);
  const [artifact, setArtifact] = useState(config.initial);
  const [meta, setMeta] = useState(config.initialMeta);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = async (payload) => {
    setLoading(true);
    setError('');

    try {
      const response = await config.request(payload);
      const nextArtifact = response[config.key];
      setArtifact(nextArtifact);
      setMeta(response.meta || { mode: 'demo', provider: 'client-fallback' });
      return {
        artifact: nextArtifact,
        meta: response.meta || { mode: 'demo', provider: 'client-fallback' }
      };
    } catch (runError) {
      setError(runError.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const hydrate = (nextArtifact, nextMeta) => {
    setArtifact(nextArtifact);
    setMeta(nextMeta);
  };

  return {
    artifact,
    meta,
    loading,
    error,
    run,
    hydrate,
    setArtifact,
    setMeta
  };
}

