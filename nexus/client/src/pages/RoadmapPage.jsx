import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import RoadmapVisualization from '../components/Roadmap/RoadmapVisualization';
import AppShell from '../components/Shell/AppShell';
import { useApp } from '../context/AppContext';
import { useProfile } from '../context/ProfileContext';
import { useAgent } from '../hooks/useAgent';
import { useChat } from '../hooks/useChat';
import { roadmapApi } from '../api';
import { generateRoadmap } from '../lib/roadmapGenerator';

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const GENERATION_LIMIT = 20;
const GENERATION_COUNTER_KEY = 'nexus-roadmap-generation-count';

function readGenerationCount() {
  return Number(window.localStorage.getItem(GENERATION_COUNTER_KEY) || 0);
}

function readRemainingGenerations() {
  return Math.max(0, GENERATION_LIMIT - readGenerationCount());
}

function incrementGenerationCount() {
  const nextCount = Math.min(GENERATION_LIMIT, readGenerationCount() + 1);
  window.localStorage.setItem(GENERATION_COUNTER_KEY, String(nextCount));
  return Math.max(0, GENERATION_LIMIT - nextCount);
}

function inferTargetRole(input, profile) {
  const match = input.match(/(?:become|as|for|to be|targeting|switch to)\s+(?:a |an )?([^,.]+?)(?:\s+at|\s+in|\s+with|$)/i);
  return match?.[1]?.trim() || profile.targetRole || 'your target role';
}

export default function RoadmapPage() {
  const { refreshCollections, session } = useApp();
  const { profile } = useProfile();
  const { artifact, meta, hydrate } = useAgent('roadmap');
  const { messages, pushMessage, updateMessage, resetMessages } = useChat('roadmap');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationKey, setGenerationKey] = useState(0);
  const [buildMessageId, setBuildMessageId] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(GENERATION_COUNTER_KEY, '0');
  }, []);

  const handleSubmit = async (input) => {
    if (readRemainingGenerations() <= 0) {
      pushMessage({
        role: 'assistant',
        text: 'Session generation limit reached. Refresh the page to reset the 20-generation demo cap.'
      });
      return;
    }

    pushMessage({ role: 'user', text: input });
    setGenerating(true);
    let progressMessageId = null;

    try {
      await delay(200);

      progressMessageId = pushMessage({
        role: 'assistant',
        text: `Reading your profile from ${profile.university}...`
      });

      await delay(250);
      updateMessage(progressMessageId, {
        text: `Factoring in your ${profile.yearsOfExperience} year experience and target companies...`
      });

      await delay(250);
      updateMessage(progressMessageId, {
        text: `Pulling resources for ${inferTargetRole(input, profile)}...`
      });

      await delay(300);
      updateMessage(progressMessageId, {
        text: 'Generating your personalized roadmap...'
      });

      const result = await generateRoadmap(input, profile, ({ message }) => {
        if (message && progressMessageId) {
          updateMessage(progressMessageId, { text: message });
        }
      });
      const nextRoadmap = result.roadmap;
      incrementGenerationCount();
      const liveFailed = result.source !== 'llm';
      const buildMessage = liveFailed
        ? 'Live AI was unavailable, so I used the template library. Building the roadmap canvas now...'
        : `Building your ${nextRoadmap.title || inferTargetRole(input, profile)} path...`;

      updateMessage(progressMessageId, { text: buildMessage });
      setBuildMessageId(progressMessageId);

      await delay(250);
      hydrate(nextRoadmap, {
        mode: 'personalized',
        provider: result.source === 'llm' ? 'openai-gpt-4o-mini' : 'aristotle-template-fallback',
        timestamp: new Date().toISOString()
      });

      setSaved(false);
      setGenerationKey((current) => current + 1);
    } catch (error) {
      const errorText = 'I hit a snag. Try rephrasing your goal — be specific about role and timeline.';
      if (progressMessageId) {
        updateMessage(progressMessageId, { text: errorText });
      } else {
        pushMessage({ role: 'assistant', text: errorText });
      }
      setGenerating(false);
      setBuildMessageId(null);
    }
  };

  const handleBuildStatus = useCallback((status) => {
    if (status?.message && buildMessageId) {
      updateMessage(buildMessageId, { text: status.message });
    }

    if (status?.done) {
      setGenerating(false);
      setBuildMessageId(null);
    }
  }, [buildMessageId, updateMessage]);

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
          loading: generating,
          meta,
          secondaryAction: {
            label: 'Reset chat',
            onClick: () => {
              resetMessages();
              setBuildMessageId(null);
              setGenerating(false);
              hydrate(null, {
                mode: 'empty',
                provider: 'aristotle-generator',
                timestamp: new Date().toISOString()
              });
              setSaved(false);
              setGenerationKey((current) => current + 1);
            }
          }
        }}
        artifact={{
          meta,
          fullBleed: true,
          hideHeader: true,
          motionKey: `${artifact?.title || 'empty-roadmap'}-${meta?.timestamp || 'demo'}`
        }}
      >
        <RoadmapVisualization
          roadmap={artifact}
          profile={profile}
          generatedAt={meta?.timestamp}
          generationKey={generationKey}
          onBuildStatus={handleBuildStatus}
          onSave={handleSave}
          saving={saving}
          saved={saved}
          isGenerating={generating}
        />
      </AppShell>
    </motion.div>
  );
}
