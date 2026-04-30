import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import RoadmapVisualization, {
  RoadmapVisualizationSkeleton
} from '../components/Roadmap/RoadmapVisualization';
import AppShell from '../components/Shell/AppShell';
import { useApp } from '../context/AppContext';
import { useAgent } from '../hooks/useAgent';
import { useChat } from '../hooks/useChat';
import { roadmapApi } from '../api';

export default function RoadmapPage() {
  const location = useLocation();
  const { refreshCollections, session } = useApp();
  const { artifact, meta, loading, run, hydrate } = useAgent('roadmap');
  const { messages, pushMessage, resetMessages } = useChat('roadmap');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const roadmap = location.state?.savedRoadmap;

    if (!roadmap?.title) {
      return;
    }

    hydrate(roadmap, {
      mode: 'collection',
      provider: 'collections',
      timestamp: new Date().toISOString()
    });
    pushMessage({
      role: 'assistant',
      text: `${roadmap.title} was loaded from Collections.`
    });
  }, [hydrate, location.state, pushMessage]);

  const handleSubmit = async (input) => {
    pushMessage({ role: 'user', text: input });
    const response = await run({
      query: input,
      userId: session.user.id || 'guest'
    });

    if (!response) {
      return;
    }

    setSaved(false);
    pushMessage({
      role: 'assistant',
      text: `${response.artifact.title} is ready. The roadmap is now staged as a 3D pathway in the artifact panel.`
    });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await roadmapApi.save({
        roadmap: artifact,
        userId: session.user.id || 'guest'
      });
      await refreshCollections();
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AppShell
        chat={{
          title: 'Aristotle',
          description: 'Ask Aristotle to map your career path.',
          messages,
          suggestions: [
            'Full Stack Developer path',
            'AI/ML Engineer roadmap',
            'Startup founder skills'
          ],
          onSubmit: handleSubmit,
          loading,
          meta,
          secondaryAction: {
            label: 'Reset chat',
            onClick: resetMessages
          },
          footer: (
            <p>
              Session: <strong>{session.user.name}</strong>
            </p>
          )
        }}
        artifact={{
          meta,
          motionKey: `${artifact.title}-${meta?.timestamp || 'demo'}`
        }}
      >
        {loading ? (
          <RoadmapVisualizationSkeleton />
        ) : (
          <RoadmapVisualization
            roadmap={artifact}
            onSave={handleSave}
            saving={saving}
            saved={saved}
          />
        )}
      </AppShell>
    </motion.div>
  );
}
